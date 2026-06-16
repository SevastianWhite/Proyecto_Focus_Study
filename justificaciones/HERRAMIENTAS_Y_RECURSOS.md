# Herramientas y recursos usados — Focus Study

Acá documentamos todo lo que usamos fuera del código en sí: herramientas de diseño, generación de contenido, referencias visuales y utilidades. Sirve para justificar de dónde vienen los recursos del proyecto y por qué los elegimos.

---

## Stack principal del proyecto

**Python + Flask**
Para el servidor web. Flask nos permite manejar rutas, sesiones y renderizar los templates HTML desde Python sin necesidad de una base de datos compleja. Lo elegimos porque es simple de entender y levantar para un proyecto de primer año.

**HTML + CSS + JavaScript**
Todo el frontend está hecho a mano sin frameworks como Bootstrap o Tailwind. Quisimos tener control total sobre el diseño y que el código fuera nuestro.

**JSON (data/usuarios.json)**
Usamos un archivo JSON como reemplazo simple de base de datos para guardar los usuarios registrados. Es suficiente para el alcance del proyecto y no requiere configurar PostgreSQL ni MySQL.

**Git + GitHub**
Control de versiones del proyecto. Cada integrante hace pull y push para mantener el código sincronizado.

---

## Herramientas de diseño y contenido visual

**Higgsfield AI** — [higgsfield.ai](https://higgsfield.ai)
Usamos Higgsfield para generar el video de fondo de la página de inicio. Es una plataforma de generación de video con IA que permite crear clips de alta calidad a partir de prompts de texto. Elegimos un video de escritorio de estudio con elementos visuales de conexión/red neuronal porque encaja con la propuesta de Focus Study como plataforma de aprendizaje. El video se exportó en MP4 y se guardó en `static/video/inicio.mp4`.

**ChatGPT / DALL-E**
Lo usamos para generar la imagen del logo símbolo (monograma FS) antes de vectorizarlo. También nos sirvió para consultar ideas de diseño, paleta de colores y para generar el SVG inicial del logo (aunque el resultado del SVG requirió ajustes manuales). Además lo usamos para discutir decisiones de estructura del proyecto.

**Vectorizer.ai** — [vectorizer.ai](https://vectorizer.ai)
Para convertir la imagen del logo (PNG/JPG generada con IA) a formato SVG vectorial limpio. Esto permite que el logo se vea nítido en cualquier tamaño sin perder calidad, tanto en el nav pequeño como en el hero grande.

**Recraft.ai** — [recraft.ai](https://recraft.ai)
Alternativa explorada para generar SVG directo con IA sin pasar por imagen intermedia. Genera íconos y logos en formato vectorial nativo con soporte de gradientes y estilos definidos por el usuario.

**Photopea** — [photopea.com](https://photopea.com)
Es un editor de imagen gratuito que funciona directo en el navegador, parecido a Photoshop. Lo usamos para quitar el fondo blanco del logo que generamos con ChatGPT, ya que DALL-E no genera imágenes con fondo transparente. El proceso fue: abrir la imagen → herramienta de varita mágica → seleccionar el fondo blanco → borrar → exportar como SVG. Antes intentamos con remove.bg pero no funcionó bien porque confundía el blanco del logo con el fondo.

**remove.bg** — [remove.bg](https://remove.bg)
Herramienta online gratuita para quitar fondos de imágenes automáticamente con IA. La usamos como primer intento para quitar el fondo blanco del logo. El problema fue que en logos con colores claros o blancos dentro del diseño, la IA no distingue bien qué es fondo y qué es parte del logo, por lo que el resultado no quedó bien. Por eso terminamos usando Photopea en su lugar.

---

## Referencias de diseño e interfaz

**uiverse.io**
Referencia visual para la animación del flip card del login (la carta que gira entre "Iniciar sesión" y "Crear cuenta"). Tomamos la idea del mecanismo CSS puro con checkbox oculto y la adaptamos completamente a la paleta lavanda del proyecto. No copiamos código, solo tomamos la lógica de la técnica.

---

## Paleta de colores

Definida manualmente por el equipo. Los valores se establecieron buscando una estética de calma y enfoque, distinta a los colores típicos de apps de estudio (que suelen ir al azul corporativo o al verde brillante). Usamos tonos lavanda/morado pastel.

Los colores están documentados como variables CSS en `static/css/nav.css` y se detallan en `justificaciones/CSS_MONSE.md`.

Referencia adicional consultada: **Coolors.co** para verificar contraste y armonía entre los tonos elegidos.

---

## Tipografía

El proyecto usa la fuente del sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) para el área privada — decisión deliberada para que se cargue rápido sin dependencias externas y se vea natural en cada sistema operativo.

La página del Pomodoro usa **Inter** y **Space Grotesk** cargadas desde Google Fonts, que ya venían en el diseño original del timer. Estas se mantienen por consistencia con ese módulo específico.

---

## Otras utilidades mencionadas

**Canva** — usado por integrantes del equipo para explorar ideas de diseño visual antes de llevarlo a código.

**Google Fonts** — fuente Inter y Space Grotesk para el módulo Pomodoro vía CDN.

---

*Este archivo se actualiza a medida que se incorporen nuevas herramientas al proyecto.*
