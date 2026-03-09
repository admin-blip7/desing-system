# Contributing Guide

Gracias por ayudar a terminar este sistema de diseño para empresas.

## Objetivo de Contribución

Buscamos PRs que muevan el proyecto de "funcional" a "productivo":

- estabilidad técnica,
- consistencia de módulos,
- mejor experiencia de uso,
- documentación clara para equipos empresariales.

## Flujo Recomendado

1. Haz fork del repo.
2. Crea branch desde `main` o desde la rama comunitaria activa.
3. Revisa [COMMUNITY_ROADMAP.md](./COMMUNITY_ROADMAP.md) y toma una tarea.
4. Abre issue antes de PRs grandes para alinear alcance.
5. Implementa y verifica.
6. Abre PR con contexto y evidencia.

## Setup Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Principios de Desarrollo

- Cambios pequeños e incrementales.
- Una intención principal por PR.
- Mantener compatibilidad con flujos existentes.
- Preferir soluciones simples sobre sobre-ingeniería.

## Estándar de Calidad (Definition of Done)

Un PR se considera listo cuando cumple:

- Código compila y pasa lint en áreas modificadas.
- Casos críticos del flujo afectado fueron probados manualmente.
- No expone secretos ni datos sensibles.
- Documentación actualizada si cambia comportamiento.

Checklist mínimo:

- `npm run lint`
- `npm run build`
- Evidencia manual del flujo tocado (capturas/logs/resumen)

## Convenciones de PR

Incluye en la descripción:

- Problema actual.
- Solución propuesta.
- Scope explícito (qué toca y qué no).
- Riesgos/regresiones posibles.
- Verificación ejecutada.

## Prioridades de Comunidad

- Consolidación de fases 2-7.
- Pruebas automáticas (unit/integration/e2e).
- Estabilización de rutas y persistencia.
- Hardening de APIs.
- UX de workspaces complejos.

## Seguridad

- No subir `.env.local`, llaves, tokens ni dumps de datos.
- No dejar logs con payloads sensibles.
- Si detectas fuga potencial, reporta de inmediato en issue de seguridad.

## Documentación Relacionada

- [README](./README.md)
- [Roadmap comunitario](./COMMUNITY_ROADMAP.md)
- [Playbook técnico](./docs/COMMUNITY_PLAYBOOK.md)
