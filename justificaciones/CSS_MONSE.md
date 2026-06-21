# CSS — Monserrat (Diseño y estilos)

Acá explico las cosas de CSS que hice o que vale la pena entender porque no son tan obvias.
No está todo, solo lo que puede generar dudas si alguien abre el código.

---

## La paleta de colores

Usamos una paleta lavanda que definí como variables en nav.css para no repetir los mismos colores en todos lados. Así si en algún momento cambiamos algo, se cambia en un solo lugar.

Las variables son:

- `--fs-lavanda` → el lila clarito de fondo, casi blanco
- `--fs-morado` → el morado más marcado, lo uso para botones y acentos
- `--fs-blanco` → blanco cálido, no puro
- `--fs-gris` → para fondos de tarjetas
- `--fs-borde` → bordes suaves
- `--fs-texto` → casi negro pero con tono azulado
- `--fs-suave` → texto secundario, tipo subtítulos o placeholders

La idea fue que todo tuviera ese tono calmado sin que se vea vacío. Evité colores muy saturados porque la plataforma es para estudiar, no tiene que llamar demasiado la atención.

---

## Fondo del login

El login tiene una foto de fondo (fotolog.jpg) que estaba antes en el diseño original. Para mantenerla pero que no chocara con la paleta lavanda, puse dos capas en el background del body:

```css
background:
  linear-gradient(145deg, rgba(220,207,251,0.72) 0%, rgba(237,232,255,0.68) 100%),
  url("...fotolog.jpg") center/cover no-repeat fixed;
```

Básicamente es un gradiente lavanda semitransparente encima de la foto. Así la foto se ve pero con el tono morado del proyecto. El `fixed` hace que la foto no se mueva si hay scroll.

---

## La animación del flip card (login)

Esta fue la parte más compleja del login. La idea era que al cambiar entre "Iniciar sesión" y "Crear cuenta" la tarjeta diera vuelta como si fuera una carta física.

Lo hice sin JavaScript, solo con CSS. El truco es usar un checkbox oculto que actúa como interruptor:

```html
<input type="checkbox" id="flip-toggle" class="flip-toggle">
```

El input está oculto (`display: none`) pero cuando está "checked" activa un selector CSS que gira la tarjeta:

```css
.flip-toggle:checked ~ .flip-wrapper .flip-card {
  transform: rotateY(180deg);
}
```

El `~` es el selector de hermano general, necesita que el input y el `.flip-wrapper` estén al mismo nivel en el HTML.

Para que el giro se vea en 3D:

```css
.card-scene {
  perspective: 900px;  /* da la sensación de profundidad */
}
.flip-card {
  transform-style: preserve-3d;
  transition: transform 0.65s ease;
}
```

La cara de atrás empieza girada 180° para que cuando el card gire, ella quede mirando al frente:

```css
.card-back {
  transform: rotateY(180deg);
}
```

Y ambas caras tienen `backface-visibility: hidden` para que no se vea el contenido del reverso mientras la tarjeta está de frente.

---

## Navegación del login (tabs con línea)

Al principio tenía un toggle tipo pastilla para cambiar entre login y registro, pero se veía raro y funcionaba mal (cualquier click en los textos lo activaba). Lo cambié por dos pestañas con una línea debajo de la activa.

La línea la hice con `::after` en cada label:

```css
.switch-nav-label::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--fs-morado);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}
```

Por defecto la línea tiene `scaleX(0)` entonces es invisible. Cuando el tab está activo se pone `scaleX(1)` y aparece con una transición suave.

El estado activo lo controla el checkbox oculto con selectores CSS igual que el flip:

```css
/* login activo por defecto */
.switch-nav-label--login::after { transform: scaleX(1); }

/* cuando está checked, registro pasa a activo */
.flip-toggle:checked ~ .flip-wrapper .switch-nav-label--login::after { transform: scaleX(0); }
.flip-toggle:checked ~ .flip-wrapper .switch-nav-label--reg::after   { transform: scaleX(1); }
```

Los textos en sí son `<span>` con onclick que fuerzan el estado del checkbox en vez de togglearlo, así no se invierte accidentalmente.

---

## Animaciones de entrada (nav y dashboard)

En el dashboard y zona de estudio algunas cosas entran con un fade desde abajo al cargar la página. Lo hice con keyframes y delays distintos para que no todo aparezca al mismo tiempo:

```css
@keyframes fs-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Cada elemento tiene un `animation-delay` diferente (0.05s, 0.1s, 0.15s...) para que entren escalonados. Si alguien tiene el sistema configurado para reducir movimiento, con `prefers-reduced-motion` se desactivan automáticamente.

---

## Estilos del logo en inicio.html

El logo principal en el hero tiene sombra y usa `mix-blend-mode`:

```css
.hero-logo-img {
  height: 185px;
  width: auto;
  filter: drop-shadow(0 6px 28px rgba(80, 100, 200, 0.28));
  mix-blend-mode: multiply;
}
```

La sombra la hice con `filter: drop-shadow` en vez de `box-shadow` porque el logo es una imagen con forma irregular. `box-shadow` sigue el rectángulo de la imagen, `drop-shadow` sigue la forma real del logo.

El `mix-blend-mode: multiply` lo agregué para que si la imagen tiene algún fondo blanco residual de cuando la exportamos, ese blanco desaparezca al mezclar con el fondo claro del video. Es un truco útil cuando trabajás con logos sobre fondos claros.

Para el texto "Focus Study" del nav usé gradiente igual que en el hero pero más chico:

```css
.nav-brand-text {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #5a9282, #7a5fc0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Descartamos poner el logo como imagen en el nav porque a ese tamaño quedaba muy pequeño y no se distinguía bien. El texto con gradiente queda más limpio.

---

## Parejando los colores entre páginas

Cuando ya teníamos varias técnicas armadas (Cornell, Feynman, Active Recall, Complementos) cada una se fue trabajando por separado y terminamos con tonos distintos en cada una: Cornell tenía un azul fuerte y un café que se usaron al principio solo para distinguir bordes mientras se armaba el diseño, Complementos tenía colores distintos por categoría (cian, verde, azul, naranja) y Feynman tenía un gris de texto distinto al resto. Se notaba que no seguían la misma paleta que Inicio, Pomodoro o Vista General.

Pasamos todo a la misma familia de morados que ya usábamos en `nav.css` y en el Inicio, y el texto a `#2F2F38` en todos lados (antes en algunas páginas quedaba el negro por defecto del navegador). En Complementos las categorías ya no tienen un color distinto cada una, todas quedaron del mismo morado — se siguen distinguiendo por el nombre de la etiqueta (Organización, Planificación, etc.), no hacía falta el color para eso.

---

## Detalles generales

- Usé `border-radius` generoso en las tarjetas (16-18px) para que se vea más amigable
- Los hover de las tarjetas tienen un `translateY(-2px)` o `-3px` para dar sensación de que se levantan
- Las sombras son con color morado (`rgba(189,167,245,...)`) en vez de negro para que no se vean duras
- Los inputs de los formularios tienen foco con `border-color: var(--fs-morado)` en vez del outline azul por defecto del navegador
