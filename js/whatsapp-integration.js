// WhatsApp Integration System
class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '56961938981';
        this.init();
    }

    init() {
        this.setupWhatsAppButtons();
        this.setupProductLinks();
        this.setupContactForms();
        this.setupFloatingButton();
    }

    // Configurar todos los botones de WhatsApp
    setupWhatsAppButtons() {
        document.querySelectorAll('[data-whatsapp]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp(button.dataset.message || 'Hola, me interesa sus servicios');
            });
        });
    }

    // Configurar enlaces de productos
    setupProductLinks() {
        document.querySelectorAll('.btn-producto-whatsapp').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productName = button.closest('.producto-card').querySelector('h3').textContent;
                const productPrice = button.closest('.producto-card').querySelector('.precio').textContent;
                const message = `Hola, me interesa el producto: ${productName} - ${productPrice}`;
                this.openWhatsApp(message);
            });
        });
    }

    // Configurar formularios de contacto
    setupContactForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    // Manejar envío de formularios vía WhatsApp
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        let message = 'Hola, quisiera contactarlos por lo siguiente:\n\n';
        
        if (data.nombre) message += `*Nombre:* ${data.nombre}\n`;
        if (data.email) message += `*Email:* ${data.email}\n`;
        if (data.telefono) message += `*Teléfono:* ${data.telefono}\n`;
        if (data.servicio) message += `*Servicio de interés:* ${data.servicio}\n`;
        if (data.mensaje) message += `*Mensaje:* ${data.mensaje}\n`;
        
        message += `\n*Fecha:* ${new Date().toLocaleDateString('es-CL')}`;
        
        this.openWhatsApp(message);
        
        // Mostrar confirmación
        this.showConfirmation('¡Formulario listo! Serás redirigido a WhatsApp para enviar tu mensaje.');
        
        // Limpiar formulario después de un tiempo
        setTimeout(() => form.reset(), 1000);
    }

    // Configurar botón flotante
    setupFloatingButton() {
        const floatButton = document.querySelector('.whatsapp-float');
        if (floatButton) {
            floatButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp('Hola, me gustaría obtener más información sobre sus servicios');
            });
        }
    }

    // Abrir WhatsApp con mensaje predefinido
    openWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        // Abrir en nueva pestaña
        window.open(whatsappUrl, '_blank');
        
        // Track event (opcional para analytics)
        this.trackWhatsAppEvent(message);
    }

    // Seguimiento de eventos (opcional)
    trackWhatsAppEvent(message) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': message.substring(0, 50)
            });
        }
        
        console.log('WhatsApp event:', {
            message: message.substring(0, 100),
            timestamp: new Date().toISOString()
        });
    }

    // Mostrar confirmación
    showConfirmation(text) {
        const notification = document.createElement('div');
        notification.className = 'whatsapp-confirmation';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #25D366;
                color: white;
                padding: 20px 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                animation: fadeIn 0.3s ease;
            ">
                <i class="fab fa-whatsapp" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p style="margin: 0; font-weight: 500;">${text}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Generar mensaje para producto
    generateProductMessage(productElement) {
        const name = productElement.querySelector('h3').textContent;
        const price = productElement.querySelector('.precio').textContent;
        const specs = Array.from(productElement.querySelectorAll('.especificacion'))
            .map(spec => spec.textContent)
            .join(', ');
        
        return `Hola, me interesa el producto:\n\n*${name}*\nPrecio: ${price}\nEspecificaciones: ${specs}\n\n¿Podrían darme más información?`;
    }

    // Método para cambiar número (útil si tienes múltiples números)
    setPhoneNumber(number) {
        this.phoneNumber = number;
    }
}

// Inicializar integración de WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappIntegration = new WhatsAppIntegration();
});