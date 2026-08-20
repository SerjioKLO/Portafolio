/**
 * ==========================================================================
 * PORTAFOLIO DE INGENIERÍA EN INFORMÁTICA — SERGIO
 * Lógica de Navegación, ScrollSpy, Filtros de Proyectos, Modal & Formulario
 * ==========================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. BASE DE DATOS TÉCNICA DE PROYECTOS
    // ==========================================================================
    const ProjectsData = {
        onlyfields: {
            title: 'OnlyFields ERP — Sistema de Gestión para Complejos Deportivos',
            category: 'FULLSTACK & MICROSERVICIOS',
            version: 'v1.0.0',
            github: 'https://github.com/Sebadlpc/Onlyfields',
            summary: 'ERP integral para la gestión operativa, financiera y de acceso de complejos deportivos. Digitaliza reservas de canchas, punto de venta, control de acceso físico por tokens QR de un solo uso, suscripciones de socios, seguimiento físico con fichas clínicas y generación de reportes consolidados multi-fuente.',
            architecture: 'Monorepo Maven multi-módulo con 10 microservicios independientes (Spring Boot 3.2), cada uno con su propia base de datos MySQL (patrón Database per Service). Un API Gateway centralizado (Spring Cloud Gateway) expone 16 rutas estáticas como punto de entrada único en el puerto 8080. La comunicación inter-servicio es síncrona mediante clientes FeignClient tipados. Los esquemas de base de datos se gestionan con migraciones versionadas Flyway. Todo el sistema se orquesta con Docker Compose en 12 contenedores sobre una red bridge privada.',
            challenges: 'Implementación del control de acceso físico mediante tokens QR dinámicos con validación multi-condición: suscripción vigente + reserva activa + token de un solo uso no consumido previamente, registrando el resultado (PERMITIDO/DENEGADO) y motivo de rechazo en cada evento de acceso.',
            stack: ['Java 17', 'Spring Boot 3.2', 'Spring Cloud Gateway', 'Spring Cloud OpenFeign', 'Spring Data JPA', 'Spring Security 6.2 (BCrypt)', 'Flyway 9.22', 'MySQL 8.0', 'Springdoc OpenAPI (Swagger UI)', 'JUnit 5 + Mockito', 'Jacoco 0.8', 'Docker 25', 'Docker Compose', 'Maven Wrapper']
        },
        statikk: {
            title: 'Statikk.gg — Plataforma de Estadísticas para Juegos de Riot Games',
            category: 'BACKEND & MICROSERVICIOS',
            version: 'v0.1.0 — En diseño',
            github: '#',
            summary: 'Plataforma web de estadísticas estilo op.gg orientada al ecosistema completo de Riot Games (League of Legends, Valorant, TFT y más). Permite buscar un jugador por Riot ID y visualizar su historial de partidas, estadísticas de ranked y promedios de rendimiento por campeón o agente.',
            architecture: 'Arquitectura de microservicios con Spring Boot (Java 21) y PostgreSQL como base de datos principal. Cada dominio de juego se encapsulará en un servicio independiente que consume la Riot Games API oficial, normaliza los datos y los persiste para servir métricas agregadas con baja latencia. Un API Gateway centraliza el acceso desde el frontend.',
            challenges: 'Gestión de los rate limits de la Riot Games API, sincronización eficiente del historial de partidas de múltiples juegos, y cálculo de promedios de estadísticas sobre grandes volúmenes de datos sin degradar los tiempos de respuesta.',
            stack: ['Java 21', 'Spring Boot 3.x', 'Spring Cloud Gateway', 'Spring Data JPA', 'PostgreSQL', 'Riot Games API', 'Docker', 'Maven']
        },
        edugraph: {
            title: 'EduGraph — Gestor Curricular & Grafo de Prerrequisitos',
            category: 'FULL STACK & MODELADO RELACIONAL',
            version: 'v2.1.0',
            github: 'https://github.com',
            summary: 'Plataforma web académica que modela la malla curricular de ingeniería como un Grafo Dirigido Acíclico (DAG), calculando rutas críticas de titulación, detectando prerrequisitos encadenados y validando correquisitos.',
            architecture: 'Backend con API REST en Node.js y Express conectado a PostgreSQL. Esquema relacional completamente normalizado en Tercera Forma Normal (3FN), con consultas recursivas en SQL (WITH RECURSIVE) para resolver árboles de dependencias.',
            challenges: 'Detección estricta de ciclos y cálculo de ordenamiento topológico mediante el algoritmo de Kahn para prevenir dependencias circulares al crear mallas personalizadas.',
            stack: ['Node.js', 'Express.js', 'PostgreSQL (3FN)', 'JavaScript Modular', 'SQL Recursivo', 'REST API']
        },
        logpulse: {
            title: 'LogPulse — Colector Concurrente de Eventos y Telemetría',
            category: 'BACKEND CONCURRENTE & WEBSOCKETS',
            version: 'v1.0.4',
            github: 'https://github.com',
            summary: 'Microservicio backend para captura y agregación de logs en tiempo real con búfer circular en memoria para mitigar la sobrecarga de E/S en disco y transmisión inmediata a tableros mediante WebSockets.',
            architecture: 'Servidor basado en eventos sobre Node.js. Implementa una estructura de datos Ring Buffer de capacidad acotada en memoria RAM que absorbe ráfagas de logs antes de volcarlos en persistencia por lotes (batching).',
            challenges: 'Control de concurrencia y prevención de desbordamientos de memoria bajo alta carga de peticiones HTTP concurrentes.',
            stack: ['Node.js', 'WebSockets (ws)', 'Estructura Ring Buffer', 'Docker', 'REST Endpoints']
        },
        kuroiengine: {
            title: 'KuroiEngine — Visualizador y Analizador de Algoritmos',
            category: 'ALGORITMOS & GRAFOS',
            version: 'v1.1.2',
            github: 'https://github.com',
            summary: 'Motor interactivo para simular paso a paso la ejecución de algoritmos de caminos mínimos sobre grafos ponderados dirigidos y no dirigidos, visualizando colas de prioridad y matrices de adyacencia.',
            architecture: 'Capa de visualización basada en nodos vectoriales SVG manipulados mediante un loop de animación con soporte para pausar, retroceder y ajustar la velocidad de ejecución.',
            challenges: 'Diseño de una cola de prioridad basada en montículo binario (Binary Min-Heap) optimizada para actualizar pesos de nodos con tiempo logarítmico O(log V).',
            stack: ['JavaScript ES6+', 'Algoritmos Dijkstra & A*', 'Binary Min-Heap', 'SVG Dinámico', 'CSS']
        }
    };

    // ==========================================================================
    // 2. ELEMENTOS DOM PRINCIPALES
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-strike-link');
    const sections = document.querySelectorAll('.section-container');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarNavbar = document.getElementById('sidebarNavbar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const toastContainer = document.getElementById('toastContainer');
    
    // Modal DOM
    const modal = document.getElementById('projectDetailsModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
    const modalProjectCategory = document.getElementById('modalProjectCategory');
    const modalProjectVersion = document.getElementById('modalProjectVersion');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectBody = document.getElementById('modalProjectBody');
    const modalGithubLink = document.getElementById('modalGithubLink');

    // Botones de acción
    const btnDownloadCv = document.getElementById('btnDownloadCv');
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const emailAddress = document.getElementById('emailAddress');
    const contactForm = document.getElementById('contactForm');

    // ==========================================================================
    // 3. NAVEGACIÓN & SCROLLSPY
    // ==========================================================================
    
    // Configuración del Intersection Observer para la navbar lateral
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                updateActiveNavLink(activeId);
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            const targetSection = link.getAttribute('data-section');
            if (targetSection === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Scroll suave al hacer clic en enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Cerrar menú móvil si está abierto
                closeMobileNav();
            }
        });
    });

    // ==========================================================================
    // 4. CONTROL DE MENÚ MÓVIL RESPONSIVO
    // ==========================================================================
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = sidebarNavbar.classList.contains('is-active');
            if (isOpened) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeMobileNav);
    }

    function openMobileNav() {
        sidebarNavbar.classList.add('is-active');
        sidebarBackdrop.classList.add('is-active');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
        sidebarNavbar.classList.remove('is-active');
        sidebarBackdrop.classList.remove('is-active');
        if (mobileNavToggle) {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // ==========================================================================
    // 5. FILTRADO DE TRABAJOS / PROYECTOS
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // 6. VENTANA MODAL DE DETALLES TÉCNICOS DE PROYECTO
    // ==========================================================================
    const modalTriggers = document.querySelectorAll('[data-open-modal]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const projectId = trigger.getAttribute('data-open-modal');
            openProjectModal(projectId);
        });
    });

    function openProjectModal(projectId) {
        const data = ProjectsData[projectId];
        if (!data) return;

        modalProjectCategory.textContent = data.category;
        modalProjectVersion.textContent = data.version;
        modalProjectTitle.textContent = data.title;
        modalGithubLink.href = data.github;

        modalProjectBody.innerHTML = `
            <div>
                <h4 class="modal-section-title">Resumen del Proyecto</h4>
                <p>${data.summary}</p>
            </div>
            <div>
                <h4 class="modal-section-title">Arquitectura del Sistema</h4>
                <p>${data.architecture}</p>
            </div>
            <div>
                <h4 class="modal-section-title">Desafíos Algorítmicos & Solución</h4>
                <p>${data.challenges}</p>
            </div>
            <div>
                <h4 class="modal-section-title">Stack Tecnológico & Herramientas</h4>
                <div class="work-meta-row" style="margin-top: 8px;">
                    ${data.stack.map(tech => `<span class="work-tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // ==========================================================================
    // 7. DESCARGA DEL CURRÍCULUM VITAE (CV)
    // ==========================================================================
    if (btnDownloadCv) {
        btnDownloadCv.addEventListener('click', () => {
            generateAndDownloadCv();
        });
    }

    function generateAndDownloadCv() {
        showToast('Generando Currículum Vitae oficial de Sergio...');

        // Contenido del CV en formato Markdown / Texto técnico formal
        const cvContent = `===================================================================
CURRÍCULUM VITAE — SERGIO
Ingeniero Informático | Desarrollador de Software Junior
Santiago, Chile • Email: serjio.dev@gmail.com
GitHub: github.com • LinkedIn: linkedin.com
===================================================================

PERFIL PROFESIONAL XD
-------------------------------------------------------------------
Ingeniero informático enfocado en la construcción de software con 
rigor técnico, fundamentos computacionales y principios de arquitectura 
limpia. Experiencia en desarrollo web full stack, diseño de APIs RESTful,
modelado relacional en bases de datos (SQL normalizado en 3FN) y 
resolución de problemas algorítmicos eficientes.

COMPETENCIAS TÉCNICAS
-------------------------------------------------------------------
• Lenguajes: JavaScript (ES6+), TypeScript, SQL, Node.js, C/C++ básico, Python.
• Backend & APIs: Express.js, RESTful Architecture, WebSockets, JWT.
• Bases de Datos: PostgreSQL, MySQL, Modelado ER, 3FN, Optimización de consultas.
• Frontend: HTML5 Semántico, CSS3 Avanzado (Flexbox, Grid), SPA modulares.
• Herramientas & DevOps: Git, GitHub Flow, Docker básico, Linux / Bash, Jest.
• Fundamentos: Estructuras de datos, Análisis asintótico Big-O, Grafos (DAG).

PROYECTOS DESTACADOS
-------------------------------------------------------------------
1. SysAlloc — Simulador Visual de Paginación & Memoria Virtual
   - Modelado de marcos de memoria y reemplazo de páginas (FIFO, LRU, Óptimo).
   - Renderizado en HTML5 Canvas con pruebas unitarias en Jest.

2. EduGraph — Gestor Curricular & Grafo de Prerrequisitos
   - Modelado de mallas universitarias como Grafo Dirigido Acíclico (DAG).
   - API REST en Node.js/PostgreSQL con consultas SQL recursivas y orden topológico.

3. LogPulse — Colector Concurrente de Eventos y Telemetría
   - Microservicio con búfer circular (Ring Buffer) en RAM y WebSockets en tiempo real.

4. KuroiEngine — Analizador & Visualizador de Algoritmos de Grafos
   - Visualización interactiva de Dijkstra y A* con montículos binarios (Min-Heap).

FORMACIÓN ACADÉMICA
-------------------------------------------------------------------
Ingeniería en Informática
Enfoque en Ciencias de la Computación, Arquitectura de Sistemas y Algoritmos.

===================================================================
Documento verificado y actualizado a 2026.`;

        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'CV_Sergio_Ingeniero_Informatico.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        setTimeout(() => {
            showToast('✓ CV descargado exitosamente.');
        }, 800);
    }

    // ==========================================================================
    // 8. COPIAR EMAIL AL PORTAPAPELES
    // ==========================================================================
    if (btnCopyEmail && emailAddress) {
        btnCopyEmail.addEventListener('click', () => {
            const email = emailAddress.textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                showToast('✓ Correo copiado: ' + email);
                const copyTextSpan = document.getElementById('copyEmailText');
                if (copyTextSpan) {
                    const original = copyTextSpan.textContent;
                    copyTextSpan.textContent = '¡Copiado!';
                    setTimeout(() => {
                        copyTextSpan.textContent = original;
                    }, 2000);
                }
            }).catch(() => {
                showToast('Correo: ' + email);
            });
        });
    }

    // ==========================================================================
    // 9. VALIDACIÓN & ENVÍO DEL FORMULARIO DE CONTACTO
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');

            // Validar Nombre
            if (!nameInput.value.trim()) {
                setFieldError(nameInput, true);
                isValid = false;
            } else {
                setFieldError(nameInput, false);
            }

            // Validar Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                setFieldError(emailInput, true);
                isValid = false;
            } else {
                setFieldError(emailInput, false);
            }

            // Validar Asunto
            if (!subjectInput.value.trim()) {
                setFieldError(subjectInput, true);
                isValid = false;
            } else {
                setFieldError(subjectInput, false);
            }

            // Validar Mensaje
            if (messageInput.value.trim().length < 10) {
                setFieldError(messageInput, true);
                isValid = false;
            } else {
                setFieldError(messageInput, false);
            }

            if (isValid) {
                const submitBtn = document.getElementById('btnSubmitForm');
                const originalContent = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-text">Enviando mensaje...</span>';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    contactForm.reset();
                    showToast('✓ Mensaje enviado correctamente. Gracias por contactarme.');
                }, 1200);
            }
        });

        // Limpiar errores mientras el usuario escribe
        ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    setFieldError(el, false);
                });
            }
        });
    }

    function setFieldError(element, hasError) {
        const parent = element.closest('.form-field');
        if (parent) {
            if (hasError) {
                parent.classList.add('has-error');
            } else {
                parent.classList.remove('has-error');
            }
        }
    }

    // ==========================================================================
    // 10. SISTEMA DE TOAST NOTIFICATIONS
    // ==========================================================================
    function showToast(message) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3500);
    }

})();
