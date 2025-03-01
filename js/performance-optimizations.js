// Performance Optimizations Module

const performanceUtils = {
    // Initialize performance optimizations
    initPerformanceOptimizations: function() {
        // Debounce event handlers
        this.setupDebouncing();
        
        // Enable lazy loading for images
        this.setupLazyLoading();
        
        // Cache frequently accessed DOM elements
        this.cacheElements();
        
        console.log('Performance optimizations initialized');
    },

    // Setup debouncing for event handlers
    setupDebouncing: function() {
        // Debounce window resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle resize
                console.log('Window resize handled');
            }, 250);
        });
    },

    // Setup lazy loading for images
    setupLazyLoading: function() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    // Cache frequently accessed DOM elements
    cacheElements: function() {
        this.mainContent = document.getElementById('main-content');
        this.alertContainer = document.getElementById('alert-container');
    }
};

// Export performance utils
window.performanceUtils = performanceUtils;
