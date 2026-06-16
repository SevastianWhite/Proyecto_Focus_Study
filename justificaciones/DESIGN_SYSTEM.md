# Focus Study — Sistema de Diseño

Referencia completa de todos los valores de diseño usados en el área privada.
Cubre: `nav.css`, `dashboard.css`, `zonadestudio.css` y los estilos inline de las páginas de técnicas.

---

## 1. Tokens CSS — variables globales

Definidas en `static/css/nav.css` dentro de `:root`.
Disponibles en **todas** las páginas que carguen `nav.css`.

| Variable        | Valor     | Uso principal                                     |
|-----------------|-----------|---------------------------------------------------|
| `--fs-lavanda`  | `#DCCFFB` | Hero · fondo card en hover · toggle nav activo    |
| `--fs-morado`   | `#BDA7F5` | Acento principal · CTA · borde izquierdo activo   |
| `--fs-blanco`   | `#FAFAFC` | Fondo de página · barra de navegación             |
| `--fs-gris`     | `#ECECF3` | Superficie de tarjetas · fondos secundarios       |
| `--fs-borde`    | `#E0DCF0` | Bordes visibles en hover y divisores              |
| `--fs-texto`    | `#2F2F38` | Texto principal (títulos, nombres, nav brand)     |
| `--fs-suave`    | `#8a7fa8` | Texto secundario (descripciones, subtítulos)      |
| `--fs-nav-h`    | `56px`    | Altura de la barra fija · compensa el `padding-top` del body |

---

## 2. Colores adicionales (no variables, hardcoded)

Estos valores aparecen directamente en las hojas de estilo como literales.

### Texto con matices de lavanda

| Valor      | Donde se usa                                           |
|------------|--------------------------------------------------------|
| `#7a6fa0`  | `.inicio-saludo` — "Hola, Crack"                       |
| `#6a5f88`  | `.inicio-frase-hero` — frase motivacional en el hero   |
| `#6b5fa0`  | `.ze-card-beneficio` · `.ze-card-cta` — texto sobre fondo lavanda |
| `#b5afc8`  | `.ze-breadcrumb` · `.inicio-sec-label` — migas/labels  |

### Franjas de acento por método (Zona de Estudio)

| Método        | Color      | Clase CSS                   |
|---------------|------------|-----------------------------|
| Pomodoro      | `#BDA7F5`  | `.ze-card--pomodoro::before` |
| Método Feynman| `#CBB8F5`  | `.ze-card--feynman::before`  |
| Cornell Notes | `#CFC3F2`  | `.ze-card--cornell::before`  |
| Active Recall | `#A690E0`  | `.ze-card--recall::before`   |

### Fondos de etiqueta-beneficio por método

| Método        | Background del badge                      |
|---------------|-------------------------------------------|
| Pomodoro      | `rgba(189, 167, 245, 0.14)`               |
| Feynman       | `rgba(203, 184, 245, 0.18)`               |
| Cornell       | `rgba(220, 207, 251, 0.25)`               |
| Active Recall | `rgba(166, 144, 224, 0.14)`               |

### Cerrar sesión (nav)

| Elemento                        | Valor      |
|---------------------------------|------------|
| Texto `.fs-nav-link--salir`     | `#9a5555`  |
| Hover background                | `#fdf0f0`  |

### Hero — degradados en capas

El hero de Inicio (`dashboard.html`) usa tres capas apiladas:

```css
background:
  radial-gradient(ellipse at 83% 44%, rgba(189, 167, 245, 0.28) 0%, transparent 56%),
  radial-gradient(ellipse at 12% 82%, rgba(220, 207, 251, 0.36) 0%, transparent 44%),
  linear-gradient(145deg, #DCCFFB 0%, #E3DAFF 48%, #EDE8FF 100%);
```

| Capa | Tipo | Color / Posición |
|------|------|-----------------|
| 1 (superior) | Radial | `rgba(189,167,245, 0.28)` en 83% 44% |
| 2 | Radial | `rgba(220,207,251, 0.36)` en 12% 82% |
| 3 (base) | Lineal 145° | `#DCCFFB → #E3DAFF → #EDE8FF` |

