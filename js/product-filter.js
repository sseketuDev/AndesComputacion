// Product Filter System
class ProductFilter {
    constructor() {
        this.products = [];
        this.activeCategory = 'todos';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupFiltering();
    }

    cacheElements() {
        this.filterButtons = document.querySelectorAll('.categoria-btn');
        this.productGrid = document.querySelector('.productos-grid');
        this.productCards = document.querySelectorAll('.producto-card');
    }

    bindEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Keyboard navigation for filters
        this.filterButtons.forEach(btn => {
            btn.addEventListener('keydown', (e) => this.handleFilterKeydown(e));
        });
    }

    handleFilterClick(e) {
        const button = e.currentTarget;
        const category = button.dataset.categoria;
        
        this.setActiveCategory(category);
        this.filterProducts();
        this.updateURL(category);
    }

    handleFilterKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleFilterClick(e);
        }

        // Arrow key navigation between filter buttons
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateFilters(e.key);
        }
    }

    navigateFilters(direction) {
        const currentIndex = Array.from(this.filterButtons).findIndex(btn => 
            btn.classList.contains('active')
        );
        
        let newIndex;
        if (direction === 'ArrowRight') {
            newIndex = (currentIndex + 1) % this.filterButtons.length;
        } else {
            newIndex = (currentIndex - 1 + this.filterButtons.length) % this.filterButtons.length;
        }
        
        const newButton = this.filterButtons[newIndex];
        this.setActiveCategory(newButton.dataset.categoria);
        this.filterProducts();
        newButton.focus();
    }

    setActiveCategory(category) {
        // Update button states
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        const activeButton = Array.from(this.filterButtons).find(btn => 
            btn.dataset.categoria === category
        );
        
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-pressed', 'true');
            this.activeCategory = category;
        }
    }

    filterProducts() {
        const startTime = performance.now();
        
        this.productCards.forEach(card => {
            const cardCategory = card.dataset.categoria;
            const shouldShow = this.activeCategory === 'todos' || cardCategory === this.activeCategory;
            
            // Usar requestAnimationFrame para animaciones suaves
            requestAnimationFrame(() => {
                if (shouldShow) {
                    this.showProduct(card);
                } else {
                    this.hideProduct(card);
                }
            });
        });

        // Anunciar cambios para lectores de pantalla
        this.announceFilterResults();
        
        const endTime = performance.now();
        console.log(`Filtering took ${endTime - startTime}ms`);
    }

    showProduct(card) {
        card.style.display = 'block';
        
        // Animación de entrada
        requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        });
    }

    hideProduct(card) {
        // Animación de salida
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    announceFilterResults() {
        const visibleCount = this.getVisibleProductCount();
        const message = `${visibleCount} productos ${this.activeCategory === 'todos' ? 'en total' : 'en esta categoría'}`;
        
        // Crear elemento de anuncio para lectores de pantalla
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remover después de que se anuncie
        setTimeout(() => announcement.remove(), 1000);
    }

    getVisibleProductCount() {
        return Array.from(this.productCards).filter(card => 
            card.style.display !== 'none'
        ).length;
    }

    updateURL(category) {
        if (category === 'todos') {
            history.replaceState(null, '', window.location.pathname);
        } else {
            const newUrl = `${window.location.pathname}?categoria=${category}`;
            history.replaceState(null, '', newUrl);
        }
    }

    setupFiltering() {
        // Cargar categoría desde URL si existe
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('categoria');
        
        if (categoryFromUrl && this.isValidCategory(categoryFromUrl)) {
            this.setActiveCategory(categoryFromUrl);
            this.filterProducts();
        }
    }

    isValidCategory(category) {
        return Array.from(this.filterButtons).some(btn => 
            btn.dataset.categoria === category
        );
    }

    // Método para agregar productos dinámicamente
    addProducts(products) {
        products.forEach(product => {
            this.products.push(product);
        });
        this.renderProducts();
    }

    renderProducts() {
        // Implementación para renderizar productos dinámicamente
        console.log('Render products method would go here');
    }
}

// Inicializar filtro de productos
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.categoria-btn')) {
        window.productFilter = new ProductFilter();
    }
});

// Exportar para pruebas o uso extendido
window.ProductFilter = ProductFilter;