// JavaScript para la aplicación MindTea

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    
    // Menú hamburguesa para móviles
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll para navegación (solo para anclas en la misma página)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Solo aplicar smooth scroll para anclas en la misma página
            if (targetId.startsWith('#') && window.location.pathname.endsWith('index.html')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Ajuste para header fijo
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Para enlaces a otras páginas, dejar que el navegador maneje la navegación normalmente
        });
    });

    // Animación de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.proposito-card, .recurso-card, .contacto-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Manejo del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre || !email || !mensaje) {
                showNotification('Por favor, completa todos los campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido.', 'error');
                return;
            }
            
            // Simular envío del formulario
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simular delay de envío
            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para mostrar notificaciones
    function showNotification(message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Colores según el tipo
        if (type === 'success') {
            notification.style.background = 'var(--primary-color)';
        } else if (type === 'error') {
            notification.style.background = '#f44336';
        } else {
            notification.style.background = 'var(--accent-color)';
        }
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Efectos hover mejorados para tarjetas de recursos
    const recursoCards = document.querySelectorAll('.recurso-card');
    recursoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animación de contadores (opcional para estadísticas futuras)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Cambio de color del header al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'var(--shadow)';
        }
    });

    // Preloader (opcional)
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });

    // Efectos de parallax para elementos flotantes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Validación en tiempo real del formulario
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = 'var(--primary-color)';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e0e0e0';
            }
        });
    });

    // Tooltips para elementos interactivos
    const tooltipElements = document.querySelectorAll('.recurso-action');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Haz clic para explorar';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                transform: translateY(-100%);
                margin-top: -10px;
            `;
            this.appendChild(tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Efecto de typing para el título (opcional)
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Inicializar efecto typing en el título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 70);
        }, 1000);
    }

    console.log('MindTea Web App inicializada correctamente');
});

// Funciones específicas para descargas
function descargarRecurso(tipo) {
    let nombreArchivo = '';
    let mensaje = '';
    
    switch(tipo) {
        case 'pictogramas':
            nombreArchivo = 'Set_Pictogramas_Rutinas_MindTea.pdf';
            mensaje = 'Set de Pictogramas de Rutinas';
            break;
        case 'agenda':
            nombreArchivo = 'Agenda_Visual_Semanal_MindTea.pdf';
            mensaje = 'Agenda Visual Semanal';
            break;
        case 'emociones':
            nombreArchivo = 'Termometro_Emociones_MindTea.pdf';
            mensaje = 'Termómetro de Emociones';
            break;
        default:
            nombreArchivo = 'Recurso_MindTea.pdf';
            mensaje = 'Recurso de MindTea';
    }
    
    // Simular descarga (en un entorno real, esto sería un enlace a un archivo real)
    const enlace = document.createElement('a');
    enlace.href = '#'; // En un entorno real, sería la URL del archivo
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    
    // Mostrar notificación de éxito
    showNotification(`✅ Descarga iniciada: ${mensaje}`, 'success');
    
    // En un entorno real, aquí se podría agregar tracking de descargas
    console.log(`Descarga iniciada: ${mensaje}`);
}

// Función para mostrar notificaciones (si no está definida en el scope principal)
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Colores según el tipo
    if (type === 'success') {
        notification.style.background = 'var(--primary-color)';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
    } else {
        notification.style.background = 'var(--accent-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Funciones utilitarias adicionales
const MindTeaUtils = {
    // Formatear números
    formatNumber: function(num) {
        return new Intl.NumberFormat('es-CL').format(num);
    },
    
    // Capitalizar texto
    capitalize: function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    // Obtener fecha formateada
    getFormattedDate: function() {
        return new Date().toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Validar teléfono chileno
    isValidChileanPhone: function(phone) {
        const phoneRegex = /^(\+?56)?(\s?)(0?)(\s?)[98765432]\d{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// Exportar para uso global (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindTeaUtils;
}
