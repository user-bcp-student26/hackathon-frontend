---
applyTo: "src/app/core/mocks/**"
description: Reglas para crear mocks a partir del contrato OpenAPI.
---

# Reglas de mocks

1. **Fuente única:** el contrato OpenAPI seleccionado en `../hackathon/docs/api/`. Cada handler cita en un comentario `operationId` o `MÉTODO /ruta` del contrato.
2. **Sin invenciones:** solo los campos, tipos, enums y códigos de respuesta definidos en el contrato. Si el contrato no tiene ejemplos, genera valores ficticios coherentes con el esquema y márcalos como `// ficticio`.
3. **Implementación por defecto:** el interceptor funcional `mockApiInterceptor` (`HttpInterceptorFn`), registrado solo cuando `environment.useMocks === true`. Otra herramienta (MSW, json-server) requiere aprobación.
4. **Estructura:**
   ```text
   src/app/core/mocks/<nombre-contrato>/
     fixtures.ts    datos tipados con los modelos del contrato
     handlers.ts    ruta + método → respuesta / error
     README.md      tabla de escenarios
   src/app/core/mocks/mock-api.interceptor.ts
   ```
5. **Escenarios deterministas:** cada código de error del contrato se puede provocar con un dato de entrada conocido (por ejemplo `error409@mock.test` → 409). Se documenta en `README.md`:

   | Endpoint | Entrada | Respuesta | Uso |
   |---|---|---|---|

6. **Estado en memoria:** los mocks pueden mantener el estado (usuarios registrados, contactos) en memoria para simular flujos completos; se reinicia al recargar.
7. **Latencia** simulada configurable (por defecto 300–600 ms) para ver los estados de carga.
8. **Autenticación simulada** igual al ADR (por ejemplo, validar la cabecera `Authorization: Basic ...` y devolver 401 si falta o es inválida).
9. **Datos ficticios:** dominios `mock.test`, teléfonos y documentos inventados. Nunca datos reales.
