# Taller práctico: Progressive Web App (PWA) básica

Este taller está diseñado para que se desarrolle en aproximadamente **30 minutos**.  
La idea es que cada compañero pueda hacer **fork** o copiar este repositorio, ejecutar la aplicación y comprobar por sí mismo cómo funciona una **Progressive Web App**.

## Objetivo del taller

Construir una PWA mínima que permita:

- ver una interfaz web funcional,
- agregar tareas sencillas,
- registrar un **Service Worker**,
- activar el uso de **caché**,
- funcionar en **modo offline** después de la primera carga,
- identificar el archivo `manifest.json`,
- entender de forma práctica qué hace cada componente de una PWA.

---

## Qué incluye este proyecto

La estructura del proyecto es la siguiente:

```text
pwa-taller/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.json
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

---

## Requisitos

Para ejecutar el taller necesitas:

- Un navegador moderno, preferiblemente **Google Chrome** o **Microsoft Edge**.
- Un editor de código, por ejemplo **Visual Studio Code**.
- Una forma de servir el proyecto localmente:
  - Live Server en VS Code, o
  - un servidor simple de Python.

> Importante: las PWA necesitan un entorno seguro para funcionar correctamente.  
> Para pruebas locales, `localhost` es válido.

---

## Paso 1: Descargar o hacer fork del repositorio

Cada estudiante debe:

1. Clonar el repositorio o hacer fork.
2. Abrir la carpeta del proyecto en su editor de código.
3. Verificar que existan todos los archivos listados arriba.

---

## Paso 2: Ejecutar el proyecto

### Opción A: Live Server
1. Abrir el proyecto en VS Code.
2. Instalar la extensión **Live Server** si no está instalada.
3. Hacer clic derecho sobre `index.html`.
4. Seleccionar **Open with Live Server**.

### Opción B: Servidor local con Python
En la terminal, ubicarse dentro de la carpeta del proyecto y ejecutar:

```bash
python -m http.server 5500
```

Luego abrir en el navegador:

```text
http://localhost:5500
```

---

## Paso 3: Entender la estructura del proyecto

### 1. `index.html`
Es la estructura principal de la aplicación.  
Contiene:

- el título de la app,
- el formulario para agregar tareas,
- el espacio donde se listan las tareas,
- el enlace al `manifest.json`,
- el enlace a `styles.css`,
- y la carga de `app.js`.

### 2. `styles.css`
Define la apariencia visual de la aplicación:
- fondo,
- tarjetas,
- botones,
- entradas de texto,
- listas.

### 3. `app.js`
Contiene la lógica principal:
- registrar el Service Worker,
- mostrar el estado de conexión,
- agregar tareas a la lista,
- guardar tareas en `localStorage`.

### 4. `manifest.json`
Le dice al navegador cómo debe comportarse la app cuando se instala:
- nombre,
- color del tema,
- pantalla de inicio,
- iconos.

### 5. `sw.js`
Es el Service Worker:
- guarda archivos en caché,
- intercepta peticiones,
- permite cargar la app sin internet una vez ya fue visitada.

---

## Paso 4: Revisar el código de cada archivo

### `index.html`
Este archivo crea la interfaz visible.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#2563eb" />
  <link rel="manifest" href="manifest.json" />
  <link rel="stylesheet" href="styles.css" />
  <title>Mi PWA</title>
</head>
<body>
  <main class="container">
    <h1>Mi PWA</h1>
    <p id="estado">Estado: comprobando conexión...</p>

    <section class="card">
      <label for="tarea">Nueva tarea</label>
      <input type="text" id="tarea" placeholder="Escribe una tarea" />
      <button id="agregar">Agregar tarea</button>
    </section>

    <section class="card">
      <h2>Lista de tareas</h2>
      <ul id="lista"></ul>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

---

### `styles.css`
Este archivo define el diseño visual.

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f6fb;
  color: #111827;
}

.container {
  max-width: 720px;
  margin: 40px auto;
  padding: 24px;
}

h1 {
  margin-top: 0;
  color: #1d4ed8;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin: 8px 0;
}
```

---

### `app.js`
Este archivo agrega la lógica de la aplicación.

```javascript
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
```

---

### `manifest.json`
Este archivo le permite al navegador reconocer la app como instalable.

```json
{
  "name": "Mi PWA Taller",
  "short_name": "PWA Taller",
  "start_url": ".",
  "scope": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "description": "Aplicación básica para aprender Progressive Web Apps",
  "lang": "es",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### `sw.js`
Este archivo guarda recursos en caché y permite el modo offline.

```javascript
const CACHE_NAME = 'pwa-taller-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
```

---

## Paso 5: Probar el funcionamiento

Una vez abierto el proyecto en el navegador:

1. Escribe una tarea.
2. Pulsa **Agregar tarea**.
3. Recarga la página.
4. Verifica que la tarea siga apareciendo.
5. Abre DevTools → pestaña **Application**.
6. Revisa:
   - **Manifest**
   - **Service Workers**
   - **Cache Storage**
7. Activa el modo **Offline**.
8. Recarga la página y comprueba que sigue funcionando.

---

## Paso 6: Qué pantallazos tomar

Cada estudiante debe guardar evidencia de:

- la página principal funcionando,
- una tarea agregada,
- el manifiesto cargado en DevTools,
- el Service Worker activo,
- la caché creada,
- la app funcionando en modo offline.

---

## Paso 7: Preguntas del taller

Responder en el informe o en clase:

1. ¿Qué hace el archivo `manifest.json`?
2. ¿Qué función cumple el Service Worker?
3. ¿Por qué la app sigue funcionando sin internet?
4. ¿Qué archivos quedan guardados en caché?
5. ¿Qué diferencia hay entre una web normal y una PWA?
6. ¿Qué ventaja tiene instalarla en el dispositivo?
7. ¿Qué archivo define la experiencia de instalación?
8. ¿Qué archivo controla el modo offline?

---

## Paso 8: Entrega final

Cada grupo debe entregar:

- el enlace al repositorio de GitHub,
- capturas de pantalla del funcionamiento,
- respuestas a las preguntas,
- explicación corta de cada archivo.

---

## Criterio de evaluación sugerido

| Aspecto | Valor |
|---|---|
| Estructura del proyecto | 20% |
| Funcionamiento de la app | 20% |
| Registro del Service Worker | 20% |
| Modo offline | 20% |
| Respuestas y explicación | 20% |

---

## Nota final

Este taller está pensado para aprender lo esencial de una PWA de manera clara, corta y práctica.  
No busca hacer una app compleja, sino entender los componentes principales que hacen que una aplicación web pueda comportarse como una app instalable y offline.