### Hero — trama de puntos (textura grain)

Aplicada via `::after` sobre el hero:

```css
background-image: radial-gradient(circle, rgba(47, 47, 56, 0.04) 1px, transparent 1px);
background-size: 16px 16px;
```

### Hero — resplandor detrás de la ilustración

```css
background: radial-gradient(circle, rgba(189, 167, 245, 0.32) 0%, transparent 70%);
width: 120px; height: 120px; border-radius: 50%;
```

---

## 3. Tipografía

### Familia de fuentes

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

Sin carga externa. Usa la fuente del sistema operativo en cada dispositivo.

### Escala completa

| Elemento / Clase               | Tamaño                        | Peso | Estilo   | Archivo fuente     |
|-------------------------------|-------------------------------|------|----------|--------------------|
| `.fs-nav-brand` (Focus Study)  | `0.9rem`                      | 700  | —        | nav.css            |
| `.fs-nav-link`                 | `0.92rem`                     | 400  | —        | nav.css            |
| `.fs-nav-link.activo`          | `0.92rem`                     | 600  | —        | nav.css            |
| `.ze-main > h1`                | `clamp(1.5rem, 4vw, 1.9rem)`  | 700  | —        | zonadestudio.css   |
| `.ze-subtitulo`                | `0.9rem`                      | 400  | —        | zonadestudio.css   |
| `.ze-breadcrumb`               | `0.7rem`                      | 400  | —        | zonadestudio.css   |
| `.ze-card-nombre`              | `1.05rem`                     | 700  | —        | zonadestudio.css   |
| `.ze-card-desc`                | `0.8rem`                      | 400  | —        | zonadestudio.css   |
| `.ze-card-beneficio`           | `0.68rem`                     | 600  | uppercase, letter-spacing 0.02em | zonadestudio.css |
| `.ze-card-cta`                 | `0.78rem`                     | 600  | —        | zonadestudio.css   |
| `.inicio-saludo`               | `0.88rem`                     | 500  | —        | dashboard.css      |
| `.inicio-titulo`               | `clamp(1.4rem, 4vw, 1.75rem)` | 700  | —        | dashboard.css      |
| `.inicio-frase-hero`           | `0.82rem`                     | 400  | italic   | dashboard.css      |
| `.inicio-sec-label`            | `0.68rem`                     | 700  | uppercase, letter-spacing 0.1em | dashboard.css |
| `.inicio-card-nombre`          | `0.88rem`                     | 600  | —        | dashboard.css      |
| `.inicio-card-sub`             | `0.72rem`                     | 400  | —        | dashboard.css      |
| `.inicio-metodo-tag`           | `0.75rem`                     | 400  | —        | dashboard.css      |
| `.inicio-metodo-nombre`        | `1.05rem`                     | 700  | —        | dashboard.css      |
| `.inicio-metodo-cta`           | `0.84rem`                     | 600  | —        | dashboard.css      |
| `.inicio-frase-texto`          | `0.9rem`                      | 400  | italic   | dashboard.css      |
| `.met-titulo` (técnicas)       | `clamp(1.6rem, 4vw, 2rem)`    | 700  | —        | inline técnicas    |
| `.met-desc` (técnicas)         | `0.92rem`                     | 400  | —        | inline técnicas    |
| `.met-bloque p` (técnicas)     | `0.83rem`                     | 400  | —        | inline técnicas    |
| `.met-badge` (técnicas)        | `0.65rem`                     | 700  | uppercase, letter-spacing 0.1em | inline técnicas |
| `.met-volver` (técnicas)       | `0.82rem`                     | 600  | —        | inline técnicas    |
| `.met-breadcrumb` (técnicas)   | `0.7rem`                      | 400  | —        | inline técnicas    |

---

## 4. Espaciado y layout

### Contenedores

