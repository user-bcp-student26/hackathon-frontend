---
applyTo: "src/**/*.spec.ts,spec/planes/**/informe-pruebas*.md"
description: Reglas para pruebas unitarias, validación funcional con Playwright MCP y evidencias.
---

# Reglas de pruebas

## Unitarias
- Usar el runner configurado en el proyecto (verificarlo en `angular.json` y `package.json`).
- Cada prueba nombra el criterio que cubre: `describe('CA-02 Registro de contacto', ...)`.
- Patrón AAA (Arrange, Act, Assert); una conducta por `it`.
- HTTP con `provideHttpClientTesting()` + `HttpTestingController`, o con el interceptor de mocks.
- Prohibido `fit`/`fdescribe`; `xit`/`skip` solo con justificación en el informe.
- Reportar la salida real del comando y la cobertura.

## Funcionales (Playwright MCP)
- Siempre contra los mocks (`useMocks = true`) salvo que el usuario autorice el backend real.
- Selectores accesibles (rol, label, texto) antes que CSS.
- Una captura como mínimo en: el estado inicial, después de ingresar datos y el resultado (éxito o error).
- Capturas en `spec/planes/<NombreDeIssue>/evidencias/v<n>/<ID-caso>-<paso>-<descripcion>.png`.
- Registrar los errores de consola y validar que las peticiones de red coincidan con el contrato.
- Viewports: 375×812 (móvil) y 1280×800 (escritorio).

## Integridad de la evidencia
- Un caso sin captura o sin salida real **no puede** marcarse como `Pasó`.
- Prohibido fabricar, editar o reutilizar evidencias.
