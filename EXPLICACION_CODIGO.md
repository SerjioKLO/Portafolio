# Guia de Estudio y Explicacion Tecnica del Portafolio

Este documento fue disenado para que puedas comprender y explicar cada componente de tu codigo con precision tecnica y claridad conceptual durante tu evaluacion.

---

## 1. Estructura General del Proyecto

El proyecto se compone de tres archivos principales y una carpeta de recursos:

```text
Portafolio/
│
├── index.html            # Estructura semantica del sitio (HTML5)
├── styles.css            # Diseno visual, variables y adaptabilidad (CSS3)
├── app.js                # Comportamiento interactivo y eventos (JavaScript Vanilla)
└── assets/               # Recursos graficos (logotipo y fotografia)
```

---

## 2. Explicacion Detallada de `index.html` (Estructura)

El archivo HTML define el esqueleto y significado de los contenidos utilizando **HTML5 Semantico**. Todas las clases e identificadores estan nombrados en espanol para reflejar directamente su funcion.

### A. Encabezado del Documento (`<head>`)
* `<!DOCTYPE html>`: Declara al navegador que el documento utiliza el estandar HTML5.
* `<html lang="es">`: Establece el idioma espanol como lenguaje del documento.
* `<meta charset="UTF-8">`: Permite la representacion de caracteres latinos (acentos y enes).
* `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Configura la escala inicial y adapta el ancho visual al dispositivo (base del diseno responsivo).
* `<link rel="stylesheet" href="styles.css">`: Vincula la hoja de estilos externa.

---

### B. Barra Lateral Fija (`<aside class="barra-lateral" id="barraLateral">`)
Se utiliza `<aside>` para delimitar contenido lateral complementario.
* **`<div class="cabecera-barra-lateral">`**: Agrupa el logotipo (`.logo-barra-lateral`) y el bloque de identificacion (`.titulo-barra-lateral`).
* **`<nav class="navegacion-barra-lateral">`**: Bloque semantico de navegacion que contiene una lista (`<ul class="lista-navegacion">`) con los enlaces a las cinco secciones (`.enlace-navegacion`).
* **`<div class="pie-barra-lateral">`**: Contenedor inferior con enlaces a perfiles externos (`.enlaces-redes`) y el texto de derechos (`.derechos-autor`).

---

### C. Contenedor Principal (`<main class="contenido-principal">`)
Encapsula el cuerpo central de la pagina dividido en cinco secciones (`<section class="seccion">`):

1. **Seccion Inicio (`#inicio`, `.seccion-portada`)**:
   * Contiene el mensaje de disponibilidad (`.etiqueta-disponibilidad`), el titulo principal (`.titulo-principal`), la descripcion y los botones de accion (`.boton-primario` y `.boton-secundario`).
2. **Seccion Sobre Mi (`#sobre-mi`)**:
   * Distribuye el contenido en dos columnas: el marco de fotografia (`.marco-foto-perfil` con `.foto-perfil`) y el bloque de texto descriptivo (`.texto-sobre-mi`), acompanado de una rejilla de datos personales (`.rejilla-datos-personales`).
3. **Seccion Habilidades (`#habilidades`)**:
   * Presenta cuatro tarjetas (`.tarjeta-habilidad`) organizadas en cuadricula (`.rejilla-habilidades`), cada una con un identificador numerico, titulo, parrafo y lista de etiquetas tecnicas (`.lista-etiquetas-habilidad`).
4. **Seccion Proyectos (`#proyectos`)**:
   * Utiliza la etiqueta semantica `<article class="tarjeta-proyecto">` para cada trabajo individual, categorizado mediante `.etiqueta-categoria-proyecto`, listado de tecnologias (`.lista-tecnologias-proyecto`) y enlace al repositorio (`.enlace-boton`).
5. **Seccion Contacto (`#contacto`)**:
   * Presenta un contenedor dividido (`.contenedor-contacto`) entre las tarjetas informativas (`.columna-informacion-contacto`) y el formulario interactivo (`<form class="formulario-contacto" id="formularioContacto">`).

---

### D. Pie de Pagina (`<footer class="pie-pagina">`)
* Cierre semantico con los creditos de desarrollo.

---

### E. Script (`<script src="app.js">`)
* Se ubica antes del cierre de `</body>` para garantizar que todo el arbol de elementos este cargado antes de que el codigo JavaScript se ejecute.

---

## 3. Explicacion Detallada de `styles.css` (Diseno)

El archivo CSS controla el formato visual, la jerarquia y la adaptabilidad a diferentes pantallas.

