# Organización del proyecto — Sevastian

Explico cómo está estructurado el proyecto y por qué está así. También algunas decisiones de coordinación que tomamos para que todo funcione junto.

---

## Estructura de carpetas

```
Proyecto_Focus_Study/
│
├── app.py                  el servidor, todas las rutas están acá
├── requirements.txt        dependencias de Python (solo Flask)
├── README.md               descripción general del proyecto
│
├── data/
│   └── usuarios.json       los usuarios registrados
│
├── templates/              los archivos HTML (Jinja2)
│   ├── inicio.html         página pública de inicio
│   ├── login.html          login + registro (flip card)
│   ├── dashboard.html      inicio del área privada
│   ├── zonadestudio.html   selector de métodos
│   ├── pomodoro.html       temporizador
│   ├── descanso.html       pantalla de descanso
│   ├── configuracion.html  ajustes del usuario
│   ├── complementos.html   herramientas externas
│   └── quienesomos.html    página del equipo
│
├── static/
│   ├── css/                hojas de estilo
│   └── js/                 scripts del cliente
│
└── justificaciones/        explicaciones internas del equipo (estos archivos)
```

---

## Por qué app.py está en la raíz

Flask busca los templates en una carpeta `templates/` y los archivos estáticos en `static/` relativo a donde está el archivo principal. Si app.py estuviera en una subcarpeta habría que configurar rutas adicionales. Dejarlo en la raíz es lo más simple y es lo que recomienda la documentación de Flask para proyectos sin blueprints.

---

## El archivo data/usuarios.json

Este archivo está versionado en git a propósito. No lo pusimos en el .gitignore porque:
- Es el "reemplazo" de la base de datos en este proyecto
- Necesitamos que todos en el equipo tengan la misma estructura base
- La estructura vacía `{ "usuarios": [] }` tiene que estar presente para que Flask no rompa al intentar leer el archivo

Si en algún momento alguien agrega un usuario de prueba y hace push, los demás verán ese usuario al hacer pull. No es ideal pero para este proyecto está bien.

---

## Cómo se conectan las partes

El flujo básico de la aplicación es:

1. Usuario entra a `/` → ve `inicio.html` (página pública)
2. Hace click en "Iniciar sesión" → va a `/login`
3. Se loguea o registra → Flask guarda en `session` y redirige a `/dashboard`
4. Desde el dashboard puede ir a `/zonadestudio`, `/pomodoro`, `/configuracion`, etc.
5. Al cerrar sesión → `/cerrar_sesion` limpia la sesión y vuelve a `/`

El nav que aparece en todas las páginas del área privada está duplicado en cada template (no hay template base por ahora). Si se cambia algo del nav hay que actualizarlo en todos los archivos.

---

## Archivos CSS y JS del nav

`nav.css` y `nav.js` son especiales porque los carga casi toda el área privada. También define las variables CSS globales (`--fs-lavanda`, `--fs-morado`, etc.) que usan los demás CSS.

Por eso `nav.css` siempre va primero en el `<head>`.

---

## Cosas pendientes o que se pueden mejorar

- El nav está duplicado en todos los templates, idealmente se factorizaría a un template base con `{% extends %}` pero lo dejamos así para mantener la simplicidad
- Las rutas del área privada no tienen protección de sesión obligatoria todavía
- Las notas del pomodoro y las técnicas de estudio no persisten en disco, solo en sesión
- El pomodoro no redirige automáticamente a la pantalla de descanso todavía (pendiente)

---

## Flujo de trabajo del equipo

- Helmuth se encargó de las rutas y la lógica de autenticación en app.py
- Karla estructuró los templates HTML de cada página
- Monserrat hizo los estilos CSS y las animaciones
- Yo coordiné, ayudé con la integración Flask-templates y me encargué del pomodoro y las redirecciones

Los archivos de cada uno están explicados en su respectivo .md de esta carpeta.
