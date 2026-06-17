# AI_CHANGELOG

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
