# Guía del Equipo — Focus Study

Esta guía explica cómo está organizado el proyecto y quién trabaja en cada parte.
Está escrita para que cualquier integrante pueda entenderla sin conocimientos avanzados.

---

## ¿Cómo se organiza el proyecto?

```
Proyecto_Focus_Study/
│
├── app.py                  ← El "centro de control" de Flask (Helmuth y Sevastian)
├── requirements.txt        ← Lista de herramientas que necesita el proyecto
├── README.md               ← Descripción general del proyecto
│
├── data/                   ← usuarios.json y las guías del equipo
├── justificaciones/        ← Explicaciones de lo que hicimos (para la presentación)
├── templates/              ← Páginas HTML (Karla)
└── static/
    ├── css/                ← Estilos visuales (Monserrat)
    ├── js/                 ← JavaScript (menú y temporizador)
    ├── img/                ← Logo e imágenes
    └── video/              ← Video de fondo del inicio
```

---

## ¿Qué hace cada carpeta?

### `templates/`
Aquí viven todas las páginas HTML del sitio.
Cuando Flask recibe una visita (por ejemplo, alguien entra a `/pomodoro`),
busca en esta carpeta el archivo `pomodoro.html` y lo muestra.

**Regla:** todo archivo `.html` que quieras mostrar en el navegador va aquí.

### `static/css/`
Aquí viven todos los archivos de estilos CSS.
Flask sirve estos archivos directamente al navegador.

**Regla:** todo archivo `.css` va dentro de `static/css/`.

### `static/img/` y `static/video/`
Aquí están el logo, las imágenes y el video de fondo del inicio.

### `static/js/`
Aquí vive el JavaScript: `nav.js` (el menú) y `pomodoro.js` (el temporizador).

### `data/`
Aquí vive `usuarios.json`, el archivo donde se guardan los datos de los usuarios.
La lógica del backend (login, registro, manejo de usuarios) está en `app.py`, no en una
carpeta aparte, porque para el tamaño del proyecto es más simple tenerlo todo en un archivo.

---

## ¿Quién modifica qué?

| Integrante | Archivos que modifica |
|---|---|
| **Karla** | Todo lo que hay en `templates/` (archivos `.html`) |
| **Monserrat** | Todo lo que hay en `static/css/` (archivos `.css`) |
| **Helmuth y Sevastian** | `app.py`, `data/usuarios.json`, el JavaScript de `static/js/` |
| **Sevastian** | `README.md`, las guías, la organización general del proyecto |

---

## ¿Cómo agregar una página nueva?

Sigue estos 3 pasos en orden:

### Paso 1 — Karla crea el HTML
Crea un archivo nuevo en `templates/`.
Por ejemplo, para una página de configuración: `templates/configuracion.html`

El archivo debe tener una estructura HTML básica:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configuración — Focus Study</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/configuracion.css') }}">
</head>
<body>
    <!-- contenido aquí -->
</body>
</html>
```

### Paso 2 — Monserrat crea el CSS (si la página lo necesita)
Crea un archivo nuevo en `static/css/`.
Por ejemplo: `static/css/configuracion.css`

### Paso 3 — Helmuth registra la ruta en `app.py`
Agrega estas líneas en `app.py` en la sección correspondiente:

```python
@app.route("/configuracion")
def configuracion():
    return render_template("configuracion.html")
```

¡Listo! La página estará disponible en `http://127.0.0.1:5000/configuracion`

---

## ¿Cómo agregar estilos nuevos?

### Si el estilo es para una sola página
Agrégalo en el CSS específico de esa página.
Ejemplo: estilos solo para el Pomodoro → `static/css/pomodoro.css`

### Si el estilo se va a usar en varias páginas
Lo compartido vive en `static/css/nav.css`. Ahí están las variables de color del proyecto
(`--fs-lavanda`, `--fs-morado`, etc.) y los estilos del menú de navegación, que se usa en
todas las páginas privadas.

**Regla simple:** si algo es solo de una página, va en el CSS de esa página; si se repite en
varias (como los colores o la barra de navegación), va en `nav.css`.

---

## ¿Cómo enlazar CSS desde un HTML?

En Flask los archivos estáticos se enlazan con `url_for`, no con rutas relativas.

```html
<!-- MAL — ruta relativa, no funciona en Flask -->
<link rel="stylesheet" href="inicio.css">

<!-- BIEN — url_for, siempre funciona -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/inicio.css') }}">
```

---

## ¿Cómo enlazar entre páginas?

```html
<!-- MAL — ruta directa al archivo, no funciona bien en Flask -->
<a href="quienesomos.html">Quiénes Somos</a>

<!-- BIEN — url_for con el nombre de la función en app.py -->
<a href="{{ url_for('quienesomos') }}">Quiénes Somos</a>
```

El nombre dentro de `url_for()` debe coincidir con el nombre de la función
en `app.py` (no con el nombre del archivo).

---

## Páginas disponibles actualmente

| Dirección en el navegador | Archivo HTML | Estado |
|---|---|---|
| `/` | `inicio.html` | Completa |
| `/quienesomos` | `quienesomos.html` | Completa |
| `/login` | `login.html` | Completa (login y registro funcionan) |
| `/registro` | (usa `login.html`) | Es la acción del formulario de registro, no una página aparte |
| `/dashboard` | `dashboard.html` | Completa |
| `/zonadestudio` | `zonadestudio.html` | Completa |
| `/pomodoro` | `pomodoro.html` | Completa |
| `/descanso` | `descanso.html` | En desarrollo (falta el temporizador) |
| `/complementos` | `complementos.html` | Completa (Notion, Calendar, Todoist, Forest, Coggle) |
| `/configuracion` | `configuracion.html` | El nombre se guarda; tema e idioma quedan pendientes |
| `/tecnica-feynman` | `tecnica_feynman.html` | Completa (formulario de práctica) |
| `/tecnica-cornell` | `tecnica_cornell.html` | Página explicativa (Próximamente) |
| `/tecnica-recall` | `tecnica_recall.html` | Página explicativa (Próximamente) |
| `/cerrar-sesion` | — | Redirige a inicio |

---

## ¿Qué archivos NO deben tocarse sin coordinación?

| Archivo | Por qué |
|---|---|
| `app.py` | Cualquier error aquí rompe todo el sitio. Cambios solo con Helmuth o Sevastian. |
| `data/usuarios.json` | Contiene los datos de los usuarios. Cambios solo con Helmuth o Sevastian. |
| `static/css/nav.css` | Tiene los colores y el menú que usan todas las páginas. Coordinar con Monserrat. |
| `static/js/nav.js` y `static/js/pomodoro.js` | Lógica del menú y del temporizador. Coordinar antes de tocar. |

---

## ¿Cómo ejecutar el proyecto localmente?

```
pip install -r requirements.txt
flask run
```

Luego abrir en el navegador: `http://127.0.0.1:5000`
