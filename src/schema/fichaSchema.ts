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

export type CategoriaLongevidad = "normal" | "prolongada" | "legendaria";

export interface RequisitoHistoriaPorEdad {
  minPalabras: number;
  maxPalabras: number;
  minParrafos: number;
  avisoLongevidadExtrema: boolean;
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

export const MAX_EDAD_PERSONAJE = 900;

const RAZAS_VIDA_PROLONGADA = new Set([
  "Elfos de Sangre",
  "Elfos de la Noche",
  "Elfos Silvanos",
  "Altos Elfos",
  "Enanos de las Montañas",
  "Enanos Oscuros",
  "Gnomos de las Profundidades",
  "Gnomos de Jardín",
  "Trolls de Selva",
  "Trolls de Hielo",
  "Onis",
  "Tanuki",
  "Nagas",
  "Sirenas y Tritones",
  "Hombres Medusa",
  "Aasimar",
  "Diablillos",
  "Gritones",
  "Hadas",
  "Pixies",
  "Ninfas de Agua",
  "Dríadas",
  "Salamandras",
  "Mujeres de Nieve",
  "Cíclopes",
  "Lamias",
  "Gorgonas",
  "Manticoras",
  "Wyverns Sapientes",
  "Basiliscos Humanoides",
]);

const RAZAS_VIDA_LEGENDARIA = new Set([
  "Ángeles de las Virtudes",
  "Serafines",
  "Querubines",
  "Ángeles Caídos",
  "Nephilim",
  "Demonios de Clase Alta",
  "Súcubos e Íncubos",
  "Ethereals",
  "Cuerpos de Éter",
  "Sombras Vivientes",
  "Vampiros Sangre Pura",
  "Liches",
  "Esqueletos Guerrero",
  "Ghouls",
  "Dullahan",
  "Espectros",
  "Espíritus del Bosque",
  "Ents",
  "Gigantes de Fuego",
  "Gigantes de Escarcha",
  "Titanes",
  "Golems de Piedra",
  "Golems de Cristal",
  "Autómatas de Vapor",
  "Dragones Celestiales",
]);

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

export function contarParrafos(texto: string): number {
  const t = texto.trim();
  if (!t) return 0;
  return t
    .split(/\n\s*\n/)
    .map((bloque) => bloque.trim())
    .filter(Boolean).length;
}

// Extrae un número de edad de un texto libre ("1200 años" -> 1200). null si no hay.
export function edadNumerica(edad: string): number | null {
  const m = edad.replace(/[.,](?=\d{3}\b)/g, "").match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

export function obtenerRequisitoHistoriaPorEdad(
  edad: number | null,
): RequisitoHistoriaPorEdad {
  if (edad === null || edad < 40) {
    return {
      minPalabras: 330,
      maxPalabras: 370,
      minParrafos: 4,
      avisoLongevidadExtrema: false,
    };
  }

  if (edad < 100) {
    return {
      minPalabras: 370,
      maxPalabras: 430,
      minParrafos: 8,
      avisoLongevidadExtrema: false,
    };
  }

  if (edad < 300) {
    return {
      minPalabras: 430,
      maxPalabras: 530,
      minParrafos: 10,
      avisoLongevidadExtrema: false,
    };
  }

  if (edad < 700) {
    return {
      minPalabras: 530,
      maxPalabras: 670,
      minParrafos: 12,
      avisoLongevidadExtrema: false,
    };
  }

  return {
    minPalabras: 670,
    maxPalabras: 850,
    minParrafos: 15,
    avisoLongevidadExtrema: true,
  };
}

export function obtenerCategoriaLongevidadPorRaza(
  raza: string,
): CategoriaLongevidad {
  if (RAZAS_VIDA_LEGENDARIA.has(raza)) return "legendaria";
  if (RAZAS_VIDA_PROLONGADA.has(raza)) return "prolongada";
  return "normal";
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
