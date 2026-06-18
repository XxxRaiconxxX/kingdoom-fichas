# Kingdoom Fichas - Handoff para agentes

App/APK **asistente para crear y validar fichas de rol** del grupo de WhatsApp de Kingdoom. El usuario rellena o genera una ficha, la app la valida, sugiere mejoras y, cuando pasa el check, permite **copiar o compartir** el texto con el formato exacto esperado por el ecosistema del reino.

- **Ubicación:** `C:\Users\e_grado\Documents\New project 2\kingdoom-fichas`
- **Proyectos hermanos:** `Kingdoom-sync` (web SPA + API Vercel), `kingdoom-bot` (bot WhatsApp). Misma cuenta Supabase.
- **Fecha de este handoff:** 2026-06-18

---

## Stack

- **Vite + React 19 + TypeScript**
- **Capacitor** (`@capacitor/core`, `/android`, `/clipboard`, `/share`) para empaquetar Android
- **CSS custom** sin Tailwind
- **TypeScript estricto** con `resolveJsonModule: true`

---

## Estructura actual

```text
docs/
  AI_CHANGELOG.md
  HANDOFF.md

src/
  assets/
    hero.png
  components/
    Campo.tsx
    MetricCard.tsx
    SectionCard.tsx
  data/
    clasesSociales.ts
    grimorio.json
    razas.ts
    reinos.ts
  schema/
    fichaSchema.ts
  services/
    analizarConIA.ts
    grimorio.ts
  styles/
    App.css
    index.css
  utils/
    generarFichaAleatoria.ts
    generarTextoWhatsApp.ts
  validation/
    validarFicha.ts
  App.tsx
  main.tsx
```

### Responsabilidad por carpeta

- `assets/`: imágenes del frontend
- `components/`: UI reutilizable extraída del contenedor principal
- `data/`: catálogos canónicos y bundle estático del grimorio
- `schema/`: modelo de ficha y helpers del dominio
- `services/`: IO, sync remoto y cliente del endpoint IA
- `styles/`: capa visual global y estilos de la app
- `utils/`: helpers puros de generación y transformación
- `validation/`: motor de reglas locales

---

## Cómo correr / construir

```bash
cd kingdoom-fichas
npm install
npm run dev
npm run build
```

### Android / APK (Compilación en la Nube y Local)

**Compilación en la Nube (Recomendado):**
- Se configuró un flujo de automatización en `.github/workflows/build-apk.yml` de GitHub Actions.
- Se ejecuta automáticamente con cada `push` en `main` o manualmente mediante `workflow_dispatch`.
- Requiere **Node 22** y **Java 21** (configurados automáticamente en la VM de GitHub `ubuntu-latest`).
- La APK compilada queda disponible como un artefacto descargable (`Kingdoom-Fichas-v5.0-APK`) en GitHub.

**Compilación Local:**
```bash
npm run sync
npm run apk:debug
npm run apk:release
```

Notas:
- `npm run sync` hace build web + `cap sync android`
- Para compilar localmente se requiere **Node >=22.0.0** (exigido por Capacitor 8) y **Java JDK 21** (para evitar errores de `invalid source release: 21` de Gradle).
- Si Gradle no encuentra el SDK, usar `android/local.properties` con `sdk.dir=...`

---

## Mapa funcional de archivos

| Archivo | Función |
|---|---|
| `src/App.tsx` | Contenedor principal del formulario, panel lateral, validación y acciones |
| `src/main.tsx` | Entry point React + carga de fuentes y estilos globales |
| `src/components/Campo.tsx` | Campo reutilizable para `input` y `textarea` |
| `src/components/MetricCard.tsx` | Tarjeta compacta para métricas de ficha |
| `src/components/SectionCard.tsx` | Sección visual reutilizable con encabezado |
| `src/services/grimorio.ts` | Catálogo del grimorio, caché local y sync desde Supabase |
| `src/services/analizarConIA.ts` | Cliente del proxy IA en Vercel |
| `src/validation/validarFicha.ts` | Motor de reglas mecánicas y narrativas locales |
| `src/utils/generarTextoWhatsApp.ts` | Genera el texto final en formato exacto para compartir |
| `src/utils/generarFichaAleatoria.ts` | Genera una ficha base válida para edición |
| `src/schema/fichaSchema.ts` | Modelo `Ficha`, constantes y helpers del dominio |

---

## Reglas de validación

### Reglas duras

- Campos obligatorios: nombre, edad, género, estatura, raza, arma, reino, clase social, profesión, personalidad, historia y debilidades
- Estadísticas: 5 atributos y suma exacta de `12`
- Poderes oficiales: suma exacta de niveles `5`
- Raza válida del catálogo
- Reino válido entre las 5 naciones
- Arma principal sin efectos mágicos
- Habilidades no mágicas sin magia
- Si la clase social es `Noble`, el título de nobleza es obligatorio
- La historia debe cumplir el mínimo de palabras y escala si la edad es muy alta

### Reglas blandas

- Raza poco afín al reino -> advertencia narrativa
- Magia no encontrada o nivel no disponible en grimorio -> advertencia
- Personalidad o debilidades cortas -> advertencia
- Estilo de combate o inventario vacíos -> advertencia

---

## Grimorio

- El bundle base vive en `src/data/grimorio.json`
- La lógica de acceso y sync vive en `src/services/grimorio.ts`
- Estrategia: **bundle offline + fusión con Supabase**
- Fuente remota: tabla `grimoire_magic_styles`
- El sync nunca encoge el catálogo, solo fusiona o amplía

---

## Análisis IA

- Endpoint: `Kingdoom-sync/api/admin/analyze-ficha.ts`
- Cliente: `src/services/analizarConIA.ts`
- Entrada: `{ ficha, avisosLocales }`
- Salida: `{ veredicto, resumen, sugerencias[] }`
- La API key vive en Vercel, nunca en el APK

Estado verificado:

- Endpoint de producción responde `200`
- Flujo cliente -> Vercel ya fue probado end-to-end
- CORS ya contempla `localhost` y `capacitor://localhost`

---

## Estado actual

- **Reescritura del generador de fichas (`generarFichaAleatoria.ts`):** Completamente rediseñado con pools realistas y coherentes de nombres, apellidos, apodos, edades por raza (según longevidad), profesiones según clase social, estilos de combate tácticos extensos, habilidades y debilidades profundas, y 5 plantillas narrativas de historia con variables dinámicas.
- **Compilación en la Nube (GitHub Actions):** Automatización del empaquetado del APK de depuración con Node 22 y Java 21 ante pushes o ejecuciones manuales.
- **Versión del proyecto alineada a V5.0.0** (`versionCode 5` / `versionName 5.0` en Gradle y `package.json`).
- **Reglas narrativas reforzadas:** la app ya trabaja con techo de `900` años, clases de longevidad por raza y pisos narrativos duros de palabras + párrafos por tramo etario.
- UI premium y responsive integrada en móvil y escritorio.

---

## Convenciones que no hay que romper

- `npm run build` debe quedar limpio antes de cerrar tarea
- No meter secretos en el repo
- Mantener el formato exacto de `generarTextoWhatsApp.ts`
- Registrar cambios funcionales o estructurales relevantes en `docs/AI_CHANGELOG.md`
- No subir keystore, contraseñas ni backups de firma a Git
