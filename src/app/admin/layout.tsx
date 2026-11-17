import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mi área privada", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin">
      <div className="explore__sky" aria-hidden />
      <div className="wrap">{children}</div>
    </main>
  );
}
