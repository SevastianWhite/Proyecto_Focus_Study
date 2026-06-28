'use strict';

/*
 * pomodoro.js — cuenta regresiva del enfoque. Cuando llega a cero, manda al
 * usuario a /descanso. El descanso (5/15 min) y los 4 ciclos son fijos: aquí
 * solo se configura el tiempo de enfoque.
 *
 * Las llaves focus_minutes / cycles van en inglés porque viajan a Flask (app.py).
 */

// SERVER_CONFIG lo inyecta pomodoro.html con los valores guardados en la sesión.
var config = {
  enfoque: SERVER_CONFIG.focus_minutes,
  ciclos: SERVER_CONFIG.cycles
};

// Minutos de enfoque elegidos en el modal, antes de aplicarlos.
var enfoqueTemporal = config.enfoque;

var enMarcha = false;
var intervalo = null;
var segundosRestantes = config.enfoque * 60;
var segundosTotales = config.enfoque * 60;
var cicloActual = CICLO_INICIAL;

// Largo del contorno del círculo (radio 88 en el SVG). Sirve para dibujar el avance.
var CIRCUNFERENCIA = 2 * Math.PI * 88;

// Referencias a los elementos del HTML que vamos a actualizar.
var pantallaTiempo = document.getElementById('time-display');
var etiquetaFase = document.getElementById('time-label');
var contadorCiclo = document.getElementById('timer-counter');
var etiquetaSiguiente = document.getElementById('next-up-label');
var contenedorPuntos = document.getElementById('dots');
var anilloProgreso = document.getElementById('ring-progress');
var textoBoton = document.getElementById('btn-start-text');
var iconoPlay = document.getElementById('play-icon');
var modalAjustes = document.getElementById('modal-overlay');

// Convierte segundos a texto "MM:SS" (ej: 125 → "02:05").
function formatearTiempo(totalSegundos) {
  var minutos = Math.floor(totalSegundos / 60);
  var segundos = totalSegundos % 60;
  return String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
}

// Vuelve a pintar todo en pantalla con los valores actuales.
// Esta página solo cuenta la fase de enfoque: el descanso vive en /descanso.
function actualizarPantalla() {
  pantallaTiempo.textContent = formatearTiempo(segundosRestantes);
  etiquetaFase.textContent = 'Enfoque';
  contadorCiclo.textContent = 'Pomodoro ' + cicloActual + '/' + config.ciclos;

  etiquetaSiguiente.textContent = cicloActual === config.ciclos
    ? 'Descanso largo (15 min)'
    : 'Descanso corto (5 min)';

  // El anillo se va "vaciando" según el tiempo que queda.
  var proporcion = segundosRestantes / segundosTotales;
  var desfase = CIRCUNFERENCIA * (1 - proporcion);
  anilloProgreso.style.strokeDasharray = CIRCUNFERENCIA;
  anilloProgreso.style.strokeDashoffset = desfase;

  dibujarPuntos();
}

// Dibuja los puntitos de progreso: hechos, el actual y los que faltan.
function dibujarPuntos() {
  contenedorPuntos.innerHTML = '';
  for (var i = 1; i <= config.ciclos; i++) {
    var punto = document.createElement('span');
    if (i < cicloActual) {
      punto.className = 'dot dot--done';
    } else if (i === cicloActual) {
      punto.className = 'dot dot--active';
    } else {
      punto.className = 'dot';
    }
    contenedorPuntos.appendChild(punto);
  }
}

// Muestra un mensajito abajo que desaparece solo (ej: "¡Buen trabajo!").
function mostrarAviso(mensaje) {
  var aviso = document.querySelector('.toast');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.className = 'toast';
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.add('show');
  setTimeout(function () { aviso.classList.remove('show'); }, 2800);
}

// Botón principal: si está corriendo lo pausa, si está parado lo arranca.
function iniciarOPausar() {
  if (enMarcha) {
    clearInterval(intervalo);
    enMarcha = false;
    textoBoton.textContent = 'Reanudar';
    iconoPlay.innerHTML = '&#9658;';
  } else {
    enMarcha = true;
    textoBoton.textContent = 'Pausar';
    iconoPlay.innerHTML = '&#10073;&#10073;';
    intervalo = setInterval(function () {
      if (segundosRestantes > 0) {
        segundosRestantes--;
        actualizarPantalla();
      } else {
        // Se acabó el enfoque de forma natural: suena el aviso y, tras un
        // momento para que se oiga, pasamos al descanso.
        clearInterval(intervalo);
        enMarcha = false;
        textoBoton.textContent = 'Iniciar';
        iconoPlay.innerHTML = '&#9658;';
        reproducirSonido();
        setTimeout(avanzarFase, 1500);
      }
    }, 1000);
  }
}

