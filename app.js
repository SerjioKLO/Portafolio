/**
 * ==========================================================================
 * PORTAFOLIO PROFESIONAL — LOGICA JAVASCRIPT (app.js)
 * ==========================================================================
 * Este archivo contiene unicamente 3 funcionalidades esenciales:
 * 1. Control del Menu Movil (abrir y cerrar la barra lateral).
 * 2. Navegacion Activa al Desplazarse (ScrollSpy).
 * 3. Envio y Validacion del Formulario de Contacto.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CONTROL DEL MENU MOVIL
    // ==========================================================================
    const botonMenuMovil = document.getElementById('botonMenuMovil');
    const barraLateral = document.getElementById('barraLateral');
    const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');

    // Abre o cierra la barra lateral al hacer clic en el boton hamburguesa
    if (botonMenuMovil && barraLateral) {
        botonMenuMovil.addEventListener('click', () => {
            barraLateral.classList.toggle('abierto');
        });
    }

    // Cierra el menu automaticamente al seleccionar cualquier seccion
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', () => {
            if (barraLateral.classList.contains('abierto')) {
                barraLateral.classList.remove('abierto');
            }
        });
    });

    // ==========================================================================
    // 2. NAVEGACION ACTIVA SEGUN EL DESPLAZAMIENTO (SCROLLSPY)
    // ==========================================================================
    const secciones = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let identificadorSeccionActual = '';
        const posicionScroll = window.scrollY + 200; // Margen de deteccion visual

        secciones.forEach(seccion => {
            const distanciaSuperior = seccion.offsetTop;
            const altoSeccion = seccion.offsetHeight;

            // Evalua si el desplazamiento se encuentra dentro del rango de la seccion
            if (posicionScroll >= distanciaSuperior && posicionScroll < distanciaSuperior + altoSeccion) {
                identificadorSeccionActual = seccion.getAttribute('id');
            }
        });

        // Aplica la clase 'activo' unicamente al enlace de la seccion visible
        enlacesNavegacion.forEach(enlace => {
            enlace.classList.remove('activo');
            if (enlace.getAttribute('href') === `#${identificadorSeccionActual}`) {
                enlace.classList.add('activo');
            }
        });
    });

    // ==========================================================================
    // 3. ENVIO Y VALIDACION DEL FORMULARIO DE CONTACTO
    // ==========================================================================
    const formularioContacto = document.getElementById('formularioContacto');
    const mensajeEstadoFormulario = document.getElementById('mensajeEstadoFormulario');

    if (formularioContacto) {
        formularioContacto.addEventListener('submit', (evento) => {
            // Previene el comportamiento por defecto de recargar la pagina
            evento.preventDefault();

            // Extraccion y limpieza de espacios en blanco
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            // Verificacion de campos no vacios
            if (nombre === '' || correo === '' || mensaje === '') {
                mensajeEstadoFormulario.textContent = 'Por favor, completa todos los campos requeridos.';
                mensajeEstadoFormulario.style.color = '#c1121f';
                return;
            }

            // Confirmacion visual de envio exitoso
            mensajeEstadoFormulario.textContent = `Gracias por tu mensaje, ${nombre}. Me pondre en contacto pronto.`;
            mensajeEstadoFormulario.className = 'mensaje-estado-formulario exito';

            // Limpieza de los campos del formulario
            formularioContacto.reset();

            // Ocultamiento automatico del mensaje despues de 5 segundos
            setTimeout(() => {
                mensajeEstadoFormulario.textContent = '';
                mensajeEstadoFormulario.className = 'mensaje-estado-formulario';
            }, 5000);
        });
    }

});
