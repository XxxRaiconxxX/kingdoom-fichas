# AI_CHANGELOG

## 2026-06-17 - [Codex] Rediseño premium inicial y preparación de repositorio

- Se rehizo el frontend principal de `kingdoom-fichas` con una dirección visual más cercana a Kingdoom:
  - hero principal con tono ceremonial
  - tarjetas oscuras premium con acento dorado/violeta
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
- La carpeta no estaba inicializada como repositorio Git al inicio de esta entrega; se prepara para creación y subida a GitHub.
