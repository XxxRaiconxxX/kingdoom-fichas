import {
  type CategoriaLongevidad,
  type Ficha,
  type Estadisticas,
  MAX_EDAD_PERSONAJE,
  PUNTOS_ESTADISTICAS,
  PUNTOS_PODERES,
  contarPalabras,
  edadNumerica,
  obtenerCategoriaLongevidadPorRaza,
  obtenerRequisitoHistoriaPorEdad,
} from "../schema/fichaSchema";
import { RAZAS } from "../data/razas";
import { REINOS } from "../data/reinos";
import { CLASES_SOCIALES } from "../data/clasesSociales";
import { getCatalogoGrimorio } from "../services/grimorio";

/* ──────────────────────── Utilidades ──────────────────────── */

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ──────────────────────── Nombres ──────────────────────── */

const NOMBRES_MASCULINOS = [
  "Aldric", "Alaric", "Theron", "Cedric", "Gideon", "Lucian", "Caelum",
  "Dorian", "Fenris", "Hadrian", "Oberon", "Rowan", "Soren", "Valen",
  "Zephyr", "Bastian", "Darius", "Emeric", "Gareth", "Alistair",
  "Ragnar", "Leoric", "Mordecai", "Iskander", "Aemond", "Cassian",
  "Torin", "Roderic", "Halvard", "Kaelith", "Magnus", "Orion",
  "Pellinore", "Reinhardt", "Severin", "Tristan", "Ulric", "Viktor",
  "Wulfric", "Yorath", "Artorias", "Baldric", "Corwin", "Draven",
  "Edmund", "Florian", "Gunther", "Hector", "Ivar", "Jasper",
];

const NOMBRES_FEMENINOS = [
  "Aeryn", "Isolde", "Seraphina", "Elowen", "Lyra", "Morgana",
  "Rowena", "Sylvari", "Virelai", "Astrid", "Brienne", "Celestine",
  "Dahlia", "Elara", "Freya", "Gwendolyn", "Helena", "Ingrid",
  "Kallista", "Liora", "Mirael", "Nyx", "Ophelia", "Petra",
  "Ravenna", "Sigrid", "Thalia", "Ursa", "Vaelith", "Wynne",
  "Arianne", "Brunhilde", "Carmilla", "Dianora", "Emilia", "Fiora",
  "Griselda", "Hildegard", "Isadora", "Jocelyn", "Katarine", "Lenora",
  "Maeve", "Nimue", "Oriana", "Rosalind", "Solaine", "Talia",
];

const APELLIDOS = [
  "Blackwood", "Ashford", "Montfort", "Lancaster", "Dessendre",
  "Silven", "Thornwall", "Ironheart", "Ravencroft", "Stormwind",
  "Dawnbreaker", "Nighthollow", "Frostborne", "Goleli", "Wyverncrest",
  "Oakheart", "Shadowmere", "Brightforge", "Starfall", "Greymantle",
  "Valorian", "Dunmere", "Flamesworth", "Coldwell", "Stonebark",
  "Velmaris", "Halenthir", "Ysendral", "Krellion", "Tharnis",
  "Morghast", "Delsarin", "Fenwick", "Lorendel", "Ashenmoor",
  "Bloodworth", "Crestfall", "Dunhaven", "Elderwood", "Galbraith",
  "Harkness", "Kingsley", "Merriweather", "Northgate", "Pemberton",
  "Rosewood", "Stillwater", "Underhill", "Whitmore", "Yarborough",
];

const APODOS = [
  "El Errante", "La Sombra Silente", "El Lobo de Hierro", "La Espina de Plata",
  "El Halcón Dorado", "La Voz del Trueno", "El Pastor del Viento",
  "La Rosa de Acero", "El Cuervo Rojo", "La Hoja Errante",
  "El Escudo Roto", "La Llama Eterna", "El Puño de Piedra",
  "La Doncella de Escarcha", "El Filo de la Noche",
  "La Centinela del Alba", "El Cazador Silencioso", "La Mano de Hierro",
  "El Empalador", "La Tejedora de Sombras", "El Vigilante", "La Cazadora",
  "El Mercenario de las Cenizas", "La Voz de los Caídos", "El Errante de los Páramos",
];

/* ──────────────────────── Edad por raza ──────────────────────── */

const RAZAS_LONGEVAS_EXTREMAS: readonly string[] = [
  "Elfos de Sangre", "Elfos de la Noche", "Elfos Silvanos", "Altos Elfos",
  "Vampiros Sangre Pura", "Liches", "Dragones Celestiales",
  "Ents", "Ángeles de las Virtudes", "Serafines", "Querubines",
  "Ethereals", "Cuerpos de Éter",
];

const RAZAS_LONGEVAS: readonly string[] = [
  "Semi-Elfos", "Dhampiros", "Ninfas de Agua", "Dríadas",
  "Hadas", "Espíritus del Bosque", "Ángeles Caídos", "Aasimar",
  "Nephilim", "Demonios de Clase Alta", "Súcubos e Íncubos",
  "Tieflings", "Cambion", "Sombras Vivientes", "Nagas",
  "Centauros", "Kitsune", "Salamandras", "Mujeres de Nieve",
  "Dullahan", "Gritones", "Espectros", "Lamias", "Gorgonas",
  "Wyverns Sapientes", "Sátiros", "Faunos", "Gigantes de Fuego",
  "Gigantes de Escarcha", "Titanes", "Cíclopes", "Golems de Piedra",
  "Golems de Cristal", "Autómatas de Vapor", "Pixies",
  "Esqueletos Guerrero", "Ghouls",
];

void RAZAS_LONGEVAS_EXTREMAS;
void RAZAS_LONGEVAS;

function tirarPorcentaje(): number {
  return Math.random() * 100;
}

function generarEdad(raza: string): string {
  const categoria = obtenerCategoriaLongevidadPorRaza(raza);
  const roll = tirarPorcentaje();

  if (categoria === "legendaria") {
    if (roll < 45) return `${randInt(40, 99)}`;
    if (roll < 75) return `${randInt(100, 299)}`;
    if (roll < 93) return `${randInt(300, 699)}`;
    return `${randInt(700, MAX_EDAD_PERSONAJE)}`;
  }

  if (categoria === "prolongada") {
    if (roll < 40) return `${randInt(25, 99)}`;
    if (roll < 80) return `${randInt(100, 219)}`;
    return `${randInt(220, 320)}`;
  }

  if (roll < 55) return `${randInt(18, 39)}`;
  if (roll < 85) return `${randInt(40, 65)}`;
  return `${randInt(66, 90)}`;
}

