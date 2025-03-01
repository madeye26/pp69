// Dashboard Customizer Module
const dashboardCustomizer = {
    init: function() {
        console.log('Dashboard customizer module initialized');
        this.loadCustomizations();
    },

    // Load saved customizations
    loadCustomizations: function() {
        const savedLayout = localStorage.getItem('dashboardLayout');
        if (savedLayout) {
            try {
                const layout = JSON.parse(savedLayout);
                this.applyLayout(layout);
            } catch (error) {
                console.error('Error loading dashboard layout:', error);
            }
        }
    },

    // Apply layout customizations
    applyLayout: function(layout) {
        const dashboard = document.querySelector('.dashboard-container');
        if (!dashboard) return;

        Object.entries(layout).forEach(([elementId, properties]) => {
            const element = document.getElementById(elementId);
            if (element) {
                Object.entries(properties).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
            }
        });
    },

    // Save current layout
    saveLayout: function() {
        const layout = this.getCurrentLayout();
        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
        window.showAlert('تم حفظ تخطيط لوحة التحكم', 'success');
    },

    // Get current layout
    getCurrentLayout: function() {
        const layout = {};
        const elements = document.querySelectorAll('.dashboard-container [id]');
        
        elements.forEach(element => {
            layout[element.id] = {
                width: element.style.width,
                height: element.style.height,
                order: element.style.order
            };
        });

        return layout;
    }
};

// Initialize dashboard customizer
document.addEventListener('DOMContentLoaded', () => {
    dashboardCustomizer.init();
});

// Export dashboard customizer
window.dashboardCustomizer = dashboardCustomizer;
