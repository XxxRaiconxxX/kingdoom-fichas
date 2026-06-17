// Modelo de datos de una ficha de Kingdoom y constantes del esquema.

export interface Estadisticas {
  fuerza: number;
  agilidad: number;
  inteligencia: number;
  defensa: number;
  defensaMagica: number;
}

export interface Ficha {
  nombre: string;
  edad: string; // texto: puede ser "1200 años", "27", etc.
  genero: string;
  estatura: string;
  raza: string;
  poderesOficiales: string; // una magia por línea, formato "Nombre Lvl X"
  estadisticas: Estadisticas;
  armaPrincipal: string;
  estiloCombate: string;
  reino: string;
  claseSocial: string;
  tituloNobleza: string;
  profesion: string;
  habilidadesNoMagicas: string;
  personalidad: string;
  historia: string;
  extras: string;
  debilidades: string;
  inventario: string;
  imagenDescripcion: string;
}

// Total de puntos a repartir entre las 5 estadísticas.
export const PUNTOS_ESTADISTICAS = 12;
export const PV_BASE = 100;

// Total de niveles (Lvl) a repartir entre los Poderes Oficiales.
export const PUNTOS_PODERES = 5;

// Mínimos de palabras (la regla edad↔historia escala Historia hacia arriba).
export const MINIMOS_PALABRAS = {
  historia: 180, // exigente
  personalidad: 40, // medio
  debilidades: 15, // suave
} as const;

export const STAT_LABELS: Record<keyof Estadisticas, string> = {
  fuerza: "Fuerza",
  agilidad: "Agilidad",
  inteligencia: "Inteligencia",
  defensa: "Defensa",
  defensaMagica: "Defensa mágica",
};

export function sumaEstadisticas(e: Estadisticas): number {
  return e.fuerza + e.agilidad + e.inteligencia + e.defensa + e.defensaMagica;
}

export function fichaVacia(): Ficha {
  return {
    nombre: "",
    edad: "",
    genero: "",
    estatura: "",
    raza: "",
    poderesOficiales: "",
    estadisticas: {
      fuerza: 0,
      agilidad: 0,
      inteligencia: 0,
      defensa: 0,
      defensaMagica: 0,
    },
    armaPrincipal: "",
    estiloCombate: "",
    reino: "",
    claseSocial: "",
    tituloNobleza: "",
    profesion: "",
    habilidadesNoMagicas: "",
    personalidad: "",
    historia: "",
    extras: "",
    debilidades: "",
    inventario: "",
    imagenDescripcion: "",
  };
}

export function contarPalabras(texto: string): number {
  const t = texto.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

// Extrae un número de edad de un texto libre ("1200 años" -> 1200). null si no hay.
export function edadNumerica(edad: string): number | null {
  const m = edad.replace(/[.,](?=\d{3}\b)/g, "").match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

export interface PoderParseado {
  linea: string;
  nombre: string; // nombre del estilo, sin el "Lvl X"
  nivel: number | null; // null si no se detecta "Lvl X"
}

// Parsea cada línea de poderes en {linea, nombre, nivel}. Líneas vacías ignoradas.
export function parsearPoderes(texto: string): PoderParseado[] {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const m = linea.match(/lvl\s*\.?\s*(\d+)/i);
      const nombre = linea
        .replace(/lvl\s*\.?\s*\d+/i, "")
        .replace(/[-–—:·,]+\s*$/, "")
        .trim();
      return { linea, nombre, nivel: m ? parseInt(m[1], 10) : null };
    });
}

// Suma de niveles de los poderes con Lvl detectado.
export function sumaNivelesPoderes(texto: string): number {
  return parsearPoderes(texto).reduce((acc, p) => acc + (p.nivel ?? 0), 0);
}
