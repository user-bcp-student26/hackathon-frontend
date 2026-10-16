# Constitución del proyecto hackathon-frontend

Este documento define las **reglas fijas** que toda IA (agentes, prompts, chat) debe obedecer en este repositorio. **Prevalece** sobre cualquier agente, prompt, skill o instrucción. Solo el usuario puede modificarlo, y solo de forma explícita.

---

## Artículo 1 — Plan y confirmación antes de actuar

1. **Toda** acción que modifique el estado del proyecto requiere **un plan escrito** y **la confirmación explícita del usuario** antes de ejecutarse. Esto incluye:
   - crear, editar, mover o eliminar archivos;
   - instalar, actualizar o desinstalar dependencias o herramientas;
   - ejecutar comandos con efectos (`ng new`, `ng add`, `ng generate`, `npm install`, scripts de migración, git commit/push, etc.);
   - cambiar la configuración (entornos, `angular.json`, `tsconfig`, `mcp.json`, CI).
2. **Sin confirmación no hay acción.** El silencio, la ambigüedad o un "ok" previo para otra tarea **no** cuentan como aprobación. Cada plan nuevo y cada desviación se confirman por separado.
3. Las acciones de **solo lectura** (leer archivos, listar carpetas, consultar Issues, `node --version`, `ng version`) están permitidas sin confirmación.
4. Si durante la ejecución surge algo no previsto en el plan, la IA **se detiene**, presenta un mini-plan de cambio y espera la confirmación.
5. Las confirmaciones se solicitan con **listas de opciones** (`askQuestions`) siempre que sea posible.

## Artículo 2 — Cero alucinación

1. **No inventar** Issues, criterios de aceptación, endpoints, campos, códigos de error, versiones, APIs de Angular, resultados de comandos ni capturas.
2. Toda afirmación técnica relevante debe tener **evidencia**: la cita de la Issue, el ADR o el contrato, la ruta de archivo y línea, o la salida real de un comando.
3. Si una información no existe en las fuentes, se declara como **"No encontrado en las fuentes"** y se pregunta. Está prohibido rellenarla con suposiciones.
4. Si no se puede verificar que una API o librería existe en la versión instalada, se dice explícitamente y se pregunta antes de usarla.
5. Los supuestos inevitables se listan en el plan, en la sección **Supuestos**, y requieren aprobación.

## Artículo 3 — Fuentes de verdad y conflictos

Orden de prioridad:

1. Criterios de aceptación de la Issue seleccionada (`user-bcp-student26/hackathon`, vía MCP `github-hackathon-issues`).
2. El ADR seleccionado (`../hackathon/docs/adr/`).
3. El contrato OpenAPI seleccionado (`../hackathon/docs/api/`).
4. Esta constitución y `.github/instructions/`.
5. El código existente.

**Ante cualquier contradicción entre fuentes, la IA no decide: muestra ambas citas y pregunta.** Excepción resuelta por el usuario (2026-10-16): la versión de Angular es la que indica el ADR (**22.2.3** en ADR-001); si otro ADR indica una versión distinta, se pregunta.

Los ADR y los contratos son de **solo lectura** para los agentes de este repositorio.

## Artículo 4 — Alcance

1. Una sesión de desarrollo trabaja **una sola Issue**.
2. No se amplía el alcance por deuda técnica o mejoras detectadas: se registran como **hallazgos secundarios** en el plan.
3. No se reescriben partes del sistema ajenas a la Issue.

## Artículo 5 — Stack obligatorio

- Angular **22.2.3** + TypeScript compatible (verificado, no asumido).
- Componentes standalone, sin `NgModule`. OnPush.
- Signals para el estado; `input()`/`output()`/`model()`; `inject()`.
- Detección de cambios zoneless.
- Control flow nativo (`@if`, `@for`, `@switch`, `@defer`).
- Rutas lazy con `loadComponent`.
- Interoperabilidad RxJS↔Signals (`toSignal`, `toObservable`, `switchMap`).
- Interceptor de API para la URL base y la autenticación definida en el ADR.
- SCSS con tokens globales.
- Accesibilidad WCAG 2.2 AA.

