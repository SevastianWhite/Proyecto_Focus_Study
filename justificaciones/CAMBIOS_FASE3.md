# Cambios de la Fase 3 — Revisión y pulido

En esta fase nos dedicamos a dejar el proyecto ordenado y fácil de explicar. No agregamos
funciones nuevas grandes, más bien revisamos todo lo que ya teníamos: limpiamos lo que
sobraba, le pusimos nombres claros a las variables y arreglamos un par de cosas que no
estaban bien conectadas. Acá queda la constancia de qué tocamos.

---

## 1. Archivos que borramos (estaban vacíos)

Teníamos varios archivos en `templates/` que estaban completamente vacíos, ocupando lugar
sin hacer nada. Los quitamos:

- `base.html`, `registro.html`, `error.html` → no los usaba nadie. El registro en realidad
  se hace dentro de `login.html` (la tarjeta que gira), así que `registro.html` no servía.
- `tecnicas.html`, `tecnica_pomodoro.html`, `metas.html` → estaban vacíos pero `app.py`
  tenía rutas que apuntaban a ellos. Eran rutas que no estaban enlazadas en ningún menú,
  o sea que nadie podía llegar a ellas. Borramos los archivos **y** esas rutas en `app.py`
  (`/tecnicas`, `/tecnica-pomodoro`, `/metas`) para que no quede código colgando.

Por qué: si un profesor abre el proyecto y ve archivos vacíos o rutas que no llevan a
ningún lado, lo primero que pregunta es "¿y esto para qué está?". Mejor no tenerlas.

---

## 2. Cosas que no estaban bien conectadas (las arreglamos)

**El saludo del Inicio (dashboard).**
La pantalla decía siempre "Hola, Crack" aunque el usuario tuviera otro nombre. Resulta que
`app.py` ya mandaba el nombre real, pero el HTML no lo estaba usando. Lo cambiamos a
`Hola, {{ nombre }}`. Ahora sí muestra el nombre de quien inició sesión.

**El botón Guardar de Configuración.**
El formulario de "Nombre visible" no tenía ni `method`, ni `action`, ni `name` en el campo,
así que el botón Guardar no hacía absolutamente nada. La lógica en `app.py` para guardarlo
ya existía (ruta `/configuracion` por POST), solo faltaba conectar el formulario. Ahora al
guardar, el nombre se actualiza en la sesión y en `usuarios.json`, y se ve reflejado en el
saludo del Inicio.

**Un error en los ajustes del Pomodoro.**
Los botones de + y − de "Minutos de descanso" no funcionaban. El problema era que el HTML
llamaba a la función con la palabra `'break'` pero el JavaScript esperaba `'brk'`, entonces
no coincidían y daba error. Al pasar todo a español unificamos el nombre a `'descanso'` en
los dos lados, y de paso quedó arreglado.

---

## 3. Nombres de variables (los pasamos a español)

Había código, sobre todo en `pomodoro.js`, con nombres muy cortos y difíciles de entender
(`cfg`, `tmp`, `brk`, `fmt`, `pct`, `msg`...). Como nosotros explicamos el proyecto en
español, los cambiamos a nombres claros en español. Acá va la lista para que cualquiera del
equipo sepa qué es cada uno.

### En `pomodoro.js` (el temporizador)

