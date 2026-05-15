# Taller práctico: Progressive Web App (PWA) básica

Este repositorio contiene una PWA pequeña, bonita y fácil de entender para que el grupo pueda practicar en aproximadamente **30 minutos**.

La idea es que cada estudiante haga **fork** o descargue el proyecto, lo ejecute, active el modo offline y responda preguntas sobre cómo funciona una PWA.

---

## 1. Objetivo del taller

Al finalizar, la app debe permitir:

- abrir la interfaz correctamente,
- agregar tareas,
- seleccionar una prioridad,
- guardar la información en el navegador,
- registrar un Service Worker,
- funcionar sin internet después de haber cargado una vez,
- identificar el archivo `manifest.json`,
- entender cómo se relacionan `index.html`, `app.js`, `sw.js` y `styles.css`.

---

## 2. Duración sugerida

- **5 min**: explicación rápida de la estructura.
- **10 min**: revisión y ejecución del código.
- **10 min**: pruebas de offline y capturas.
- **5 min**: preguntas finales.

---

## 3. Estructura del proyecto

```text
pwa-taller/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.json
├── ping.txt
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

---

## 4. Requisitos

Necesitas:

- **Google Chrome** o **Microsoft Edge**.
- **Visual Studio Code** o cualquier editor.
- Un servidor local:
  - Live Server, o
  - Python.

> Importante: una PWA necesita un origen seguro.  
> Para pruebas locales, `localhost` funciona correctamente.

---

## 5. Paso a paso para ejecutar el taller

### Paso 1: Hacer fork o descargar
1. Abrir el repositorio.
2. Hacer fork o descargar el proyecto.
3. Abrir la carpeta en el editor de código.
4. Verificar que estén todos los archivos.

### Paso 2: Abrir el proyecto
Usa una de estas opciones:

**Opción A: Live Server**
1. Abrir `index.html`.
2. Hacer clic derecho.
3. Elegir **Open with Live Server**.

**Opción B: Python**
```bash
python -m http.server 5500
```

Luego abre:
```text
http://localhost:5500
```

---

## 6. Qué hace cada archivo

### `index.html`
Contiene la estructura visual de la app:
- título,
- estado de conexión,
- formulario,
- lista de tareas.

### `styles.css`
Define el estilo:
- fondo,
- tarjetas,
- botones,
- diseño responsivo,
- colores,
- tarjetas de tareas.

### `app.js`
Tiene la lógica principal:
- guardar tareas en `localStorage`,
- mostrar la lista,
- eliminar tareas,
- verificar la conexión real,
- registrar el Service Worker.

### `sw.js`
Es el Service Worker:
- guarda recursos en caché,
- permite cargar la app offline,
- evita que la página dependa totalmente de internet.

### `manifest.json`
Le dice al navegador cómo instalar la PWA:
- nombre,
- ícono,
- colores,
- modo de visualización.

### `ping.txt`
Archivo mínimo usado para comprobar conexión real.

---

## 7. Qué mirar en el código

### 7.1 Campo principal
El usuario escribe una tarea.

### 7.2 Campo adicional
El usuario selecciona una prioridad:
- Alta
- Media
- Baja

### 7.3 Botones
- **Agregar tarea**
- **Limpiar lista**

### 7.4 Estado de conexión
La aplicación muestra:
- conectado,
- sin conexión,
- comprobando conexión.

La verificación no depende solo de `navigator.onLine`, sino de una prueba real con `ping.txt`.

---

## 8. Archivos listos para revisar

### `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#2563eb" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="manifest" href="manifest.json" />
  <link rel="icon" href="icons/icon-192.png" />
  <link rel="stylesheet" href="styles.css" />
  <title>Mi PWA Taller</title>
</head>
<body>
  <main class="shell">
    <section class="hero card">
      <div>
        <span class="tag">Taller práctico PWA</span>
        <h1>Mi PWA Taller</h1>
        <p class="lead">
          Una aplicación pequeña para entender <strong>manifest</strong>, <strong>Service Worker</strong>,
          <strong>caché</strong>, <strong>instalación</strong> y <strong>modo offline</strong>.
        </p>
      </div>

      <div class="status-panel">
        <p class="status-label">Conexión</p>
        <p id="estado" class="status state-waiting">Comprobando conexión...</p>
        <p id="estado-detalle" class="status-detail">La app verificará si hay internet real y no solo el estado del navegador.</p>
      </div>
    </section>

    <section class="card form-card">
      <div class="card-title">
        <h2>Agregar una tarea</h2>
        <p>Completa los campos y presiona “Agregar tarea”.</p>
      </div>

      <div class="grid">
        <div class="field">
          <label for="tarea">Tarea</label>
          <input type="text" id="tarea" placeholder="Ej. Revisar el Service Worker" maxlength="80" />
        </div>

        <div class="field">
          <label for="prioridad">Prioridad</label>
          <select id="prioridad">
            <option value="Alta">Alta</option>
            <option value="Media" selected>Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button id="agregar" class="primary">Agregar tarea</button>
        <button id="limpiar" class="secondary" type="button">Limpiar lista</button>
      </div>
    </section>

    <section class="card">
      <div class="list-header">
        <div>
          <h2>Lista de tareas</h2>
          <p>Tus datos se guardan en el navegador con <code>localStorage</code>.</p>
        </div>
        <span id="contador" class="counter">0 tareas</span>
      </div>

      <ul id="lista" class="task-list"></ul>
      <p class="hint">
        Prueba esto: agrega una tarea, abre DevTools, activa <strong>Offline</strong> y recarga. La app debe seguir visible y mostrar el estado correcto.
      </p>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

### `app.js`
```javascript
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

// ... resto del código ...
```

### `sw.js`
```javascript
const CACHE_NAME = 'pwa-taller-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
```

---

## 9. Cómo probar que funciona offline

1. Abrir la app.
2. Agregar 2 o 3 tareas.
3. Esperar a que se registre el Service Worker.
4. Abrir DevTools.
5. Ir a la pestaña **Network**.
6. Marcar **Offline**.
7. Recargar la página.

### Resultado esperado
- La app debe seguir cargando.
- La lista debe mantenerse.
- El estado debe cambiar a **Sin conexión**.

---

## 10. Qué deben capturar en pantallazos

- pantalla principal de la app,
- lista con tareas guardadas,
- Service Worker activo,
- modo offline activado,
- recarga de la app sin internet,
- sección `Application` o `Service Workers` en DevTools.

---

## 11. Preguntas para responder

1. ¿Qué hace el `manifest.json`?
2. ¿Qué función cumple el Service Worker?
3. ¿Por qué la app puede seguir funcionando sin internet?
4. ¿Para qué sirve la caché?
5. ¿Qué cambia al agregar el campo de prioridad?
6. ¿Por qué `navigator.onLine` no siempre es suficiente?
7. ¿Qué diferencia hay entre una web normal y una PWA?

---

## 12. Observaciones importantes

- La app está pensada para ser simple y fácil de entender.
- El código usa una prueba real de conectividad para evitar que el estado “conectado” se vea mal al volver de modo offline.
- El diseño es responsivo y funciona en móvil y escritorio.

---

## 13. Entrega sugerida

Cada grupo puede entregar:

- enlace al fork o repositorio,
- capturas de pantalla,
- respuestas a las preguntas,
- breve explicación de cómo funciona la PWA.

---

## 14. Resumen final

Una PWA combina:
- **HTML** para estructura,
- **CSS** para diseño,
- **JavaScript** para lógica,
- **manifest.json** para instalación,
- **Service Worker** para caché y offline.

Eso es lo esencial que este taller quiere mostrar.
