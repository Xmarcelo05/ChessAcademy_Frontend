/**
 * ChessAcademy - Script Principal
 * Contiene toda la funcionalidad interactiva de la landing page
 */

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarTablero();
    inicializarObservador();
    inicializarEventos();
});


// ========================================
// FUNCIONES DE TABLERO DE AJEDREZ
// ========================================

/**
 * Inicializa el tablero con animaciones y efectos visuales
 */
function inicializarTablero() {
    const squares = document.querySelectorAll('.square');
    
    squares.forEach((square, index) => {
        // Determina si la casilla debe ser activada
        const esNegra = (index % 2 === 0 && Math.floor(index / 8) % 2 === 0) ||
                        (index % 2 !== 0 && Math.floor(index / 8) % 2 !== 0);
        
        // Activar algunas casillas aleatoriamente para efecto visual
        if (esNegra && Math.random() > 0.7) {
            square.classList.add('active');
        }
        
        // Agregar delay a la animación de aparición
        square.style.animationDelay = `${index * 0.02}s`;
    });
}


// ========================================
// OBSERVADOR DE INTERSECCIÓN
// ========================================

/**
 * Inicializa el observador para animaciones de scroll
 */
function inicializarObservador() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}


// ========================================
// EVENTOS E INTERACTIVIDAD
// ========================================

/**
 * Inicializa todos los eventos de la página
 */
function inicializarEventos() {
    // Evento del botón CTA principal
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const seccionTecnicas = document.querySelector('#tecnicas');
            if (seccionTecnicas) {
                seccionTecnicas.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Animación de barras de progreso al entrar en viewport
    animarBarrasProgreso();

    // Efectos hover en tarjetas
    agregarEfectosHover();
}


/**
 * Anima las barras de progreso cuando entran en vista
 */
function animarBarrasProgreso() {
    const stats = document.querySelectorAll('.stat');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progresoBarra = entry.target.querySelector('.progress-fill');
                if (progresoBarra) {
                    // Forzar reflow para reiniciar la animación
                    progresoBarra.style.animation = 'none';
                    setTimeout(() => {
                        progresoBarra.style.animation = '';
                    }, 10);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}


/**
 * Agrega efectos hover interactivos a las tarjetas
 */
function agregarEfectosHover() {
    const cards = document.querySelectorAll('.tech-card, .learning-card, .timeline-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}


// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Muestra un mensaje emergente personalizado
 * @param {string} mensaje - El mensaje a mostrar
 */
function mostrarMensaje(mensaje) {
    // Opción 1: Alert nativo
    alert(mensaje);

    // Opción 2: Descomenta para usar una notificación personalizada
    // mostrarNotificacionPersonalizada(mensaje);
}


/**
 * Muestra una notificación personalizada (opcional)
 * @param {string} mensaje - El mensaje a mostrar
 */
function mostrarNotificacionPersonalizada(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d4a574 0%, #f5d87e 100%);
        color: #1a1a1a;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.5s ease-out;
        font-weight: 600;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notificacion.remove();
        }, 500);
    }, 3000);
}


/**
 * Navega suavemente a una sección
 * @param {string} sectionId - El ID de la sección
 */
function navegarASeccion(sectionId) {
    const seccion = document.querySelector(`#${sectionId}`);
    if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
    }
}


/**
 * Obtiene el color de la variable CSS
 * @param {string} nombreVariable - Nombre de la variable CSS
 * @returns {string} - Valor de la variable
 */
function obtenerColorCSS(nombreVariable) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${nombreVariable}`)
        .trim();
}


// ========================================
// FUNCIONES AVANZADAS (OPCIONAL)
// ========================================

/**
 * Habilita modo oscuro/claro
 */
function cambiarTema() {
    const html = document.documentElement;
    const tema = localStorage.getItem('tema') || 'claro';
    
    if (tema === 'claro') {
        html.style.filter = 'invert(1) hue-rotate(180deg)';
        localStorage.setItem('tema', 'oscuro');
    } else {
        html.style.filter = 'none';
        localStorage.setItem('tema', 'claro');
    }
}


/**
 * Rastrea eventos de usuario para analytics (opcional)
 * @param {string} nombreEvento - Nombre del evento
 * @param {object} datos - Datos adicionales del evento
 */
function rastrearEvento(nombreEvento, datos = {}) {
    console.log(`Evento: ${nombreEvento}`, datos);
    
    // Aquí puedes integrar con Google Analytics u otra herramienta
    // if (typeof gtag === 'function') {
    //     gtag('event', nombreEvento, datos);
    // }
}


/**
 * Valida un formulario de contacto (si lo agregamos)
 * @param {object} formData - Datos del formulario
 * @returns {boolean} - True si el formulario es válido
 */
function validarFormulario(formData) {
    if (!formData.nombre || formData.nombre.trim() === '') {
        console.error('El nombre es requerido');
        return false;
    }

    if (!formData.email || !validarEmail(formData.email)) {
        console.error('El email es inválido');
        return false;
    }

    return true;
}


/**
 * Valida un formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es un email válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * Desplaza la página suavemente hacia arriba
 */
function irAlInicio() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/**
 * Copia texto al portapapeles
 * @param {string} texto - Texto a copiar
 */
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarMensaje('¡Copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}


// ========================================
// EXPORTAR FUNCIONES (para uso en HTML)
// ========================================

// Hacer funciones disponibles globalmente si es necesario
window.mostrarMensaje = mostrarMensaje;
window.navegarASeccion = navegarASeccion;
window.cambiarTema = cambiarTema;
window.irAlInicio = irAlInicio;
window.copiarAlPortapapeles = copiarAlPortapapeles;
