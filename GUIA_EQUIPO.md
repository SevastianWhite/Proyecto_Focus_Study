# Guía del Equipo — Focus Study

Esta guía explica cómo está organizado el proyecto y quién trabaja en cada parte.
Está escrita para que cualquier integrante pueda entenderla sin conocimientos avanzados.

---

## ¿Cómo se organiza el proyecto?

```
Proyecto_Focus_Study/
│
├── app.py                  ← El "centro de control" de Flask (Helmuth)
├── requirements.txt        ← Lista de herramientas que necesita el proyecto
├── README.md               ← Descripción general del proyecto
├── GUIA_EQUIPO.md          ← Este archivo
├── RESUMEN_MIGRACION.md    ← Registro de cambios realizados
│
├── modulos/                ← Lógica del backend (Helmuth)
├── data/                   ← Archivos de datos (Helmuth)
├── templates/              ← Páginas HTML (Karla)
└── static/
    └── css/                ← Estilos visuales (Monserrat)
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

### `static/img/`  ← (se creará en Fase 2)
Aquí irán las imágenes y el video de fondo.

### `modulos/`
Aquí vive la lógica del backend: login, manejo de usuarios, etc.
Por ahora estos archivos tienen solo comentarios — se implementarán en fases futuras.

**Regla:** solo Helmuth trabaja aquí.

### `data/`
Aquí vive `usuarios.json`, el archivo donde se guardarán los datos de los usuarios.

---

## ¿Quién modifica qué?

| Integrante | Archivos que modifica |
|---|---|
| **Karla** | Todo lo que hay en `templates/` (archivos `.html`) |
| **Monserrat** | Todo lo que hay en `static/css/` (archivos `.css`) |
| **Helmuth** | `app.py`, `modulos/`, `data/usuarios.json` |
| **Sevastian** | `README.md`, `GUIA_EQUIPO.md`, `RESUMEN_MIGRACION.md`, coordinación general |

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
Agrégalo en uno de los archivos globales según corresponda:

| Archivo | Para qué sirve | Ejemplo |
|---|---|---|
| `base.css` | Colores, tipografía base, reset | Variables de color, fuente del cuerpo |
| `componentes.css` | Piezas reutilizables | Botones, tarjetas, etiquetas |
| `layout.css` | Estructura y posición | Navbar, columnas, tamaños |

**Regla simple:** si algo se repite en 2 o más páginas, va en los archivos globales.

---

## ¿Cómo enlazar CSS desde un HTML?

En Flask los archivos estáticos se enlazan con `url_for`, no con rutas relativas.

```html
<!-- ✗ MAL — ruta relativa, no funciona en Flask -->
<link rel="stylesheet" href="inicio.css">

<!-- ✓ BIEN — url_for, siempre funciona -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/inicio.css') }}">
```

---

## ¿Cómo enlazar entre páginas?

```html
<!-- ✗ MAL — ruta directa al archivo, no funciona bien en Flask -->
<a href="quienesomos.html">Quiénes Somos</a>

<!-- ✓ BIEN — url_for con el nombre de la función en app.py -->
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
| `/login` | `login.html` | Incompleta (ver Fase 2) |
| `/registro` | `registro.html` | Placeholder |
| `/dashboard` | `dashboard.html` | Placeholder |
| `/zonadestudio` | `zonadestudio.html` | Completa |
| `/pomodoro` | `pomodoro.html` | Completa |
| `/descanso` | `descanso.html` | Completa |
| `/tecnicas` | `tecnicas.html` | Placeholder |
| `/tecnica-pomodoro` | `tecnica_pomodoro.html` | Placeholder |
| `/tecnica-feynman` | `tecnica_feynman.html` | Placeholder |
| `/tecnica-cornell` | `tecnica_cornell.html` | Placeholder |
| `/tecnica-recall` | `tecnica_recall.html` | Placeholder |
| `/metas` | `metas.html` | Solo técnico — ver nota abajo |
| `/cerrar-sesion` | — | Redirige a inicio |

> **Nota sobre `/metas`:** esta ruta existe solo para evitar errores técnicos.
> Las metas NO serán una página independiente en el producto final.
> La funcionalidad de metas vivirá integrada dentro de cada método de estudio.

---

## ¿Qué archivos NO deben tocarse sin coordinación?

| Archivo | Por qué |
|---|---|
| `app.py` | Cualquier error aquí rompe todo el sitio. Cambios solo con Helmuth. |
| `data/usuarios.json` | Contiene datos de usuarios. Cambios solo con Helmuth. |
| `modulos/` | Lógica del backend. Cambios solo con Helmuth. |
| `static/css/base.css` | Afecta a todas las páginas. Cambios coordinados con Monserrat. |
| `static/css/componentes.css` | Igual que base.css. |
| `static/css/layout.css` | Igual que base.css. |

---

## ¿Cómo ejecutar el proyecto localmente?

```
pip install -r requirements.txt
flask run
```

Luego abrir en el navegador: `http://127.0.0.1:5000`