| Contexto               | max-width | Padding (desktop)       | Padding (mobile)       |
|------------------------|-----------|-------------------------|------------------------|
| Inicio (dashboard)     | `840px`   | `36px 24px 72px`        | `28px 16px 60px`       |
| Zona de Estudio        | `840px`   | `36px 24px 72px`        | `24px 16px 60px`       |
| Técnicas (Feynman etc.)| `640px`   | `40px 24px 72px`        | (sin breakpoint propio)|
| Nav barra fija         | 100% ancho| padding interno: `0 20px`| —                     |
| Nav menú desplegable   | `min 220px`| padding: `8px 0`       | —                      |
| Nav ítems              | —         | `12px 20px`             | —                      |

### Gaps y separaciones internas

| Elemento                     | Gap / Separación         |
|------------------------------|--------------------------|
| `.inicio-main` (flex column) | `36px`                   |
| `.inicio-accesos` (grid 3×1) | `10px`                   |
| `.ze-grid` (grid 2×2)        | `14px`                   |
| `.ze-card` (flex column)     | `10px` entre items       |
| `.inicio-metodo` (flex row)  | `16px`                   |
| Hamburguesa spans            | `5px` entre líneas       |

---

## 5. Bordes y radios

| Elemento                         | border-radius           | Borde                                         |
|----------------------------------|-------------------------|-----------------------------------------------|
| `.inicio-hero`                   | `18px`                  | sin borde explícito                           |
| `.ze-card` / `.inicio-card`      | `16px`                  | `1.5px solid transparent` → hover `var(--fs-borde)` |
| `.ze-card::before` (franja)      | `16px 16px 0 0`         | sin borde, solo fondo de color                |
| `.inicio-card` / accesos         | `12px`                  | `1.5px solid transparent`                     |
| `.inicio-metodo`                 | `12px`                  | `border-left: 4px solid var(--fs-morado)`     |
| `.inicio-metodo-cta` / CTA btn   | `9px`                   | sin borde                                     |
| `.fs-nav-menu` (menú desplegable)| `0 0 12px 0`            | `border-right + border-bottom: 1px solid var(--fs-gris)` |
| `.fs-nav-toggle` (hamburguesa)   | `7px`                   | sin borde                                     |
| `.fs-nav` (barra fija)           | `0`                     | `border-bottom: 1px solid var(--fs-gris)`     |
| `.ze-card-beneficio` / badge     | `5px`                   | sin borde                                     |
| `.met-bloque` (técnicas)         | `0 10px 10px 0`         | `border-left: 4px solid [acento del método]`  |
| `.met-volver` (botón volver)     | `9px`                   | sin borde                                     |

---

## 6. Sombras

| Elemento             | `box-shadow`                                      |
|----------------------|---------------------------------------------------|
| `.fs-nav-menu`       | `4px 6px 24px rgba(47, 47, 56, 0.08)`             |
| `.ze-card:hover`     | `0 6px 20px rgba(189, 167, 245, 0.16)`            |

---

## 7. Transiciones

| Elemento / estado              | Propiedades animadas                              | Duración y curva   |
|-------------------------------|---------------------------------------------------|--------------------|
| `.ze-card`                    | `background`, `border-color`, `transform`, `box-shadow` | `0.18s / 0.16s ease` |
| `.ze-card-cta` en hover card  | `letter-spacing`                                  | `0.14s ease`       |
| `.inicio-card`                | `background`, `transform`, `border-color`         | `0.18s / 0.14s ease` |
| `.inicio-metodo-cta`          | `opacity`                                         | `0.18s ease`       |
| `.fs-nav-toggle`              | `background`                                      | `0.15s ease`       |
| `.fs-nav-link`                | `background`, `border-color`                      | `0.12s ease`       |
| `.met-volver:hover`           | `background`                                      | `0.15s ease`       |

### Transforms en hover

| Elemento          | Transform                  |
|-------------------|----------------------------|
| `.ze-card:hover`  | `translateY(-3px)`         |
| `.inicio-card:hover` | `translateY(-2px)`      |

---

## 8. Sistema de animaciones

Todas las animaciones decorativas están **envueltas en**:

```css
@media (prefers-reduced-motion: no-preference) { ... }
```

Esto garantiza que se desactiven automáticamente si el usuario activa "Reducir movimiento" en el S.O.

### Keyframes disponibles

#### `fsFadeUp` (dashboard.css) — entrada de texto

