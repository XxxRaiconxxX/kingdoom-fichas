# AI_CHANGELOG

## 2026-06-17 - [Codex] Empaquetado V3 del APK

- Se alineo el versionado del proyecto a `3.0.0` en `package.json`.
- Se actualizo Android a `versionCode 3` y `versionName 3.0`.
- Se preparo la nueva salida de distribucion como V3 para separar esta iteracion compacta de la V2 previa.

### Validacion

- `npm run sync`
- `npm run apk:debug` con `JAVA_HOME=C:\Program Files\Android\Android Studio\jbr`

### Riesgos abiertos

- La V3 generada sigue siendo una build debug para distribucion por sideload, no una release firmada para tienda.

## 2026-06-17 - [Codex] Ajuste mobile compacto para APK V2

- Se revisó el feedback de saturación visual en teléfono y se ajustó el layout responsive del APK V2.
- Se corrigió el estado visual del sello superior para usar las clases reales `is-ok` / `is-pending`.
- En mobile se redujo la densidad inicial:
  - se ocultan textos ornamentales largos del hero
  - se oculta la imagen hero para priorizar formulario y acciones
  - se compactan paddings, radios, botones, campos y métricas
  - se limita la altura del checklist y la vista previa para evitar pantallas verticales interminables
- Se agregó un carrusel horizontal móvil de resumen para que la lectura de reino, validación e IA no interrumpa el formulario.
- Se compactaron tarjetas del checklist y sugerencias IA para conservar el valor de corrección sin alargar tanto la pantalla.
- Se regeneró localmente `dist-apk/Kingdoom-Fichas-v2.0.apk` desde el debug APK recién compilado.

### Validación

- `npm run sync`
- `npm run apk:debug` con `JAVA_HOME=C:\Program Files\Android\Android Studio\jbr`

### Riesgos abiertos

- No se hizo prueba visual dentro de emulador físico/Android Studio en esta pasada; la validación fue por build y revisión del CSS responsive.

## 2026-06-17 - [Codex] Rediseño premium inicial y preparación de repositorio

- Se rehizo el frontend principal de `kingdoom-fichas` con una dirección visual más cercana a Kingdoom:
  - hero principal con tono ceremonial
  - tarjetas oscuras premium con acento dorado y violeta
  - panel lateral de veredicto más claro para validación, IA y salida final
  - mejor lectura responsive en escritorio y móvil
- Se mantuvo intacta la lógica funcional existente:
  - validación local
  - análisis IA
  - copiado y compartido
- Se reforzó el tono del producto con tipografía display más medieval y bloques narrativos del reino.
- Se reemplazó el `README.md` genérico del template por documentación real del proyecto.

### Validación

- `npm run build`
- Revisión visual local en escritorio y móvil mediante capturas headless sobre servidor Vite

### Riesgos abiertos

- El asset `src/assets/hero.png` sigue siendo provisional; una ilustración o blasón oficial elevaría aún más la identidad visual.
- La carpeta no estaba inicializada como repositorio Git al inicio de esa entrega; después fue creada y subida a GitHub.

## 2026-06-17 - [Codex] Cierre de reorganización estructural

- Se terminó la reorganización iniciada a medias del frontend:
  - `src/components/` para UI reutilizable
  - `src/services/` para grimorio sync y cliente IA
  - `src/styles/` para la capa visual
  - `docs/` para trazabilidad del proyecto
- Se actualizaron las referencias en `App.tsx`, `main.tsx` y `validarFicha.ts` para apuntar a las rutas nuevas.
- Se eliminaron assets sobrantes del template (`react.svg`, `vite.svg`).
- Se reescribió `docs/HANDOFF.md` para que refleje la estructura actual y no las rutas viejas.
- Se normalizó la documentación con acentos y nombres de ruta coherentes tras la migración.

### Validación

- `npm run build`

### Riesgos abiertos

- No se tocaron keystore, APKs ni artefactos Android en esta pasada; el foco fue cerrar la estructura del código y la documentación.
