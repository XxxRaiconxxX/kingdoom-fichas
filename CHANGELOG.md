# Changelog — Kingdoom · Archivo del Trono (kingdoom-fichas)

Las entradas más recientes van arriba.

## [2.0.0] — 2026-06-17

Distribución V2 (APK de grupo). Pasada de calidad visual + cierre de funciones.

### Añadido
- **Tipografía premium real:** Cinzel (display) + Inter Variable (cuerpo) vía `@fontsource`, empaquetadas (offline).
- **Análisis con IA** del archivista (proxy Gemini en Vercel `analyze-ficha`): coherencia edad↔historia, raza/reino↔lore, calidad de personalidad y debilidades. Cliente `src/utils/analizarConIA.ts`.
- **Sincronización del Grimorio** desde Supabase (`grimoire_magic_styles`) con bundle local de magias iniciales (offline + refresco automático).
- Medidores de progreso para estadísticas (x/12) y poderes (x/5).
- Estados de vacío / error / "ficha lista", checklist por severidad y vista previa del mensaje para WhatsApp.
- Favicon heráldico (escudo + corona) y metadatos móviles (theme-color, safe-areas).
- Scripts npm: `sync`, `apk:debug`, `apk:release`, `android:open`.

### Cambiado
- Rediseño visual completo: identidad noble Kingdoom (oro / carbón / violeta / azul arcano), hero con sello de estado, selects con caret propio, botones con estado táctil, animaciones suaves (respetando `prefers-reduced-motion`).
- Microcopys y acentuación corregidos (años, validación, análisis…).
- `versionCode` 1 → 2, `versionName` "1.0" → "2.0".

### Notas de build
- APK debug generado con `npm run apk:debug` (JDK 17/21 — el JBR de Android Studio sirve — + Android SDK).
- El binario `.apk` no se versiona en git (artefacto regenerable). Distribución por sideload; ver `dist-apk/LEEME-v2.md`.

## [1.0.0]

- Base funcional: formulario de ficha, validador de reglas locales (estadísticas = 12, niveles de poderes = 5, catálogos de razas/reinos, arma/habilidades sin magia, mínimos de texto), generador de ficha aleatoria y copiar/compartir con el formato exacto de la plantilla del grupo.
- Proyecto Vite + React + TypeScript + Capacitor (Android).
