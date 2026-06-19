// Catálogo del Grimorio: copia empaquetada (offline) + sync desde Supabase.
import bundled from "../data/grimorio.json";
import { normalizar } from "../data/razas";

export interface EstiloMagia {
  id: string;
  title: string;
  categoria: string;
  niveles: number[];
}

const CACHE_KEY = "grimorio.cache.v2";
const SYNC_AT_KEY = "grimorio.synced.at";
// Solo se vuelve a sincronizar como mucho una vez al día (reduce egress de Supabase).
const SYNC_TTL_MS = 24 * 60 * 60 * 1000;
// Niveles por defecto de un estilo (todos los del catálogo usan 1..5). Evita
// descargar la columna `levels` (jsonb pesado con todo el texto de los hechizos).
const NIVELES_DEFECTO = [1, 2, 3, 4, 5];

// Datos de Supabase (anon/publishable key, pensada para uso público).
const SUPABASE_URL = "https://sibisgiwmgdrpfkzmkkw.supabase.co";
const SUPABASE_ANON = "sb_publishable_Y8Dk0GxPacMnHDDWmT3DcQ_fptqtC3h";

let catalogo: EstiloMagia[] = bundled as EstiloMagia[];

// Fusiona una lista sobre el bundle base (los nuevos pisan por título normalizado).
function fusionarConBundle(extra: EstiloMagia[]): EstiloMagia[] {
  const porTitulo = new Map<string, EstiloMagia>();
  for (const e of bundled as EstiloMagia[]) porTitulo.set(normalizar(e.title), e);
  for (const e of extra) porTitulo.set(normalizar(e.title), e);
  return [...porTitulo.values()];
}

// Al cargar, fusiona la copia cacheada (si existe) sobre el bundle.
try {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as EstiloMagia[];
    if (Array.isArray(parsed) && parsed.length > 0) catalogo = fusionarConBundle(parsed);
  }
} catch {
  /* sin localStorage o JSON inválido: nos quedamos con el bundle */
}

export function getCatalogoGrimorio(): EstiloMagia[] {
  return catalogo;
}

// Busca un estilo por nombre (tolerante: normaliza y permite coincidencia parcial).
export function buscarEstilo(nombre: string): EstiloMagia | null {
  const n = normalizar(nombre);
  if (!n) return null;
  // Coincidencia exacta normalizada primero.
  const exacto = catalogo.find((e) => normalizar(e.title) === n);
  if (exacto) return exacto;
  // Coincidencia parcial (uno contiene al otro).
  return (
    catalogo.find((e) => {
      const t = normalizar(e.title);
      return t.includes(n) || n.includes(t);
    }) ?? null
  );
}

function syncReciente(): boolean {
  try {
    const at = Number(localStorage.getItem(SYNC_AT_KEY) || 0);
    return at > 0 && Date.now() - at < SYNC_TTL_MS;
  } catch {
    return false;
  }
}

// Refresca el catálogo desde Supabase y lo guarda en cache. Devuelve nº de estilos.
// Por defecto respeta un TTL (1 vez/día) para no consumir egress en cada apertura.
// `forzar: true` (botón manual de sync) ignora el TTL.
export async function sincronizarGrimorio(
  opciones: { forzar?: boolean } = {},
): Promise<number> {
  if (!opciones.forzar && syncReciente()) {
    return catalogo.length;
  }

  // Pedimos solo lo necesario (sin la columna `levels`, que es pesada).
  const url =
    `${SUPABASE_URL}/rest/v1/grimoire_magic_styles` +
    `?select=id,title,category_title&order=sort_order`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  const filas = (await res.json()) as Array<{
    id: string;
    title: string;
    category_title: string;
  }>;
  const remotos: EstiloMagia[] = filas.map((f) => ({
    id: f.id,
    title: f.title,
    categoria: f.category_title,
    niveles: NIVELES_DEFECTO,
  }));
  // Fusiona sobre el bundle (Supabase tiene prioridad). El sync nunca encoge el catálogo.
  const fusionado = fusionarConBundle(remotos);
  if (fusionado.length > 0) {
    catalogo = fusionado;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(fusionado));
      localStorage.setItem(SYNC_AT_KEY, String(Date.now()));
    } catch {
      /* ignorar fallos de almacenamiento */
    }
  }
  return catalogo.length;
}
