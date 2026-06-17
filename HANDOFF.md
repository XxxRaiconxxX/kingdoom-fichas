# Kingdoom Fichas — Handoff para agentes

App/APK **asistente para crear y validar fichas de rol** del grupo de WhatsApp de Kingdoom. El usuario rellena (o genera) una ficha, la app la valida y le sugiere mejoras, y cuando pasa el check le deja **copiar/compartir** el texto con el formato exacto de la plantilla para pegarlo en el grupo.

- **Ubicación:** `C:\Users\e_grado\Documents\New project 2\kingdoom-fichas`
- **Proyectos hermanos:** `Kingdoom-sync` (web SPA + API Vercel), `kingdoom-bot` (bot WhatsApp). Misma cuenta Supabase.
- **Fecha de este handoff:** 2026-06-17

---

## Stack

- **Vite + React 19 + TypeScript** (template `react-ts`).
- **Capacitor** (`@capacitor/core`, `/android`, `/clipboard`, `/share`) → empaqueta a `.apk`. App id `com.kingdoom.fichas`, nombre "Kingdoom Fichas", `webDir: dist`.
- **Sin Tailwind**: CSS plano en `src/App.css` (variables CSS, tema oscuro).
- **TS estricto** con `noUnusedLocals`/`noUnusedParameters` y `resolveJsonModule: true`.

## Cómo correr / construir

```bash
cd kingdoom-fichas
npm install
npm run dev      # dev server (config preview: launch.json -> "kingdoom-fichas" puerto 4320)
npm run build    # tsc -b && vite build (úsalo SIEMPRE para type-check antes de cerrar)
# APK (requiere Android Studio / Android SDK):
npm run build && npx cap sync android && npx cap open android
```

> El preview MCP usa `.claude/launch.json` (en la RAÍZ `New project 2`). Config `kingdoom-fichas` → puerto **4320**. La config `kingdoom-preview` (4310) es de `Kingdoom-sync`, NO tocar.

---

## Mapa de archivos (todo en `src/`)

| Archivo | Qué hace |
|---|---|
| `schema/fichaSchema.ts` | Modelo `Ficha`, constantes (`PUNTOS_ESTADISTICAS=12`, `PUNTOS_PODERES=5`, `PV_BASE=100`, `MINIMOS_PALABRAS`), helpers (`sumaEstadisticas`, `parsearPoderes`, `sumaNivelesPoderes`, `contarPalabras`, `edadNumerica`). |
| `data/razas.ts` | Catálogo de razas por categoría + `RAZAS` (plano), `esRazaValida`, `normalizar` (minúsculas/sin acentos). |
| `data/reinos.ts` | Las **5 naciones** + razas afines a cada una, `esReinoValido`, `reinoAfinARaza`. |
| `data/clasesSociales.ts` | `CLASES_SOCIALES` + `exigeTitulo` (Noble ⇒ título obligatorio). |
| `data/grimorio.json` | **Bundle empaquetado** de 31 estilos de magia (offline). |
| `data/grimorio.ts` | Carga bundle + cache localStorage (`grimorio.cache.v2`) + `sincronizarGrimorio()` (fetch Supabase, **fusiona** sobre bundle) + `buscarEstilo()`. |
| `validation/validarFicha.ts` | **Motor de reglas locales.** Devuelve `{resultados[], errores, avisos, aprobada}`. |
| `utils/generarTextoWhatsApp.ts` | Reconstruye la ficha con el **formato exacto** de la plantilla (los `⊰❂⊱`, `*negritas*`, etc.). |
| `utils/generarFichaAleatoria.ts` | Genera una ficha que YA pasa las reglas (stats=12, poderes=5, raza afín al reino, historia ≥180 palabras). |
| `utils/analizarConIA.ts` | Cliente del proxy de IA. `VITE_FICHA_AI_API_URL` (ver `.env.example`). |
| `App.tsx` / `App.css` | UI: formulario guiado + panel de check (✅/⚠️/❌) + análisis IA + botones copiar/compartir. |

---

## Reglas de validación (las dictó el usuario)

**Reglas DURAS (bloquean el envío, estado `error`):**
- Campos obligatorios: nombre, edad, género, estatura, raza, arma, reino, clase social, profesión, personalidad, historia, debilidades.
- **Estadísticas (5: fuerza/agilidad/inteligencia/defensa/defensa mágica): suman exactamente 12**, enteros ≥0. PV base 100.
- **Poderes Oficiales: los niveles (`Lvl`) suman exactamente 5.** Formato por línea: `Nombre de magia Lvl X`. Cualquier combinación vale (5×Lvl1, 1×Lvl5, Lvl3+Lvl2…).
- **Raza** debe estar en el catálogo. **Reino** debe ser una de las 5 naciones.
- **Arma principal:** normal, SIN efectos mágicos/habilidad (detección por palabras clave en `PALABRAS_MAGICAS`).
- **Habilidades no mágicas:** solo capacidades/conocimientos, nada mágico.
- **Clase social = Noble** ⇒ Título de Nobleza obligatorio.
- **Mínimos de palabras:** Historia ≥180 (escala con la edad: +20 por siglo si edad>100, tope 600), pero Historia vacía/corta es error; Personalidad ≥40 y Debilidades ≥15 son `warn`.