Cualquier desviación del stack requiere aprobación y queda registrada en el plan.

## Artículo 6 — Dependencias

1. Ninguna dependencia se instala sin preguntar. La pregunta indica **el paquete, la versión exacta, el motivo, la alternativa sin dependencia** y si es `dependency` o `devDependency`.
2. Se fijan versiones exactas o con un rango aprobado. Se usa el lockfile.
3. Se prefieren las soluciones nativas de Angular frente a las librerías nuevas.

## Artículo 7 — Mocks

1. Mientras el backend no esté confirmado por el usuario, la UI consume **mocks**.
2. Los mocks se derivan **solo** del contrato OpenAPI seleccionado: mismas rutas, esquemas y códigos.
3. Los datos son ficticios: nunca datos personales reales ni secretos.
4. Pasar al backend real requiere la confirmación explícita del usuario.

## Artículo 8 — Seguridad

1. Sin secretos, tokens ni credenciales en el código, los mocks, los logs o la documentación.
2. Las credenciales de usuario (por ejemplo, Basic Auth) se guardan solo en memoria. Prohibido `localStorage`/`sessionStorage` para credenciales.
3. Sin `innerHTML` con datos externos ni `bypassSecurityTrust*` sin aprobación.
4. Los mensajes de error no filtran información sensible (por ejemplo, "credenciales inválidas" sin indicar qué campo falló).

## Artículo 9 — Calidad y evidencia

1. No se declara "terminado" algo solo porque compila. Se requieren build, lint y pruebas en verde **con la salida real**.
2. Prohibido desactivar pruebas, reglas de lint o validaciones para pasar.
3. Las pruebas funcionales se ejecutan con Playwright MCP sobre los mocks, con capturas reales.

## Artículo 10 — Documentación obligatoria

Por cada Issue, en `spec/planes/<NombreDeIssue>/` (con `<NombreDeIssue>` = `issue-<número>-<titulo-kebab-case>`):

| Archivo | Responsable | Contenido mínimo |
|---|---|---|
| `plan-v<n>.md` | Frontend Developer | Plantilla `spec/templates/plan.template.md`: fuentes, trazabilidad, pasos, dependencias, supuestos, riesgos, aprobación, bitácora de ejecución y desviaciones. |
| `informe-pruebas-v<n>.md` | Frontend Tester | Plantilla `spec/templates/informe-pruebas.template.md`: casos, resultados, salidas reales, defectos y veredicto. |
| `evidencias/v<n>/*.png` | Frontend Tester | Capturas de la interacción web, una o más por caso funcional. |

Además:
- **Versionado:** los planes nunca se sobrescriben. Si la carpeta ya tiene un plan, se crea `plan-v<n+1>.md`, que enlaza la versión anterior. El informe y las evidencias llevan la versión del plan que validan; una revalidación de la misma versión usa el sufijo `-r<k>`.
- **Pruebas unitarias:** las escribe exclusivamente el Frontend Tester. El Frontend Developer no crea ni modifica `*.spec.ts`.
- Los mocks se documentan en `src/app/core/mocks/<contrato>/README.md` (escenarios y cómo provocarlos).
- Cada decisión tomada por el usuario durante la sesión se registra en el `plan-v<n>.md` vigente (sección *Decisiones del usuario*) con fecha.
- Los hallazgos secundarios se registran y no se implementan.

## Artículo 11 — Git

No se hace commit, push, creación de ramas ni PR sin la petición explícita del usuario. Nunca merge.

## Artículo 12 — Comunicación

1. Idioma: español.
2. Se informa qué se hizo, qué falló (con la salida) y qué queda pendiente, sin maquillar resultados.
3. Si algo no se pudo ejecutar o verificar, se dice explícitamente.