```css
@keyframes fsFadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

#### `zeFadeUp` (zonadestudio.css) — entrada de cards

```css
@keyframes zeFadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

> Ambos keyframes son idénticos. Se mantienen separados para que cada hoja sea independiente.

#### `fsFloat1` — partículas del hero (movimiento lento)

```css
@keyframes fsFloat1 {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(3px, -9px); }
  66%       { transform: translate(-4px, -5px); }
}
```

#### `fsFloat2` — partículas del hero (movimiento alternado)

```css
@keyframes fsFloat2 {
  0%, 100% { transform: translate(0, 0); }
  40%       { transform: translate(-5px, -13px); }
  70%       { transform: translate(6px, -6px); }
}
```

> Solo se usan `transform` y `opacity`. Nunca `width`, `height`, `top`, `left` — garantiza aceleración GPU y costo mínimo.

### Stagger de entrada — Inicio (dashboard.css)

| Elemento              | Duración | Delay  |
|-----------------------|----------|--------|
| `.inicio-saludo`      | `0.5s`   | `0.05s`|
| `.inicio-titulo`      | `0.5s`   | `0.18s`|
| `.inicio-frase-hero`  | `0.5s`   | `0.30s`|

### Stagger de entrada — Zona de Estudio (zonadestudio.css)

| Elemento            | Duración | Delay  |
|---------------------|----------|--------|
| `.ze-main > h1`     | `0.5s`   | `0s`   |
| `.ze-subtitulo`     | `0.5s`   | `0.08s`|
| Card 1 (Pomodoro)   | `0.48s`  | `0.14s`|
| Card 2 (Feynman)    | `0.48s`  | `0.22s`|
| Card 3 (Cornell)    | `0.48s`  | `0.30s`|
| Card 4 (Active Recall) | `0.48s` | `0.38s`|

### Partículas flotantes del hero

| Clase  | Tamaño    | Posición           | Opacidad | Animación | Duración | Delay |
|--------|-----------|--------------------|----------|-----------|----------|-------|
| `.pt-1`| `4×4px`   | top 14%, left 7%   | `0.18`   | `fsFloat1`| `11s`    | `0s`  |
| `.pt-2`| `3×3px`   | top 68%, left 22%  | `0.14`   | `fsFloat2`| `14s`    | `-4s` |
| `.pt-3`| `5×5px`   | top 9%, right 26%  | `0.15`   | `fsFloat1`| `13s`    | `-7s` |
| `.pt-4`| `3×3px`   | top 60%, right 10% | `0.19`   | `fsFloat2`| `10s`    | `-2s` |

Color de todas las partículas: `#BDA7F5` (`--fs-morado`).

### Cómo desactivar animaciones manualmente

```css
/* Desactiva solo las partículas del hero */
.inicio-pt { animation: none !important; }

/* Desactiva todas las entradas de Zona de Estudio */
.ze-card, .ze-main > h1, .ze-subtitulo { animation: none !important; }

/* Desactiva todo el área privada de una vez */
body * { animation: none !important; transition: none !important; }
```

---

## 9. Componentes principales

### Barra de navegación fija (`.fs-nav`)

```
Altura:      56px  (var(--fs-nav-h))
z-index:     300
Fondo:       var(--fs-blanco)
Borde inf:   1px solid var(--fs-gris)
Padding:     0 20px
```

Menú desplegable (`.fs-nav-menu`):

```
z-index:     299
position:    fixed  ← deliberado (no absolute) para anclar al scroll
Ancho min:   220px
Fondo:       var(--fs-blanco)
Radio:       0 0 12px 0
Shadow:      4px 6px 24px rgba(47,47,56, 0.08)
```

Ítem activo (`.fs-nav-link.activo`):

```
background:        var(--fs-lavanda)
border-left:       3px solid var(--fs-morado)
font-weight:       600
```

---

### Hero principal (Inicio — `dashboard.html`)

```
border-radius:  18px
padding:        30px 26px
overflow:       hidden
Grid interno:   3fr 2fr  (texto | ilustración)
Gap interno:    20px
z-index texto:  2  (sobre la trama ::after)
```

---