/* ──────────────────────── Estadísticas ──────────────────────── */

function repartirEstadisticas(): Estadisticas {
  const claves: (keyof Estadisticas)[] = [
    "fuerza", "agilidad", "inteligencia", "defensa", "defensaMagica",
  ];
  const valores: Record<string, number> = {
    fuerza: 0, agilidad: 0, inteligencia: 0, defensa: 0, defensaMagica: 0,
  };
  for (let i = 0; i < PUNTOS_ESTADISTICAS; i++) {
    valores[rand(claves)]++;
  }
  return valores as unknown as Estadisticas;
}

/* ──────────────────────── Poderes (del Grimorio real) ──────────────────────── */

function generarPoderes(): string {
  const grimorio = getCatalogoGrimorio();
  if (grimorio.length === 0) return "Magia de Gravedad Lvl 5";

  const numMagias = randInt(1, 3);
  const seleccion = shuffle(grimorio).slice(0, numMagias);
  const niveles = new Array(numMagias).fill(1);
  for (let i = numMagias; i < PUNTOS_PODERES; i++) {
    const idx = Math.floor(Math.random() * numMagias);
    // Respetar el nivel máximo del estilo si está disponible
    const maxNivel = seleccion[idx].niveles.length > 0
      ? Math.max(...seleccion[idx].niveles)
      : 5;
    if (niveles[idx] < maxNivel) {
      niveles[idx]++;
    } else {
      // Buscar otra magia que aún pueda subir
      const otras = niveles.map((n, j) => {
        const mx = seleccion[j].niveles.length > 0 ? Math.max(...seleccion[j].niveles) : 5;
        return n < mx ? j : -1;
      }).filter(j => j >= 0);
      if (otras.length > 0) niveles[rand(otras)]++;
    }
  }
  return seleccion.map((m, i) => `${m.title} Lvl ${niveles[i]}`).join("\n");
}

/* ──────────────────────── Armas ──────────────────────── */

const ARMAS_CUERPO = [
  "Espada larga de acero templado", "Espada bastarda", "Hacha de guerra",
  "Maza de hierro reforzada", "Martillo de guerra", "Lanza de punta doble",
  "Mandoble de dos manos", "Estoque ligero", "Guantes reforzados de combate",
  "Cimitarra de hoja curva", "Garrote con púas de hierro",
  "Alabarda de mango largo", "Espada corta y escudo",
];

const ARMAS_DISTANCIA = [
  "Arco largo compuesto", "Ballesta de repetición", "Arco corto reforzado",
  "Honda de guerra con munición de plomo", "Jabalinas arrojadizas",
];

const ARMAS_MAGICAS_FISICAS = [
  "Bastón de madera ancestral", "Dagas gemelas de acero",
  "Abanico catalizador con runas", "Cetro de cristal tallado",
  "Guadaña ceremonial", "Vara de hueso antiguo",
];

/* ──────────────────────── Estilos de combate (extensos) ──────────────────────── */

interface EstiloCombateData {
  tipo: "cuerpo" | "distancia" | "mixto";
  texto: string;
}

const ESTILOS_COMBATE: EstiloCombateData[] = [
  {
    tipo: "cuerpo",
    texto: "Combate cuerpo a cuerpo agresivo y directo. Prefiere imponer presión constante sobre el enemigo, acortando distancias rápidamente para no dar tiempo a reaccionar. Sus golpes son contundentes y buscan zonas vitales con precisión quirúrgica. Cuando encuentra una apertura, no duda en lanzar ataques consecutivos hasta que el oponente ceda terreno o caiga. Su filosofía es simple: quien golpea primero y más fuerte, sobrevive.",
  },
  {
    tipo: "cuerpo",
    texto: "Estilo defensivo y disciplinado basado en la paciencia y la lectura del oponente. Mantiene una guardia firme y espera a que el enemigo cometa un error antes de contraatacar con golpes precisos y devastadores. Su forma de luchar recuerda a un muro viviente que absorbe cada impacto sin retroceder, desgastando psicológicamente al rival. Cuando finalmente ataca, lo hace con toda la fuerza acumulada en un único movimiento contundente.",
  },
  {
    tipo: "distancia",
    texto: "Combatiente a distancia que domina las emboscadas y el posicionamiento táctico. Se mueve constantemente buscando líneas de tiro claras y terreno elevado desde donde atacar sin ser alcanzado. Cada disparo o lanzamiento está calculado para maximizar el daño y minimizar su exposición. Si el enemigo logra acercarse, se repliega con movimientos ágiles y trampas improvisadas para restablecer la distancia segura.",
  },
  {
    tipo: "mixto",
    texto: "Estilo híbrido que combina ataques cuerpo a cuerpo con técnicas de apoyo mágico. Inicia cada enfrentamiento analizando al oponente, reforzando su cuerpo y equipo con mejoras antes de comprometerse al combate directo. Una vez en el cuerpo a cuerpo, alterna entre golpes físicos potenciados y ráfagas de energía a corta distancia, manteniendo un ritmo impredecible que desconcierta a la mayoría de rivales convencionales.",
  },
  {
    tipo: "cuerpo",
    texto: "Estilo ágil y evasivo centrado en la velocidad y la fluidez de movimiento. En vez de bloquear o resistir golpes directamente, esquiva con movimientos certeros y reposiciona constantemente para atacar desde ángulos inesperados. Su forma de luchar es casi una danza: pasos rápidos, fintas constantes y cortes precisos que buscan tendones, articulaciones y puntos débiles. Nunca permanece en el mismo sitio más de un segundo.",
  },
  {
    tipo: "mixto",
    texto: "Combate táctico y oportunista basado en el engaño y la manipulación del entorno. Utiliza ilusiones, distracciones y cambios de posición para desorientar al enemigo, haciéndolo dudar de lo que percibe. Su forma de lucha es fluida y adaptable, alternando entre ataques rápidos cuando encuentra una apertura y repliegues calculados cuando la presión es excesiva. Prefiere que el enemigo cometa errores por su propia confusión antes que forzar un enfrentamiento directo.",
  },
  {
    tipo: "cuerpo",
    texto: "Estilo brutal de tanque pesado que absorbe el daño mientras avanza inexorablemente hacia el enemigo. Su filosofía es resistir cualquier golpe sin perder terreno y responder con ataques demoledores que quiebran defensas y armaduras. No necesita velocidad ni fintas: su presencia física intimida y su resistencia agota a cualquier rival que intente desgastarlo. Cada impacto que recibe solo alimenta su determinación de aplastar a quien se interponga.",
  },
  {
    tipo: "distancia",
    texto: "Francotirador paciente que selecciona cuidadosamente cada objetivo antes de actuar. Se camufla en el entorno, observa los patrones de movimiento del enemigo y espera el momento perfecto para un disparo limpio y letal. Si es descubierto, utiliza trampas precolocadas y señuelos para ganar tiempo mientras se reposiciona. Su mayor virtud es la disciplina para no revelar su posición prematuramente.",
  },
];

