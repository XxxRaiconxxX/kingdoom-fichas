import {
  type Ficha,
  PUNTOS_ESTADISTICAS,
  PUNTOS_PODERES,
  MINIMOS_PALABRAS,
  sumaEstadisticas,
  parsearPoderes,
  contarPalabras,
  edadNumerica,
} from "../schema/fichaSchema";
import { esRazaValida } from "../data/razas";
import { esReinoValido, reinoAfinARaza } from "../data/reinos";
import { exigeTitulo } from "../data/clasesSociales";
import { buscarEstilo } from "../data/grimorio";

export type Estado = "ok" | "warn" | "error";

export interface ResultadoApartado {
  apartado: string;
  estado: Estado;
  mensaje: string;
}

export interface ResultadoValidacion {
  resultados: ResultadoApartado[];
  errores: number;
  avisos: number;
  // true si no hay ningún error -> se puede copiar/enviar a WhatsApp.
  aprobada: boolean;
}

// Palabras que sugieren un efecto mágico/sobrenatural en un arma o habilidad "no mágica".
const PALABRAS_MAGICAS = [
  "magia",
  "mágic",
  "magic",
  "hechizo",
  "encantad",
  "encantamiento",
  "maldición",
  "maldito",
  "elemental",
  "fuego",
  "hielo",
  "rayo",
  "trueno",
  "veneno mágico",
  "aether",
  "maná",
  "mana",
  "espiritual",
  "sagrad",
  "demoníac",
  "divin",
  "runa",
  "rúnic",
  "alma",
  "invoca",
  "teletransport",
  "psíquic",
  "telequin",
];

function contieneMagia(texto: string): boolean {
  const t = texto.toLowerCase();
  return PALABRAS_MAGICAS.some((p) => t.includes(p));
}

function ok(apartado: string, mensaje = "Correcto"): ResultadoApartado {
  return { apartado, estado: "ok", mensaje };
}
function warn(apartado: string, mensaje: string): ResultadoApartado {
  return { apartado, estado: "warn", mensaje };
}
function error(apartado: string, mensaje: string): ResultadoApartado {
  return { apartado, estado: "error", mensaje };
}

function vacio(s: string): boolean {
  return s.trim().length === 0;
}

