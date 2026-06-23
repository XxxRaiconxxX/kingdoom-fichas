# Changelog - Kingdoom · Archivo del Trono (`kingdoom-fichas`)

Las entradas más recientes van arriba.

## [5.0.2] - 2026-06-23

Tutorial inicial mobile-first para mejorar onboarding, reducir fricción en el primer uso y sanear textos visibles.

### Añadido

- Overlay fullscreen de onboarding que aparece solo en el primer arranque.
- Carrusel de 4 pantallas con progreso visible, navegacion por botones y gesto swipe.
- CTA final `Forjar mi ficha` para cerrar el tutorial y devolver al home.
- Boton `Ver tutorial` dentro del bloque superior para reabrirlo manualmente.

### Cambiado

- El estado del tutorial ahora se persiste en `localStorage` para no repetirlo en aperturas futuras.
- El layout del tutorial se ajustó específicamente para pantallas móviles: texto más compacto, escenas CSS ilustradas y acciones en columna.
- Se corrigieron textos visibles del home y panel móvil para evitar inconsistencias de acentos antes del build.

### Notas de build

- `npm run lint` validado.
- `npm run build` validado.

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

## [5.0.0] - 2026-06-18

Distribucion V5. Endurecimiento narrativo por edad + preparacion del release en GitHub.

### Anadido

- **Reglas narrativas por edad** centralizadas con tres clases de longevidad racial: `normal`, `prolongada` y `legendaria`.
- **Techo oficial de edad** en `900` anos para el ecosistema de fichas.
- **Aviso textual inmediato** en la UI cuando la edad detectada exige una historia reforzada.
- **Contexto narrativo estructurado** enviado al analisis IA: edad numerica, longevidad racial, requisito de historia y revision de pronombres.

### Cambiado

- El generador aleatorio ya no usa el esquema viejo de longevidad y ahora reparte edades por porcentaje segun la raza.
- Las historias generadas se expanden segun la edad del personaje para cumplir mejor con densidad, etapas vitales y extension minima.
- La validacion local ahora bloquea historias insuficientes no solo por palabras, sino tambien por parrafos minimos segun tramo etario.
- La version del proyecto pasa a `5.0.0`, Android a `versionCode 5` / `versionName 5.0`, y el artefacto de GitHub Actions se publica como `Kingdoom-Fichas-v5.0-APK`.

### Notas de build

- `npx tsc --noEmit` validado.
- `npm run build` validado.
- La APK V5 queda preparada para compilarse desde GitHub Actions en cada push a `main` o por ejecucion manual del workflow.

## [2.0.0] - 2026-06-17

Distribucion V2 (APK de grupo). Pasada de calidad visual + cierre de funciones.

### Anadido

- **Tipografia premium real:** Cinzel (display) + Inter Variable (cuerpo) via `@fontsource`, empaquetadas para uso offline.
- **Analisis con IA** del archivista mediante el proxy Gemini en Vercel (`analyze-ficha`). Cliente actual: `src/services/analizarConIA.ts`.
- **Sincronizacion del grimorio** desde Supabase (`grimoire_magic_styles`) con bundle local de arranque para modo offline + refresco automatico.
- Medidores de progreso para estadisticas (`x/12`) y poderes (`x/5`).
- Estados de vacio, error y ficha lista, checklist por severidad y vista previa del mensaje para WhatsApp.
- Favicon heraldico y metadatos moviles (`theme-color`, `safe-area`).
- Scripts npm: `sync`, `apk:debug`, `apk:release`, `android:open`.

### Cambiado

- Rediseño visual completo con identidad noble Kingdoom: oro, carbon, violeta y azul arcano.
- Hero ceremonial, tarjetas premium, panel lateral de veredicto y mejoras de lectura responsive.
- Reorganizacion estructural del frontend:
  - `src/components/` para UI reutilizable
  - `src/services/` para cliente IA y sync remoto
  - `src/styles/` para la capa visual
  - `docs/` para trazabilidad del proyecto
- Correccion de textos, acentos y documentacion interna.

### Notas de build

- `npm run build` validado tras la reorganizacion.
- APK debug y release ya fueron generados fuera del repo con Capacitor + Gradle.
- El binario `.apk` no se versiona en Git; se distribuye como artefacto externo.

## [1.0.0]

- Base funcional: formulario de ficha, validador local, generador aleatorio y salida lista para WhatsApp.
- Proyecto Vite + React + TypeScript + Capacitor (Android).
