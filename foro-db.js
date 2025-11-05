// Configuración de conexión a la base de datos Heroku
const DB_CONFIG = {
    url: 'https://tranquil-lake-75636.herokuapp.com/api',
    // En producción, esta URL debería apuntar a tu API real en Heroku
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
            console.log('API no disponible, usando localStorage');
        }
    }

    // Iniciar sincronización automática
    startAutoSync() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        this.pollingInterval = setInterval(async () => {
            await this.syncLocalToServer();
        }, DB_CONFIG.pollingInterval);
    }

    // Detener sincronización automática
    stopAutoSync() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    // Sincronizar localStorage con el servidor
    async syncLocalToServer() {
        if (!this.isOnline) {
            await this.checkConnection();
            if (!this.isOnline) return;
        }

        try {
            const publicacionesLocales = this.obtenerPublicacionesLocal();
            const publicacionesServidor = await this.obtenerPublicaciones();
            
            // Encontrar publicaciones locales que no están en el servidor
            const publicacionesParaSincronizar = publicacionesLocales.filter(local => 
                !publicacionesServidor.some(server => server.id === local.id)
            );

            // Sincronizar cada publicación local con el servidor
            for (const publicacion of publicacionesParaSincronizar) {
                await this.crearPublicacion(publicacion);
            }

            // Actualizar localStorage con datos del servidor
            const publicacionesActualizadas = await this.obtenerPublicaciones();
            localStorage.setItem('foro_publicaciones', JSON.stringify(publicacionesActualizadas));
            
            this.lastSync = new Date();
            console.log('Sincronización completada:', publicacionesParaSincronizar.length, 'publicaciones sincronizadas');
            
        } catch (error) {
            console.error('Error en sincronización:', error);
        }
    }

    // Obtener publicaciones con sincronización automática
    async obtenerPublicacionesConSync() {
        if (this.isOnline) {
            try {
                const publicaciones = await this.obtenerPublicaciones();
                // Actualizar localStorage con datos del servidor
                localStorage.setItem('foro_publicaciones', JSON.stringify(publicaciones));
                return publicaciones;
            } catch (error) {
                console.error('Error al obtener publicaciones del servidor:', error);
                return this.obtenerPublicacionesLocal();
            }
        } else {
            return this.obtenerPublicacionesLocal();
        }
    }

    // Crear publicación con sincronización automática
    async crearPublicacionConSync(publicacion) {
        let resultado;
        
        if (this.isOnline) {
            try {
                resultado = await this.crearPublicacion(publicacion);
                // Actualizar localStorage con la nueva publicación
                const publicaciones = this.obtenerPublicacionesLocal();
                publicaciones.push(resultado);
                localStorage.setItem('foro_publicaciones', JSON.stringify(publicaciones));
            } catch (error) {
                console.error('Error al crear publicación en servidor:', error);
                resultado = this.crearPublicacionLocal(publicacion);
            }
        } else {
            resultado = this.crearPublicacionLocal(publicacion);
        }

        return resultado;
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
