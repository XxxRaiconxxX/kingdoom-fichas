// Catálogo oficial de razas de Aethelgardia (Kingdoom).
// Fuente: catálogo de razas del grupo de rol.

export interface CategoriaRazas {
  categoria: string;
  razas: string[];
}

export const RAZAS_POR_CATEGORIA: CategoriaRazas[] = [
  {
    categoria: "Humanos y Elfos",
    razas: [
      "Humanos",
      "Elfos de Sangre",
      "Elfos de la Noche",
      "Elfos Silvanos",
      "Altos Elfos",
      "Semi-Elfos",
    ],
  },
  {
    categoria: "Enanos y Seres Pequeños",
    razas: [
      "Enanos de las Montañas",
      "Enanos Oscuros",
      "Gnomos de las Profundidades",
      "Gnomos de Jardín",
      "Goblins Ingenieros",
      "Goblins de las Cuevas",
      "Hobgoblins",
      "Trasgos",
      "Kobolds",
    ],
  },
  {
    categoria: "Orcos, Trolls y Bestiales",
    razas: [
      "Orcos de las Estepas",
      "Orcos de Hierro",
      "Semi-Orcos",
      "Trolls de Selva",
      "Trolls de Hielo",
      "Gnolls",
      "Onis",
    ],
  },
  {
    categoria: "Cambiaformas y Teriántropos",
    razas: [
      "Hombres Lobo",
      "Hombres Tigre",
      "Hombres León",
      "Hombres Gato",
      "Hombres Conejo",
      "Hombres Zorro",
      "Hombres Oso",
      "Hombres Jabalí",
      "Hombres Rata",
      "Hombres Topo",
      "Hombres Murciélago",
      "Tanuki",
    ],
  },
  {
    categoria: "Seres Acuáticos y Reptilianos",
    razas: [
      "Nagas",
      "Sirenas y Tritones",
      "Hombres Pez",
      "Hombres Tiburón",
      "Hombres Pulpo",
      "Hombres Medusa",
      "Dracónidos",
      "Saurios",
      "Hombres Cocodrilo",
      "Basiliscos Humanoides",
    ],
  },
  {
    categoria: "Celestiales, Infernales y Etéreos",
    razas: [
      "Ángeles de las Virtudes",
      "Serafines",
      "Querubines",
      "Ángeles Caídos",
      "Aasimar",
      "Nephilim",
      "Demonios de Clase Alta",
      "Súcubos e Íncubos",
      "Diablillos",
      "Tieflings",
      "Cambion",
      "Ethereals",
      "Cuerpos de Éter",
      "Sombras Vivientes",
    ],
  },
  {
    categoria: "No-Muertos y Espectros",
    razas: [
      "Vampiros Sangre Pura",
      "Dhampiros",
      "Liches",
      "Esqueletos Guerrero",
      "Ghouls",
      "Dullahan",
      "Gritones",
      "Espectros",
    ],
  },
  {
    categoria: "Espíritus de la Naturaleza y Elementales",
    razas: [
      "Hadas",
      "Pixies",
      "Ninfas de Agua",
      "Dríadas",
      "Espíritus del Bosque",
      "Salamandras",
      "Mujeres de Nieve",
      "Hombres Planta",
      "Myconids",
      "Ents",
    ],
  },
  {
    categoria: "Gigantes, Colosos y Constructos",
    razas: [
      "Gigantes de Fuego",
      "Gigantes de Escarcha",
      "Titanes",
      "Cíclopes",
      "Yeti",
      "Golems de Piedra",
      "Golems de Cristal",
      "Autómatas de Vapor",
    ],
  },
  {
    categoria: "Híbridos y Quimeras",
    razas: [
      "Centauros",
      "Sátiros",
      "Faunos",
      "Minotauros",
      "Arácnidos",
      "Hombres Escorpión",
      "Harpías",
      "Tengus",
      "Lamias",
      "Gorgonas",
      "Manticoras",
      "Dragones Celestiales",
      "Wyverns Sapientes",
    ],
  },
];

// Lista plana de todas las razas válidas.
export const RAZAS: string[] = RAZAS_POR_CATEGORIA.flatMap((c) => c.razas);

// Normaliza para comparar de forma tolerante (minúsculas, sin acentos, sin espacios extra).
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

const RAZAS_NORMALIZADAS = new Set(RAZAS.map(normalizar));

export function esRazaValida(raza: string): boolean {
  return RAZAS_NORMALIZADAS.has(normalizar(raza));
}
