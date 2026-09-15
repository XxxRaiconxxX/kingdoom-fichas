## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Local operational paths:
- `graphify-out/` stays in the project root because Graphify, Codex, and Antigravity all look for `graphify-out/graph.json` there. It is local and ignored by Git.
- `.codex/hooks.json` is local and ignored by Git. Refresh it with `npm run graphify:setup`.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- For audits, debugging, architecture review, feature impact analysis, or handoff work, prefer Graphify before broad manual browsing.
- For ficha flow questions, prefer Graphify first for traces such as UI -> state/context -> storage/data layer.
- If a change may affect connected modules, use Graphify to find neighbors and dependency clusters before editing.
- Run `npm run graphify:setup` once per clone or when hooks and local Graphify wiring need repair.
- Run `npm run graphify:update` after structural code changes that are still uncommitted, or before asking Graphify-heavy architecture questions during an active edit session.
- Run `npm run graphify:doctor` when another AI agent reports stale graph answers, missing hooks, or missing local Graphify state.
- Dirty `graphify-out/` files are expected after hooks or incremental updates; dirty graph files are not a reason to skip Graphify. Only skip Graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, prefer `npm run graphify:update` over raw CLI calls so Codex hooks and repo conventions stay aligned.

---

## Protocolo de Diagnóstico Forense y Validación de Base de Datos (Anti-Parches Superficiales)

Este protocolo es de cumplimiento estricto para **Codex CLI**, Antigravity y cualquier agente ante tareas de auditoría, soporte de incidencias o corrección de bugs reportados en producción:

### A. Evidencia en Logs Primero (Ground Truth First)
- ⛔ **PROHIBIDO adivinar o asumir la causa de un fallo** basándose únicamente en diferencias de código o lecturas superficiales.
- Ante un error reportado por un usuario o una captura de pantalla, el agente **DEBE consultar los logs reales del sistema** (PostgreSQL vía MCP `get_logs`, logs de consola de la app o backend) en la marca de tiempo exacta del incidente.
- No se inicia ninguna modificación de código hasta identificar la excepción cruda del sistema (ej: `violates check constraint`, `null value in column`, `RPC function not found`, `permission denied`).

### B. Auditoría Cruzada Código ↔ Esquema DDL (Constraint Audit)
- Cuando la gestión de fichas interactúa con PostgreSQL (mediante RPC, `insert` o `update`), no basta con verificar que las columnas existan o que los nombres coincidan.
- **Auditoría obligatoria de restricciones DDL:**
  * **`CHECK constraints`:** Verificar que los límites numéricos de la base de datos admitan la totalidad del rango que la app calcula (estadísticas, niveles, cupos de fichas, atributos).
  * **`ENUMs / Status checks`:** Confirmar que todos los estados posibles del flujo estén explícitamente permitidos en el `CHECK (status IN (...))`.
  * **`UNIQUE constraints` y Nulos:** Validar que las claves compuestas y la nulabilidad no choquen con la sincronización de fichas.
- La regla es: **el código no manda sobre la base de datos; si el código cambia un rango de datos o estado, la base de datos DEBE actualizarse en sincronía mediante migración SQL.**

### C. Pruebas de Límites Reales (Boundary Testing Obligatorio)
- ⛔ **PROHIBIDO validar correcciones únicamente con "caminos felices" triviales o valores mínimos.**
- Si un valor o atributo tiene un rango `[min, max]`, probar obligatoriamente el límite mínimo (`min`) y el límite máximo (`max`).
- Si la app permite hasta el nivel máximo o estadísticas top, la prueba debe ejecutar transacciones reales en los límites. Si falla con el valor máximo, la tarea **NO está resuelta**.

### D. Prohibición de Declaración de Éxito Prematuro (Verification Gate)
- Un bug no se considera resuelto porque "la app compila sin errores" o porque "el build pasa".
- La validación debe demostrar que el **caso exacto reportado por el usuario** ahora se completa satisfactoriamente con respuesta de éxito (`status = 'ok'`).
- Dejar una aserción o prueba que falle si la restricción o la RPC se rompen en el futuro.

### E. Integridad y Versionado de Migraciones
- Todo ajuste de esquema o función en Supabase debe:
  1. Aplicarse en el entorno remoto activo.
  2. Quedar guardado en el archivo `.sql` de migración versionado del repositorio para que sea 100% reproducible.
  3. Registrarse en `AI_CHANGELOG.md` y `ai-memory/kingdoom-memory.jsonl` indicando la excepción real resuelta y la prueba de límites efectuada.

