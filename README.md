
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
npm install
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

## Anexo: Backend

El back-end del Auto-Asistencia fue construido en Python utilizando el framework web FastAPI, y su código fuente puede encontrarse en este mismo repositorio dentro de la carpeta _"backend"_. En esta sección se detallan instrucciones para su ejecución local.

### Requisitos previos

Antes de ejecutar este back-end, asegúrese de tener instalado lo siguiente:

- Python 3.7+ (se recomienda utilizar la última versión estable de Python)
- Pip (administrador de paquetes de Python)

### Configuración del entorno

1. Estando ubicado en la carpeta raìz del proyecto, navega al directorio del back-end

```bash
cd backend
```

2. Crea un entorno virtual

```bash
python3 -m venv .venv
```

3. Activa el entorno virtual

```bash
source .venv/bin/activate
```

4. Instala las dependencias

```bash
pip install -r requirements.txt
```

5. Ejecuta el servidor

```bash
uvicorn main:app --host 0.0.0.0
```

(6). Desactiva el entorno virtual

```bash
deactivate
```

### Dependencias

Las dependencias del proyecto se encuentran enlistadas en el archivo _"requirements.txt"_ ubicando en el directorio _"backend"_ junto al archivo _"main.py"_.

### Uso

En esta sección se incluye información relevante al uso correcto de esta API.

#### Documentación de FastAPI

FastAPI proporciona una documentación interactiva generada automáticamente en _http://0.0.0.0:8000/docs_. Esta documentación describe todos los endpoints disponibles, los parámetros requeridos y opcionales, y los ejemplos de solicitud y respuesta.

```http
GET /docs
```

#### Student (Servicio)

Este servicio recibe los datos de un alumno y los carga en la base de datos. Para utilizarlo se debe efectuar una _POST request_ de la siguiente forma:

```http
POST http://0.0.0.0:8000/student
```

En el _body_ de la _request_ se debe especificar la siguiente información:

- image: Imagen del alumno en el formato de _base64_
- email: Correo electrónico del alumno
- latitude: Coordenada de longitud
- longitude: Coordenada de latitud

![Footer](https://user-images.githubusercontent.com/75450615/175360883-72efe4c4-1f14-4b11-9a7c-55937563cffa.png)
