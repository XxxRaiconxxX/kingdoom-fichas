# Changelog — Kingdoom · Archivo del Trono (`kingdoom-fichas`)

Las entradas más recientes van arriba.

## [5.0.1] - 2026-06-19

Parche post V5 para reducir egress de Supabase y mejorar la lectura en pantallas moviles.

### Cambiado

- El sync automatico del grimorio ahora respeta una ventana local de 24 horas y deja de descargar el JSON pesado de niveles en cada apertura.
- El boton manual de sincronizacion conserva el refresh forzado cuando el staff quiera actualizar el catalogo.
- En mobile, las secciones principales del formulario se vuelven colapsables para disminuir saturacion visual y scroll vertical.
- El lint ignora artefactos generados por Android/Gradle para validar solamente el codigo fuente real.
- Versionado alineado a `5.0.1` en npm y Android (`versionCode 6`) para distribuirlo como actualizacion sobre V5.

### Notas de build

- `npm run lint` validado.
- `npm run build` validado.

## [5.0.0] — 2026-06-18

Distribución V5. Endurecimiento narrativo por edad + preparación del release en GitHub.

### Añadido

- **Reglas narrativas por edad** centralizadas con tres clases de longevidad racial: `normal`, `prolongada` y `legendaria`.
- **Techo oficial de edad** en `900` años para el ecosistema de fichas.
- **Aviso textual inmediato** en la UI cuando la edad detectada exige una historia reforzada.
- **Contexto narrativo estructurado** enviado al análisis IA: edad numérica, longevidad racial, requisito de historia y revisión de pronombres.

### Cambiado

- El generador aleatorio ya no usa el esquema viejo de longevidad y ahora reparte edades por porcentaje según la raza.
- Las historias generadas se expanden según la edad del personaje para cumplir mejor con densidad, etapas vitales y extensión mínima.
- La validación local ahora bloquea historias insuficientes no solo por palabras, sino también por párrafos mínimos según tramo etario.
- La versión del proyecto pasa a `5.0.0`, Android a `versionCode 5` / `versionName 5.0`, y el artefacto de GitHub Actions se publica como `Kingdoom-Fichas-v5.0-APK`.

### Notas de build

- `npx tsc --noEmit` validado.
- `npm run build` validado.
- La APK V5 queda preparada para compilarse desde GitHub Actions en cada push a `main` o por ejecución manual del workflow.

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

