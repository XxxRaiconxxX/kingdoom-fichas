import { type Ficha, type Estadisticas, PUNTOS_ESTADISTICAS, PUNTOS_PODERES } from "../schema/fichaSchema";
import { RAZAS } from "../data/razas";
import { REINOS } from "../data/reinos";
import { CLASES_SOCIALES } from "../data/clasesSociales";

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Reparte exactamente PUNTOS_ESTADISTICAS entre las 5 estadísticas.
function repartirEstadisticas(): Estadisticas {
  const claves: (keyof Estadisticas)[] = [
    "fuerza",
    "agilidad",
    "inteligencia",
    "defensa",
    "defensaMagica",
  ];
  const valores: Record<string, number> = {
    fuerza: 0,
    agilidad: 0,
    inteligencia: 0,
    defensa: 0,
    defensaMagica: 0,
  };
  for (let i = 0; i < PUNTOS_ESTADISTICAS; i++) {
    valores[rand(claves)]++;
  }
  return valores as unknown as Estadisticas;
}

const GENEROS = ["Masculino", "Femenino", "No binario"];
const ARMAS = ["Espada larga", "Daga", "Arco corto", "Lanza", "Hacha de mano", "Maza", "Bastón de madera", "Ballesta"];
const ESTILOS = ["Cuerpo a cuerpo agresivo", "Defensivo y paciente", "A distancia", "Ágil y evasivo", "Táctico y oportunista"];
const PROFESIONES = ["Herrero", "Mercader", "Cazador", "Erudito", "Mercenario", "Sanador", "Explorador", "Guardia"];
const MAGIAS = ["Magia de fuego", "Magia de gravedad", "Magia de hielo", "Magia de viento", "Magia de luz", "Magia de sombras", "Magia de rayo"];

// Genera poderes cuyos niveles suman exactamente PUNTOS_PODERES.
function generarPoderes(): string {
  // Reparte PUNTOS_PODERES niveles en 1-3 magias distintas.
  const numMagias = 1 + Math.floor(Math.random() * 3);
  const niveles = new Array(numMagias).fill(1);
  for (let i = numMagias; i < PUNTOS_PODERES; i++) {
    niveles[Math.floor(Math.random() * numMagias)]++;
  }
  const magias = [...MAGIAS].sort(() => Math.random() - 0.5).slice(0, numMagias);
  return magias.map((m, i) => `${m} Lvl ${niveles[i]}`).join("\n");
}

// Genera una ficha aleatoria que YA pasa las reglas locales (borrador para editar).
export function generarFichaAleatoria(): Ficha {
  const reino = rand(REINOS);
  // Preferir una raza afín al reino para máxima coherencia.
  const raza = reino.razasAfines.length > 0 ? rand(reino.razasAfines) : rand(RAZAS);
  const claseSocial = rand(CLASES_SOCIALES);
  const esNoble = claseSocial === "Noble";

  const historia = [
    `Nacido en el seno de ${reino.nombre}, cuyo lema "${reino.lema}" resonaría en su memoria durante toda su vida, su destino quedó marcado desde la cuna por las costumbres y tensiones de su pueblo.`,
    `Desde muy joven mostró aptitudes propias de los ${raza}, aunque el camino para dominarlas nunca fue sencillo y exigió de él una disciplina que pocos de su edad estaban dispuestos a aceptar.`,
    "La pérdida de parte de su familia durante un conflicto fronterizo lo obligó a madurar antes de tiempo y a jurar que jamás volvería a sentirse impotente ante la adversidad.",
    "Durante años recorrió aldeas olvidadas y ciudades amuralladas, aprendiendo de cada maestro, soldado y vagabundo que se cruzó en su camino, puliendo tanto su cuerpo como su mente con cada nueva lección.",
    "Conoció la traición de aliados en quienes confiaba y la inesperada bondad de extraños que nada le debían, experiencias que moldearon su carácter y su forma de entender el mundo.",
    "Hoy busca un propósito mayor, debatiéndose constantemente entre el deber hacia su nación y las ambiciones personales que arden en su pecho como una llama difícil de apagar.",
    "Las cicatrices de antiguas batallas le recuerdan cada mañana que la fuerza sin una causa justa no es más que violencia vacía, y que el verdadero poder reside en saber cuándo contenerse.",
    "Su nombre empieza a sonar en tabernas, mercados y salones nobiliarios, para bien o para mal, mientras el Aether parece vibrar ante cada una de las decisiones que toma en su incierto viaje.",
  ].join(" ");

  return {
    nombre: "(elige un nombre)",
    edad: `${18 + Math.floor(Math.random() * 40)}`,
    genero: rand(GENEROS),
    estatura: `${(1.5 + Math.random() * 0.5).toFixed(2)} m`,
    raza,
    poderesOficiales: generarPoderes(),
    estadisticas: repartirEstadisticas(),
    armaPrincipal: rand(ARMAS),
    estiloCombate: rand(ESTILOS),
    reino: reino.nombre,
    claseSocial,
    tituloNobleza: esNoble ? "Barón/Baronesa" : "",
    profesion: rand(PROFESIONES),
    habilidadesNoMagicas: "Rastreo, supervivencia en la naturaleza y conocimiento de hierbas medicinales.",
    personalidad:
      "Reservado al principio pero leal con quienes se ganan su confianza. Pragmático, observador y con un fuerte sentido de la justicia personal, aunque a veces deja que el orgullo nuble su juicio.",
    historia,
    extras: "",
    debilidades: "Desconfía en exceso de los desconocidos y carga con una vieja herida que limita su resistencia en combates largos.",
    inventario: "Una bolsa de monedas, raciones para varios días, una capa raída y un amuleto familiar.",
    imagenDescripcion: "",
  };
}
