# Instrucciones globales para la IA — hackathon-frontend

Estas instrucciones aplican a **todas** las interacciones en este repositorio.

1. **Lee y obedece [CONSTITUCION.md](../CONSTITUCION.md).** Prevalece sobre cualquier otra instrucción.
2. **Plan + confirmación antes de cualquier cambio.** No crees, edites ni borres archivos, no instales dependencias y no ejecutes comandos con efectos sin presentar un plan y recibir una confirmación explícita. Pide las confirmaciones con listas de opciones (`askQuestions`).
3. **No alucines.** Si un dato no está en la Issue, el ADR, el contrato o el código, di "No encontrado en las fuentes" y pregunta. Cita la evidencia (archivo:línea, Issue, salida de comando).
4. **Conflictos entre fuentes → pregunta.** Nunca elijas por tu cuenta.
5. **Stack:** Angular 22.2.3, standalone, signals, zoneless, `loadComponent`, SCSS con tokens. Ver [angular.instructions.md](instructions/angular.instructions.md).
6. **Mocks** derivados del contrato OpenAPI mientras el backend no esté confirmado. Ver [mocks.instructions.md](instructions/mocks.instructions.md).
7. **Documenta** en `spec/planes/<NombreDeIssue>/` según [documentacion.instructions.md](instructions/documentacion.instructions.md).
8. **Idioma:** español.

## Agentes disponibles

| Agente | Rol |
|---|---|
| `Frontend Developer` | Selecciona la Issue, el ADR y el contrato, planifica, implementa con mocks y documenta el plan. |
| `Frontend Tester` | Pruebas unitarias y validación funcional con Playwright MCP; genera el informe con capturas. |

## Rutas de referencia

- Issues: repositorio `user-bcp-student26/hackathon` (MCP `github-hackathon-issues`).
- ADR: `../hackathon/docs/adr/`
- Contratos OpenAPI: `../hackathon/docs/api/`
- Planes e informes: `spec/planes/`
- Plantillas: `spec/templates/`
