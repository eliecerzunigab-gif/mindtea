// Configuración de conexión a la base de datos Heroku
const DB_CONFIG = {
    url: 'https://tranquil-lake-75636.herokuapp.com/api',
    // En producción, esta URL debería apuntar a tu API real en Heroku
};

// Funciones para interactuar con la base de datos
class ForoDB {
    constructor() {
        this.baseUrl = DB_CONFIG.url;
    }

    // Obtener todas las publicaciones
    async obtenerPublicaciones() {
        try {
            const response = await fetch(`${this.baseUrl}/posts`);
            if (!response.ok) {
                throw new Error('Error al obtener publicaciones');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener publicaciones:', error);
            // Fallback a localStorage si la API no está disponible
            return this.obtenerPublicacionesLocal();
        }
    }

    // Crear nueva publicación
    async crearPublicacion(publicacion) {
        try {
            const response = await fetch(`${this.baseUrl}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(publicacion)
            });
            
            if (!response.ok) {
                throw new Error('Error al crear publicación');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al crear publicación:', error);
            // Fallback a localStorage
            return this.crearPublicacionLocal(publicacion);
        }
    }

    // Dar like a una publicación
    async darLike(postId) {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al dar like');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al dar like:', error);
            // Fallback a localStorage
            return this.darLikeLocal(postId);
        }
    }

    // Obtener likes de una publicación
    async obtenerLikes(postId) {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}/likes`);
            if (!response.ok) {
                throw new Error('Error al obtener likes');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener likes:', error);
            // Fallback a localStorage
            return this.obtenerLikesLocal(postId);
        }
    }

    // Guardar hashtags
    async guardarHashtags(postId, hashtags) {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}/hashtags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hashtags })
            });
            
            if (!response.ok) {
                throw new Error('Error al guardar hashtags');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al guardar hashtags:', error);
            // Fallback a localStorage
            return this.guardarHashtagsLocal(postId, hashtags);
        }
    }

    // Métodos de fallback usando localStorage
    obtenerPublicacionesLocal() {
        try {
            const publicaciones = localStorage.getItem('foro_publicaciones');
            return publicaciones ? JSON.parse(publicaciones) : [];
        } catch (error) {
            console.error('Error al obtener publicaciones de localStorage:', error);
            return [];
        }
    }

    crearPublicacionLocal(publicacion) {
        try {
            const publicaciones = this.obtenerPublicacionesLocal();
            const nuevaPublicacion = {
                ...publicacion,
                id: Date.now(),
                fecha: new Date().toISOString(),
                likes: 0,
                hashtags: []
            };
            
            publicaciones.push(nuevaPublicacion);
            localStorage.setItem('foro_publicaciones', JSON.stringify(publicaciones));
            return nuevaPublicacion;
        } catch (error) {
            console.error('Error al crear publicación en localStorage:', error);
            return null;
        }
    }

    darLikeLocal(postId) {
        try {
            const publicaciones = this.obtenerPublicacionesLocal();
            const publicacion = publicaciones.find(p => p.id === postId);
            
            if (publicacion) {
                publicacion.likes = (publicacion.likes || 0) + 1;
                localStorage.setItem('foro_publicaciones', JSON.stringify(publicaciones));
                return { likes: publicacion.likes };
            }
            return { likes: 0 };
        } catch (error) {
            console.error('Error al dar like en localStorage:', error);
            return { likes: 0 };
        }
    }

    obtenerLikesLocal(postId) {
        try {
            const publicaciones = this.obtenerPublicacionesLocal();
            const publicacion = publicaciones.find(p => p.id === postId);
            return { likes: publicacion ? (publicacion.likes || 0) : 0 };
        } catch (error) {
            console.error('Error al obtener likes de localStorage:', error);
            return { likes: 0 };
        }
    }

    guardarHashtagsLocal(postId, hashtags) {
        try {
            const publicaciones = this.obtenerPublicacionesLocal();
            const publicacion = publicaciones.find(p => p.id === postId);
            
            if (publicacion) {
                publicacion.hashtags = hashtags;
                localStorage.setItem('foro_publicaciones', JSON.stringify(publicaciones));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Error al guardar hashtags en localStorage:', error);
            return { success: false };
        }
    }
}

// Instancia global de la base de datos
const foroDB = new ForoDB();

// Funciones de utilidad para el foro
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function obtenerNombreCategoria(categoria) {
    const categorias = {
        'diagnostico': 'Diagnóstico',
        'terapias': 'Terapias',
        'educacion': 'Educación',
        'vida-cotidiana': 'Vida Cotidiana',
        'derechos': 'Derechos y Leyes',
        'otro': 'Otro'
    };
    return categorias[categoria] || 'General';
}

// Extraer hashtags del texto
function extraerHashtags(texto) {
    const hashtags = texto.match(/#[\wáéíóúñ]+/g) || [];
    return hashtags.map(tag => tag.toLowerCase()).slice(0, 5); // Máximo 5 hashtags
}

// Función global para dar like
async function darLike(postId) {
    const resultado = await foroDB.darLike(postId);
    if (resultado && resultado.likes !== undefined) {
        // Actualizar el contador en la interfaz
        const likeBtn = document.querySelector(`.experiencia-item[data-id="${postId}"] .btn-like span`);
        if (likeBtn) {
            likeBtn.textContent = resultado.likes;
        }
    }
}

// Exportar para uso global
window.foroDB = foroDB;
window.darLike = darLike;
window.formatearFecha = formatearFecha;
window.obtenerNombreCategoria = obtenerNombreCategoria;
window.extraerHashtags = extraerHashtags;
