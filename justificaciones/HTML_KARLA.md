# HTML — Karla (Estructura de los templates)

Acá explico cómo estructuré los templates y por qué algunas cosas están como están.
Usamos Jinja2 porque Flask lo trae incluido, así que los templates tienen `{{ variables }}` y `{% bloques %}` mezclados con el HTML normal.

---

## Estructura general de los templates

Todos los templates del área privada siguen más o menos el mismo esquema:

```
<head>
  nav.css primero (tiene las variables y la nav)
  css de la página
</head>
<body>
  bloque nav (copiado igual en todos)
  contenido principal
  nav.js al final
</body>
```

El nav va al final con `nav.js` porque necesita que el DOM esté cargado para poder agarrar los elementos. Si lo pusiera en el head tendría que usar `defer` o `DOMContentLoaded`, así que fue más simple ponerlo al final.

---

## El login — estructura del flip card

El login es el template más distinto porque no tiene nav y tiene la animación de la carta.

La estructura base es así:

```html
<!-- input oculto que controla el flip (lo maneja CSS) -->
<input type="checkbox" id="flip-toggle" class="flip-toggle">

<p class="fs-brand">Focus Study</p>

<div class="flip-wrapper">
  <div class="switch-nav">
    <!-- los dos tabs de navegación -->
  </div>

  <div class="card-scene">       <!-- le da la perspectiva 3D -->
    <div class="flip-card">      <!-- este es el que gira -->
      <div class="card-front">   <!-- login -->
      </div>
      <div class="card-back">    <!-- registro -->
      </div>
    </div>
  </div>
</div>
```

El `input[type=checkbox]` tiene que estar antes del `.flip-wrapper` en el HTML porque el CSS usa el selector `~` (hermano siguiente). Si estuviera adentro del wrapper no funcionaría.

---

## Variables de Flask en los templates

Flask pasa datos desde Python a los templates con Jinja2. Algunos ejemplos de cómo los usé:

En login.html para mostrar errores:
```html
{% if error %}
<p class="fs-error">{{ error }}</p>
{% endif %}
```

Para que si el login falla y vuelve la página, el correo quede escrito:
```html
<input value="{{ correo_previo or '' }}">
```

Para que si el registro falla la tarjeta empiece del lado de registro:
```html
<input type="checkbox" {% if mostrar_registro %}checked{% endif %}>
```

En dashboard para el nombre del usuario:
```html
<p class="inicio-saludo">Hola, {{ nombre }}</p>
```

En pomodoro para los valores de configuración:
```html
{{ config.focus_minutes }} min
```

---

## Formularios

Los formularios del login y registro apuntan a rutas de Flask:

```html
<form method="POST" action="{{ url_for('login') }}">
```

Usé `url_for()` en vez de escribir la ruta a mano (`/login`) porque si en algún momento cambiamos el nombre de la ruta en app.py, los links se actualizan solos.

Ambos formularios tienen `onsubmit="return validarLogin(this)"` para hacer una validación básica en el navegador antes de enviar al servidor. Igual el servidor también valida, pero así evitamos envíos con datos claramente mal escritos.

---

## Template de pomodoro

El pomodoro tiene una parte importante: el script inline antes de cargar pomodoro.js

```html
<script>
  const SERVER_CONFIG = {
    focus_minutes: {{ config.focus_minutes }},
    break_minutes: {{ config.break_minutes }},
    cycles: {{ config.cycles }}
  };
</script>
<script src="{{ url_for('static', filename='js/pomodoro.js') }}"></script>
```

Esto es para que pomodoro.js pueda leer los valores que guardó el usuario en sesión. Si pusiera los valores directo en el .js no podría acceder a las variables de Flask porque el .js es estático.

---

## Logo en la página de inicio

Para la página de inicio (inicio.html) usé una etiqueta `<img>` en vez de código SVG inline para el logo principal. Antes había intentado poner el SVG directamente en el HTML pero el código quedaba enorme y difícil de leer. Con `<img>` queda simple:

```html
<div class="hero-logo-wrap">
  <img src="{{ url_for('static', filename='img/logo_hero.svg') }}" alt="Focus Study" class="hero-logo-img">
  <p class="hero-logo-nombre">Focus Study</p>
</div>
```

El logo está en `static/img/` y Flask lo sirve con `url_for`. El texto "Focus Study" lo puse aparte como párrafo porque quería que tuviera el estilo de gradiente morado independiente del logo.

Para la barra de navegación decidí no poner imagen porque el ícono quedaba muy pequeño y no se veía bien. En cambio puse el texto "Focus Study" directo:

```html
<span class="nav-brand-text">Focus Study</span>
```

Así el nav queda limpio sin depender de que la imagen se vea bien a tamaño chico.

---

## Cosas que se pierden al recargar

Las páginas de técnicas (Feynman, Cornell, Active Recall) no guardan el contenido en base de datos, así que si el usuario recarga pierde lo que escribió. Eso es intencional por ahora, son más de apoyo que de almacenamiento. Lo mismo con las notas del pomodoro, aunque esas sí se guardan en sesión mientras no se cierre el navegador.
