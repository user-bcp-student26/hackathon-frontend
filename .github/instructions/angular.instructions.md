---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.scss"
description: Estándares de código Angular 22.2.3 para este repositorio.
---

# Estándares Angular 22.2.3

> Verifica cada API contra la versión instalada (`package.json`, `ng version`) y angular.dev. Si no puedes confirmar una API, pregunta.

## Componentes
- Standalone (sin `NgModule`); `changeDetection: ChangeDetectionStrategy.OnPush`.
- `input()`, `input.required()`, `output()` y `model()`; no `@Input`/`@Output`.
- `inject()` para las dependencias.
- Plantillas con `@if`, `@for (x of xs; track x.id)`, `@switch` y `@defer`. Prohibido `*ngIf`/`*ngFor`.
- Un componente por archivo; archivos `*.component.ts|html|scss` separados si la plantilla supera ~20 líneas.
- Nombres: `kebab-case` en archivos, `PascalCase` en clases y prefijo de selector `app-`.

## Estado
- `signal` / `computed` / `linkedSignal` para el estado local y los servicios de estado.
- Exponer señales de solo lectura (`asReadonly()`) desde los servicios.
- `effect` solo para efectos secundarios (no para derivar estado).

## Datos y HTTP
- `provideHttpClient(withInterceptors([...]), withFetch())`.
- Servicios de API tipados con los modelos del contrato OpenAPI (`features/<feature>/models/*.ts`).
- Interop: `toSignal`, `toObservable` y `switchMap`; `httpResource`/`resource` solo si son estables en la versión instalada.
- El manejo de errores mapea los códigos del contrato a mensajes accionables para el usuario.

## Configuración
- `app.config.ts` con `provideZonelessChangeDetection()` (o la API vigente), `provideRouter(routes, withComponentInputBinding())` y `provideHttpClient(...)`.
- Rutas lazy: `loadComponent: () => import('...').then(m => m.X)`.
- Guards e interceptores funcionales (`CanActivateFn`, `HttpInterceptorFn`).
- La URL base y `useMocks` vienen de `src/environments/`.

## Formularios
- Reactive Forms tipados (`FormBuilder.nonNullable`) o Signal Forms solo con aprobación.
- Validaciones equivalentes a las del contrato (required, format, minLength...).
- Errores visibles, asociados con `aria-describedby` y anunciados con `aria-live="polite"`.

## Estilos
- SCSS con tokens en `src/styles/_tokens.scss` (colores, tipografía, espaciado, radios, sombras, breakpoints) como CSS custom properties.
- Prohibidos los valores mágicos de color o espaciado en los componentes.
- Mobile-first; respetar `prefers-reduced-motion` y `prefers-color-scheme` si el diseño lo contempla.

## Seguridad
- Credenciales solo en memoria; nunca en Web Storage.
- Sin `innerHTML` con datos externos ni `bypassSecurityTrust*`.
- Sin secretos ni URLs de entornos privados en el código.
