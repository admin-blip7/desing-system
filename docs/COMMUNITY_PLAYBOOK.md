# Community Playbook

Guía operativa para contribuidores que quieran terminar y estabilizar `brand-manual-app`.

## 1. Contexto Técnico

`brand-manual-app` usa:

- Frontend: Next.js App Router + React + Tailwind
- Datos/Auth: Supabase
- IA: BAML + OpenAI (y rutas de integración adicionales)
- Export: PDF/HTML/Markdown

Arquitectura base:

- `src/app/**`: rutas y endpoints
- `src/components/**`: UI y workspaces
- `src/lib/**`: dominio, IA, utilidades, persistencia
- `src/actions/**`: server actions

## 2. Flujo Principal de Negocio

1. Usuario crea marca (onboarding).
2. Marca avanza por fases y módulos.
3. IA genera contenido por módulo.
4. Usuario edita y guarda resultados.
5. Sistema exporta manual completo.
6. Manual puede compartirse por token.

## 3. Qué Rompe Más Fácilmente

- Contratos de contenido entre generación IA y workspaces.
- Persistencia de `modules` cuando cambia estructura del payload.
- Integridad de rutas entre workspace legacy y dashboard.
- Export cuando un módulo tiene estructura inesperada.

## 4. Reglas para Contribuir Código

- Un problema principal por PR.
- Evitar refactors masivos no solicitados.
- Mantener backward compatibility donde sea posible.
- Documentar contratos nuevos o cambios de shape.

## 5. Estrategia de Testing Recomendada

Nivel mínimo por PR:

- `npm run lint`
- `npm run build`
- Prueba manual del flujo tocado

Nivel recomendado por área:

- Utilidades: tests unitarios
- Endpoints: tests de integración con escenarios de error
- UX crítica: smoke e2e básico

## 6. Guía por Tipo de Tarea

### A. Módulos/Workspaces

- Verifica parseo de contenido inicial y generado.
- Garantiza guardado consistente en `modules`.
- Revisa visualización + export.

### B. Endpoints/API

- Auth y ownership obligatorios.
- Mensajes de error sin filtrar internals.
- Evitar logs con payload sensible.

### C. IA/BAML

- Contrato de entrada/salida estable.
- Fallback razonable cuando falla proveedor.
- Validación de JSON estructurado antes de persistir.

## 7. Criterios de Aceptación Productiva

Un módulo se considera "listo para empresa" cuando:

- genera contenido útil consistentemente,
- se puede editar sin romper estructura,
- se guarda/carga sin pérdida,
- exporta correctamente,
- y tiene validación básica automatizada o manual documentada.

## 8. Seguridad Operativa

- Nunca commitear secretos ni `.env.local`.
- No publicar artefactos locales de agentes/herramientas.
- Evitar endpoints debug en producción.
- Si se detecta riesgo, priorizar fix de seguridad sobre feature.

## 9. Roadmap de Impacto Alto

1. Consolidación de rutas.
2. Consistencia de persistencia.
3. Cobertura de tests críticos.
4. Cierre de módulos de fases 2-7.
5. Integraciones de distribución/versionado.

## 10. Entrega de PR Excelente

Incluye:

- resumen claro del problema,
- cambios realizados,
- evidencia de validación,
- riesgos y plan de rollback.