function generarArmaYEstilo(): { arma: string; estilo: string } {
  const estiloData = rand(ESTILOS_COMBATE);
  let arma: string;
  switch (estiloData.tipo) {
    case "cuerpo":
      arma = rand(ARMAS_CUERPO);
      break;
    case "distancia":
      arma = rand(ARMAS_DISTANCIA);
      break;
    case "mixto":
      arma = rand([...ARMAS_MAGICAS_FISICAS, ...ARMAS_CUERPO.slice(0, 5)]);
      break;
  }
  return { arma, estilo: estiloData.texto };
}

/* ──────────────────────── Clase social / Título / Profesión ──────────────────────── */

const TITULOS_MASCULINOS = ["Barón", "Conde", "Duque", "Marqués", "Lord", "Caballero", "Vizconde"];
const TITULOS_FEMENINOS = ["Baronesa", "Condesa", "Duquesa", "Marquesa", "Lady", "Dama", "Vizcondesa"];

const PROFESIONES_NOBLE = [
  "General", "Comandante militar", "Diplomático", "Canciller real",
  "Paladín de la corte", "Estratega de guerra", "Inquisidor",
  "Caballero de élite", "Embajador del reino", "Consejero real",
];

const PROFESIONES_BURGUES = [
  "Mercader de renombre", "Alquimista", "Artesano maestro",
  "Herrero de la forja real", "Erudito independiente", "Boticario",
  "Ingeniero de asedio", "Armero de prestigio", "Comerciante de reliquias",
  "Navegante cartógrafo",
];

const PROFESIONES_PLEBEYO = [
  "Cazador", "Guardia de la ciudad", "Herrero", "Mercenario",
  "Explorador", "Sanador de aldea", "Leñador", "Mensajero",
  "Granjero veterano", "Minero", "Pescador", "Rastreador",
  "Tabernero", "Aprendiz de mago", "Vigilante nocturno",
];

function generarClaseTituloProfesion(genero: string): {
  claseSocial: string;
  tituloNobleza: string;
  profesion: string;
} {
  const claseSocial = rand(CLASES_SOCIALES.filter(c => c !== "Otro"));
  const esMasculino = genero === "Masculino";

  if (claseSocial === "Noble") {
    const titulo = esMasculino ? rand(TITULOS_MASCULINOS) : rand(TITULOS_FEMENINOS);
    return { claseSocial, tituloNobleza: titulo, profesion: rand(PROFESIONES_NOBLE) };
  }
  if (claseSocial === "Burgués") {
    return { claseSocial, tituloNobleza: "", profesion: rand(PROFESIONES_BURGUES) };
  }
  return { claseSocial, tituloNobleza: "", profesion: rand(PROFESIONES_PLEBEYO) };
}

/* ──────────────────────── Habilidades no mágicas ──────────────────────── */

const HABILIDADES_POOL = [
  "**Rastreo avanzado:** Capaz de seguir huellas, marcas de sangre y señales de paso incluso en terrenos difíciles como nieve, barro o roca. Con suficiente tiempo puede reconstruir la ruta completa de su objetivo.",
  "**Supervivencia en la naturaleza:** Sabe construir refugios improvisados, identificar plantas comestibles y venenosas, encender fuego sin herramientas y orientarse usando las estrellas y el musgo de los árboles.",
  "**Conocimiento de hierbas medicinales:** Identifica y prepara remedios a base de plantas para tratar heridas, fiebres e infecciones leves. No sustituye a un sanador, pero puede estabilizar a un herido en el campo de batalla.",
  "**Combate cuerpo a cuerpo entrenado:** Años de entrenamiento le han dado una técnica sólida con su arma principal. Conoce posturas defensivas, contraataques básicos y técnicas de desarme.",
  "**Oído agudo:** Sus sentidos están afinados para detectar sonidos sutiles: pasos sigilosos, el roce de metal al desenvainarse o susurros en habitaciones contiguas, lo que le permite anticipar emboscadas.",
  "**Equitación experta:** Monta a caballo con destreza tanto en caminos como en campo abierto. Puede combatir montado sin perder el equilibrio y dirigir su montura con las rodillas mientras usa ambas manos.",
  "**Diplomacia y persuasión:** Posee una elocuencia natural que le permite negociar, mediar en conflictos y convencer a otros sin recurrir a la fuerza. Sabe adaptar su discurso según su audiencia.",
  "**Conocimiento de estrategia militar:** Entiende formaciones de batalla, tácticas de flanqueo, uso del terreno y logística de campaña. Puede coordinar grupos pequeños con eficiencia táctica.",
  "**Juego de manos y prestidigitación:** Posee una coordinación motriz excepcional. Es capaz de ocultar, desenfundar o hacer aparecer objetos pequeños con movimientos tan rápidos y limpios que engañan a la vista.",
  "**Sigilo y infiltración:** Se mueve en silencio, sabe aprovechar las sombras y los puntos ciegos de guardias y centinelas. Puede abrir cerraduras simples y escalar muros bajos sin equipamiento especial.",
  "**Lingüista:** Habla con fluidez dos o tres idiomas además del común, lo que le permite comunicarse con culturas extranjeras, descifrar inscripciones antiguas y detectar dialectos regionales.",
  "**Lectura del cuerpo y conducta:** Es un observador agudo que puede detectar mentiras, nerviosismo o intenciones hostiles leyendo el lenguaje corporal, los microgestos y los patrones de habla de su interlocutor.",
  "**Cocina y conocimiento culinario:** Sabe preparar comidas nutritivas con ingredientes limitados. Conoce técnicas de conservación de alimentos y puede identificar la calidad y procedencia de ingredientes exóticos.",
  "**Primeros auxilios de campo:** Sabe suturar heridas, entablillar fracturas, aplicar torniquetes y estabilizar a compañeros heridos en medio del caos de batalla mientras llega ayuda profesional.",
  "**Navegación y cartografía:** Puede trazar mapas fiables de territorios explorados, calcular distancias y orientarse en terrenos desconocidos usando puntos de referencia naturales.",
  "**Natación avanzada:** Se desenvuelve con agilidad tanto en superficie como bajo el agua. Puede cruzar ríos caudalosos, bucear para recuperar objetos y resistir corrientes moderadas.",
  "**Voluntad férrea:** Su determinación mental le permite resistir intentos de intimidación, tortura psicológica y presión social sin quebrarse. Mantiene la calma en situaciones que harían entrar en pánico a otros.",
  "**Artesanía y reparación:** Sabe reparar armas, armaduras ligeras y equipamiento básico con herramientas rudimentarias. Puede improvisar soluciones funcionales con materiales disponibles en el entorno.",
  "**Conocimiento de venenos y antídotos:** Sabe identificar sustancias tóxicas por su olor, color o efecto, y conoce los antídotos básicos para las toxinas más comunes de la región.",
  "**Reflejos ágiles:** Está acostumbrado a reaccionar rápido ante estímulos inesperados. Puede esquivar objetos lanzados, apartarse de un derrumbe o interceptar un golpe sorpresa con un margen de reacción mínimo.",
];

