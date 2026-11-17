"use client";

import { useEffect, useRef } from "react";

/**
 * Agua viva: dibuja el paisaje en WebGL y anima solo el agua.
 *  - Lago: ondulación horizontal que crece hacia el primer plano, reflejos que
 *    tiemblan y pequeños destellos que se desplazan.
 *  - Cascadas: textura de flujo que cae, enmascarada por el brillo del agua.
 *  - Rocas, lotos y flores del primer plano quedan quietos.
 *
 * Las zonas están en coordenadas 0..1 de la imagen (y hacia abajo).
 * Si WebGL no está disponible o se prefiere menos movimiento, no hace nada y
 * queda visible la imagen estática de debajo.
 */

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform sampler2D img;
uniform float t;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
// Caja suave: r = (x0, y0, x1, y1)
float box(vec2 uv, vec4 r, float e) {
  return smoothstep(r.x - e, r.x + e, uv.x) * (1.0 - smoothstep(r.z - e, r.z + e, uv.x))
       * smoothstep(r.y - e, r.y + e, uv.y) * (1.0 - smoothstep(r.w - e, r.w + e, uv.y));
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec4 base = texture2D(img, uv);
  float lum = dot(base.rgb, vec3(0.3, 0.5, 0.2));

  // ── Lago ──
  float H = 0.566;
  float lake = smoothstep(H, H + 0.025, uv.y);
  float depth = clamp((uv.y - H) / (1.0 - H), 0.0, 1.0);
  // Primer plano quieto: rocas y lotos (izq.), lotos y flores (der.), orilla izquierda.
  float still = max(max(box(uv, vec4(-0.1, 0.70, 0.27, 1.1), 0.03), box(uv, vec4(-0.1, 0.56, 0.21, 0.72), 0.025)),
                max(box(uv, vec4(0.69, 0.80, 1.1, 1.1), 0.03), box(uv, vec4(0.93, 0.62, 1.1, 0.85), 0.02)));
  still = max(still, box(uv, vec4(0.14, 0.79, 0.24, 0.84), 0.01));
  still = max(still, box(uv, vec4(0.73, 0.87, 0.86, 0.93), 0.01));
  float m = lake * (1.0 - still);

  float wave = sin(uv.y * (260.0 - 120.0 * depth) - t * 1.5 + sin(uv.x * 11.0 + t * 0.6) * 1.8) * 0.0016 * (0.25 + depth)
             + (noise(vec2(uv.x * 16.0 + t * 0.15, uv.y * 80.0 - t * 0.5)) - 0.5) * 0.005 * (0.2 + depth);
  vec2 suv = uv;
  suv.x += wave * m;
  suv.y += (noise(vec2(uv.x * 24.0 - t * 0.2, uv.y * 140.0)) - 0.5) * 0.0022 * m * (0.3 + depth);

  // ── Cascadas ──
  float fall = max(box(uv, vec4(0.105, 0.35, 0.262, 0.55), 0.006), box(uv, vec4(0.853, 0.36, 0.913, 0.565), 0.005));
  float water = smoothstep(0.32, 0.62, lum) * fall;
  float drop = noise(vec2(uv.x * 110.0, uv.y * 9.0 - t * 2.4));
  suv.y -= (drop - 0.5) * 0.006 * water;
  suv.x += (noise(vec2(uv.x * 200.0, uv.y * 30.0 - t * 3.0)) - 0.5) * 0.0012 * water;

  vec4 col = texture2D(img, suv);
  float clum = dot(col.rgb, vec3(0.3, 0.5, 0.2));

  // Vetas de agua que caen.
  float streak = noise(vec2(uv.x * 160.0, uv.y * 12.0 - t * 2.8)) * 0.6 + noise(vec2(uv.x * 70.0, uv.y * 26.0 - t * 4.2)) * 0.4;
  col.rgb *= 1.0 + (streak - 0.5) * 0.7 * water;
  col.rgb += vec3(0.75, 0.85, 1.0) * smoothstep(0.78, 0.95, streak) * 0.18 * water;

  // Espuma en la base de las cascadas.
  float foam = max(box(uv, vec4(0.12, 0.5, 0.27, 0.57), 0.02), box(uv, vec4(0.84, 0.52, 0.93, 0.58), 0.02));
  col.rgb += vec3(0.7, 0.8, 1.0) * noise(vec2(uv.x * 50.0 + t * 0.8, uv.y * 40.0 - t)) * 0.12 * foam * smoothstep(0.25, 0.6, lum);

  // Destellos en el agua, más vivos donde se refleja la luz (luna y faroles).
  float g = noise(vec2(uv.x * 320.0 + sin(t * 0.3) * 4.0, uv.y * 900.0 - t * 1.4));
  float glint = smoothstep(0.86, 0.99, g) * smoothstep(0.3, 0.75, clum) * m;
  col.rgb += glint * vec3(0.95, 0.95, 1.0) * 0.55;
  // Respiración suave del brillo de los reflejos.
  col.rgb *= 1.0 + m * smoothstep(0.35, 0.8, clum) * 0.08 * sin(t * 1.3 + uv.y * 40.0 + uv.x * 6.0);

  gl_FragColor = vec4(col.rgb, 1.0);
}
`;

export function LivingWater({ src, onReady }: { src: string; onReady?: (ok: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onReady?.(false); return; }
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) { onReady?.(false); return; }

    const compile = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      onReady?.(false);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "t");

    let raf = 0;
    let running = false;
    let disposed = false;
    const t0 = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const frame = () => {
      gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = running ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!running && !disposed) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      resize();
      frame();
      canvas.classList.add("is-on");
      onReady?.(true);
      if (!document.hidden) start();
    };
    img.onerror = () => onReady?.(false);
    img.src = src;

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    const onLost = (e: Event) => { e.preventDefault(); stop(); onReady?.(false); };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      stop();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, onReady]);

  return <canvas ref={ref} className="gb__water" aria-hidden />;
}
