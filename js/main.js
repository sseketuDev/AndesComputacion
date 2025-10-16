// Andescomputacion - Main JavaScript
class AndesComputacion {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeader();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupLazyLoading();
        this.setupFormHandlers();
        this.setupIntersectionObserver();
        this.setupAccessibility();
    }

    // Header scroll effect
    setupHeader() {
        const header = document.getElementById('main-header');
        if (!header) return;

        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', scrollHandler);
        scrollHandler(); // Ejecutar al cargar
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.getElementById('main-nav');
        
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking on links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // Smooth scroll for anchor links
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.getElementById('main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus management for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    targetElement.removeAttribute('tabindex');
                }
            });
        });
    }

    // Lazy loading for images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Form handling
    setupFormHandlers() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Enviando...';
                
                try {
                    // Simular envío (reemplazar con tu endpoint real)
                    await this.submitForm(form);
                    
                    // Success feedback
                    this.showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                    form.reset();
                    
                } catch (error) {
                    // Error feedback
                    this.showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
                    console.error('Form submission error:', error);
                } finally {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = originalText;
                }
            });
        });
    }

    // Form submission (simulado - reemplazar con tu implementación real)
    async submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Aquí iría tu lógica real de envío
        console.log('Form data:', data);
        
        return { success: true };
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        // Estilos básicos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'error' ? '#dc3545' : '#28a745',
            color: 'white',
            borderRadius: '5px',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos para animación
        document.querySelectorAll('.servicio-card, .producto-card, .proceso-step').forEach(el => {
            observer.observe(el);
        });
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Focus management for modal-like elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.body.style.overflow === 'hidden') {
                e.preventDefault();
            }
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.removeAttribute('tabindex');
                }
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AndesComputacion();
});

// Exportar para uso global si es necesario
window.AndesComputacion = AndesComputacion;