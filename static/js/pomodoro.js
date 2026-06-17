'use strict';

/*
 * pomodoro.js — Lógica del temporizador Pomodoro
 *
 * Variables principales que usamos en todo el archivo:
 *   config → minutos de enfoque, de descanso y cantidad de ciclos (los que están activos)
 *   configTemporal → copia que se edita en el modal de ajustes antes de guardar
 *   faseActual → 'enfoque' o 'descanso', según en qué parte del ciclo estamos
 *   enMarcha → true cuando el reloj está corriendo, false cuando está pausado
 *   intervalo → el setInterval que descuenta un segundo cada vez
 *   segundosRestantes → cuántos segundos faltan en la fase actual
 *   segundosTotales → cuántos segundos dura la fase actual (para calcular el anillo)
 *   cicloActual → en qué pomodoro vamos (1, 2, 3...)
 *
 * Nota: las llaves focus_minutes / break_minutes / cycles y goal / notes se quedan
 * en inglés porque son las que viajan hacia Flask (app.py). Si cambiamos una acá,
 * habría que cambiarla también allá, así que las dejamos igual.
 */

// SERVER_CONFIG lo inyecta pomodoro.html con los valores guardados en la sesión.
var config = {
  enfoque: SERVER_CONFIG.focus_minutes,
  descanso: SERVER_CONFIG.break_minutes,
  ciclos: SERVER_CONFIG.cycles
};

var configTemporal = { ...config };

var faseActual = 'enfoque';
var enMarcha = false;
var intervalo = null;
var segundosRestantes = config.enfoque * 60;
var segundosTotales = config.enfoque * 60;
var cicloActual = 1;

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
function actualizarPantalla() {
  pantallaTiempo.textContent = formatearTiempo(segundosRestantes);
  etiquetaFase.textContent = faseActual === 'enfoque' ? 'Enfoque' : 'Descanso';
  contadorCiclo.textContent = 'Pomodoro ' + cicloActual + '/' + config.ciclos;

  if (faseActual === 'enfoque') {
    etiquetaSiguiente.textContent = 'Descanso corto (' + config.descanso + ' min)';
  } else {
    etiquetaSiguiente.textContent = cicloActual === config.ciclos
      ? 'Descanso largo (15–30 min)'
      : 'Enfoque (' + config.enfoque + ' min)';
  }

  // El anillo se va "vaciando" según el tiempo que queda.
  var proporcion = segundosRestantes / segundosTotales;
  var desfase = CIRCUNFERENCIA * (1 - proporcion);
  anilloProgreso.style.strokeDasharray = CIRCUNFERENCIA;
  anilloProgreso.style.strokeDashoffset = desfase;
  anilloProgreso.classList.toggle('break-mode', faseActual === 'descanso');

  dibujarPuntos();
}

// Dibuja los puntitos de progreso: hechos, el actual y los que faltan.
function dibujarPuntos() {
  contenedorPuntos.innerHTML = '';
  for (var i = 1; i <= config.ciclos; i++) {
    var punto = document.createElement('span');
    punto.setAttribute('aria-hidden', 'true');
    if (i < cicloActual) {
      punto.className = 'dot dot--done';
    } else if (i === cicloActual) {
      punto.className = faseActual === 'enfoque' ? 'dot dot--active' : 'dot dot--active-break';
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
        // Se acabó la fase: paramos el reloj y pasamos a la siguiente.
        clearInterval(intervalo);
        enMarcha = false;
        textoBoton.textContent = 'Iniciar';
        iconoPlay.innerHTML = '&#9658;';
        avanzarFase();
      }
    }, 1000);
  }
}

// Pasa de enfoque a descanso y viceversa, contando los ciclos.
function avanzarFase() {
  if (faseActual === 'enfoque') {
    faseActual = 'descanso';
    segundosRestantes = config.descanso * 60;
    segundosTotales = config.descanso * 60;
    mostrarAviso('¡Buen trabajo! Tiempo de descanso ☕');
  } else {
    faseActual = 'enfoque';
    if (cicloActual < config.ciclos) {
      cicloActual++;
    } else {
      cicloActual = 1;
      mostrarAviso('¡Sesión completa! Excelente trabajo 🎉');
    }
    segundosRestantes = config.enfoque * 60;
    segundosTotales = config.enfoque * 60;
  }
  actualizarPantalla();
}

// Vuelve todo al inicio (enfoque, ciclo 1, reloj parado).
function reiniciarTemporizador() {
  clearInterval(intervalo);
  enMarcha = false;
  faseActual = 'enfoque';
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

// Abre el modal de ajustes copiando los valores actuales a la copia temporal.
function abrirAjustes() {
  configTemporal.enfoque = config.enfoque;
  configTemporal.descanso = config.descanso;
  configTemporal.ciclos = config.ciclos;
  document.getElementById('inp-focus').textContent = configTemporal.enfoque;
  document.getElementById('inp-break').textContent = configTemporal.descanso;
  document.getElementById('inp-cycles').textContent = configTemporal.ciclos;
  modalAjustes.classList.add('show');
}

// Cierra el modal. Si se hizo clic en la tarjeta (no en el fondo), no cierra.
function cerrarAjustes(evento) {
  if (evento && evento.target !== modalAjustes) return;
  modalAjustes.classList.remove('show');
}

// Límites mínimos y máximos para cada campo del modal.
var LIMITES = {
  enfoque: [1, 60],
  descanso: [1, 30],
  ciclos: [1, 10]
};

// Sube o baja un valor del modal sin pasarse de los límites.
function ajustarValor(campo, cambio) {
  var minimo = LIMITES[campo][0];
  var maximo = LIMITES[campo][1];
  configTemporal[campo] = Math.min(Math.max(configTemporal[campo] + cambio, minimo), maximo);

  var mapaIds = { enfoque: 'inp-focus', descanso: 'inp-break', ciclos: 'inp-cycles' };
  document.getElementById(mapaIds[campo]).textContent = configTemporal[campo];
}

// Guarda los ajustes en el servidor (Flask) y reinicia el reloj con los nuevos valores.
function aplicarAjustes() {
  var datos = {
    focus_minutes: configTemporal.enfoque,
    break_minutes: configTemporal.descanso,
    cycles: configTemporal.ciclos
  };

  fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (respuesta) {
    if (respuesta.status === 'ok') {
      config.enfoque = respuesta.config.focus_minutes;
      config.descanso = respuesta.config.break_minutes;
      config.ciclos = respuesta.config.cycles;
      modalAjustes.classList.remove('show');
      reiniciarTemporizador();
      mostrarAviso('Configuración aplicada ✓');
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
