# Requisitos técnicos

Esta guía describe lo necesario para instalar y ejecutar el frontend en otra computadora. No se requiere instalar Angular CLI globalmente: el proyecto incluye su versión local.

## Requisitos de software

- Sistema operativo compatible con Node.js (Windows, macOS o Linux).
- Node.js compatible con Angular 22. La tabla oficial admite `^22.22.3`, `^24.15.0` o `^26.0.0`. Node.js 26 es una opción válida.
- npm `11.19.1`, indicado por `package.json` y `package-lock.json` (`packageManager: npm@11.19.1`).
- Git para clonar o actualizar el repositorio.
- Navegador actualizado para abrir la aplicación.

Angular CLI y las dependencias del proyecto se instalan localmente mediante npm. No instales `ng` globalmente para trabajar en este proyecto.

## Instalación

1. Clona el repositorio y abre la carpeta `hackathon-frontend`.
2. Comprueba las versiones:

   ```bash
   node --version
   npm --version
   ```

3. Instala exactamente las dependencias registradas en el lockfile:

   ```bash
   npm ci
   ```

## Ejecución local

```bash
npm start
```

Abre `http://localhost:4200/`. El backend permite CORS desde ese origen de desarrollo.

## Comandos disponibles

```bash
npm run build
npm run lint
npm test
```

- `npm run build`: genera la aplicación en `dist/`.
- `npm run lint`: ejecuta ESLint para Angular.
- `npm test`: ejecuta el runner configurado en Angular CLI (Vitest). Las pruebas de cada flujo deben estar presentes para probar su comportamiento.

## Conexión al backend

El entorno de desarrollo usa `apiBaseUrl` en `src/environments/environment.development.ts`. Actualmente apunta a una URL pública temporal de ngrok; esa dirección puede cambiar y solo funciona mientras el túnel del backend esté activo. Si deja de responder, consulta el README del repositorio backend para obtener la URL vigente. No introduzcas datos personales reales en la base de pruebas.

Según la disponibilidad confirmada actualmente, el backend expone creación de cuenta (`POST /users`) e ingreso (`POST /auth/login`). Las secciones de wallet y contactos se muestran como no disponibles y no envían solicitudes hasta que el backend implemente esos endpoints. La URL de producción no está configurada; el frontend bloquea solicitudes en ese entorno si `apiBaseUrl` está vacío.

## Hardware

El repositorio no especifica requisitos mínimos de memoria, procesador ni espacio en disco. No se fija un mínimo de hardware en esta guía.

## Referencias

- Versión de Angular CLI y scripts: `package.json` y `README.md`.
- Versiones reproducibles: `package-lock.json`.
- Compatibilidad de Node.js, TypeScript y RxJS: https://angular.dev/reference/versions
- URL del backend y pasos para levantarlo: `../hackathon-backend/README.md`.
