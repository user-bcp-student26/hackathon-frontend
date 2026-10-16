---
applyTo: "spec/**"
description: Qué documentar, dónde y con qué formato.
---

# Reglas de documentación

## Estructura

```text
spec/
  templates/
    plan.template.md
    informe-pruebas.template.md
  planes/
    issue-<n>-<titulo-kebab>/
      plan-v1.md                 ← Frontend Developer
      plan-v2.md                 ← nueva versión (nunca se sobrescribe la anterior)
      informe-pruebas-v1.md      ← Frontend Tester (valida plan-v1)
      informe-pruebas-v1-r2.md   ← revalidación del mismo plan
      evidencias/v1/*.png        ← Frontend Tester (capturas Playwright)
      evidencias/v1-r2/*.png
```

## Nombre de carpeta
`issue-<número>-<título-en-kebab-case>`: minúsculas, sin tildes ni ñ (ñ → n), solo `[a-z0-9-]`, máximo 60 caracteres.

## Versionado
- Si la carpeta ya tiene planes, se crea `plan-v<n+1>.md`; en *Fuentes* se enlaza la versión anterior y se indica qué cambia.
- El informe y las evidencias llevan la versión del plan que validan. Una revalidación de la misma versión usa `-r<k>`.
- Ningún plan, informe ni captura existente se sobrescribe ni se edita después de cerrado.

## Qué se documenta siempre
1. **Fuentes usadas:** Issue (número, título y URL), ADR (archivo) y contrato (archivo), con la fecha de lectura.
2. **Matriz de trazabilidad:** criterio → decisión del ADR → endpoint → artefacto → prueba.
3. **Plan de pasos** con su estado (`Pendiente`, `En curso`, `Hecho`, `Bloqueado`).
4. **Dependencias** propuestas y la respuesta del usuario.
5. **Supuestos y preguntas** con su resolución.
6. **Decisiones del usuario** con fecha (aprobaciones, conflictos resueltos).
7. **Bitácora de ejecución:** archivos creados o modificados y comandos con su resultado real.
8. **Desviaciones** del plan aprobado y su aprobación.
9. **Hallazgos secundarios** (fuera de alcance).
10. **Riesgos residuales.**

## Reglas
- Usar las plantillas de `spec/templates/`; no eliminar secciones (si no aplica: "No aplica" + motivo).
- No pegar secretos ni datos personales.
- Enlaces e imágenes con rutas relativas.
- El plan solo pasa a `Aprobado` con la confirmación explícita del usuario.