**Reglas BLANDAS (avisan, estado `warn`, NO bloquean):**
- Raza no afín al reino → "justifícalo en la historia".
- **Grimorio:** si un estilo de magia no está en el catálogo (que está incompleto) o el nivel no existe para ese estilo. NO bloquea a propósito.
- Personalidad/Debilidades cortas, estilo de combate / inventario vacíos.

> **Mundo (lore):** Aethelgardia; magia = **Aether**; alineamiento **Auxilium** (orden) vs **Malum** (ambición). 5 Custodes. Ver memoria del proyecto para el detalle.

---

## Grimorio (catálogo de magias)

- Estrategia: **copia empaquetada + sync**. `grimorio.json` (31 estilos) viene del **parseo de `Kingdoom-sync/extracted_powers/Poderes/`** (41 `.txt` + 1 `.docx`; título en heading `## --Nombre--` o `### --Nombre--`, niveles en `#### Habilidades de LvN`) + 3 extra de Supabase.
- Tabla Supabase: **`grimoire_magic_styles`** (cols: `id`, `title`, `category_title`, `levels` jsonb cuyas claves `"1".."5"` son los niveles disponibles).
- `sincronizarGrimorio()` hace fetch REST y **fusiona** con el bundle (Supabase pisa por título normalizado) → el sync **nunca encoge** el catálogo. Cachea en localStorage `grimorio.cache.v2`.
- Credenciales (anon/publishable, públicas) en `data/grimorio.ts`, reutilizadas de `Kingdoom-sync/.env`: URL `https://sibisgiwmgdrpfkzmkkw.supabase.co`.
- **Para regenerar el bundle** desde los `.txt`: script node que extrae `--Título--` + `Habilidades de LvN` (hay uno en el historial; vive en la carpeta `Poderes`).

---

## Análisis IA (proxy Gemini)

- **Endpoint:** `Kingdoom-sync/api/admin/analyze-ficha.ts` (mismo patrón que `generate-magic.ts`). POST `{ficha, avisosLocales}` → JSON `{veredicto: "aprobada"|"mejorable", resumen, sugerencias: [{apartado, severidad, problema, sugerencia}]}`. Juzga coherencia y calidad narrativa, NO repite las reglas mecánicas.
- **La API key de Gemini NUNCA va en el APK** — vive en Vercel (`GEMINI_API_KEY`). El cliente solo llama al proxy.
- **Cliente:** `utils/analizarConIA.ts` (URL en `VITE_FICHA_AI_API_URL`, default `https://kingdoom.vercel.app/api/admin/analyze-ficha`).

### ✅ IA desplegada y verificada (2026-06-17)
- Endpoint en producción: `https://kingdoom.vercel.app/api/admin/analyze-ficha` (POST → 200 JSON; flujo end-to-end probado desde la app).
- `MISSION_AI_ALLOWED_ORIGINS` ya incluye `http://localhost:4320`, `https://localhost`, `capacitor://localhost`.
- Si en el futuro falla con CORS desde el APK, revisar que esos orígenes sigan en la env de Vercel.

---

## Estado actual

✅ **Fase 1 (base local)** — completa y verificada en navegador: formulario, validador de reglas duras, generador aleatorio, copiar/compartir con formato exacto.
✅ **Grimorio** — bundle + sync fusionado, verificado (reconoce magias iniciales, avisa de las desconocidas).
✅ **IA cliente + endpoint** — desplegado y verificado end-to-end (ver sección IA).
✅ **APK v2.0 generado** — `dist-apk/Kingdoom-Fichas-v2.0.apk` (debug, ~4.5 MB, versionCode 2). Build CLI con `npm run apk:debug` usando el JDK de Android Studio (JBR) + SDK en `local.properties`. Instrucciones de instalación en `dist-apk/LEEME-v2.md`.

### Reconstruir / distribuir
- `npm run sync` → build web + `cap sync android`.
- `npm run apk:debug` / `npm run apk:release` → genera el APK (necesita `JAVA_HOME` = JDK 17/21; el JBR de Android Studio sirve).
- Release firmada para tienda: configurar keystore en `android/app/build.gradle`.

### Próximos pasos sugeridos
- (Opcional) Build `release` firmada si se quiere publicar en Play Store.
- Conforme se suban magias a Supabase, el catálogo se completa solo vía sync.
- Posible: persistir borradores de ficha (localStorage), modo "guía paso a paso" para nuevos.

## Convenciones / cosas que NO romper

- `npm run build` debe quedar en **0 errores** (TS estricto) antes de cerrar tarea.
- No exponer secretos en el cliente (la anon key de Supabase SÍ es pública; la de Gemini NO).
- Mantener el **formato exacto** de `generarTextoWhatsApp.ts` (el grupo espera esa plantilla literal).
- Registrar cambios relevantes que toquen `Kingdoom-sync` en su `AI_CHANGELOG.md`.
