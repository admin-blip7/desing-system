# GenericModuleWorkspace Removal Checklist

## Checklist de migración

1. Eliminar archivo del componente genérico:
   - `src/components/workspace/GenericModuleWorkspace.tsx`

2. Eliminar imports/referencias:
   - `src/app/(dashboard)/dashboard/brands/[id]/modules/[moduleId]/page.tsx`

3. Redirigir navegación de módulos:
   - módulos con `workspacePath` -> `/dashboard/brands/[id]/workspace/<slug>`
   - módulos sin workspace -> `/dashboard/brands/[id]/workspace/brand-generation?moduleKey=<key>`

4. Verificar ausencia de referencias:
   - `rg -n "GenericModuleWorkspace" src`

5. Verificar compilación y lint:
   - `npm run lint`
   - `npm run build`

6. Verificar flujo de generación IA:
   - Crear sesión `POST /api/brand-generation/sessions`
   - Ejecutar sesión `POST /api/brand-generation/sessions/[id]/run`
   - Confirmar persistencia de resultados en módulo (si `moduleKey` fue enviado)

7. Reiniciar servidor local:
   - detener proceso actual
   - `npm run dev`

## Resultado esperado

- Sin referencias huérfanas al workspace genérico.
- Workspaces personalizados existentes operativos.
- Flujo IA multi-agente funcional de extremo a extremo.
