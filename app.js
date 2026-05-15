const inputTarea = document.getElementById('tarea');
const botonAgregar = document.getElementById('agregar');
const listaTareas = document.getElementById('lista');
const estado = document.getElementById('estado');

const STORAGE_KEY = 'pwa-taller-tareas';

function actualizarEstadoConexion() {
  if (navigator.onLine) {
    estado.textContent = 'Estado: conectado a Internet';
    estado.style.color = 'green';
  } else {
    estado.textContent = 'Estado: sin conexión (modo offline)';
    estado.style.color = 'red';
  }
}

function cargarTareas() {
  const tareas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  listaTareas.innerHTML = '';

  tareas.forEach((tarea) => {
    const li = document.createElement('li');
    li.textContent = tarea;
    listaTareas.appendChild(li);
  });
}

function guardarTarea(nuevaTarea) {
  const tareas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  tareas.push(nuevaTarea);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

botonAgregar.addEventListener('click', () => {
  const tarea = inputTarea.value.trim();

  if (!tarea) {
    alert('Escribe una tarea antes de agregarla.');
    return;
  }

  guardarTarea(tarea);
  cargarTareas();
  inputTarea.value = '';
  inputTarea.focus();
});

window.addEventListener('online', actualizarEstadoConexion);
window.addEventListener('offline', actualizarEstadoConexion);

actualizarEstadoConexion();
cargarTareas();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then((registro) => {
        console.log('Service Worker registrado correctamente:', registro.scope);
      })
      .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}