function generarHabilidades(): string {
  const seleccionadas = shuffle(HABILIDADES_POOL).slice(0, randInt(3, 5));
  return seleccionadas.map(h => `• ${h}`).join("\n\n");
}

/* ──────────────────────── Personalidad ──────────────────────── */

const PERSONALIDADES = [
  "Carismático y extrovertido, tiene facilidad para conectar con desconocidos y ganarse la confianza de quienes lo rodean. Posee un sentido del humor mordaz que utiliza para destensar situaciones peligrosas, aunque a veces sus bromas rozan lo inapropiado. Bajo esa fachada sociable esconde una mente analítica que evalúa constantemente a las personas y sus intenciones. Es leal hasta la muerte con quienes se ganan su respeto, pero implacable con quienes traicionan esa confianza.",

  "Reservado y metódico, prefiere observar antes de actuar y rara vez habla sin haber pensado cuidadosamente cada palabra. Su silencio no es timidez sino una forma deliberada de control, una máscara que oculta emociones profundas y un pasado que prefiere no compartir. Con sus allegados muestra un lado protector y cálido que contrasta con la frialdad que proyecta al exterior. Tiene una voluntad de hierro y un sentido del deber que lo lleva a cumplir sus promesas incluso cuando el precio es demasiado alto.",

  "Impulsivo y apasionado, actúa guiado por sus emociones antes que por la lógica. Posee una energía contagiosa que arrastra a otros a la acción, pero su falta de paciencia lo mete en problemas con frecuencia. Odia la injusticia con una intensidad visceral y no puede quedarse de brazos cruzados cuando alguien débil está siendo oprimido. A pesar de su temperamento explosivo, es capaz de actos de bondad desinteresada que sorprenden incluso a quienes lo conocen desde hace años.",

  "Despreocupado y libre, con una curiosidad casi infantil por el mundo que lo rodea. No le interesan las jerarquías, las posesiones ni las normas sociales rígidas. Su atención es volátil y puede distraerse a mitad de una conversación importante observando algo trivial que captura su imaginación. Sin embargo, cuando alguien que le importa está en peligro, toda esa dispersión desaparece y revela una determinación silenciosa que pocos sospecharían de alguien tan aparentemente despreocupado.",

  "Disciplinado y justo, con una moral férrea que guía cada una de sus decisiones. Se muestra firme e intimidante ante extraños, imponiendo respeto con su sola presencia y su forma directa de hablar. No tolera la cobardía, la mentira ni la falta de compromiso. Sin embargo, con las personas cercanas revela un lado amable, protector y sorprendentemente cálido. Cree firmemente que los actos más duros pueden ser necesarios si conducen a un bien mayor.",

  "Astuto y calculador, con un talento natural para la manipulación sutil y la negociación. Habla con doble sentido, sonríe cuando no debería y siempre parece saber más de lo que revela. Se muestra amable y servicial con quienes le conviene, aunque quienes logran traspasar sus capas descubren que en el fondo se preocupa genuinamente por sus cercanos. Su mayor defecto es la desconfianza crónica: asume que todos tienen una agenda oculta porque él mismo siempre la tiene.",

  "Melancólico y reflexivo, carga con el peso de recuerdos que preferiría olvidar pero que definen quién es. Encuentra belleza en las cosas pequeñas: una puesta de sol, el sonido de la lluvia, una melodía olvidada. Aunque su tristeza puede ser palpable, no la deja convertirse en autocompasión. Posee una empatía profunda que le permite entender el dolor ajeno como pocos pueden, lo que lo convierte en un confidente silencioso al que otros acuden instintivamente en momentos de crisis.",

  "Orgulloso y competitivo, con una necesidad constante de demostrar su valía ante sí mismo y ante el mundo. No acepta la derrota con facilidad y cada fracaso lo impulsa a entrenar más duro y prepararse mejor para la próxima oportunidad. Su orgullo puede rayar en la arrogancia, pero quienes lo conocen saben que detrás de esa fachada hay una inseguridad profunda nacida de sentir que nunca es suficiente. Es ferozmente protector con los suyos y capaz de sacrificios enormes por quienes ama.",
];

/* ──────────────────────── Historias (plantillas) ──────────────────────── */

