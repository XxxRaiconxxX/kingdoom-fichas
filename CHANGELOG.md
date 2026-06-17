# Changelog — Kingdoom · Archivo del Trono (`kingdoom-fichas`)

Las entradas más recientes van arriba.

## [2.0.0] — 2026-06-17

Distribución V2 (APK de grupo). Pasada de calidad visual + cierre de funciones.

### Añadido

- **Tipografía premium real:** Cinzel (display) + Inter Variable (cuerpo) vía `@fontsource`, empaquetadas para uso offline.
- **Análisis con IA** del archivista mediante el proxy Gemini en Vercel (`analyze-ficha`). Cliente actual: `src/services/analizarConIA.ts`.
- **Sincronización del grimorio** desde Supabase (`grimoire_magic_styles`) con bundle local de arranque para modo offline + refresco automático.
- Medidores de progreso para estadísticas (`x/12`) y poderes (`x/5`).
- Estados de vacío, error y ficha lista, checklist por severidad y vista previa del mensaje para WhatsApp.
- Favicon heráldico y metadatos móviles (`theme-color`, `safe-area`).
- Scripts npm: `sync`, `apk:debug`, `apk:release`, `android:open`.

### Cambiado

- Rediseño visual completo con identidad noble Kingdoom: oro, carbón, violeta y azul arcano.
- Hero ceremonial, tarjetas premium, panel lateral de veredicto y mejoras de lectura responsive.
- Reorganización estructural del frontend:
  - `src/components/` para UI reutilizable
  - `src/services/` para cliente IA y sync remoto
  - `src/styles/` para la capa visual
  - `docs/` para trazabilidad del proyecto
- Corrección de textos, acentos y documentación interna.

### Notas de build

- `npm run build` validado tras la reorganización.
- APK debug y release ya fueron generados fuera del repo con Capacitor + Gradle.
- El binario `.apk` no se versiona en Git; se distribuye como artefacto externo.

## [1.0.0]

- Base funcional: formulario de ficha, validador local, generador aleatorio y salida lista para WhatsApp.
- Proyecto Vite + React + TypeScript + Capacitor (Android).