### Tarjetas de método — Zona de Estudio (`.ze-card`)

```
background:     var(--fs-gris)
border-radius:  16px
padding:        24px 22px 20px
border:         1.5px solid transparent → hover: var(--fs-borde)
display:        flex column, gap 10px
Franja ::before: 3px altura, radio 16px 16px 0 0
Hover transform: translateY(-3px)
Hover shadow:   0 6px 20px rgba(189,167,245, 0.16)
```

Alineación del contenido al fondo:  
`.ze-card-desc { flex-grow: 1 }` — empuja badge + CTA hacia el borde inferior.

---

### Tarjetas de acceso rápido — Inicio (`.inicio-card`)

```
background:     var(--fs-gris)
border-radius:  12px
padding:        20px 16px
border:         1.5px solid transparent → hover: var(--fs-borde)
Hover bg:       var(--fs-lavanda)
Hover transform: translateY(-2px)
```

---

### Bloque método recomendado (`.inicio-metodo`)

```
background:     var(--fs-gris)
border-radius:  12px
padding:        20px 22px
border-left:    4px solid var(--fs-morado)
display:        flex row, space-between, gap 16px
```

CTA del método (`.inicio-metodo-cta`):

```
background:    var(--fs-morado)
color:         #ffffff
border-radius: 9px
padding:       11px 20px
font-size:     0.84rem  font-weight: 600
Hover:         opacity 0.82
```

---

### Páginas de técnicas (Feynman / Cornell / Active Recall)

Estilos definidos inline en cada template. Todos comparten:

```
max-width:     640px
padding:       40px 24px 72px
display:       flex column, gap 20px
```

`.met-bloque` (panel de beneficio):

```
background:    var(--fs-gris)
border-left:   4px solid [acento del método]
border-radius: 0 10px 10px 0
padding:       18px 20px
```

`.met-badge` ("Próximamente"):

```
font-size:     0.65rem  font-weight: 700  uppercase
background:    rgba([color acento], 0.15)
color:         #6b5fa0
border-radius: 5px  padding: 3px 9px
```

`.met-volver` (botón):

```
background:    var(--fs-gris)
border-radius: 9px  padding: 11px 18px
Hover bg:      var(--fs-lavanda)
```

---

## 10. Breakpoints responsive

| Breakpoint      | Afecta a                | Cambios                                              |
|-----------------|-------------------------|------------------------------------------------------|
| `max-width: 640px` | Inicio (dashboard)   | Grid hero → 1 columna, ilustración oculta, accesos → 1 col, método → column |
| `max-width: 540px` | Zona de Estudio      | Grid cards → 1 columna, h1 fijo en 1.5rem           |

Mobile body padding en ambos:

```css
.inicio-main { padding: 28px 16px 60px; gap: 28px; }
.ze-main     { padding: 24px 16px 60px; }
```

---

## 11. Cómo agregar una nueva página al área privada

1. Cargar `nav.css` **antes** que cualquier otro CSS.
2. Añadir `padding-top: var(--fs-nav-h)` al `body`.
3. Copiar el bloque `<nav class="fs-nav">` y `<div id="fsNavMenu">` exactamente como está en los templates existentes.
4. Marcar el ítem activo con la clase `activo` en el `<a>` correspondiente.
5. Cargar `nav.js` como último script antes de `</body>`.

---

## 12. Archivos de referencia

| Archivo                          | Contenido                                              |
|----------------------------------|--------------------------------------------------------|
| `static/css/nav.css`             | Variables globales + barra fija + menú desplegable     |
| `static/css/dashboard.css`       | Hero, partículas, accesos rápidos, método recomendado  |
| `static/css/zonadestudio.css`    | Grid de cards 2×2, franjas de acento, animaciones ZE   |
| `static/js/nav.js`               | Toggle, cierre por clic exterior, cierre por Escape    |
| `templates/dashboard.html`       | Frases rotativas JS (IIFE), SVG libros+planta          |
| `templates/zonadestudio.html`    | SVG inline por método, grid 2×2                        |
| `templates/tecnica_*.html`       | Inline `<style>` — estructura placeholder de técnica   |
