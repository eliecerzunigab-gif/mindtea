// Configuración de conexión a la base de datos Heroku
const DB_CONFIG = {
    url: 'https://tranquil-lake-75636-67d7c26c6d1d.herokuapp.com/api',
    // URL actualizada con el dominio correcto de Heroku
    pollingInterval: 30000, // 30 segundos para actualizaciones automáticas
    maxRetries: 3
};

// Funciones para interactuar con la base de datos
class ForoDB {
    constructor() {
        this.baseUrl = DB_CONFIG.url;
        this.isOnline = false;
        this.lastSync = null;
        this.pollingInterval = null;
        this.checkConnection();
    }

    // Verificar conexión con la API
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            this.isOnline = response.ok;
            console.log('Estado de conexión:', this.isOnline ? 'Online' : 'Offline');
        } catch (error) {
            this.isOnline = false;
            console.log('API no disponible');
        }
    }

    // Iniciar sincronización automática
    startAutoSync() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        this.pollingInterval = setInterval(async () => {
            await this.actualizarPublicaciones();
        }, DB_CONFIG.pollingInterval);
    }

    // Detener sincronización automática
    stopAutoSync() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    // Actualizar publicaciones desde el servidor
    async actualizarPublicaciones() {
        if (!this.isOnline) {
            await this.checkConnection();
            if (!this.isOnline) return;
        }

        try {
            // Solo actualizamos la vista si hay cambios
            const publicaciones = await this.obtenerPublicaciones();
            this.lastSync = new Date();
            console.log('Actualización automática completada');
            
        } catch (error) {
            console.error('Error en actualización automática:', error);
        }
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
            throw error; // No hay fallback, solo base de datos
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
            throw error; // No hay fallback, solo base de datos
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
            throw error; // No hay fallback, solo base de datos
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
            throw error; // No hay fallback, solo base de datos
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
            throw error; // No hay fallback, solo base de datos
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
