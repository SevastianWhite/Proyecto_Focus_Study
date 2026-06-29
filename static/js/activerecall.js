'use strict';

// activerecall.js — lógica del modo de práctica con tarjetas.
// Las preguntas viven en memoria: si se recarga la página se pierden (pendiente para el Avance 4).

var preguntas = [];
var indiceActual = 0;
var contadorSabia = 0;
var contadorMasOMenos = 0;
var contadorNoSabia = 0;

var inputPregunta = document.getElementById('pregunta');
var btnAgregar = document.getElementById('btnagregar');
var listaPreguntas = document.getElementById('listapreguntas');
var estadoVacio = document.getElementById('estadovacio');
var tarjeta = document.getElementById('tarjeta');
var listaPasos = document.getElementById('listapasos');
var contadorPreg = document.getElementById('contadorpreg');
var preguntaActualEl = document.getElementById('preguntaactual');
var respuestaArea = document.getElementById('respuesta-ar');
var marcador = document.getElementById('marcador');
var btnSabia = document.getElementById('btnsabia');
var btnMasOMenos = document.getElementById('btnmasomenos');
var btnNoSabia = document.getElementById('btnnosabia');
var btnAnterior = document.getElementById('btnanterior');
var btnSiguiente = document.getElementById('btnsiguiente');

btnAgregar.addEventListener('click', agregarPregunta);

inputPregunta.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    agregarPregunta();
  }
});

btnSabia.addEventListener('click', function () { registrarAutoevaluacion('sabia'); });
btnMasOMenos.addEventListener('click', function () { registrarAutoevaluacion('masomenos'); });
btnNoSabia.addEventListener('click', function () { registrarAutoevaluacion('nosabia'); });
btnAnterior.addEventListener('click', anteriorPregunta);
btnSiguiente.addEventListener('click', siguientePregunta);

function agregarPregunta() {
  var texto = inputPregunta.value.trim();
  if (texto === '') return;

  preguntas.push(texto);
  inputPregunta.value = '';
  renderizarListaPreguntas();

  // La primera pregunta agregada activa la tarjeta de práctica.
  if (preguntas.length === 1) {
    indiceActual = 0;
    estadoVacio.classList.add('oculto');
    tarjeta.classList.remove('oculto');
    mostrarPreguntaActual();
  } else {
    renderizarListaPasos();
  }
}

function eliminarPregunta(indice) {
  preguntas.splice(indice, 1);

  // Para no complicarnos con casos raros (borrar justo la que se está
  // practicando, borrar una de en medio, etc.) la práctica simplemente
  // vuelve a empezar desde la primera pregunta cada vez que se borra algo.
  indiceActual = 0;
  renderizarListaPreguntas();

  if (preguntas.length === 0) {
    estadoVacio.classList.remove('oculto');
    tarjeta.classList.add('oculto');
    listaPasos.innerHTML = '';
  } else {
    mostrarPreguntaActual();
  }
}

function renderizarListaPreguntas() {
  listaPreguntas.innerHTML = '';
  preguntas.forEach(function (texto, indice) {
    var item = document.createElement('li');

    var span = document.createElement('span');
    span.textContent = texto;
    item.appendChild(span);

    var btnBorrar = document.createElement('button');
    btnBorrar.type = 'button';
    btnBorrar.className = 'btnborrarpreg';
    btnBorrar.textContent = 'Borrar';
    btnBorrar.addEventListener('click', function () { eliminarPregunta(indice); });
    item.appendChild(btnBorrar);

    listaPreguntas.appendChild(item);
  });
}

function renderizarListaPasos() {
  listaPasos.innerHTML = '';
  preguntas.forEach(function (texto, indice) {
    var paso = document.createElement('li');
    paso.textContent = 'Pregunta ' + (indice + 1);
    paso.className = (indice === indiceActual) ? 'pasoactivo' : '';
    paso.addEventListener('click', function () { irAPregunta(indice); });
    listaPasos.appendChild(paso);
  });
}

function irAPregunta(indice) {
  indiceActual = indice;
  mostrarPreguntaActual();
}

function anteriorPregunta() {
  if (preguntas.length === 0) return;
  indiceActual = (indiceActual - 1 + preguntas.length) % preguntas.length;
  mostrarPreguntaActual();
}

function siguientePregunta() {
  if (preguntas.length === 0) return;
  indiceActual = (indiceActual + 1) % preguntas.length;
  mostrarPreguntaActual();
}

function mostrarPreguntaActual() {
  preguntaActualEl.textContent = preguntas[indiceActual];
  respuestaArea.value = '';
  contadorPreg.textContent = 'Pregunta ' + (indiceActual + 1) + ' de ' + preguntas.length;
  renderizarListaPasos();
}

function registrarAutoevaluacion(nivel) {
  if (preguntas.length === 0) return;

  if (nivel === 'sabia') {
    contadorSabia++;
  } else if (nivel === 'masomenos') {
    contadorMasOMenos++;
  } else {
    contadorNoSabia++;
  }

  marcador.textContent = 'Lo sabía: ' + contadorSabia + ' · Más o menos: ' + contadorMasOMenos + ' · No lo sabía: ' + contadorNoSabia;
  siguientePregunta();
}