| Antes | Ahora | Para qué se usa |
|-------|-------|-----------------|
| `cfg` | `config` | Los minutos de enfoque, de descanso y los ciclos que están activos ahora. |
| `tmp` | `configTemporal` | Una copia que se edita en la ventana de ajustes antes de guardar. Si cancelas, esta copia se descarta y `config` no cambia. |
| `mode` | `faseActual` | Dice si estamos en `'enfoque'` o en `'descanso'`. |
| `running` | `enMarcha` | `true` si el reloj está corriendo, `false` si está pausado. |
| `interval` | `intervalo` | Guarda el cronómetro interno que descuenta un segundo cada vez. Lo necesitamos para poder pararlo. |
| `remaining` | `segundosRestantes` | Cuántos segundos faltan en la fase actual. |
| `totalTime` | `segundosTotales` | Cuánto dura la fase completa. Sirve para calcular cuánto llenar el anillo. |
| `cycle` | `cicloActual` | En qué pomodoro vamos (1, 2, 3...). |
| `fmt()` | `formatearTiempo()` | Convierte los segundos a texto tipo "02:05". |
| `updateUI()` | `actualizarPantalla()` | Vuelve a pintar todo en pantalla con los valores del momento. |
| `renderDots()` | `dibujarPuntos()` | Dibuja los puntitos de progreso (hechos, actual, faltantes). |
| `showToast()` | `mostrarAviso()` | Muestra un mensajito abajo que desaparece solo. |
| `toggleTimer()` | `iniciarOPausar()` | El botón grande: arranca o pausa el reloj. |
| `advancePhase()` | `avanzarFase()` | Pasa de enfoque a descanso y al revés. |
| `resetTimer()` | `reiniciarTemporizador()` | Vuelve todo al inicio. |
| `skipPhase()` | `saltarFase()` | Salta a la siguiente fase sin esperar. |
| `openSettings()` / `closeSettings()` | `abrirAjustes()` / `cerrarAjustes()` | Abren y cierran la ventana de ajustes. |
| `LIMITS` | `LIMITES` | Los valores mínimo y máximo de cada campo (ej: descanso entre 1 y 30 min). |
| `adjust()` | `ajustarValor()` | Sube o baja un valor en los ajustes sin pasarse de los límites. |
| `applySettings()` | `aplicarAjustes()` | Guarda los ajustes en el servidor y reinicia el reloj. |
| los `el...` (elDisplay, elRing...) | `pantallaTiempo`, `anilloProgreso`, etc. | Son las referencias a los elementos del HTML que vamos actualizando. |

### En `dashboard.html` (script de frases)

| Antes | Ahora | Para qué se usa |
|-------|-------|-----------------|
| `rand()` | `fraseAlAzar()` | Elige una frase al azar de la lista, sin repetir la que ya salió. |
| `i`, `iHero`, `iPie` | `posicion`, `posicionHero`, `posicionPie` | La posición de la frase elegida dentro de la lista. |
| `elHero`, `elPie` | `fraseHero`, `frasePie` | Los elementos del HTML donde se escribe cada frase. |

### En `login.html` (validación)

| Antes | Ahora | Para qué se usa |
|-------|-------|-----------------|
| `el` | `span` | El cuadrito donde mostramos el mensaje de error. |
| `msg` | `mensaje` | El texto del error. |
| `pass` | `clave` | Lo que el usuario escribió en la contraseña. |
| `partes` | `partesDelCorreo` | El correo cortado por el `@`, para revisar que esté bien escrito. |
| `form` | `formulario` | El formulario que se está validando. |

---

## 4. Nombres que dejamos en inglés a propósito

Hay unos nombres que **no** cambiamos: `focus_minutes`, `break_minutes`, `cycles`, `goal`
y `notes`. Estos son las "llaves" que viajan entre el JavaScript y Flask (`app.py`) cuando
se guardan los ajustes y las notas. Si cambiáramos el nombre en un lado y no en el otro, se
rompería la conexión. Por eso los dejamos igual, y lo anotamos como comentario en el código.

Lo mismo con los `id` del HTML (como `time-display` o `study-goal`): el JavaScript los busca
por ese nombre exacto, así que tampoco se tocan.

---

## 5. Comentarios

Quitamos unos comentarios que tenían líneas decorativas largas (tipo `══════════`) porque
se veían demasiado "de plantilla". Los dejamos como comentarios normales y cortos, que es
como los escribiríamos nosotros. La idea es que cada comentario diga qué hace algo o por qué
está, sin adornos.
