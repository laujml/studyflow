# StudyFlow

StudyFlow es una aplicación web diseñada para ayudar a estudiantes a organizar su vida académica en un solo lugar.

Permite gestionar cursos, tareas, eventos, calificaciones y materiales de estudio, mostrando además un panel principal con información priorizada para facilitar la planificación diaria.

---

## Características

### Dashboard (Home)

* Resumen general del progreso académico.
* Plan de hoy con tareas ordenadas por prioridad.
* Próximos eventos del calendario.
* Cursos activos.
* Tip del día.

### Cursos

* Crear, editar y eliminar cursos.
* Gestión de información del docente.
* Asociación de tareas, archivos y calificaciones.

###  Tareas

* Crear, editar y eliminar tareas.
* Marcar tareas como completadas.
* Priorización automática según:

  * Fecha límite.
  * Dificultad.
  * Tiempo estimado.

###  Calendario

* Crear eventos académicos.
* Soporte para eventos de un día o rangos de fechas.
* Visualización mensual.
* Integración con el dashboard.

###  Calificaciones

* Registro de evaluaciones.
* Cálculo automático de:

  * Acumulado actual.
  * Porcentaje evaluado.
  * Porcentaje pendiente.
  * Nota necesaria para aprobar.

###  Archivos

* Subida de materiales de estudio mediante Cloudinary.
* Soporte para:

  * Imágenes.
  * PDF.
  * Word.
  * Excel.
  * PowerPoint.
* Vista previa dentro de la aplicación.

---

##  Tecnologías Utilizadas

### Frontend

* React
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express
* Prisma ORM
* JWT Authentication

### Base de Datos

* PostgreSQL

### Almacenamiento de Archivos

* Cloudinary

---

##  Seguridad

El proyecto incluye:

* Autenticación mediante JWT.
* Protección de rutas privadas.
* Validación de acceso por usuario propietario.
* Restricción de tipos y tamaños de archivo.
* Middleware global de manejo de errores.
* Configuración segura de CORS.
* Gestión de variables de entorno mediante dotenv.

---

##  Estructura General

```text
StudyFlow
│
├── backend
│   ├── prisma
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── services
│   │   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│
└── README.md
```

---

##  Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/laujml/studyflow.git
cd studyflow
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=http://localhost:5173
```

Ejecutar migraciones:

```bash
npx prisma migrate deploy
```

Iniciar servidor:

```bash
npm run dev
```

---

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar aplicación:

```bash
npm run dev
```

---

##  Estado del Proyecto

StudyFlow es un proyecto personal desarrollado con fines de aprendizaje y portafolio, enfocado en aplicar buenas prácticas de desarrollo full-stack, organización de código, autenticación, gestión de archivos y diseño de APIs.

---

##  Licencia

Este proyecto se encuentra disponible únicamente con fines educativos y de demostración de portafolio.
