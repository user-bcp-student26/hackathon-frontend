# Plan de ejecución — Issue #1: H-01: Registro y activación del MVP de wallet

| Campo | Valor |
|---|---|
| Estado | Implementado; validación autenticada y Frontend Tester pendientes; empaquetado backend bloqueado por dependencia no descargable |
| Versión | v2 (anterior: [plan-v1.md](./plan-v1.md)) |
| Fecha de creación | 2026-10-16 |
| Aprobado por / fecha | Usuario / 2026-10-16 |
| Agente | Frontend Developer |
| Rama | No definida |

## 1. Fuentes

| Tipo | Referencia | Fecha de lectura |
|---|---|---|
| Issue | [#1 H-01: Registro y activación del MVP de wallet](https://github.com/user-bcp-student26/hackathon/issues/1) | 2026-10-16 |
| ADR | [ADR-001-onboarding-wallet-kyc.md](../../../../hackathon/docs/adr/ADR-001-onboarding-wallet-kyc.md) | 2026-10-16 |
| Contrato backend | [openapi.yaml](../../../../hackathon-backend/src/main/resources/META-INF/resources/openapi.yaml) | 2026-10-16 |
| README backend | [README.md](../../../../hackathon-backend/README.md) | 2026-10-16 |
| Configuración CORS backend | [application.properties](../../../../hackathon-backend/src/main/resources/application.properties) | 2026-10-16 |
| Plan previo | [plan-v1.md](./plan-v1.md); v2 amplía el alcance para activar contactos conforme a la solicitud actual del usuario | 2026-10-16 |

## 2. Criterios de aceptación (copia textual de la Issue)

| ID | Criterio |
|---|---|
| CA-03 | Dentro de la aplicación existe una sección para registrar contactos. Para registrar un contacto son obligatorios el nombre, el celular y el wallet_id que el contacto comparte; si falta alguno, el registro se bloquea con un mensaje accionable. El wallet_id debe corresponder a una wallet existente y se almacena con el contacto como clave para identificar a quién se envía dinero en pagos futuros. |

## 3. Matriz de trazabilidad

| CA | Decisión del ADR | Endpoint (contrato) | Componente / servicio | Prueba |
|---|---|---|---|---|
| CA-03 | Contactos con nombre, celular y wallet_id obligatorios; el backend es fuente de verdad; endpoints protegidos con HTTP Basic Auth. | `GET /contacts` devuelve `Contact[]`; `POST /contacts` recibe `ContactRequest`, devuelve `201 Contact` y define errores `400`, `401` y `422`. | `ContactsPage`, `ContactsService`, `ContactRequest`, `Contact`, interceptor de API. | Build y lint; inspección funcional de carga, validaciones y mensajes existentes. No hacer POST remoto de prueba por persistencia de datos. |

## 4. Conflictos detectados entre fuentes

| Conflicto | Fuente A (cita) | Fuente B (cita) | Resolución del usuario |
|---|---|---|---|
| El formato de `wallet_id` difiere. | ADR-001, sección Wallet: `wallet_id` UUID v4. | OpenAPI, `ContactRequest`: patrón `^wallet_[0-9a-f]{16}$`, longitud 23; el README backend documenta el mismo formato. | El usuario indicó que el OpenAPI es el contrato del backend. Se usará el formato del OpenAPI. |
| La URL de servidor OpenAPI es referencial. | OpenAPI: `https://api.example.com/v1`, descrita como entorno de referencia a reemplazar. | README backend: URL temporal de ngrok y ejemplos de rutas en la raíz. | Usar la URL pública temporal seleccionada por el usuario y rutas sin prefijo `/v1`. |
| El plan v1 mantiene contactos inactivos debido al estado del backend conocido entonces. | [plan-v1.md](./plan-v1.md), decisiones del usuario y CA-03. | Solicitud actual: habilitar «Mis contactos» usando OpenAPI como contrato backend. | La instrucción actual del usuario supersede para contactos el acuerdo anterior; no se modifica plan-v1. |

## 5. Estado del entorno

| Herramienta | Versión requerida | Versión detectada | Evidencia |
|---|---|---|---|
| Node.js | Compatible con Angular 22.2.3 | 26.9.0 | `node --version`, 2026-10-16 |
| npm | Según el proyecto | 11.19.1 | `npm --version`, 2026-10-16 |
| Angular CLI | 22.2.3 | 22.2.3 | `ng version` local, 2026-10-16 |
| Angular | 22.2.3 | 22.2.3 | `ng version` local, 2026-10-16 |

## 6. Dependencias a instalar

No aplica. Se reutilizan Angular `HttpClient`, Reactive Forms y dependencias instaladas.

## 7. Diseño de la solución

- **Rutas:** conservar la ruta protegida `/contactos`.
- **Componentes:** habilitar la pantalla existente, eliminar el estado fijo de indisponibilidad y cargar los contactos al inicializarla.
- **Servicios / estado (signals):** reutilizar `ContactsService` (`GET/POST /contacts`) y los signals ya existentes en `ContactsPage`.
- **Interceptores / guards:** reutilizar guard e interceptor Basic Auth; credenciales solo en memoria.
- **Modelos (desde el contrato OpenAPI):** reutilizar `Contact` y `ContactRequest`, ya definidos con los campos del contrato.
- **Validaciones:** nombre requerido, máximo 120 caracteres; celular requerido con patrón `^\+?[0-9]{9,15}$`; wallet_id requerido, longitud 23 y patrón `^wallet_[0-9a-f]{16}$`.
- **UI/UX (`ui-ux-pro-max`, `frontend-design`):** conservar la UI, responsive y estados accesibles existentes; no proponer rediseño.
- **Interacciones (`gsap-core`):** No aplica; no se necesitan animaciones.
- **Recursos no instalados:** `ui-ux-pro-max`, `frontend-design` y `code-review-skill`. El usuario autorizó continuar sin ellos.
- **Conexión:** backend público temporal `https://opulently-crowd-watch.ngrok-free.dev`; `environment.development.ts` ya usa esa URL y `useMocks: false`. Configurar la misma URL en `environment.ts` conforme al plan aprobado para que producción tampoco carezca de base URL.
- **CORS ngrok:** la solicitud del interceptor incluye `ngrok-skip-browser-warning`; se permite esta cabecera en `quarkus.http.cors.headers` para habilitar el preflight del navegador.

## 8. Mocks

No aplica: el usuario eligió el backend público real; no se agregarán mocks ni se cambiará silenciosamente el modo.

## 9. Pasos de ejecución

| # | Paso | Archivos | Comando | Estado |
|---|---|---|---|---|
| 1 | Guardar plan v2 sin modificar el plan v1 | `spec/planes/issue-1-registro-y-activacion-del-mvp-de-wallet/plan-v2.md` | — | Hecho |
| 2 | Alinear validación del wallet_id con OpenAPI y cargar la lista al abrir la página | `src/app/features/contacts/contacts.page.ts` | — | Hecho |
| 3 | Retirar el mensaje de indisponibilidad y activar el contenido ya existente | `src/app/features/contacts/contacts.page.html` | — | Hecho |
| 4 | Configurar la URL pública seleccionada para compilación de producción | `src/environments/environment.ts` | — | Hecho |
| 5 | Permitir la cabecera ngrok usada por el interceptor en CORS | `hackathon-backend/src/main/resources/application.properties` | — | Hecho (mini-plan aprobado) |
| 6 | Ejecutar build/lint y validar el preflight remoto; intentar empaquetar backend | Frontend y backend | `npm run build`; `npm run lint`; `mvn -q -DskipTests package`; `OPTIONS /contacts` | Frontend y preflight en verde; empaquetado backend bloqueado por dependencia Maven no disponible |

## 10. Supuestos y preguntas abiertas

| # | Supuesto / pregunta | Resolución |
|---|---|---|
| 1 | La URL ngrok es temporal y puede dejar de responder. | Aceptado por el usuario al seleccionarla; se documenta el riesgo. |
| 2 | La API requiere credenciales Basic Auth para listar y registrar contactos. | Reutilizar la sesión autenticada en memoria y el interceptor existente; no inventar credenciales. |
| 3 | El formato requerido para wallet_id es el del OpenAPI aunque difiera del ADR. | Resuelto por la instrucción explícita del usuario de usar OpenAPI como contrato. |
| 4 | El GET público de `/contacts` responde sin credenciales. | La respuesta observada fue HTTP 401 JSON (`UNAUTHORIZED`), lo que confirma que la ruta está detrás de autenticación. No se validó el listado autenticado ni se ejecutó un POST. |
| 5 | No se hallaron archivos `*.spec.ts` existentes y el agente de implementación no crea pruebas según las instrucciones del proyecto. | No crear ni modificar specs; agente Frontend Tester pendiente. |
| 6 | El empaquetado local del backend no pudo resolver `at.favre.lib:bcrypt:0.10.2` porque Maven Central agotó el tiempo de conexión. | El cambio de CORS es una propiedad; el preflight del backend público devolvió 200 con las cabeceras requeridas. Informar que el paquete local no se verificó. |

## 11. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| URL ngrok temporal | El API puede quedar inaccesible al cambiar el túnel. | Configurar por entorno, no fijarla en el servicio, e informar que la URL expira. |
| Conflicto ADR/OpenAPI sobre wallet_id | El servidor podría rechazar IDs si no sigue el contrato. | Aplicar patrón OpenAPI, mostrar el error API existente y registrar la discrepancia. |
| Build/lint no verifican el listado autenticado ni la creación remota | No se confirma el recorrido integrado autenticado completo. | Se verificó solo que GET `/contacts` alcanza el backend y devuelve 401 sin credenciales; no afirmar que el flujo autenticado está probado. |

## 12. Decisiones del usuario

| Fecha | Decisión |
|---|---|
| 2026-10-16 | Seleccionar backend público temporal `https://opulently-crowd-watch.ngrok-free.dev`. |
| 2026-10-16 | Continuar sin `ui-ux-pro-max`, `frontend-design` y `code-review-skill`, no disponibles en el workspace. |
| 2026-10-16 | Usar el archivo OpenAPI indicado como contrato del backend y, por ello, el patrón `wallet_` + 16 caracteres hexadecimales. |
| 2026-10-16 | Aprobar plan v2 y proceder con los cambios después de conocer que existe plan-v1 y que no se sobrescribirá. |

## 13. Bitácora de ejecución

| Fecha | Acción | Resultado (salida real resumida) |
|---|---|---|
| 2026-10-16 | Verificar versiones con `node --version`, `npm --version` y `ng version` local. | Node `v26.9.0`, npm `11.19.1`, Angular CLI `22.2.3`, Angular `22.2.3`. |
| 2026-10-16 | Leer plan-v1 y preparar esta versión incremental. | Plan-v1 conservado; plan-v2 aprobado por el usuario. |
| 2026-10-16 | Intentar ejecutar la implementación con el agente de desarrollo solicitado. | La herramienta de agentes devolvió HTTP 400: el modelo configurado no está accesible mediante `/chat/completions`; no se ejecutó el subagente. |
| 2026-10-16 | Habilitar la página conservando `WALLET_ID_PATTERN`, importar `OnInit` para cargar los contactos y alinear maxLength/mensaje al OpenAPI. | Cambios en `contacts.page.ts` y `contacts.page.html`; se conserva el patrón compartido `^wallet_[0-9a-f]{16}$`. |
| 2026-10-16 | Configurar base URL de producción elegida por el usuario. | `environment.ts` ahora apunta a `https://opulently-crowd-watch.ngrok-free.dev`; desarrollo ya apuntaba a la misma URL. |
| 2026-10-16 | `npm run build`. | Éxito: “Application bundle generation complete.”; chunk lazy `contacts-page` generado. |
| 2026-10-16 | `npm run lint`. | Éxito: “All files pass linting.” |
| 2026-10-16 | Revisar errores de editor en los tres archivos editados. | No se encontraron errores. |
| 2026-10-16 | GET sin credenciales a `/contacts`, con `ngrok-skip-browser-warning: true`. | HTTP 401 JSON: `{"code":"UNAUTHORIZED","message":"No autenticado o credenciales incorrectas"}`; no se enviaron credenciales ni se crearon datos. |
| 2026-10-16 | Inspeccionar el CORS local al confirmar el uso de la cabecera ngrok. | La propiedad permitía `Content-Type,Authorization` pero no `ngrok-skip-browser-warning`; se detuvo la implementación y se pidió aprobación para corregirlo. |
| 2026-10-16 | Mini-plan aprobado para agregar la cabecera al CORS del backend. | Se actualizó `quarkus.http.cors.headers` en `application.properties`, sin alterar otros valores. |
| 2026-10-16 | Validar preflight remoto de `/contacts` para `localhost:4200`. | HTTP 200; `Access-Control-Allow-Headers` incluye `Content-Type,Authorization,ngrok-skip-browser-warning`; métodos `GET,POST,OPTIONS`. |
| 2026-10-16 | `mvn -q -DskipTests package` en backend. | Falló al resolver `at.favre.lib:bcrypt:0.10.2`; Maven Central agotó conexión. No se instalaron dependencias ni se modificó el manifiesto. |

## 14. Desviaciones del plan

| Fecha | Desviación | Motivo | Aprobada |
|---|---|---|---|
| 2026-10-16 | Crear plan-v2 en vez de plan-v1. | Ya existe plan-v1; no se sobrescribe. | Sí; usuario aprobó plan v2. |
| 2026-10-16 | Implementar directamente tras no poder iniciar el agente requerido por error del runtime. | El modelo del agente no es accesible desde el endpoint de delegación. Se mantuvo el alcance y se siguió el plan aprobado. | Limitación de herramienta; reportada en bitácora. |
| 2026-10-16 | Agregar `ngrok-skip-browser-warning` a la lista de cabeceras CORS. | El interceptor ya enviaba la cabecera y sin permitirla el navegador no puede completar preflight. | Sí; mini-plan aprobado por el usuario. |

## 15. Hallazgos secundarios (fuera de alcance)

| Hallazgo | Evidencia | Impacto |
|---|---|---|
| El plan v1 registra decisiones previas para mantener contactos sin solicitudes hasta que se confirmara el endpoint. | [plan-v1.md](./plan-v1.md) | Esta ejecución supersede esa decisión solo para la feature de contactos y no modifica su historial. |
| No se encontraron pruebas unitarias en `src`; el agente Frontend Tester no está disponible como herramienta de esta sesión. | Inspección de archivos del frontend y herramientas disponibles. | No se crearán capturas ni informe funcional como si se hubieran ejecutado. |

## 16. Cierre

| CA | Implementado en | Prueba | Estado |
|---|---|---|---|
| CA-03 | `src/app/features/contacts/contacts.page.ts`, `contacts.page.html`, `src/environments/environment.ts`; `hackathon-backend/src/main/resources/application.properties` (CORS) | Build/lint frontend en verde; GET `/contacts` sin credenciales devolvió 401 esperado; preflight remoto 200 con cabecera CORS permitida. Sin sesión ni POST real. El empaquetado backend no se pudo verificar por timeout de Maven Central. | Implementado — pendiente de validación autenticada y Frontend Tester |
