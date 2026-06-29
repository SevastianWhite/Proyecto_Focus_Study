'use strict';

// Cronómetro del descanso. Arranca solo al cargar la página y, cuando el tiempo
// llega a cero, vuelve al Pomodoro con la siguiente sesión.

// Los datos del descanso llegan en atributos data-* del <main> (los pone Flask).
// Así no hace falta escribir variables de JavaScript dentro del HTML.
var elMain = document.getElementById('descanso-main');
var minutosDescanso = parseInt(elMain.dataset.minutos, 10);
var cicloActual = parseInt(elMain.dataset.ciclo, 10);
var totalCiclos = parseInt(elMain.dataset.totalCiclos, 10);
var siguienteCiclo = parseInt(elMain.dataset.siguienteCiclo, 10);

var segundosRestantes = minutosDescanso * 60;
var segundosTotales = minutosDescanso * 60;
var enMarcha = false;
var intervalo = null;

// Largo del contorno del círculo del SVG (radio 88), para dibujar el avance del anillo.
var circunferencia = 2 * Math.PI * 88;

var displayTiempo = document.getElementById('ds-time-display');
var anilloProgreso = document.getElementById('ds-ring-progress');
var btnPausa = document.getElementById('ds-btn-pausa');
var contenedorPuntos = document.getElementById('ds-dots');
var elementoFrase = document.getElementById('ds-frase');

function formatearTiempo(totalSegundos) {
  var minutos = Math.floor(totalSegundos / 60);
  var segundos = totalSegundos % 60;
  return String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
}

function actualizarAnillo() {
  var proporcion = segundosRestantes / segundosTotales;
  anilloProgreso.style.strokeDasharray = circunferencia;
  anilloProgreso.style.strokeDashoffset = circunferencia * (1 - proporcion);
}

function dibujarPuntos() {
  contenedorPuntos.innerHTML = '';
  for (var i = 1; i <= totalCiclos; i++) {
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

function actualizarPantalla() {
  displayTiempo.textContent = formatearTiempo(segundosRestantes);
  actualizarAnillo();
}

function reproducirSonido() {
  var audio = document.getElementById('ds-sonido-fin');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(function () {});
  }
}

function iniciar() {
  enMarcha = true;
  btnPausa.textContent = 'Pausar';
  intervalo = setInterval(function () {
    if (segundosRestantes > 0) {
      segundosRestantes--;
      actualizarPantalla();
    } else {
      clearInterval(intervalo);
      enMarcha = false;
      reproducirSonido();
      // Esperamos un momento para que el sonido alcance a oírse antes de redirigir.
      setTimeout(function () {
        window.location.href = '/pomodoro?ciclo=' + siguienteCiclo;
      }, 1500);
    }
  }, 1000);
}

function pausarReanudar() {
  if (enMarcha) {
    clearInterval(intervalo);
    enMarcha = false;
    btnPausa.textContent = 'Reanudar';
  } else {
    iniciar();
  }
}

// Omitir no reproduce el sonido: redirige directo al Pomodoro.
function omitirDescanso() {
  clearInterval(intervalo);
  window.location.href = '/pomodoro?ciclo=' + siguienteCiclo;
}

// Abre o cierra un desplegable y cambia el texto del botón.
// textoCerrado es lo que muestra el botón cuando el contenido está oculto.
function alternarDesplegable(btn, idContenido, textoCerrado) {
  var contenido = document.getElementById(idContenido);
  contenido.classList.toggle('visible');
  btn.textContent = contenido.classList.contains('visible') ? 'Ocultar' : textoCerrado;
}

function mostrarFrase() {
  var frases = [
    'Descansar también es parte de estudiar.',
    'Un cerebro descansado aprende mejor.',
    'Respira hondo: vas por buen camino.',
    'Pequeñas pausas, grandes resultados.',
    'Lo estás haciendo bien, sigue así.',
    'Un paso a la vez. Ya casi terminas.',
    'El descanso de hoy es el rendimiento de mañana.'
  ];
  var azar = Math.floor(Math.random() * frases.length);
  elementoFrase.textContent = '“' + frases[azar] + '”';
}

btnPausa.addEventListener('click', pausarReanudar);

dibujarPuntos();
actualizarPantalla();
mostrarFrase();
iniciar();
