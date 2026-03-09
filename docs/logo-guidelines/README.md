# README - Exportación de la Guía a PDF

Este directorio contiene una plantilla completa en Markdown para la guía de identidad visual enfocada en gestión de logotipo.

## Archivos
- `guia-identidad-visual-logotipo.md`: documento principal listo para edición de datos reales de marca.

## Opción A: Exportar con Pandoc (recomendado)

### Requisitos
- Pandoc instalado
- Motor PDF (`wkhtmltopdf` o LaTeX con `xelatex`)

### Comando básico (xelatex)
```bash
pandoc docs/logo-guidelines/guia-identidad-visual-logotipo.md \
  --from=gfm \
  --toc \
  --number-sections \
  --pdf-engine=xelatex \
  -V geometry:margin=20mm \
  -V mainfont="Source Sans 3" \
  -V colorlinks=true \
  -o docs/logo-guidelines/guia-identidad-visual-logotipo.pdf
```

### Comando alternativo (wkhtmltopdf)
```bash
pandoc docs/logo-guidelines/guia-identidad-visual-logotipo.md \
  --from=gfm \
  --toc \
  --number-sections \
  --pdf-engine=wkhtmltopdf \
  -o docs/logo-guidelines/guia-identidad-visual-logotipo.pdf
```

## Opción B: Maquetación visual (Figma, InDesign, Canva)
1. Importar el contenido Markdown como base de texto.
2. Aplicar la grilla editorial del manual.
3. Insertar figuras usando los nombres sugeridos (`fig-01...fig-09`).
4. Exportar a PDF con perfil de salida:
- Digital: compresión media, marcadores activos.
- Impresión: 300 DPI, perfil CMYK según imprenta.

## Checklist previo a publicación
- Validar contraste (WCAG 2.1 AA para texto del documento).
- Confirmar consistencia de valores Hex/RGB/CMYK/Pantone.
- Revisar que todas las figuras tengan pie descriptivo.
- Confirmar versión y fecha en portada.
