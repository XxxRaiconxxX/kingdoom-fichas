# Kingdoom · Archivo del Trono — v2.0

**Archivo:** `Kingdoom-Fichas-v2.0.apk` (≈4.5 MB)
**versionCode:** 2 · **versionName:** 2.0
**Fecha:** 2026-06-17
**Tipo de build:** debug (firmado con clave de depuración, instalable por sideload)

---

## Cómo instalar (Android)

1. Pasa el archivo `Kingdoom-Fichas-v2.0.apk` al teléfono (WhatsApp, cable, Drive…).
2. Ábrelo desde el gestor de archivos.
3. Si Android avisa, permite **"Instalar apps de orígenes desconocidos"** para la app desde la que abres el APK.
4. Acepta la instalación. Si ya tenías la v1 instalada, se actualiza encima (mismo `applicationId`).

> Es la versión de pruebas/grupo (sideload). No requiere Play Store.

---

## Novedades de la v2.0

- **Tipografía premium real:** Cinzel (títulos) + Inter (cuerpo), ahora cargadas y empaquetadas (funciona sin internet).
- **Rediseño visual completo:** identidad noble Kingdoom (oro/carbón/violeta/azul arcano), hero con sello de estado, medidores de progreso para estadísticas (x/12) y poderes (x/5).
- **Mobile-first real:** safe-areas para barras de Android, color de barra de estado, botones táctiles, sin desbordes.
- **Estados cuidados:** validación en vivo, checklist por severidad, estados de vacío/error/listo, vista previa del mensaje para WhatsApp.
- **Análisis con IA** del archivista (coherencia, tono y balance) ya operativo.
- **Grimorio** sincronizado con el catálogo oficial (offline + actualización automática).

---

## Requisitos de conexión

- **Sin internet:** crear/validar/copiar fichas funciona (incluye catálogo local de magias).
- **Con internet:** sincronizar el Grimorio y usar el Análisis con IA.

---

## Notas para reconstruir el APK

```bash
cd kingdoom-fichas
npm run apk:debug      # genera android/app/build/outputs/apk/debug/app-debug.apk
```
Requiere Android SDK + JDK 17/21 (el de Android Studio, JBR, sirve).
Para una build de tienda firmada: configurar keystore en `android/app/build.gradle` y usar `npm run apk:release`.