export function validarFicha(ficha: Ficha): ResultadoValidacion {
  const r: ResultadoApartado[] = [];

  // Nombre
  r.push(vacio(ficha.nombre) ? error("Nombre/Apodo", "Falta el nombre o apodo.") : ok("Nombre/Apodo"));

  // Edad
  const edadNum = edadNumerica(ficha.edad);
  if (vacio(ficha.edad)) {
    r.push(error("Edad", "Falta la edad."));
  } else if (edadNum === null) {
    r.push(warn("Edad", "No se detecta un número de edad claro."));
  } else {
    r.push(ok("Edad"));
  }

  // Género
  r.push(vacio(ficha.genero) ? error("Género", "Falta el género.") : ok("Género"));

  // Estatura
  r.push(vacio(ficha.estatura) ? error("Estatura", "Falta la estatura.") : ok("Estatura"));

  // Raza
  if (vacio(ficha.raza)) {
    r.push(error("Raza", "Falta la raza."));
  } else if (!esRazaValida(ficha.raza)) {
    r.push(error("Raza", `"${ficha.raza}" no está en el catálogo oficial de razas.`));
  } else {
    r.push(ok("Raza"));
  }

  // Poderes oficiales: formato "Nombre Lvl X" y los niveles deben sumar exactamente 5.
  if (vacio(ficha.poderesOficiales)) {
    r.push(error("Poderes Oficiales", `Sin poderes. Reparte ${PUNTOS_PODERES} niveles (Lvl) entre tus magias.`));
  } else {
    const poderes = parsearPoderes(ficha.poderesOficiales);
    const malFormato = poderes.filter((p) => p.nivel === null).map((p) => p.linea);
    if (malFormato.length > 0) {
      r.push(
        error(
          "Poderes Oficiales",
          `Formato esperado "Nombre de magia Lvl X". Revisa: ${malFormato.join(" | ")}`,
        ),
      );
    } else {
      const suma = poderes.reduce((acc, p) => acc + (p.nivel ?? 0), 0);
      if (suma !== PUNTOS_PODERES) {
        const dif = suma - PUNTOS_PODERES;
        r.push(
          error(
            "Poderes Oficiales",
            `Los niveles suman ${suma}, deben sumar ${PUNTOS_PODERES} (${dif > 0 ? `sobran ${dif}` : `faltan ${-dif}`}).`,
          ),
        );
      } else {
        r.push(ok("Poderes Oficiales", `${poderes.length} poder(es), niveles suman ${PUNTOS_PODERES}.`));
      }

      // Chequeo contra el Grimorio (aviso, no bloquea: el catálogo está incompleto).
      const noEncontradas: string[] = [];
      const nivelInvalido: string[] = [];
      for (const p of poderes) {
        if (p.nivel === null) continue;
        const estilo = buscarEstilo(p.nombre);
        if (!estilo) {
          noEncontradas.push(p.nombre);
        } else if (!estilo.niveles.includes(p.nivel)) {
          nivelInvalido.push(`${estilo.title} (tiene Lvl ${estilo.niveles.join("/")})`);
        }
      }
      if (nivelInvalido.length > 0) {
        r.push(warn("Grimorio", `Nivel no disponible para: ${nivelInvalido.join(" | ")}`));
      }
      if (noEncontradas.length > 0) {
        r.push(warn("Grimorio", `No están en el Grimorio (catálogo incompleto, revisa el nombre): ${noEncontradas.join(" | ")}`));
      }
    }
  }

  // Estadísticas: suma exacta = 12, enteros >= 0
  const e = ficha.estadisticas;
  const valores = Object.values(e);
  const suma = sumaEstadisticas(e);
  if (valores.some((v) => !Number.isInteger(v) || v < 0)) {
    r.push(error("Estadísticas", "Las estadísticas deben ser números enteros ≥ 0."));
  } else if (suma !== PUNTOS_ESTADISTICAS) {
    const dif = suma - PUNTOS_ESTADISTICAS;
    r.push(
      error(
        "Estadísticas",
        `Suman ${suma}, deben sumar ${PUNTOS_ESTADISTICAS} (${dif > 0 ? `sobran ${dif}` : `faltan ${-dif}`}).`,
      ),
    );
  } else {
    r.push(ok("Estadísticas", `Suman ${PUNTOS_ESTADISTICAS} puntos.`));
  }

  // Arma principal: obligatoria y sin efectos mágicos
  if (vacio(ficha.armaPrincipal)) {
    r.push(error("Arma principal", "Falta el arma principal."));
  } else if (contieneMagia(ficha.armaPrincipal)) {
    r.push(error("Arma principal", "El arma principal debe ser normal, sin efectos mágicos ni de habilidad."));
  } else {
    r.push(ok("Arma principal"));
  }

  // Estilo de combate
  r.push(vacio(ficha.estiloCombate) ? warn("Estilo de combate", "Conviene describir el estilo de combate.") : ok("Estilo de combate"));

  // Reino
  if (vacio(ficha.reino)) {
    r.push(error("Reino", "Falta el reino de nacimiento."));
  } else if (!esReinoValido(ficha.reino)) {
    r.push(error("Reino", `"${ficha.reino}" no es una de las 5 naciones válidas.`));
  } else if (!vacio(ficha.raza) && esRazaValida(ficha.raza) && !reinoAfinARaza(ficha.reino, ficha.raza)) {
    r.push(warn("Reino", `Tu raza no es típica de ${ficha.reino}. Es posible, pero justifícalo en la historia.`));
  } else {
    r.push(ok("Reino"));
  }

  // Clase social + título de nobleza condicional
  if (vacio(ficha.claseSocial)) {
    r.push(error("Clase social", "Falta la clase social."));
  } else {
    r.push(ok("Clase social"));
  }
  if (exigeTitulo(ficha.claseSocial)) {
    r.push(vacio(ficha.tituloNobleza) ? error("Título de Nobleza", "Al ser Noble, debes indicar el título de nobleza.") : ok("Título de Nobleza"));
  }

  // Profesión
  r.push(vacio(ficha.profesion) ? error("Profesión", "Falta la profesión.") : ok("Profesión"));

  // Habilidades no mágicas: sin magia
  if (vacio(ficha.habilidadesNoMagicas)) {
    r.push(warn("Habilidades no mágicas", "Conviene listar capacidades o conocimientos."));
  } else if (contieneMagia(ficha.habilidadesNoMagicas)) {
    r.push(error("Habilidades no mágicas", "Aquí solo van capacidades/conocimientos, nada mágico."));
  } else {
    r.push(ok("Habilidades no mágicas"));
  }

  // Personalidad (mínimo medio)
  const palPers = contarPalabras(ficha.personalidad);
  if (vacio(ficha.personalidad)) {
    r.push(error("Personalidad", "Falta la personalidad."));
  } else if (palPers < MINIMOS_PALABRAS.personalidad) {
    r.push(warn("Personalidad", `Algo corta (${palPers} palabras; recomendado ≥ ${MINIMOS_PALABRAS.personalidad}).`));
  } else {
    r.push(ok("Personalidad"));
  }

  // Historia (mínimo exigente, escala con edad)
  const palHist = contarPalabras(ficha.historia);
  let minHist: number = MINIMOS_PALABRAS.historia;
  if (edadNum !== null && edadNum > 100) {
    // +20 palabras por cada siglo de vida, tope razonable.
    const siglos = Math.floor(edadNum / 100);
    minHist = Math.min(MINIMOS_PALABRAS.historia + siglos * 20, 600);
  }
  if (vacio(ficha.historia)) {
    r.push(error("Historia", "Falta la historia."));
  } else if (palHist < minHist) {
    const extra = edadNum !== null && edadNum > 100 ? ` Para una edad de ${edadNum}, se espera más trasfondo.` : "";
    r.push(error("Historia", `Demasiado corta (${palHist} palabras; se esperan ≥ ${minHist}).${extra}`));
  } else {
    r.push(ok("Historia"));
  }

  // Extras (opcional)
  if (!vacio(ficha.extras)) r.push(ok("Extras"));

  // Debilidades (mínimo suave, obligatorias)
  const palDeb = contarPalabras(ficha.debilidades);
  if (vacio(ficha.debilidades)) {
    r.push(error("Debilidades", "Las debilidades son obligatorias para el equilibrio del rol."));
  } else if (palDeb < MINIMOS_PALABRAS.debilidades) {
    r.push(warn("Debilidades", `Algo escuetas (${palDeb} palabras; recomendado ≥ ${MINIMOS_PALABRAS.debilidades}).`));
  } else {
    r.push(ok("Debilidades"));
  }

  // Inventario
  r.push(vacio(ficha.inventario) ? warn("Inventario", "Conviene indicar el inventario.") : ok("Inventario"));

  // Imagen/Descripción (opcional)
  if (!vacio(ficha.imagenDescripcion)) r.push(ok("Imagen/Descripción"));

  const errores = r.filter((x) => x.estado === "error").length;
  const avisos = r.filter((x) => x.estado === "warn").length;

  return { resultados: r, errores, avisos, aprobada: errores === 0 };
}
