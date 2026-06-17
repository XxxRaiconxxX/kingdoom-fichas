# Kingdoom · Archivo del Trono - v3.0

**Archivo:** `Kingdoom-Fichas-v3.0.apk`
**versionCode:** `3`
**versionName:** `3.0`
**Fecha:** `2026-06-17`
**Tipo de build:** `debug` (instalable por sideload)

## Como instalar en Android

1. Pasa `Kingdoom-Fichas-v3.0.apk` al telefono.
2. Abre el APK desde el gestor de archivos.
3. Si Android lo pide, habilita la instalacion desde origenes desconocidos para esa app.
4. Acepta la instalacion. Si ya tienes una version anterior, se actualiza sobre la misma app.

## Que cambia en esta V3

- Layout mobile mas compacto en la primera pantalla.
- Franja horizontal de resumen para reino, validacion e IA.
- Menos texto decorativo visible en vertical.
- Checklist y panel de IA mas densos para reducir scroll.
- Misma logica de validacion y analisis IA que ya venia funcionando bien.

## Requisitos

- Sin internet: crear, validar y copiar fichas funciona.
- Con internet: sincronizar grimorio y usar analisis IA.

## Reconstruccion

```bash
npm run apk:debug
```

Requiere Android SDK y JDK 17+.
