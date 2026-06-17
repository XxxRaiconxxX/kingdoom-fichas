// Las 5 naciones de Aethelgardia (campo "Reino donde nació").
import { normalizar } from "./razas";

export interface Reino {
  id: string;
  nombre: string;
  lema: string;
  // Razas más asociadas a la nación (para pistas de coherencia, no es una regla dura).
  razasAfines: string[];
}

export const REINOS: Reino[] = [
  {
    id: "kaelum-gard",
    nombre: "Imperio de Kaelum-Gard",
    lema: "El Puño del Orden",
    razasAfines: [
      "Humanos",
      "Ángeles de las Virtudes",
      "Serafines",
      "Vampiros Sangre Pura",
      "Altos Elfos",
      "Elfos de Sangre",
      "Orcos de Hierro",
      "Minotauros",
      "Cíclopes",
      "Gigantes de Fuego",
      "Golems de Piedra",
      "Autómatas de Vapor",
      "Enanos de las Montañas",
    ],
  },
  {
    id: "oakhaven",
    nombre: "Protectorado de Oakhaven",
    lema: "El Latido Alquímico",
    razasAfines: [
      "Elfos Silvanos",
      "Elfos de la Noche",
      "Dríadas",
      "Ents",
      "Espíritus del Bosque",
      "Hombres Lobo",
      "Hombres Tigre",
      "Hombres León",
      "Hombres Oso",
      "Hombres Planta",
      "Myconids",
      "Ninfas de Agua",
      "Hadas",
      "Pixies",
      "Tengus",
    ],
  },
  {
    id: "arcania",
    nombre: "Nexo de Arcania",
    lema: "El Prisma del Saber",
    razasAfines: [
      "Ethereals",
      "Cuerpos de Éter",
      "Sombras Vivientes",
      "Golems de Cristal",
      "Enanos Oscuros",
      "Gnomos de las Profundidades",
      "Liches",
      "Aasimar",
      "Tieflings",
      "Nephilim",
      "Súcubos e Íncubos",
    ],
  },
  {
    id: "paramos",
    nombre: "Unión de los Páramos",
    lema: "La Senda del Pragmatismo",
    razasAfines: [
      "Goblins Ingenieros",
      "Hobgoblins",
      "Tanuki",
      "Hombres Zorro",
      "Hombres Rata",
      "Centauros",
      "Hombres Jabalí",
      "Hombres Topo",
      "Trolls de Hielo",
      "Trolls de Selva",
      "Gigantes de Escarcha",
      "Gnolls",
      "Kobolds",
    ],
  },
  {
    id: "naciones-agua",
    nombre: "Naciones del Agua y Exiliados",
    lema: "Las Mareas y las Sombras",
    razasAfines: [
      "Sirenas y Tritones",
      "Nagas",
      "Hombres Pulpo",
      "Hombres Tiburón",
      "Hombres Pez",
      "Hombres Medusa",
      "Dullahan",
      "Ghouls",
      "Gorgonas",
      "Gritones",
    ],
  },
];

export const REINOS_NOMBRES: string[] = REINOS.map((r) => r.nombre);

const REINOS_NORMALIZADOS = new Set(REINOS_NOMBRES.map(normalizar));

export function esReinoValido(reino: string): boolean {
  return REINOS_NORMALIZADOS.has(normalizar(reino));
}

export function reinoAfinARaza(reino: string, raza: string): boolean {
  const r = REINOS.find((x) => normalizar(x.nombre) === normalizar(reino));
  if (!r) return false;
  return r.razasAfines.some((ra) => normalizar(ra) === normalizar(raza));
}