### A. Variables Globales (`:root`)
Centralizan los valores clave para facilitar el mantenimiento bajo el principio DRY (*Don't Repeat Yourself*):
* `--color-primario: #c1121f;`: Tono carmesi utilizado para botones, enfasis y estados activos.
* `--fondo-barra-lateral: #121316;`: Fondo oscuro de la barra de navegacion.
* `--fondo-principal: #ffffff;`: Fondo blanco del area de lectura principal.
* `--ancho-barra-lateral: 270px;`: Ancho fijo reservado para el menu lateral en pantallas de escritorio.

### B. Reseteo Universal (`*`)
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
* Elimina inconsistencias entre navegadores. `box-sizing: border-box` calcula el ancho total incluyendo relleno y borde, evitando desbordamientos de caja.

### C. Esquemas de Maquetacion
* **Flexbox (`display: flex`)**: Usado para alineaciones unidimensionales (filas de botones, items del menu, distribucion vertical de la barra lateral).
* **CSS Grid (`display: grid`)**: Usado para composiciones bidimensionales en columnas y filas, como `.rejilla-habilidades` y `.rejilla-proyectos` (`grid-template-columns: repeat(2, 1fr)`).

### D. Posicionamiento Fijo (`position: fixed`)
* La clase `.barra-lateral` permanece anclada a la izquierda de la ventana independiente del desplazamiento vertical del usuario.

### E. Reglas de Medios (@media) y Adaptabilidad
```css
@media (max-width: 860px) { ... }
```
* En pantallas menores a 860 pixeles (tablets y telefonos):
  1. Se activa el boton de menu movil (`.boton-menu-movil`).
  2. La barra lateral se traslada fuera de la vista (`transform: translateX(-100%)`) y se despliega solo al recibir la clase `.abierto`.
  3. Las cuadriculas de dos columnas se transforman a una sola columna (`grid-template-columns: 1fr`).

---

## 4. Explicacion Detallada de `app.js` (Interactividad)

El script de JavaScript implementa la interactividad minima y necesaria mediante tres modulos:

### A. Evento Inicial (`DOMContentLoaded`)
* `document.addEventListener('DOMContentLoaded', ...)` asegura que la manipulacion del DOM comience unicamente cuando la estructura HTML este disponible en memoria.

---

### B. Modulo 1: Menu Movil
```javascript
botonMenuMovil.addEventListener('click', () => {
    barraLateral.classList.toggle('abierto');
});
```
* Alterna la clase CSS `.abierto` en la barra lateral al interactuar con el boton de hamburguesa.
* Contiene un recorrido con `forEach` sobre `.enlace-navegacion` para cerrar el menu cuando el usuario selecciona una seccion.

---

### C. Modulo 2: Deteccion de Seccion Activa (ScrollSpy)
```javascript
window.addEventListener('scroll', () => { ... });
```
* Escucha el evento de desplazamiento de la ventana.
* Compara la posicion actual (`window.scrollY`) contra el punto de inicio de cada seccion (`seccion.offsetTop`).
* Asigna la clase `.activo` al enlace de la seccion visible y la retira de los demas.

---

### D. Modulo 3: Gestion del Formulario
```javascript
formularioContacto.addEventListener('submit', (evento) => {
    evento.preventDefault();
    ...
});
```
* **`evento.preventDefault()`**: Anula la recarga predeterminada de la pagina al enviar un formulario.
* **Validacion con `.trim()`**: Comprueba que los campos de texto no contengan unicamente espacios en blanco.
* **Respuesta y reseteo**: Muestra el mensaje de confirmacion mediante la clase `.exito` y restablece los campos con `formularioContacto.reset()`.

---

## 5. Preguntas Clave para la Evaluacion Oral

### 1. Que es el DOM y como interactua tu codigo JavaScript con el?
> **Respuesta:**
> "El DOM (Document Object Model) es la representacion en memoria del documento HTML estructurada como un arbol de nodos. En mi archivo JavaScript utilizo metodos nativos como `document.getElementById` y `document.querySelectorAll` para referenciar elementos, escuchar eventos mediante `addEventListener` y modificar dinamicamente sus clases con `classList`."

---

### 2. Por que es importante utilizar etiquetas semanticas en HTML?
> **Respuesta:**
> "Las etiquetas semanticas como `aside`, `nav`, `main`, `section` y `article` otorgan un significado estructural concreto. Esto optimiza la accesibilidad para tecnologias de asistencia (como lectores de pantalla), mejora la indexacion en motores de busqueda (SEO) y facilita la comprension y mantenimiento del codigo por parte de otros desarrolladores."

---

### 3. Cual es el proposito de `evento.preventDefault()` en el formulario?
> **Respuesta:**
> "El comportamiento estandar de un formulario en HTML al ejecutarse el evento submit es realizar una peticion HTTP sincrona que recarga la pagina completa. Al invocar `evento.preventDefault()`, detenemos esa accion nativa para procesar los datos de manera asincrona o local con JavaScript, validando la entrada y mostrando la respuesta sin interrumpir la sesion del usuario."

---

### 4. Como funciona el diseno responsivo en esta aplicacion?
> **Respuesta:**
> "El diseno responsivo se basa en tres componentes:
> 1. La directiva `<meta name="viewport">` en el encabezado para el escalado correcto.
> 2. Reglas de consulta de medios (`@media`) en CSS que reorganizan la interfaz a una sola columna cuando el ancho de pantalla es menor o igual a 860 pixeles.
> 3. Logica en JavaScript para alternar la visibilidad de la barra lateral mediante la clase `.abierto` en dispositivos moviles."

---

### 5. Que ventajas aporta el uso de variables CSS (:root)?
> **Respuesta:**
> "Permite centralizar valores repetitivos como la paleta de colores (`--color-primario`, `--fondo-barra-lateral`) y familias tipograficas. Esto asegura coherencia visual en todo el documento y simplifica cualquier actualizacion de diseno desde un unico bloque de definicion."
