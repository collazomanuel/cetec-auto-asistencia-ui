
# CETEC Auto-Asistencia

Este es el front-end del CETEC Auto-Asistencia hecho con SvelteKit, diseñado para el uso de los alumnos de la Facultad de Ingeniería de la Universidad de Buenos Aires.

<div align="center">
  <img src="https://user-images.githubusercontent.com/75450615/228704389-a2bcdf3e-d4d6-4236-b1c6-57fd9e545625.png#gh-dark-mode-only" width="50%" align="center">
</div>

## Empezando

Para empezar con esta interfaz gráfica, siga los siguientes pasos:

1. Clona el repositorio a tu máquina local

```bash
git clone https://github.com/collazomanuel/cetec-auto-asistencia-ui.git
```

2. Instala las dependencias

```bash
cd cetec-auto-asistencia-ui
npm install --force
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:

```env
VITE_API_URL=<URL_DEL_BACKEND>
VITE_GOOGLE_CLIENT_ID=<ID_CLIENTE_GOOGLE>
VITE_GOOGLE_CLIENT_SECRET=<SECRETO_CLIENTE_GOOGLE>
```

4. Ejecuta el servidor de desarrollo

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en http://localhost:5173, donde podrás ver al front-end en acción.

## Funcionalidades

- **Autenticación con Google**: Los usuarios pueden iniciar sesión utilizando su cuenta de Google.
- **Gestión de exámenes**: Crear, editar y listar exámenes.
- **Registro de asistencia**: Captura de foto, geolocalización y detección facial para registrar la asistencia de los alumnos.
- **Conexión offline**: Las solicitudes se encolan y se reintentan automáticamente cuando la conexión a internet se restablece.

## Estructura del Proyecto

El proyecto sigue la estructura estándar de SvelteKit. Aquí hay una descripción de las carpetas principales:

- `src/`: Contiene el código fuente del proyecto.
  - `routes/`: Define las rutas de la aplicación.
  - `lib/`: Contiene tipos, utilidades y otros recursos compartidos.
  - `styles.css`: Archivo de estilos globales.
- `.svelte-kit/`: Archivos generados automáticamente por SvelteKit.
- `static/`: Archivos estáticos como el favicon.

## Despliegue

Para desplegar el front-end, sigue estos pasos:

1. Construye la versión de producción de la aplicación:

```bash
npm run build
```

2. Despliega la carpeta `build` en tu proveedor de alojamiento.

## Dependencias

Esta página fue construida con las siguientes dependencias:

- **Framework**: SvelteKit
- **Librerías principales**:
  - `@auth/sveltekit`: Manejo de autenticación.
  - `@mediapipe/tasks-vision`: Detección facial.
  - `@sveltestrap/sveltestrap`: Componentes de UI.
  - `axios`: Manejo de solicitudes HTTP.
- **Herramientas de desarrollo**:
  - `eslint`: Linter para mantener la calidad del código.
  - `prettier`: Formateador de código.
  - `typescript`: Tipado estático.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Previsualiza la aplicación construida.
- `npm run check`: Sincroniza SvelteKit y realiza una verificación de tipos.
- `npm run format`: Formatea el código con Prettier.
- `npm run lint`: Verifica el código con ESLint y Prettier.

## Contacto

Para consultas o soporte, puedes contactarte con el desarrollador a través de [mcollazo@fi.uba.ar](mailto:mcollazo@fi.uba.ar).

![Footer](https://user-images.githubusercontent.com/75450615/175360883-72efe4c4-1f14-4b11-9a7c-55937563cffa.png)
