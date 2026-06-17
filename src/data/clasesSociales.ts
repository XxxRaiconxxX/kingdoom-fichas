// Clases sociales válidas. "Noble" exige Título de Nobleza.
export const CLASES_SOCIALES = ["Noble", "Plebeyo", "Burgués", "Otro"] as const;

export type ClaseSocial = (typeof CLASES_SOCIALES)[number];

export function exigeTitulo(clase: string): boolean {
  return clase.trim().toLowerCase() === "noble";
}