function generarHistoria(
  nombre: string, raza: string, reino: string, lema: string,
  profesion: string, claseSocial: string, arma: string, genero: string,
): string {
  const pronombre = genero === "Masculino" ? "él" : "ella";
  const adjetivo = genero === "Masculino" ? "nacido" : "nacida";
  const hijo = genero === "Masculino" ? "hijo" : "hija";
  const joven = genero === "Masculino" ? "el joven" : "la joven";

  const plantillas = [
    // Plantilla 1: Origen humilde, ascenso por mérito
    `${adjetivo.charAt(0).toUpperCase() + adjetivo.slice(1)} en ${reino}, cuyo lema "${lema}" resonaría en su memoria durante toda su vida, ${nombre} creció en circunstancias modestas entre las calles y mercados de una ciudad fronteriza. Desde muy temprana edad mostró aptitudes que lo distinguían de otros de su especie, aunque el camino para dominarlas nunca fue sencillo y exigió una disciplina que pocos de su edad estaban dispuestos a aceptar. La pérdida de parte de su familia durante un conflicto fronterizo lo obligó a madurar antes de tiempo, jurando que jamás volvería a sentirse impotente ante la adversidad.\n\nDurante años recorrió aldeas olvidadas y ciudades amuralladas, aprendiendo de cada maestro, soldado y vagabundo que se cruzó en su camino, puliendo tanto su cuerpo como su mente con cada nueva lección. Fue en esos viajes donde descubrió su afinidad con ${arma}, un arma que pronto se convertiría en una extensión de su propia voluntad. Conoció la traición de aliados en quienes confiaba y la inesperada bondad de extraños que nada le debían, experiencias que moldearon su carácter y su forma de entender el mundo.\n\nHoy, como ${profesion} ${claseSocial === "Noble" ? "de reconocido linaje" : "de reputación creciente"}, busca un propósito mayor, debatiéndose constantemente entre el deber hacia su nación y las ambiciones personales que arden en su pecho como una llama difícil de apagar. Las cicatrices de antiguas batallas le recuerdan cada mañana que la fuerza sin una causa justa no es más que violencia vacía, y que el verdadero poder reside en saber cuándo contenerse. Su nombre empieza a sonar en tabernas, mercados y salones nobiliarios, para bien o para mal, mientras el Aether parece vibrar ante cada una de las decisiones que toma en su incierto viaje.`,

    // Plantilla 2: Tragedia familiar y venganza
    `La historia de ${nombre} comienza entre las murallas de ${reino}, en un hogar que conoció días mejores antes de que la tragedia tocara a su puerta. ${hijo.charAt(0).toUpperCase() + hijo.slice(1)} de una familia que una vez gozó de cierto prestigio entre los ${raza}, su infancia fue marcada por la violencia cuando un grupo de mercenarios al servicio de intereses oscuros arrasó con todo lo que conocía. ${joven.charAt(0).toUpperCase() + joven.slice(1)} sobrevivió por pura fortuna, escondido entre los escombros mientras el humo y los gritos se apoderaban de la noche.\n\nLos años siguientes fueron de supervivencia pura. Sin familia, sin hogar y sin nombre que lo respaldara, aprendió a confiar únicamente en sus propios instintos y en la frialdad del acero. Trabajó como aprendiz en forjas, como ayudante en caravanas comerciales y como vigilante nocturno en ciudades que no lo querían, acumulando habilidades y contactos que con el tiempo le darían las herramientas necesarias para buscar las respuestas que necesitaba.\n\nFue durante ese peregrinaje que descubrió una aptitud innata para el combate. Un antiguo veterano de guerra lo tomó bajo su protección, reconociendo en ${pronombre} algo que otros habían ignorado: un fuego interior que no se extinguía con nada. Le enseñó disciplina, técnica y sobre todo, a canalizar la rabia sin dejarse consumir por ella. Hoy, como ${profesion}, recorre los caminos de Aethelgardia con un objetivo que no ha olvidado, mientras el lema de su tierra natal, "${lema}", le recuerda de dónde viene y hacia dónde debe dirigir sus pasos.`,

    // Plantilla 3: Legado familiar y deber
    `${nombre} nació en el seno de una familia reconocida dentro de ${reino}, conocidos por sus aportes al desarrollo y la estabilidad de la región. Como ${raza}, se esperaba que siguiera el camino trazado por sus ancestros, heredando el prestigio y la disciplina de su linaje. Sin embargo, ${nombre} nunca sintió ese llamado con la claridad que su familia esperaba. Mientras los suyos miraban hacia las tradiciones y el orden establecido, ${pronombre} miraba hacia algo distinto: un anhelo profundo de conocer el mundo más allá de las fronteras que siempre había conocido.\n\nEsta diferencia generaba constantes conflictos, pues su familia veía sus aspiraciones como una distracción sin valor real. Todo cambió durante una celebración donde conoció a un viajero proveniente de tierras lejanas, cuyos relatos encendieron en ${pronombre} una imaginación y un deseo imposibles de ignorar. Tiempo después, tomó la decisión de abandonar la comodidad de su hogar para forjar su propio destino.\n\nLos primeros días fuera no fueron fáciles. Sin experiencia real del mundo, tuvo que aprender a sobrevivir por su cuenta, desarrollando agilidad, astucia y una capacidad de adaptación que nadie en su familia habría previsto. Fue en ese proceso que encontró su vocación como ${profesion}, descubriendo que las habilidades que había cultivado en silencio durante años tenían un valor que nadie le había enseñado a apreciar. A pesar de todo, no ha olvidado su origen: ${arma} es un vínculo con su pasado y un símbolo del camino que eligió seguir. El lema de ${reino}, "${lema}", sigue resonando en su memoria como un recordatorio de que, sin importar cuán lejos llegue, sus raíces siempre serán parte de quién es.`,

    // Plantilla 4: Redención y segunda oportunidad
    `Pocas historias son tan tortuosas como la de ${nombre}. ${adjetivo.charAt(0).toUpperCase() + adjetivo.slice(1)} en la pobreza dentro de ${reino}, su infancia fue un reflejo de las peores sombras que acechan a los menos afortunados. Creció en un hogar frío, sin afecto ni protección, y desde muy temprana edad aprendió que el mundo no era un lugar amable para quienes carecían de poder o influencias.\n\nLas circunstancias lo empujaron hacia un camino oscuro. Durante años sobrevivió haciendo lo necesario, sin importar las consecuencias morales, aprendiendo a pelear, a mentir y a desaparecer cuando las cosas se ponían peligrosas. Fue en ese periodo que desarrolló un carácter fuerte y feroz, aunque en su interior nunca aceptó completamente esa vida. Algo dentro de ${pronombre} siempre buscó algo más, algo que diera sentido al sufrimiento acumulado.\n\nLa oportunidad llegó de la mano más inesperada: un extraño que, en lugar de juzgarlo por su pasado, le ofreció lo que ${nombre} nunca había tenido: una segunda oportunidad. Bajo su guía recibió educación, disciplina, entrenamiento y un propósito. Los años de redención fueron difíciles, llenos de oposición y desconfianza por parte de quienes conocían su pasado, pero ${nombre} demostró su valía a través de sus acciones, imponiéndose con disciplina y determinación. Hoy, como ${profesion}, lleva consigo las lecciones de ambas vidas: la dureza de las calles y la nobleza de quien le dio la oportunidad de cambiar. El lema "${lema}" ahora guía cada una de sus decisiones.`,

    // Plantilla 5: Despertar de poder / destino imprevisto
    `${nombre} fue encontrado de ${hijo} cuando era apenas un infante, cerca de una zona donde el Aether se manifestaba con una intensidad anormal. Posteriormente fue adoptado por una familia humilde dentro de ${reino} que trabajaba en oficios cotidianos. Nunca conoció a sus verdaderos progenitores ni recibió respuestas sobre su origen, pero desde muy temprana edad ocurrieron cosas extrañas a su alrededor: objetos que reaccionaban a su presencia, destellos de energía inexplicables y sensaciones que no podía describir con palabras.\n\nA pesar de estas anomalías, vivió una infancia relativamente normal, creyendo que simplemente era diferente. Todo cambió cuando un incidente reveló señales innegables de su naturaleza como ${raza}, forzando a quienes lo rodeaban a enfrentar una verdad que habían preferido ignorar. Algunos miembros de la comunidad reaccionaron con temor, otros con curiosidad académica, pero fue un viejo maestro quien decidió tomarlo bajo su protección y enseñarle a controlar lo que otros apenas podían comprender.\n\nActualmente lleva estudiando y practicando para dominar sus habilidades, mientras trabaja como ${profesion} para sostenerse y contribuir a su comunidad. A pesar de descubrir aspectos extraordinarios sobre sí mismo, sigue comportándose con la sencillez de quien creció entre gente común. El lema de ${reino}, "${lema}", le recuerda que el verdadero valor no reside en el linaje ni en el poder innato, sino en las decisiones que uno toma cada día.`,
  ];

  return rand(plantillas);
}

