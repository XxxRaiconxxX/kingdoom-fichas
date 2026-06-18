# AI_CHANGELOG

## 2026-06-18 - [Codex] Blindaje del copiado completo en Android para la APK V5

- Se corrigio el flujo de `Copiar texto final` en `src/App.tsx` para evitar falsos positivos cuando Android/Capacitor deja el portapapeles truncado.
- El boton ahora usa una cadena de copiado con verificacion real:
  - `@capacitor/clipboard` con lectura inmediata de retorno
  - `navigator.clipboard` como segundo intento si esta disponible
  - fallback final por `textarea + execCommand("copy")`
- Si algun metodo devuelve menos caracteres que el texto original, la app ya no reporta exito silencioso y continua probando el siguiente camino.
- El aviso visual al usuario se actualizo para distinguir entre copia completa confirmada y fallo de copia.

### Validacion

- `npx tsc --noEmit`
- `npm run build`

### Riesgos abiertos

- El flujo queda mucho mas robusto, pero la validacion completa en dispositivo real sigue siendo importante porque algunos teclados o capas OEM de Android pueden tratar distinto el portapapeles del sistema.

## 2026-06-18 - [Codex] Registro de release V5 para GitHub

- Se alineó el proyecto a la línea de distribución **V5**:
  - `package.json` → `5.0.0`
  - Android → `versionCode 5` / `versionName 5.0`
  - GitHub Actions → artefacto `Kingdoom-Fichas-v5.0-APK`
- Se actualizó el changelog público del producto para dejar trazado que V5 incorpora el endurecimiento narrativo por edad, longevidad racial y aviso textual de edades altas.
- Se actualizó el `HANDOFF.md` para que los próximos agentes partan desde V5 y no desde la referencia vieja de V4.

### Validación

- `npx tsc --noEmit`
- `npm run build`

### Riesgos abiertos

- La parte cliente ya quedó lista para V5, pero la mejora completa del análisis IA sigue dependiendo de que el endpoint remoto use de forma explícita `contextoNarrativo`.

## 2026-06-18 - [Codex] Endurecimiento narrativo por edad y longevidad

- Se centralizaron en `src/schema/fichaSchema.ts` las nuevas reglas de narrativa por edad:
  - tope máximo de `900` años
  - escala de palabras por tramo
  - escala de párrafos mínimos por tramo
  - helper compartido para `normal`, `prolongada` y `legendaria`
- Se reforzó `src/utils/generarFichaAleatoria.ts` para que la edad aleatoria respete la nueva tabla de longevidad por raza y no vuelva a generar extremos fuera del techo acordado.
- La historia aleatoria ahora se postprocesa con expansión por edad:
  - corrige varios casos de concordancia femenina en las plantillas actuales
  - añade capas narrativas extra para edades altas
  - fuerza el crecimiento de párrafos y densidad histórica según la edad detectada
- `src/validation/validarFicha.ts` ahora bloquea por:
  - edad superior a `900`
  - historia por debajo del mínimo de palabras del tramo
  - historia por debajo del mínimo de párrafos del tramo
- `src/App.tsx` ahora muestra un aviso textual inmediato cuando detecta edades de `100+`, informando el piso narrativo requerido antes del análisis.
- `src/services/analizarConIA.ts` empezó a enviar `contextoNarrativo` al endpoint con:
  - `edadNumerica`
  - `longevidadRaza`
  - `requisitoHistoria`
  - flag para revisión de pronombres según género

### Validación

- `npx tsc --noEmit`
- `npm run build`

### Riesgos abiertos

- La corrección fuerte de pronombres y profundidad narrativa en la IA quedó preparada desde el cliente, pero depende de que el endpoint remoto consuma `contextoNarrativo` y lo incorpore explícitamente en su prompt.

## 2026-06-18 - [Antigravity] Empaquetado V4 del APK

- Se alineó el versionado del proyecto a `4.0.0` en `package.json`.
- Se actualizó Android a `versionCode 4` y `versionName 4.0`.
- Se creó el flujo de trabajo de GitHub Actions `.github/workflows/build-apk.yml` para compilar la APK de depuración en la nube de forma automática ante cada push o de manera manual, resolviendo las limitaciones de herramientas locales (JDK/SDK).

### Validación

- Sincronización y compilación del frontend exitosas (`npm run build && npx cap sync android`).
- Estructuración del archivo de flujo de trabajo YAML para GitHub Actions.

## 2026-06-18 - [Antigravity] Reescritura completa del generador aleatorio de fichas

- Se reescribió `src/utils/generarFichaAleatoria.ts` de cero, reemplazando todos los campos hardcodeados por pools extensos y lógica de coherencia.
- **Nombres:** Pool de ~50 nombres masculinos y ~48 femeninos de estilo medieval/fantasía + ~50 apellidos + apodos opcionales. El nombre se genera según el género elegido.
- **Género:** Solo "Masculino" o "Femenino" (se eliminó "No binario").
- **Edad:** Se genera coherentemente según la raza. Razas longevas extremas (Elfos, Vampiros, Liches, Dragones) → 200-1200 años. Razas longevas (Semi-Elfos, Nephilim, Demonios) → 60-500. Mortales → 18-65.
- **Poderes Oficiales:** Se eliminó el array hardcodeado de 7 magias inventadas. Ahora se importa `getCatalogoGrimorio()` y se seleccionan magias reales del grimorio (31 estilos), respetando los niveles máximos de cada estilo.
- **Arma + Estilo de combate:** Coherencia mutua. Se categorizan armas (cuerpo, distancia, mágico-físico) y se emparejan con estilos extensos (párrafos de 3-5 oraciones).
- **Clase social ↔ Título ↔ Profesión:** Coherencia total. Noble → título aleatorio (Barón, Conde, Duque, etc.) + profesiones de alto rango. Burgués → sin título + profesiones comerciales. Plebeyo → sin título + profesiones humildes.
- **Habilidades no mágicas:** Pool de 20 habilidades detalladas (nombre + descripción). Se seleccionan 3-5 aleatorias.
- **Personalidad:** Pool de 8 personalidades profundas y variadas (60-100 palabras cada una).
- **Historia:** 5 plantillas narrativas extensas (200+ palabras) con variables dinámicas ({nombre}, {raza}, {reino}, {lema}, {profesión}, {arma}, {clase social}, {género}).
- **Debilidades:** Pool de 10 debilidades variadas (físicas, emocionales, tácticas). Se seleccionan 2-3.
- **Inventario:** Base común + extras aleatorios coherentes. Incluye el arma principal.
- **Extras:** Pool de 10 curiosidades/manías del personaje. Se seleccionan 2-4.

### Validación

- `tsc --noEmit` ✅
- `npm run build` (tsc -b && vite build) ✅ — 44 módulos, 4.05s

### Riesgos abiertos

- El grimorio local (`grimorio.json`) tiene 31 magias. Si existen más en Supabase, el generador las usará automáticamente tras el sync, pero el bundle offline seguiría limitado a 31.

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
