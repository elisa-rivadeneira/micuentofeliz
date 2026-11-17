import type { GardenId } from "./types";

/**
 * Jardines.
 *
 * Fase 1: existe un único jardín, el personal. Cada universo y cada contenido
 * guarda su gardenId. Cuando llegue El Mundo Compartido, cada persona tendrá su
 * propio jardín y bastará con resolver el gardenId a partir de la sesión o de
 * la URL (por ejemplo /jardines/[gardenId]/...), sin rehacer el modelo.
 */
export const PERSONAL_GARDEN: GardenId = "jardin-personal";

export const SHARED_WORLD = {
  name: "El Mundo Compartido",
  status: "en-construccion" as const,
};