/* ──────────────────────── Debilidades ──────────────────────── */

const DEBILIDADES_POOL = [
  "**Desconfianza crónica:** Le cuesta enormemente confiar en personas que no conoce, lo que lo aísla socialmente y lo hace perder aliados potenciales en momentos críticos donde la cooperación sería esencial.",
  "**Herida antigua:** Carga con una vieja lesión que nunca sanó del todo, limitando su resistencia en combates prolongados. Cuando el esfuerzo físico se extiende demasiado, el dolor resurge y compromete su rendimiento.",
  "**Impulsividad:** Tiende a actuar antes de pensar las consecuencias, especialmente cuando alguien cercano está en peligro. Esta reactividad lo ha metido en emboscadas y trampas que un momento de reflexión habría evitado.",
  "**Agotamiento mágico:** El uso excesivo de sus poderes lo deja físicamente débil, con mareos y pérdida temporal de la visión periférica. En batalla, esto lo obliga a dosificar su magia con extremo cuidado.",
  "**Orgullo excesivo:** Su negativa a pedir ayuda o admitir debilidad lo ha puesto en situaciones donde enfrentó amenazas que claramente lo superaban, sufriendo derrotas que podrían haberse evitado.",
  "**Control emocional frágil:** Cuando se ve superado por la ira, la tristeza o la frustración, sus habilidades se vuelven erráticas e impredecibles, perdiendo la precisión que normalmente lo caracteriza.",
  "**Vulnerabilidad a magia específica:** Su constitución natural lo hace especialmente susceptible a ciertos tipos de magia, recibiendo daño amplificado donde otros resistirían sin mayores consecuencias.",
  "**Resistencia física limitada:** No está acostumbrado a peleas largas ni a recibir golpes directos. Si no puede resolver el combate rápidamente, su efectividad cae drásticamente con cada minuto que pasa.",
  "**Distracción crónica:** Su mente volátil puede ser explotada por un enemigo astuto que use estímulos inesperados para desviar su atención en momentos críticos del combate.",
  "**Dependencia emocional:** Proteger a sus seres queridos es su mayor fortaleza pero también su talón de Aquiles. Un enemigo inteligente puede usar esa lealtad en su contra, obligándolo a elegir entre su misión y quienes ama.",
];

function generarDebilidades(): string {
  const seleccionadas = shuffle(DEBILIDADES_POOL).slice(0, randInt(2, 3));
  return seleccionadas.map(d => `• ${d}`).join("\n\n");
}

/* ──────────────────────── Inventario ──────────────────────── */

const INVENTARIO_BASE = [
  "Bolsa de monedas", "Raciones de comida para varios días",
  "Cantimplora de cuero", "Capa de viaje con capucha",
];

const INVENTARIO_EXTRAS = [
  "Un amuleto familiar de significado personal", "Vendajes y suministros de primeros auxilios",
  "Un mapa desgastado de la región", "Cuerdas y ganchos de escalada",
  "Un diario personal con anotaciones y bocetos", "Hierbas medicinales secas",
  "Una piedra de afilar para su arma", "Un frasco de tinta y pluma para escribir",
  "Un farol de aceite portátil", "Una cota protectora ligera bajo la ropa",
  "Un juego de ganzúas", "Pociones de recuperación menores",
  "Souvenirs de otros reinos visitados", "Un libro de oraciones o conocimiento",
  "Una flauta o instrumento musical sencillo", "Un sello o insignia de su facción",
];

function generarInventario(arma: string): string {
  const items = [arma, ...INVENTARIO_BASE, ...shuffle(INVENTARIO_EXTRAS).slice(0, randInt(2, 4))];
  return items.map(i => `• ${i}`).join("\n");
}

/* ──────────────────────── Extras ──────────────────────── */

const EXTRAS_POOL = [
  "Tiene la costumbre de tararear inconscientemente cuando está concentrado, lo que delata su posición en situaciones de sigilo.",
  "Posee una colección de objetos pequeños que guarda celosamente: piedras curiosas, monedas extranjeras y botones de diversos orígenes.",
  "Antes de cada misión o enfrentamiento importante, realiza un pequeño ritual personal que considera de buena suerte.",
  "Suele observar a las personas en silencio durante largos períodos, analizando cada uno de sus movimientos y expresiones.",
  "Tiene una debilidad particular por un alimento o bebida específica que consume con una pasión que contrasta con su personalidad habitual.",
  "En sus ratos libres disfruta tallando figuras de madera, una habilidad que aprendió en su infancia y que le ayuda a calmar la mente.",
  "Posee un tic nervioso que se manifiesta cuando está bajo presión extrema: se frota las manos, parpadea rápidamente o mueve el pie.",
  "Tiene una curiosa debilidad por los animales pequeños y suele detenerse para alimentar gatos callejeros o perros abandonados.",
  "Habla solo cuando está planificando algo complicado, debatiendo consigo mismo en voz baja como si conversara con un interlocutor invisible.",
  "Tiene la costumbre de desaparecer sin aviso en situaciones sociales incómodas, dejando a las personas hablando solas.",
];

