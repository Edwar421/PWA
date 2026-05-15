const inputTarea = document.getElementById('tarea');
const selectPrioridad = document.getElementById('prioridad');
const botonAgregar = document.getElementById('agregar');
const botonLimpiar = document.getElementById('limpiar');
const listaTareas = document.getElementById('lista');
const estado = document.getElementById('estado');
const estadoDetalle = document.getElementById('estado-detalle');
const contador = document.getElementById('contador');

const STORAGE_KEY = 'pwa-taller-tareas-v2';
const PING_URL = './ping.txt';

function obtenerTareas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function guardarTareas(tareas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

function renderizarTareas() {
  const tareas = obtenerTareas();
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'empty';
    vacio.textContent = 'Todavía no hay tareas. Agrega la primera arriba.';
    listaTareas.appendChild(vacio);
    contador.textContent = '0 tareas';
    return;
  }

  tareas.forEach((tarea, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const contenedor = document.createElement('div');
    contenedor.className = 'task-content';

    const titulo = document.createElement('div');
    titulo.className = 'task-title';
    titulo.textContent = tarea.texto;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const prioridad = document.createElement('span');
    prioridad.className = `badge badge-${tarea.prioridad.toLowerCase()}`;
    prioridad.textContent = `Prioridad: ${tarea.prioridad}`;

    const fecha = document.createElement('span');
    fecha.textContent = `Guardada: ${tarea.fecha}`;

    meta.appendChild(prioridad);
    meta.appendChild(fecha);

    contenedor.appendChild(titulo);
    contenedor.appendChild(meta);

    const eliminar = document.createElement('button');
    eliminar.className = 'delete-btn';
    eliminar.type = 'button';
    eliminar.textContent = 'Eliminar';
    eliminar.addEventListener('click', () => {
      const tareasActualizadas = obtenerTareas().filter((_, i) => i !== index);
      guardarTareas(tareasActualizadas);
      renderizarTareas();
    });

    li.appendChild(contenedor);
    li.appendChild(eliminar);
    listaTareas.appendChild(li);
  });

  contador.textContent = `${tareas.length} tarea${tareas.length === 1 ? '' : 's'}`;
}

function setEstado(conectado, detalle) {
  estado.classList.remove('state-online', 'state-offline', 'state-waiting');

  if (conectado === true) {
    estado.classList.add('state-online');
    estado.textContent = 'Conectado a Internet';
  } else if (conectado === false) {
    estado.classList.add('state-offline');
    estado.textContent = 'Sin conexión (modo offline)';
  } else {
    estado.classList.add('state-waiting');
    estado.textContent = 'Comprobando conexión...';
  }

  estadoDetalle.textContent = detalle;
}

async function verificarConexionReal() {
  if (!navigator.onLine) {
    setEstado(false, 'El navegador indicó que no hay conexión.');
    return false;
  }

  setEstado(null, 'Verificando acceso real a red...');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const respuesta = await fetch(`${PING_URL}?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (respuesta.ok) {
      setEstado(true, 'La prueba de red respondió correctamente.');
      return true;
    }

    setEstado(false, 'La prueba de red no respondió como se esperaba.');
    return false;
  } catch {
    setEstado(false, 'No fue posible confirmar conexión real. La app sigue operando con caché.');
    return false;
  }
}

function agregarTarea() {
  const texto = inputTarea.value.trim();
  const prioridad = selectPrioridad.value;

  if (!texto) {
    alert('Escribe una tarea antes de agregarla.');
    inputTarea.focus();
    return;
  }

  const tareas = obtenerTareas();
  tareas.unshift({
    texto,
    prioridad,
    fecha: new Date().toLocaleString('es-CO')
  });

  guardarTareas(tareas);
  inputTarea.value = '';
  selectPrioridad.value = 'Media';
  renderizarTareas();
  inputTarea.focus();
}

function limpiarLista() {
  const confirmar = confirm('¿Quieres borrar todas las tareas guardadas?');
  if (!confirmar) return;

  localStorage.removeItem(STORAGE_KEY);
  renderizarTareas();
}

botonAgregar.addEventListener('click', agregarTarea);
botonLimpiar.addEventListener('click', limpiarLista);

inputTarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    agregarTarea();
  }
});

window.addEventListener('online', verificarConexionReal);
window.addEventListener('offline', verificarConexionReal);

renderizarTareas();
verificarConexionReal();

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
