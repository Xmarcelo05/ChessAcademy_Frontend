/**
 * ChessAcademy - Script Principal
 * Integrado con FastAPI Backend (Versión CRUD Simple)
 */

// Si levantas el backend localmente, responderá en este puerto
const BACKEND_URL = 'http://localhost:8000'; 
const API_BASE = `${BACKEND_URL}/api/v1`;

document.addEventListener('DOMContentLoaded', () => {
    inicializarTablero();
    inicializarObservador();
    cargarCursos(); // Llama a la API apenas carga la página
});

// ========================================
// CARGA DINÁMICA DE CURSOS (API REST - GET)
// ========================================
async function cargarCursos() {
    const contenedor = document.getElementById('contenedor-cursos');
    
    try {
        // Hace la petición GET a tu backend en Python
        const respuesta = await fetch(`${API_BASE}/cursos`);
        if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
        
        const cursos = await respuesta.json();
        renderizarCursos(cursos);
    } catch (error) {
        console.error('Error fetching courses:', error);
        contenedor.innerHTML = `
            <div style="text-align: center; width: 100%; color: var(--color-error); grid-column: 1 / -1;">
                <p>⚠️ No se pudieron cargar los cursos. Verifica que el backend esté corriendo.</p>
            </div>
        `;
    }
}

function renderizarCursos(cursos) {
    const contenedor = document.getElementById('contenedor-cursos');
    contenedor.innerHTML = ''; 

    cursos.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'learning-card';
        card.innerHTML = `
            <div>
                <span class="badge ${curso.nivel}">${curso.nivel}</span>
                <h3>${curso.nombre}</h3>
                <p class="precio">$${curso.precio}</p>
                <div class="cupos-counter">
                    Cupos totales: <span>${curso.cupos_totales}</span>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// ========================================
// ANIMACIONES VISUALES ORIGINALES
// ========================================
function inicializarTablero() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
        const esNegra = (index % 2 === 0 && Math.floor(index / 8) % 2 === 0) ||
                        (index % 2 !== 0 && Math.floor(index / 8) % 2 !== 0);
        if (esNegra && Math.random() > 0.7) {
            square.classList.add('active');
        }
        square.style.animationDelay = `${index * 0.02}s`;
    });
}

function inicializarObservador() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function navegarASeccion(sectionId) {
    const seccion = document.querySelector(`#${sectionId}`);
    if (seccion) seccion.scrollIntoView({ behavior: 'smooth' });
}