function generarExtras(): string {
  const seleccionados = shuffle(EXTRAS_POOL).slice(0, randInt(2, 4));
  return seleccionados.map(e => `• ${e}`).join("\n");
}

function normalizarConcordanciaGenero(historia: string, genero: string): string {
  if (genero !== "Femenino") return historia;

  const reemplazos: Array<[RegExp, string]> = [
    [/\blo obligó\b/g, "la obligó"],
    [/\blo respaldara\b/g, "la respaldara"],
    [/\blo tomó bajo su protección\b/g, "la tomó bajo su protección"],
    [/\bjuzgarlo\b/g, "juzgarla"],
    [/\blo rodeaban\b/g, "la rodeaban"],
    [/\blo distinguían\b/g, "la distinguían"],
  ];

  return reemplazos.reduce((texto, [patron, valor]) => texto.replace(patron, valor), historia);
}

function construirParrafosExtra(
  nombre: string,
  raza: string,
  reino: string,
  lema: string,
  profesion: string,
  claseSocial: string,
  arma: string,
  edad: number,
  longevidad: CategoriaLongevidad,
): string[] {
  const comunes = [
    `${nombre} pasó por etapas muy distintas dentro de ${reino}: años de aprendizaje, temporadas de disciplina extrema y periodos donde tuvo que reconstruir su lugar entre gente que no estaba dispuesta a confiar de inmediato. En cada una de esas fases fue acumulando hábitos, cicatrices y una forma más sobria de entender el deber.`,
    `A medida que su oficio como ${profesion} se consolidó, ${nombre} aprendió que la reputación no depende solo del talento, sino de la constancia con que uno sostiene sus decisiones cuando el entorno cambia. Esa certeza fue empujándolo a perfeccionar tanto su dominio de ${arma} como su criterio al elegir aliados, rutas y causas.`,
    `La historia personal de ${nombre} también quedó marcada por pérdidas concretas: personas que no sobrevivieron a guerras menores, amistades quebradas por intereses opuestos y promesas que el tiempo volvió imposibles de cumplir. En lugar de romperse por completo, transformó esas ausencias en memoria activa y en una prudencia difícil de engañar.`,
    `Hubo momentos en que ${nombre} tuvo que alejarse de espacios donde antes era bien recibido. Algunas rupturas nacieron del orgullo ajeno, otras de su negativa a aceptar órdenes vacías, pero todas dejaron una lección útil: el prestigio solo vale algo si no exige traicionarse para sostenerlo.`,
    `El lema "${lema}" no funciona para ${nombre} como una frase ornamental. Es una regla interior que reaparece cuando debe elegir entre comodidad y responsabilidad, entre lealtad y conveniencia, o entre una victoria inmediata y una consecuencia más duradera para quienes lo rodean.`,
    `${nombre} nunca vivió su pertenencia a la raza ${raza} como un simple rasgo de origen. Esa herencia moldeó expectativas, prejuicios, ventajas y cargas particulares, y obligó a que cada paso importante fuese leído por los demás a través de un filtro cultural que a veces ayudó y otras veces pesó demasiado.`,
    `Con el tiempo, ${nombre} desarrolló una relación más compleja con la autoridad. Respeta la estructura cuando protege a la gente correcta, pero desconfía de las jerarquías que se sostienen solo por tradición o miedo. Esa tensión atraviesa tanto su manera de hablar como su forma de actuar cuando una crisis exige decisión rápida.`,
    `El recorrido de ${nombre} también dejó huellas visibles en su comportamiento cotidiano. Observa antes de hablar, escucha incluso cuando desconfía y rara vez entrega su palabra sin medir las consecuencias. No es frialdad vacía, sino una disciplina nacida de haber visto cómo decisiones pequeñas pueden deformar destinos enteros.`,
  ];

  const prolongadas = [
    `Cuando la edad de ${nombre} empezó a superar la de la mayoría de sus contemporáneos, la percepción del tiempo cambió con violencia. Las estaciones dejaron de sentirse como una simple sucesión de inviernos y veranos, y comenzaron a convertirse en capítulos enteros de aprendizaje. Cada década añadió nuevos maestros, nuevas culpas y nuevas preguntas sobre qué partes de su identidad merecían sobrevivir.`,
    `${nombre} vio cambiar oficios, barrios, pactos y generaciones enteras dentro de un mismo territorio. Esa continuidad le dio una mirada más histórica que la de sus contemporáneos, porque entiende que muchos conflictos presentes son apenas ecos de errores viejos que nadie quiso recordar a tiempo.`,
    `La longevidad de ${nombre} no llegó sola: también trajo cansancio, distancia y una conciencia más dura sobre lo efímero de casi todos los vínculos. Aprendió a querer sin ingenuidad, a despedirse sin teatralidad y a aceptar que la memoria a veces pesa tanto como una armadura completa.`,
    `Hubo décadas en que ${nombre} prefirió el retiro antes que el protagonismo. En esos intervalos estudió, trabajó en silencio, corrigió errores propios y dejó que otros ocuparan el centro. Lejos de debilitarlo, ese repliegue refinó su criterio y lo convirtió en alguien mucho más difícil de manipular.`,
    `La experiencia prolongada también transformó la forma en que ${nombre} entiende el fracaso. Lo que antes podía vivirse como derrota absoluta hoy es leído como un episodio más dentro de un trayecto mucho mayor, algo que le permite sostener la calma incluso cuando el presente parece inclinarse hacia la ruina.`,
  ];

  const legendarias = [
    `${nombre} pertenece a un tipo de existencia que obliga a pensar en siglos y no solo en años. A lo largo de esa vida extensa ha visto desaparecer nombres que parecían eternos, alianzas que prometían estabilidad y centros de poder que terminaron cayendo por orgullo, codicia o simple desgaste.`,
    `En una vida tan prolongada, incluso la identidad deja de ser una pieza inmóvil. ${nombre} tuvo que reinventar prioridades, revisar convicciones y aceptar que no todas las versiones de sí merecían llegar intactas al presente. Esa capacidad de transformación es parte central de su fortaleza y también de su carga más íntima.`,
    `${nombre} recuerda épocas completas con una claridad que incomodaría a cualquiera dispuesto a romantizar el pasado. Sabe cuánto puede costar una guerra sostenida, cuántas verdades se tuercen con el tiempo y cuán fácil es que una causa justa termine secuestrada por manos indignas.`,
    `Las relaciones de ${nombre} con el mundo actual están atravesadas por esa memoria larga. Cuando escucha promesas grandilocuentes o amenazas repetidas, no reacciona como alguien impresionable, sino como quien ya ha visto demasiadas veces el mismo ciclo vestido con símbolos nuevos.`,
    `Pese a todo, ${nombre} no vive atrapado en la nostalgia. Sigue buscando motivos presentes para actuar, proteger, enseñar o intervenir, porque entiende que sobrevivir tanto solo tiene sentido si aún queda algo digno de ser legado a quienes vienen después.`,
  ];

  const seleccion = [...shuffle(comunes)];
  if (longevidad !== "normal" || edad >= 100) seleccion.push(...shuffle(prolongadas));
  if (longevidad === "legendaria" || edad >= 300) seleccion.push(...shuffle(legendarias));

  if (claseSocial === "Noble") {
    seleccion.push(
      `${nombre} sigue siendo observado por la nobleza con una mezcla de respeto, cálculo y recelo. Su linaje abre puertas, pero también activa expectativas sofocantes, y eso lo obliga a justificar cada desviación del camino tradicional con resultados concretos en vez de meras palabras.`,
    );
  }

  if (edad >= 700) {
    seleccion.push(
      `Haber vivido tanto volvió a ${nombre} más selectivo con la esperanza, pero no incapaz de sentirla. Cada proyecto que decide proteger en el presente debe merecer el peso de siglos de memoria, porque ya no concede su energía a causas pequeñas ni a juramentos que no soporten el paso del tiempo.`,
    );
  }

  return seleccion;
}

