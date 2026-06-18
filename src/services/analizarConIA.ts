import {
  type Ficha,
  edadNumerica,
  obtenerCategoriaLongevidadPorRaza,
  obtenerRequisitoHistoriaPorEdad,
} from "../schema/fichaSchema";

export interface SugerenciaIA {
  apartado: string;
  severidad: "alta" | "media" | "baja";
  problema: string;
  sugerencia: string;
}

export interface AnalisisIA {
  veredicto: "aprobada" | "mejorable";
  resumen: string;
  sugerencias: SugerenciaIA[];
}

// URL del proxy (Vercel). Configurable por env; no expone la API key de Gemini.
const API_URL =
  import.meta.env.VITE_FICHA_AI_API_URL ||
  "https://kingdoom.vercel.app/api/admin/analyze-ficha";

export async function analizarFichaConIA(
  ficha: Ficha,
  avisosLocales: string[],
): Promise<AnalisisIA> {
  const edad = edadNumerica(ficha.edad);
  const requisitoHistoria = obtenerRequisitoHistoriaPorEdad(edad);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ficha,
      avisosLocales,
      contextoNarrativo: {
        edadNumerica: edad,
        longevidadRaza: obtenerCategoriaLongevidadPorRaza(ficha.raza),
        requisitoHistoria,
        revisarPronombresSegunGenero: true,
      },
    }),
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      /* respuesta no-JSON */
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as Partial<AnalisisIA>;
  return {
    veredicto: data.veredicto === "aprobada" ? "aprobada" : "mejorable",
    resumen: data.resumen ?? "",
    sugerencias: Array.isArray(data.sugerencias) ? data.sugerencias : [],
  };
}
