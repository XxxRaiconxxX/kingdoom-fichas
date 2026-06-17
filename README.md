# Kingdoom Fichas

Aplicacion React + TypeScript + Capacitor para crear, validar y exportar fichas de personaje con formato exacto para el ecosistema de Kingdoom.

## Que resuelve

- Guiar al jugador en la construccion de una ficha consistente.
- Validar reglas mecanicas y narrativas antes de enviar al grupo.
- Analizar la ficha con IA usando el endpoint administrativo de `Kingdoom-sync`.
- Copiar o compartir el texto final en formato listo para WhatsApp.

## Stack

- Vite
- React 19
- TypeScript estricto
- Capacitor (`clipboard`, `share`, `android`)
- CSS custom con estetica visual inspirada en Kingdoom

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Variables de entorno

La app cliente usa una URL de endpoint para el analisis IA:

```bash
VITE_FICHA_AI_API_URL=https://kingdoom.vercel.app/api/admin/analyze-ficha
```

Si no se define, el cliente usa esa URL por defecto.

## Flujo funcional

1. El usuario completa o genera una ficha base.
2. La validacion local revisa campos, puntos, poderes y coherencia minima.
3. El usuario puede pedir una segunda opinion al analizador IA.
4. Cuando la ficha pasa el check, la app permite copiar o compartir el texto final.

## Estado actual

- UI premium alineada con la estetica de Kingdoom.
- Validacion local operativa.
- Integracion IA verificada contra Vercel.
- Flujo listo para exportar a WhatsApp.
