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

## 8.  Cómo probar que funciona offline

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

## 9. Qué deben capturar en pantallazos

- pantalla principal de la app,
- lista con tareas guardadas,
- Service Worker activo,
- modo offline activado,
- recarga de la app sin internet,
- sección `Application` o `Service Workers` en DevTools.

---

## 10. Preguntas para responder

1. ¿Qué hace el `manifest.json`?
2. ¿Qué función cumple el Service Worker?
3. ¿Por qué la app puede seguir funcionando sin internet?
4. ¿Para qué sirve la caché?
5. ¿Qué cambia al agregar el campo de prioridad?
6. ¿Por qué `navigator.onLine` no siempre es suficiente?
7. ¿Qué diferencia hay entre una web normal y una PWA?

---

## 11. Observaciones importantes

- La app está pensada para ser simple y fácil de entender.
- El código usa una prueba real de conectividad para evitar que el estado “conectado” se vea mal al volver de modo offline.
- El diseño es responsivo y funciona en móvil y escritorio.

---

## 12. Entrega sugerida

Cada grupo puede entregar:

- capturas de pantalla
- respuestas a las preguntas

---

## 14. Resumen final

Una PWA combina:
- **HTML** para estructura,
- **CSS** para diseño,
- **JavaScript** para lógica,
- **manifest.json** para instalación,
- **Service Worker** para caché y offline.

Eso es lo esencial que este taller quiere mostrar.
