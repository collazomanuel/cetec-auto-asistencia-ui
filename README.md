
# CETEC Auto-Asistencia

Este es el front-end del CETEC Auto-Asistencia hecho con Svelte, diseñado para el uso de los alumnos de la Facultad de Ingeniería de la Universidad de Buenos Aires.

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

3. Ejecuta el servidor de desarrollo

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en http://localhost:5173, donde podrás ver al front-end en acción.

## Despliegue

Para desplegar el front-end, sigue estos pasos:

1. Construye la versión de producción de la aplicación:

```bash
npm run build
```

2. Despliega la carpeta "build" en tu proveedor de alojamiento.

## Dependencias

Esta página fue construida con las siguientes dependencias:

- svelte 4.2.7
- vite 5.0.3
- axios 1.6.7
- @mediapipe/tasks-vision 0.10.9

![Footer](https://user-images.githubusercontent.com/75450615/175360883-72efe4c4-1f14-4b11-9a7c-55937563cffa.png)
