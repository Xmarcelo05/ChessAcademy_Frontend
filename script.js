/**
 * ChessAcademy - Script Principal
 * Integrado con AWS App Runner (FastAPI) Backend
 */

// ========================================
// CONFIGURACIÓN DEL BACKEND
// ========================================
// IMPORTANTE: Cambia estas URLs cuando despliegues en AWS
const BACKEND_URL = 'http://localhost:8000'; 
const API_BASE = `${BACKEND_URL}/api/v1`;
// Generamos un ID único para la conexión WebSocket de este cliente
const CLIENT_ID = Math.random().toString(36).substring(2, 15);
const WS_URL = `ws://localhost:8000/ws/${CLIENT_ID}`; 

let websocket = null;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarTablero();
    inicializarObservador();
    cargarCursos();
    conectarWebSocket();
});

// ========================================
// 1. CARGA DINÁMICA DE CURSOS (API REST)
// ========================================
async function cargarCursos() {
    const contenedor = document.getElementById('contenedor-cursos');
    
    try {
        const respuesta = await fetch(`${API_BASE}/cursos`);
        if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
        
        const cursos = await respuesta.json();
        renderizarCursos(cursos);
    } catch (error) {
        console.error('Error fetching courses:', error);
        contenedor.innerHTML = `
            <div style="text-align: center; width: 100%; color: var(--color-error); grid-column: 1 / -1;">
                <p>⚠️ No se pudieron cargar los cursos en este momento. Por favor, intenta más tarde.</p>
                <p style="font-size: 0.8rem; margin-top: 1rem;">(Verifica que el backend de FastAPI esté corriendo en ${BACKEND_URL})</p>
            </div>
        `;
    }
}

function renderizarCursos(cursos) {
    const contenedor = document.getElementById('contenedor-cursos');
    contenedor.innerHTML = ''; // Limpiar el mensaje de carga

    cursos.forEach(curso => {
        // Determinar estilo del badge según el nivel o si está lleno
        let badgeClass = curso.nivel;
        let estadoBoton = 'disponible';
        let textoBoton = 'Inscribirse Ahora';
        
        if (curso.cupos_disponibles === 0) {
            badgeClass = 'lleno';
            estadoBoton = 'completo';
            textoBoton = 'Curso Lleno';
        }

        const card = document.createElement('div');
        card.className = 'learning-card';
        card.innerHTML = `
            <div>
                <span class="badge ${badgeClass}">${curso.nivel === 'principiante' && curso.cupos_disponibles === 0 ? 'Lleno' : curso.nivel}</span>
                <h3>${curso.nombre}</h3>
                <p class="instructor">👨‍🏫 ${curso.instructor || 'Instructor Experto'}</p>
                <p class="precio">$${curso.precio || '0.00'}</p>
                
                <div class="cupos-counter" id="cupos-${curso.id}">
                    Cupos disponibles: <span>${curso.cupos_disponibles}/${curso.cupos_totales}</span>
                </div>
            </div>
            <button class="${estadoBoton}" 
                    ${estadoBoton === 'completo' ? 'disabled' : `onclick="abrirModal('${curso.id}', '${curso.nombre}')"`}>
                ${textoBoton}
            </button>
        `;
        contenedor.appendChild(card);
    });
}

// ========================================
// 2. LÓGICA DEL FORMULARIO Y MODAL
// ========================================
function abrirModal(cursoId, nombreCurso) {
    document.getElementById('curso_id').value = cursoId;
    document.getElementById('modal-titulo-curso').innerText = `Inscripción: ${nombreCurso}`;
    document.getElementById('modal-inscripcion').classList.add('open');
    limpiarMensajes();
}

function cerrarModal() {
    document.getElementById('modal-inscripcion').classList.remove('open');
    document.getElementById('form-inscripcion').reset();
    limpiarMensajes();
}

function limpiarMensajes() {
    const msgDiv = document.getElementById('mensaje-formulario');
    msgDiv.className = 'mensaje-form';
    msgDiv.innerText = '';
}

async function procesarInscripcion(event) {
    event.preventDefault(); // Evitar que la página se recargue
    
    const botonSubmit = document.getElementById('btn-submit');
    const msgDiv = document.getElementById('mensaje-formulario');
    
    // Preparar el Payload según el esquema del Backend (Pydantic)
    const payload = {
        curso_id: document.getElementById('curso_id').value,
        fecha_inicio_preferida: document.getElementById('fecha_inicio').value,
        usuario: {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value
        }
    };

    try {
        botonSubmit.disabled = true;
        botonSubmit.innerText = 'Procesando...';
        limpiarMensajes();

        const respuesta = await fetch(`${API_BASE}/inscripciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            msgDiv.className = 'mensaje-form success';
            msgDiv.innerText = '¡Inscripción exitosa! Te hemos enviado un correo con los detalles.';
            document.getElementById('form-inscripcion').reset();
            
            // Cerrar el modal automáticamente después de 3 segundos
            setTimeout(cerrarModal, 3000);
            
            // Refrescar los cursos para actualizar los botones si se llenó
            cargarCursos();
        } else {
            // Manejar errores de validación del backend (Pydantic)
            msgDiv.className = 'mensaje-form error';
            msgDiv.innerText = data.detail || 'Hubo un error al procesar tu inscripción. Revisa tus datos.';
        }
    } catch (error) {
        console.error('Error procesando inscripción:', error);
        msgDiv.className = 'mensaje-form error';
        msgDiv.innerText = 'Error de conexión con el servidor. Intenta de nuevo.';
    } finally {
        botonSubmit.disabled = false;
        botonSubmit.innerText = 'Confirmar Inscripción';
    }
}

// ========================================
// 3. TIEMPO REAL CON WEBSOCKETS
// ========================================
function conectarWebSocket() {
    websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
        console.log('🟢 Conectado al servidor WebSocket de ChessAcademy');
        // Opcional: Suscribirse para recibir actualizaciones
        websocket.send(JSON.stringify({ tipo: "obtener_cursos" }));
    };

    websocket.onmessage = (event) => {
        const datos = JSON.parse(event.data);
        console.log('📡 Mensaje WS recibido:', datos);

        // Si el backend avisa que alguien se inscribió o los cupos cambiaron
        if (datos.tipo === 'inscripcion_procesada' || datos.tipo === 'curso_actualizado') {
            // Refrescamos toda la lista para mantener la UI sincronizada perfectamente
            // Podríamos actualizar solo el DOM específico, pero cargarCursos es más seguro
            console.log('Actualizando cupos en la interfaz...');
            cargarCursos();
        }
    };

    websocket.onclose = () => {
        console.log('🔴 Desconectado del WebSocket. Reintentando en 5s...');
        setTimeout(conectarWebSocket, 5000);
    };

    websocket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
    };
}

// ========================================
// 4. ANIMACIONES Y UI (CÓDIGO ORIGINAL)
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