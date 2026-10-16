# Plan de ejecución — Issue #1: H-01: Registro y activación del MVP de wallet

| Campo | Valor |
|---|---|
| Estado | Implementado parcialmente — creación/ingreso listos; CA-02/03/05/06 pendientes de backend; Tester pendiente |
| Versión | v1 (anterior: Ninguna) |
| Fecha de creación | 2026-10-16 |
| Aprobado por / fecha | Usuario, confirmación en chat / 2026-10-16 |
| Agente | Frontend Developer |
| Rama | No definida |

## 1. Fuentes

| Tipo | Referencia | Fecha de lectura |
|---|---|---|
| Issue | [#1 H-01: Registro y activación del MVP de wallet](https://github.com/user-bcp-student26/hackathon/issues/1) | 2026-10-16; sin comentarios |
| ADR | [ADR-001-onboarding-wallet-kyc.md](../../../../hackathon/docs/adr/ADR-001-onboarding-wallet-kyc.md) | 2026-10-16 |
| Contrato seleccionado | [H01-onboarding-wallet-kyc.openapi.yaml](../../../../hackathon/docs/api/H01-onboarding-wallet-kyc.openapi.yaml) | 2026-10-16 |
| Contrato backend | [openapi.yaml](../../../../hackathon-backend/src/main/resources/META-INF/resources/openapi.yaml) | 2026-10-16 |
| Backend y URL de pruebas | [README.md](../../../../hackathon-backend/README.md) | 2026-10-16 |
| CORS | [application.properties](../../../../hackathon-backend/src/main/resources/application.properties) | 2026-10-16 |
| Referencia visual | [aliada-wallet.html](../../../prototipo/aliada-wallet.html) | 2026-10-16 |
| Diseño y stack | [ui-ux-pro-max.prompt.md](../../../.github/prompts/ui-ux-pro-max.prompt.md), [frontend-design/SKILL.md](../../../.github/skills/frontend-design/SKILL.md) | 2026-10-16 |
| Compatibilidad Angular | [angular.dev/reference/versions](https://angular.dev/reference/versions) | 2026-10-16 |
| Paquetes consultados | [@angular/cli@22.2.3](https://www.npmjs.com/package/@angular/cli/v/22.2.3), [@angular-eslint/schematics](https://www.npmjs.com/package/@angular-eslint/schematics) | 2026-10-16 |

## 2. Criterios de aceptación (copia textual de la Issue)

| ID | Criterio |
|---|---|
| CA-01 | El módulo de registro solicita nombre, correo electrónico, celular y contraseña como campos obligatorios. Si falta algún dato o tiene formato inválido, el registro se bloquea y muestra un mensaje accionable para corregirlo. La contraseña se guarda únicamente como hash seguro, nunca en texto plano. |
| CA-02 | Una vez creado el usuario, puede generar su wallet desde la aplicación. La relación es 1 usuario a 1 wallet: cada wallet tiene un identificador único (wallet_id) generado por el sistema y queda asociada exclusivamente a ese usuario, en estado activo. |
| CA-03 | Dentro de la aplicación existe una sección para registrar contactos. Para registrar un contacto son obligatorios el nombre, el celular y el wallet_id que el contacto comparte; si falta alguno, el registro se bloquea con un mensaje accionable. El wallet_id debe corresponder a una wallet existente y se almacena con el contacto como clave para identificar a quién se envía dinero en pagos futuros. |
| CA-04 | El backend expone endpoints para el registro de usuario y para la autenticación, con persistencia de usuarios y credenciales en base de datos. El endpoint de autenticación valida correo y contraseña y devuelve una sesión o token válido; si las credenciales son incorrectas, responde con error sin indicar cuál de los dos campos falló. |
| CA-05 | El backend expone un endpoint de verificación KYC, consumible solo por un usuario autenticado, que recibe los datos de identidad requeridos y registra el resultado de la verificación (aprobado, rechazado o pendiente). |
| CA-06 | Si la verificación KYC es aprobada, la wallet del usuario queda habilitada para pagos de bajo monto. Si es rechazada o queda pendiente, la wallet permanece sin habilitar para pagos y el usuario recibe un mensaje accionable con el siguiente paso. |
| CA-07 | Para este MVP, la base de datos puede ser en memoria (H2), siempre que los datos de usuarios, credenciales, wallets y contactos se gestionen mediante la misma capa de persistencia que usaría una base de datos persistente. |

## 3. Matriz de trazabilidad

| CA | Decisión del ADR | Endpoint (contrato) | Componente / servicio | Prueba |
|---|---|---|---|---|
| CA-01 | Validación cliente/servidor; bcrypt solo en backend | `POST /users` (201, 400, 409) | Registro, formulario tipado y `UserService` | Formatos, obligatorios, 201 y errores del contrato; agente Tester |
| CA-02 | Una wallet por usuario, UUID v4, `active`; crear sin KYC | No disponible en el backend actual | `WalletPage` informativa; sin servicio HTTP | Verificar que no haya request; implementación pendiente de endpoint |
| CA-03 | Contactos pertenecen a usuario y guardan wallet_id existente | No disponible en el backend actual | `ContactsPage` informativa; sin servicio HTTP | Verificar que no haya request; implementación pendiente de endpoint |
| CA-04 | Basic Auth sobre HTTPS, genérico en 401; decisión del usuario en CA-04 de la Issue | `POST /auth/login` (200, 401) | Ingreso, guard e `AuthService` | Aceptación de credenciales y error genérico; agente Tester |
| CA-05 | KYC autenticado; campos previstos por el contrato, sin endpoint en backend actual | No disponible en el backend actual | Estado informativo dentro de `WalletPage`; sin formulario ni servicio HTTP | Verificar que no haya request; implementación pendiente de endpoint |
| CA-06 | Solo KYC `approved` habilita pagos | No disponible en el backend actual | Estado informativo dentro de `WalletPage`; sin request de wallet/KYC | Pendiente de endpoints de wallet/KYC |
| CA-07 | Persistencia SQLite definida por ADR; gestión de datos es backend | No aplica en frontend | No aplica | Fuera del alcance frontend; no modificar backend |

## 4. Conflictos detectados entre fuentes

| Conflicto | Fuente A | Fuente B | Resolución del usuario |
|---|---|---|---|
| CA-04 pide sesión/token; ADR elige HTTP Basic Auth y declara la desviación | Issue #1, CA-04 | ADR-001, secciones “Autenticación y sesión” y “Pendientes antes de implementar” | Aceptar Basic Auth para el frontend; decisión previa del usuario, 2026-10-16. No se almacenan credenciales fuera de memoria. |
| Requisitos KYC pendientes de cumplimiento, mientras OpenAPI enumera cuatro campos | ADR-001, “Pendientes antes de implementar” | `KycRequest`: `documentType`, `documentNumber`, `fullName`, `birthDate`; enum DNI/CE/PASSPORT | Usar provisionalmente los cuatro campos exactos del contrato para este MVP; decisión del usuario, 2026-10-16. |
| El `servers` del OpenAPI es una URL de referencia con `/v1`; README documenta el host real y ejemplos en raíz | Contrato: `https://api.example.com/v1`, marcado como reemplazable | README: host ngrok y ejemplos `.../users`, `.../auth/login` | Usar el host raíz concreto del README y las rutas OpenAPI sin agregar `/v1`; la dirección es temporal y se revalidará al comenzar. |
| CA-07 menciona H2 como opción y ADR elige SQLite | Issue permite H2; ADR selecciona SQLite | No contradictorio: H2 es permisible, no obligatorio | Sin cambio frontend; backend fuera de alcance. |
| El contrato H01 describe además wallet, contactos y KYC, pero no están disponibles en el backend actual | OpenAPI enumera `GET/POST /wallet`, `/contacts` y `/kyc/verifications` | El usuario confirma que hoy solo existen registro e ingreso | Consumir únicamente `POST /users` y `POST /auth/login`; mantener las demás páginas como informativas y no llamar esos endpoints. Decisión del usuario, 2026-10-16. |

## 5. Estado del entorno

| Herramienta | Versión requerida | Versión detectada | Evidencia |
|---|---|---|---|
| Node.js | Compatible con Angular 22 | 26.9.0 | `node --version`; Angular 22.0.x admite `^26.0.0` según angular.dev |
| npm | No fijada por ADR | 11.19.1 | `npm --version` |
| Angular CLI global | 22.2.3 para generación | 22.1.8 | `ng version`; se usará CLI 22.2.3 aprobada, no la global |
| App Angular/package.json | Angular 22.2.3 | Angular 22.2.3 instalado | `npx ng version`; `package.json`; scaffold creado durante esta ejecución |
| Python | Python 3 para skill UI/UX | 3.12.10 | `python --version` |
| Backend | URL pública de pruebas elegida | No comprobada en vivo | README advierte que ngrok depende del túnel activo |
| CORS | Origen de desarrollo | Habilitado para `http://localhost:4200` | `application.properties`; si cambia el puerto, detenerse y resolverlo |

## 6. Dependencias a instalar

| Paquete | Versión | Tipo | Motivo | Alternativa sin dependencia | Decisión del usuario |
|---|---|---|---|---|---|
| `@angular/cli` | 22.2.3 | devDependency / CLI de scaffolding | Crear app y alinear con ADR; la versión está publicada en npmjs | La CLI global 22.1.8 no cumple la versión exigida | Aprobada para el plan, 2026-10-16; instalar/ejecutar solo al confirmar inicio de desarrollo |
| `@angular-eslint/schematics` | 22.6.0 | devDependency | Configurar el target lint exigido por el flujo | No agregar linter; detenerse si el scaffold no incluye `lint` | Instalada con aprobación condicional cumplida; schematic confirmó Angular-eslint v22 para Angular v22 |
| GSAP | No aplica | — | No se requiere animación compleja; usar transiciones CSS discretas | CSS y `prefers-reduced-motion` | No instalar |
| Librerías de pruebas | No propuestas | — | Las pruebas unitarias son responsabilidad del Frontend Tester | Runner generado por CLI; confirmar al revisar el scaffold | No instalar en este plan |

## 7. Diseño de la solución

- **Conexión:** `environment.development.ts` conserva la URL de pruebas y `useMocks = false`; producción mantiene `apiBaseUrl = ''`. La integración actual solo usa `POST /users` y `POST /auth/login`; no llamar wallet, KYC ni contactos aunque estén descritos en el contrato. CORS contempla `localhost:4200`.
- **Rutas:** `/ingresar`, `/registro`, `/wallet` y `/contactos`; proteger el workspace con guard funcional. Registro público. Wallet/contactos se mantienen como rutas informativas sin requests al cargar.
- **Componentes:** ingreso y registro funcionales; wallet/contactos muestran “función no disponible” hasta que el backend implemente sus endpoints.
- **Servicios/estado:** servicio de usuario y sesión Basic Auth solo para crear cuenta e ingresar; credenciales solo en memoria y borradas al cerrar sesión. No usar Web Storage, cookies del cliente ni logs para credenciales.
- **HTTP/modelos:** interceptor funcional para Basic Auth en solicitudes protegidas; errores 401 genéricos. Wallet, KYC y contactos no tienen formularios activos ni hacen requests.
- **Dirección visual:** tomar como base el prototipo ALiaDA: fondo `#F2F4F9`, superficies blancas, navy `#0E2A66`/rail `#0A1B40`, acento naranja `#FF6A2B`; Bricolage Grotesque para display, Figtree para cuerpo y JetBrains Mono para IDs. Panel de marca oscuro junto al formulario en escritorio; flujo apilado en móvil; tokens SCSS, foco visible, etiquetas asociadas, errores anunciados y movimiento reducido.
- **Revisión de skills:** el resultado local de UI/UX sugirió un patrón landing de “Trust & Authority + Conversion”, paleta oro/púrpura e IBM Plex; se descarta por no corresponder al flujo real ni a la referencia. Se conserva solo la guía pertinente de formularios simples, contraste, foco y responsive. `frontend-design` exige revisar la propuesta antes de implementar; esta dirección queda sujeta a la aprobación del plan.
- **Interacciones:** CSS nativo discreto; GSAP no aplica.

## 8. Mocks

| Endpoint | Escenario | Entrada que lo provoca | Respuesta |
|---|---|---|---|
| No aplica al modo elegido | Backend público de pruebas seleccionado | No aplica | No crear mocks ni cambiar silenciosamente a ellos. Si el backend no responde, detenerse y preguntar antes de cambiar el modo. |

No usar datos personales reales. Las validaciones de integración, si se autorizan al comenzar, emplearán datos ficticios en la base de pruebas.

## 9. Pasos de ejecución

| # | Paso | Archivos | Comando | Estado |
|---|---|---|---|---|
| 1 | Confirmar opciones y dry-run del CLI; revisar colisiones, sin escribir archivos | Raíz del frontend | `npx @angular/cli@22.2.3 new --help`; `npx @angular/cli@22.2.3 new hackathon-frontend --directory . --skip-git --style=scss --skip-tests --routing --zoneless --defaults --skip-install --dry-run` | Hecho: opciones confirmadas; dry-run sin escrituras y sin colisiones |
| 2 | Crear app Angular; no sobrescribir archivos existentes | `angular.json`, `package.json`, `src/`, `tsconfig*`, `.prettierrc`, `.editorconfig`, `.gitignore`, `README.md`, `public/`, `.vscode/extensions.json`, `.vscode/launch.json`, `.vscode/tasks.json` | `npx @angular/cli@22.2.3 new hackathon-frontend --directory . --skip-git --style=scss --skip-tests --routing --zoneless --defaults --package-manager npm` | Hecho; CLI creó el scaffold y npm instaló dependencias |
| 3 | Configurar base URL por entorno y bloquear requests sin host | `src/environments/`, interceptor API | Desarrollo: URL ngrok y `useMocks=false`; producción: base vacía con error de configuración | Hecho |
| 4 | Instalar y configurar linter tras verificar rango de Angular DevKit | `package.json`, `angular.json`, `eslint.config.js` | `ng add @angular-eslint/schematics@22.6.0 --defaults` | Hecho; target `lint` configurado y pasó |
| 5 | Implementar modelos, servicios HTTP, Basic Auth en memoria, guard e interceptor solo para endpoints disponibles | `src/app/core/`, `src/app/features/auth/` | Sin comando adicional | Hecho |
| 6 | Implementar registro/ingreso; mantener wallet/contactos como estados informativos sin requests | Páginas auth, wallet y contactos | Sin comando adicional | Hecho; no inicializa servicios de endpoints ausentes |
| 7 | Ejecutar build/lint y validar que no hay tráfico a endpoints ausentes | Proyecto Angular | `npm run build`, `npx ng lint`, Playwright/network | Build/lint en verde; comprobación de red de esta corrección pendiente |
| 8 | Iniciar servidor para revisión; entregar URL local y ofrecer handoff al Frontend Tester | Proyecto Angular | `ng serve --port 4200` | Hecho; smoke visual en login/registro y guard; pruebas funcionales del Tester pendientes |

## 10. Supuestos y preguntas abiertas

| # | Supuesto / pregunta | Resolución |
|---|---|---|
| 1 | El backend actual implementa crear cuenta e ingresar; el usuario confirmó que `GET /wallet` no existe. | Limitar requests a `POST /users` y `POST /auth/login`; mantener wallet, contactos y KYC informativos hasta que existan endpoints. |
| 5 | No se proporcionó host de producción y el host de pruebas es temporal. | Producción queda sin host; el interceptor no enviará requests hasta configurar una URL aprobada. |
| 2 | El endpoint de login responde con `User`, no con sesión/token; Basic Auth se envía en cada solicitud protegida. | Decisión previa del usuario: Basic Auth. Tras registro, proponer pantalla de ingreso explícito; no asumir auto-login ni persistir credenciales. |
| 3 | El contrato no define al proveedor KYC ni sus reglas internas; además el endpoint KYC no está disponible actualmente. | No integrar ni capturar datos KYC hasta que exista endpoint. |
| 4 | El backend actual no ofrece endpoints para wallet, contactos ni KYC. | No activar sus métodos HTTP; esperar a que el backend implemente esos endpoints. |

## 11. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| URL ngrok temporal o backend apagado | Registro/ingreso podrían no conectar | Conservar URL solo en desarrollo; detener y reportar si los dos endpoints disponibles fallan |
| Basic Auth repite contraseña en requests | Exposición ante transporte/logs inseguros | Usar HTTPS; mantener credenciales solo en memoria; no registrar headers ni valores |
| El Issue/OpenAPI describen funciones sin endpoint implementado | El usuario puede esperar wallet/KYC/contactos activos | Mostrar estado informativo; no emitir requests y marcar los CA correspondientes pendientes de backend |
| Base de pruebas persiste datos | Cuentas/contactos ficticios quedan guardados | Usar únicamente datos sintéticos, correos `mock.test` y no enviar datos personales |
| CLI/scaffold puede tocar archivos existentes | Pérdida de configuración | Dry-run tras autorización y detenerse ante colisiones |
| CORS limitado a `localhost:4200` | Requests bloqueados si se usa otro origen | Ejecutar servidor en puerto 4200; si no está disponible, parar y solicitar resolución |

## 12. Decisiones del usuario

| Fecha | Decisión |
|---|---|
| 2026-10-16 | Aceptar Basic Auth para el frontend pese a la diferencia textual de CA-04; credenciales solo en memoria. |
| 2026-10-16 | Usar la URL pública temporal vigente del README como base de integración. |
| 2026-10-16 | Usar `documentType`, `documentNumber`, `fullName` y `birthDate` del contrato como esquema KYC provisional. Supersedida: no integrar KYC hasta que el endpoint exista. |
| 2026-10-16 | Incluir `@angular/cli@22.2.3` para scaffolding; no ejecutar hasta confirmar inicio de desarrollo. |
| 2026-10-16 | Autorizar `@angular-eslint/schematics@22.6.0` solo sujeto a verificación de compatibilidad; si no se confirma, detenerse. |
| 2026-10-16 | Guardar este plan y esperar confirmación separada antes de iniciar desarrollo. |
| 2026-10-16 | Aprobar mini-plan: ngrok solo en desarrollo; producción sin host y con requests bloqueados hasta aprobación de URL real. |
| 2026-10-16 | Se intentó `GET /wallet` por la ruta descrita en OpenAPI; el usuario aclaró que ese endpoint no existe actualmente. No volver a solicitarlo. |
| 2026-10-16 | Confirmar que el backend actual solo tiene dos endpoints: crear cuenta e ingresar; `GET /wallet` no existe. |
| 2026-10-16 | Aprobar mantener wallet y contactos visibles pero informativos; no invocar endpoints wallet/contactos/KYC hasta que estén disponibles. Esta decisión supersede la integración prevista anteriormente para esas pantallas. |

## 13. Bitácora de ejecución

| Fecha | Acción | Resultado (salida real resumida) |
|---|---|---|
| 2026-10-16 | Lectura de Issue, ADR, OpenAPI, README backend, CORS, prototipo y configuración del frontend | Issue abierta; sin comentarios; app y `package.json` ausentes; CORS habilitado para `localhost:4200` |
| 2026-10-16 | Consultas de entorno | Python 3.12.10; Node 26.9.0; npm 11.19.1; Angular CLI global 22.1.8 |
| 2026-10-16 | Consulta local UI/UX | Primer resultado genérico de landing descartado; reintento también genérico; dirección final subordinada al prototipo |
| 2026-10-16 | Validación de CLI Angular | `npx @angular/cli@22.2.3 new --help` confirmó `--dry-run`, `--skip-tests`, `--style`, `--routing` y `--zoneless`; npmjs confirma versión 22.2.3 |
| 2026-10-16 | Dry-run del scaffold | Sin cambios escritos. Archivos propuestos: configuración Angular/TypeScript, `package.json`, `README.md`, `src/`, `public/` y tres archivos `.vscode`. La carpeta existente solo contiene `.vscode/mcp.json`, no listado por el dry-run. Angular informó analytics global habilitado; no se cambió configuración global. |
| 2026-10-16 | Creación del scaffold | `ng new` creó los archivos listados por el dry-run; salida: “Packages installed successfully.” `.vscode/mcp.json` se conservó. |
| 2026-10-16 | Verificación Angular | `npx ng version`: Angular CLI 22.2.3, Angular 22.2.3, Node 26.9.0, npm 11.19.1. |
| 2026-10-16 | Generación de entornos | `ng generate environments --defaults`: creó `src/environments/environment.ts` y `environment.development.ts`, y actualizó `angular.json` con reemplazo de archivos. |
| 2026-10-16 | Compatibilidad ESLint | npm devuelve `@angular-devkit/core` y `@angular-devkit/schematics` en `>=22.0.0 <23.0.0`; ambos incluyen la versión Angular 22.2.3. |
| 2026-10-16 | Instalación ESLint | `ng add @angular-eslint/schematics@22.6.0 --defaults`: schematic confirmó angular-eslint v22 con workspace Angular v22; creó `eslint.config.js` y actualizó `package.json`/`angular.json`. |
| 2026-10-16 | Validación lint | `npx ng lint`: “All files pass linting.” |
| 2026-10-16 | Build inicial | `npm run build`: Application bundle generation complete; salida en `dist/hackathon-frontend`. |
| 2026-10-16 | Servicios API | `npm run build`: Application bundle generation complete. `npx ng lint`: “All files pass linting.” Modelos/servicios para registro, wallet, contactos y KYC; no se enviaron datos. |
| 2026-10-16 | Registro e ingreso | Build y lint pasan. Registro valida el contrato y muestra éxito antes de login explícito; no conserva contraseña tras respuesta. Login muestra error genérico para 401. |
| 2026-10-16 | Disponibilidad/CORS backend | `OPTIONS` devolvió HTTP 200, pero no confirmó la API. `GET /wallet` sin Authorization devolvió la página interstitial de ngrok; no se enviaron datos. |
| 2026-10-16 | Reintento backend | Se releyó README (misma URL) y se reintentó `GET /wallet`; HTTP 200 `text/plain`, body inicia “You are about to visit opulently-crowd-watch.ngrok-free…”. Integración detenida. |
| 2026-10-16 | Reintento tras renovación | README mantuvo `https://opulently-crowd-watch.ngrok-free.dev`; `GET /wallet` siguió devolviendo HTTP 200 `text/plain` con el interstitial ngrok. No se enviaron credenciales ni datos. |
| 2026-10-16 | Smoke visual Playwright | `/ingresar` y `/registro` cargaron; móvil 375×812, validación vacía visible; `/wallet` sin sesión redirige a ingreso; 0 errores de consola. No se envió registro válido. |
| 2026-10-16 | Guardado del plan | `plan-v1.md` creado y verificado; estado actualizado a En ejecución |
| 2026-10-16 | Guard y navegación protegida | Wallet/contactos requieren credenciales en memoria; logout las limpia; un 401 redirige a ingreso. |
| 2026-10-16 | Pantallas wallet/KYC/contactos | Implementados endpoints del contrato, estado `payments_enabled`, resultados KYC y validaciones de contacto; no se enviaron requests con datos. |
| 2026-10-16 | Build/lint final del bloque UI | `npm run build`: Application bundle generation complete. `npx ng lint`: “All files pass linting.” |
| 2026-10-16 | Ajuste al alcance del backend | Desactivada la inicialización de wallet/contactos; ambas pantallas muestran indisponibilidad y no llaman servicios. Registro/login conservados. |
| 2026-10-16 | Validación tras limitar endpoints | `npm run build`: Application bundle generation complete. `npx ng lint`: “All files pass linting.” |
| 2026-10-16 | Confirmación de endpoints disponibles | El usuario confirmó que el backend actual expone solo creación e ingreso; `GET /wallet` no existe. Wallet/contactos/KYC quedan visibles pero sin requests. |
| 2026-10-16 | Verificación de rutas tras el ajuste | Navegar sin sesión a `/wallet` redirige a `/ingresar`; consola sin errores. El flujo post-login no se ejercitó con credenciales, pero las páginas quedan en estado informativo y no inicializan llamadas. |

## 14. Desviaciones del plan
| Fecha | Desviación | Motivo | Aprobada |
|---|---|---|---|
| 2026-10-16 | Separar URL temporal por entorno y bloquear API si producción no tiene host | Evitar que el build de producción envíe datos a la base pública temporal | Sí; usuario eligió la opción “Solo desarrollo; producción sin host” |
| 2026-10-16 | Mantener wallet/contactos como páginas informativas sin requests; no integrar KYC | El backend solo implementa registro e ingreso | Sí; mini-plan aprobado por el usuario |

## 15. Hallazgos secundarios (fuera de alcance)

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| El prototipo incluye funciones y datos de prueba más allá del alcance H-01. | `prototipo/aliada-wallet.html` | No copiar funciones W2–W6 ni datos demostrativos; implementar solo registro, autenticación, wallet, KYC y contactos requeridos. |
| La política de proveedor KYC y sus reglas finales sigue pendiente en ADR-001. | ADR-001, “Pendientes antes de implementar” | Integración limitada al contrato aprobado; no se implementan reglas de proveedor. |

## 16. Cierre

| CA | Implementado en | Prueba | Estado |
|---|---|---|---|
| CA-01 | `RegistrationPage` y `UserService` | Pendiente de Frontend Tester | Implementado — pendiente de pruebas |
| CA-02 | No implementado; endpoint wallet ausente | No aplica hasta que exista endpoint | Pendiente de backend real |
| CA-03 | No implementado; endpoints de contactos ausentes | No aplica hasta que existan endpoints | Pendiente de backend real |
| CA-04 | `LoginPage`, `AuthSessionService` y `apiInterceptor` | Pendiente de Frontend Tester | Implementado con desviación Basic Auth aprobada — pendiente de pruebas |
| CA-05 | No implementado; endpoint KYC ausente | No aplica hasta que exista endpoint | Pendiente de backend real |
| CA-06 | No implementado; endpoints wallet/KYC ausentes | No aplica hasta que existan endpoints | Pendiente de backend real |
| CA-07 | Backend; fuera del alcance frontend | No aplica a este plan | No aplicable |