// Reproduce el aviso de fin. Solo se llama al terminar el enfoque de forma
// natural; al "Saltar" no suena.
function reproducirSonido() {
  var audio = document.getElementById('sonido-fin');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(function () {});
  }
}

// Cuando termina (o se salta) un ciclo de enfoque, mandamos al usuario a la
// pantalla de descanso. Esa página ya recibe el ciclo y los minutos por URL.
function avanzarFase() {
  var esUltimoCiclo = cicloActual >= config.ciclos;
  var parametros = new URLSearchParams({
    tipo: esUltimoCiclo ? 'largo' : 'corto',
    min: esUltimoCiclo ? 15 : 5,
    ciclo: cicloActual,
    totalCiclos: config.ciclos
  });
  window.location.href = '/descanso?' + parametros.toString();
}

// Vuelve todo al inicio (enfoque, ciclo 1, reloj parado).
function reiniciarTemporizador() {
  clearInterval(intervalo);
  enMarcha = false;
  cicloActual = 1;
  segundosRestantes = config.enfoque * 60;
  segundosTotales = config.enfoque * 60;
  textoBoton.textContent = 'Iniciar';
  iconoPlay.innerHTML = '&#9658;';
  actualizarPantalla();
}

// Salta la fase actual sin esperar a que termine el tiempo.
function saltarFase() {
  clearInterval(intervalo);
  enMarcha = false;
  textoBoton.textContent = 'Iniciar';
  iconoPlay.innerHTML = '&#9658;';
  avanzarFase();
}

// Abre el modal y resalta la opción de enfoque que está activa.
function abrirAjustes() {
  enfoqueTemporal = config.enfoque;
  marcarOpcionActiva();
  modalAjustes.classList.add('show');
}

// Resalta el botón cuyo valor coincide con el enfoque elegido.
function marcarOpcionActiva() {
  var botones = document.querySelectorAll('.opcion-min');
  botones.forEach(function (boton) {
    var minutos = parseInt(boton.dataset.min, 10);
    boton.classList.toggle('opcion-min--activa', minutos === enfoqueTemporal);
  });
}

function seleccionarEnfoque(minutos) {
  enfoqueTemporal = minutos;
  marcarOpcionActiva();
}

// Cierra el modal. Si se hizo clic en la tarjeta (no en el fondo), no cierra.
function cerrarAjustes(evento) {
  if (evento && evento.target !== modalAjustes) return;
  modalAjustes.classList.remove('show');
}

// Guarda el enfoque elegido en el servidor (Flask) y reinicia el reloj.
function aplicarAjustes() {
  fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ focus_minutes: enfoqueTemporal })
  })
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (respuesta) {
    if (respuesta.status === 'ok') {
      config.enfoque = respuesta.config.focus_minutes;
      modalAjustes.classList.remove('show');
      reiniciarTemporizador();
      mostrarAviso('Configuración aplicada');
    }
  })
  .catch(function () { mostrarAviso('Error al guardar la configuración'); });
}

// ── Notas y meta de estudio ──────────────────────────────────────────────
// Guardamos automáticamente, pero esperamos un poco después de la última tecla
// para no mandar una petición por cada letra escrita.
var temporizadorGuardado = null;

function programarGuardado() {
  clearTimeout(temporizadorGuardado);
  temporizadorGuardado = setTimeout(guardarNotas, 600);
}

function guardarNotas() {
  var meta = document.getElementById('study-goal').value;
  var notas = document.getElementById('quick-notes').value;

  fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: meta, notes: notas })
  }).catch(function () {});
}

document.getElementById('study-goal').addEventListener('input', programarGuardado);
document.getElementById('quick-notes').addEventListener('input', programarGuardado);

// Pintamos la pantalla por primera vez al cargar.
actualizarPantalla();
