# Community Roadmap - Cierre del Sistema de Diseño Empresarial

Este roadmap define cómo la comunidad puede llevar el proyecto a un estado productivo para empresas.

## Objetivo de Cierre

Entregar una plataforma donde una empresa pueda:

- definir su identidad,
- generar un sistema visual/UI consistente,
- operar ese sistema en web, marketing y operaciones,
- exportar y distribuir el manual como estándar interno.

## Estado Global

- Fases: `7`
- Módulos: `55`
- Estado: base funcional operativa + deuda de producto/arquitectura/testing.

## Prioridades (Top 10)

1. Consolidar rutas duplicadas (`/workspace/*` vs `/dashboard/brands/[id]/workspace/*`).
2. Unificar modelo de persistencia de módulos (`modules` como fuente única de verdad).
3. Cerrar endpoints de prueba y endurecer seguridad operacional.
4. Aumentar cobertura de tests en flujos críticos.
5. Estandarizar formato de salida IA por tipo de módulo.
6. Eliminar deuda de archivos `.bak` y código legacy residual.
7. Completar módulos incompletos de fases 2 a 7 con criterios de aceptación.
8. Mejorar exportación para calidad "entregable empresarial".
9. Definir versionado/changelog estable del manual.
10. Mejorar onboarding y docs para nuevos contribuidores.

## Fase 1 - Fundamentos de Identidad

Estado: parcialmente estable.

Pendientes críticos:

- Consistencia de lectura/guardado en módulos base.
- Validaciones de calidad de contenido generado.
- QA de rendimiento y UX en editores clave (`logo`, `colorPalette`, `typography`).

Criterio de aceptación:

- Flujo completo sin errores: onboarding -> generación -> edición -> export.

## Fase 2 - Sistema Visual Extendido

Estado: incompleta.

Pendientes:

- Calidad de módulos visuales (`photography`, `illustration`, `motion`, `audioBranding`, `dataVisualization`).
- Normalización de estructura de contenido para preview/export.
- Manejo robusto de fallback cuando falla imagen o texto.

Criterio de aceptación:

- Todos los módulos visuales generan contenido usable y exportable sin parches manuales.

## Fase 3 - UI Kit y Sistema de Diseño

Estado: incompleta.

Pendientes:

- Homogeneizar tokens/componentes/estados.
- Mejorar consistencia entre workspaces.
- Tests de regresión en `buttons`, `forms`, `navigation`, `tablesLists`, `emptyErrorStates`.

Criterio de aceptación:

- Componentes críticos comparten patrón y contratos consistentes.

## Fase 4 - Presencia Digital

Estado: incompleta.

Pendientes:

- End-to-end estable de módulos digitales.
- Mejoras de UX para edición de contenido multi-canal.
- Exportes listos para equipos de marketing y ventas.

Criterio de aceptación:

- Módulos de presencia digital con salida utilizable por equipos no técnicos.

## Fase 5 - Identidad Física

Estado: incompleta.

Pendientes:

- Templates y reglas de producción para impresión/material físico.
- Validaciones de constraints técnicos (colores, tamaños, formatos).

Criterio de aceptación:

- Salidas con especificaciones ejecutables por imprenta/proveedores físicos.

## Fase 6 - Experiencia del Cliente

Estado: incompleta.

Pendientes:

- Estructura sólida para protocolos operativos (`behavior`, `incidents`, `cxSystem`).
- Reutilización consistente en exportes y flujos de soporte.

Criterio de aceptación:

- Protocolos claros y consistentes para operación diaria en empresa.

## Fase 7 - Integraciones y Distribución

Estado: incompleta.

Pendientes:

- Integraciones reales (`notionConnector`, `assetLibrary`, `releaseNotes`, `brandAudit`).
- Versionado de manual y trazabilidad de cambios.
- UX de distribución interna para equipos.

Criterio de aceptación:

- Manual distribuible, versionado y consumible por equipos y herramientas.

## Ejes Transversales

### A. Testing

- Unit tests para utilidades críticas.
- Integration tests para APIs de módulos/export.
- E2E smoke (auth -> onboarding -> generación -> export).

### B. Seguridad

- Sin secretos en repo.
- Errores sin `stack/details` en producción.
- Endpoints sensibles con auth obligatoria.
- Rate limiting robusto (no solo en memoria).

### C. Deuda Técnica

- Eliminación de `.bak`.
- Limpieza de rutas legacy.
- Consolidación de contratos de datos.

### D. DX y Comunidad

- Issues y PRs bien etiquetados.
- Guías claras por módulo.
- Checklist de aceptación por fase.

## Como Tomar una Tarea

1. Elige una fase o eje transversal.
2. Abre issue con formato: problema -> propuesta -> validación.
3. Implementa en PR pequeño.
4. Adjunta verificación.
5. Documenta cambios de comportamiento.

## Que Nos Hace Falta Urgente

- Maintainers técnicos por fase.
- QA funcional para flujos empresariales completos.
- Colaboradores para pruebas y documentación en español/inglés.