function expandirHistoriaPorEdad(
  historiaBase: string,
  edadTexto: string,
  raza: string,
  reino: string,
  lema: string,
  profesion: string,
  claseSocial: string,
  arma: string,
  genero: string,
  nombre: string,
): string {
  const historiaNormalizada = normalizarConcordanciaGenero(historiaBase, genero);
  const edad = edadNumerica(edadTexto) ?? 30;
  const longevidad = obtenerCategoriaLongevidadPorRaza(raza);
  const requisito = obtenerRequisitoHistoriaPorEdad(edad);
  const parrafosBase = historiaNormalizada
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  const extras = construirParrafosExtra(
    nombre,
    raza,
    reino,
    lema,
    profesion,
    claseSocial,
    arma,
    edad,
    longevidad,
  );

  while (parrafosBase.length < requisito.minParrafos && extras.length > 0) {
    const siguiente = extras.shift();
    if (siguiente) parrafosBase.push(siguiente);
  }

  const refuerzos = [
    "Ese recuerdo sigue influyendo en el modo exacto en que decide a quién proteger, cuándo ceder y qué clase de precio está dispuesto a pagar por mantenerse fiel a sí mismo.",
    "No se trata solo de pasado acumulado, sino de una experiencia que todavía se refleja en sus gestos, en sus silencios y en la clase de promesas que acepta pronunciar.",
    "Cada una de esas vivencias dejó marcas visibles en su criterio, en su paciencia y en la dureza con la que juzga tanto sus propios errores como los ajenos.",
    "Por eso su historia no puede resumirse en un solo conflicto: es la suma de varias etapas que fueron alterando su manera de pensar, de combatir y de relacionarse con el poder.",
  ];

  let historia = parrafosBase.join("\n\n");
  let indice = 0;
  while (contarPalabras(historia) < requisito.minPalabras) {
    const posicion = indice % parrafosBase.length;
    parrafosBase[posicion] = `${parrafosBase[posicion]} ${refuerzos[indice % refuerzos.length]}`;
    historia = parrafosBase.join("\n\n");
    indice += 1;
  }

  return historia;
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN PRINCIPAL
   ══════════════════════════════════════════════════════════════ */

export function generarFichaAleatoria(): Ficha {
  // 1. Género (solo Masculino/Femenino)
  const genero = rand(["Masculino", "Femenino"]);

  // 2. Reino
  const reinoObj = rand(REINOS);
  const reino = reinoObj.nombre;

  // 3. Raza (preferir afines al reino)
  const raza = reinoObj.razasAfines.length > 0 ? rand(reinoObj.razasAfines) : rand(RAZAS);

  // 4. Nombre coherente con género
  const primerNombre = genero === "Masculino" ? rand(NOMBRES_MASCULINOS) : rand(NOMBRES_FEMENINOS);
  const apellido = rand(APELLIDOS);
  const tieneApodo = Math.random() < 0.35;
  const nombre = tieneApodo
    ? `${primerNombre} ${apellido} / "${rand(APODOS)}"`
    : `${primerNombre} ${apellido}`;

  // 5. Edad coherente con la raza
  const edad = generarEdad(raza);

  // 6. Estatura
  const estatura = `${(1.50 + Math.random() * 0.55).toFixed(2)} m`;

  // 7. Clase social, título y profesión coherentes
  const { claseSocial, tituloNobleza, profesion } = generarClaseTituloProfesion(genero);

  // 8. Arma y estilo de combate coherentes
  const { arma, estilo } = generarArmaYEstilo();

  // 9. Poderes del grimorio real
  const poderesOficiales = generarPoderes();

  // 10. Estadísticas
  const estadisticas = repartirEstadisticas();

  // 11. Habilidades no mágicas extensas
  const habilidadesNoMagicas = generarHabilidades();

  // 12. Personalidad profunda
  const personalidad = rand(PERSONALIDADES);

  // 13. Historia elaborada
  const historiaBase = generarHistoria(
    primerNombre, raza, reino, reinoObj.lema, profesion, claseSocial, arma, genero,
  );
  const historia = expandirHistoriaPorEdad(
    historiaBase,
    edad,
    raza,
    reino,
    reinoObj.lema,
    profesion,
    claseSocial,
    arma,
    genero,
    primerNombre,
  );

  // 14. Debilidades variadas
  const debilidades = generarDebilidades();

  // 15. Inventario coherente
  const inventario = generarInventario(arma);

  // 16. Extras
  const extras = generarExtras();

  return {
    nombre,
    edad,
    genero,
    estatura,
    raza,
    poderesOficiales,
    estadisticas,
    armaPrincipal: arma,
    estiloCombate: estilo,
    reino,
    claseSocial,
    tituloNobleza,
    profesion,
    habilidadesNoMagicas,
    personalidad,
    historia,
    extras,
    debilidades,
    inventario,
    imagenDescripcion: "",
  };
}
