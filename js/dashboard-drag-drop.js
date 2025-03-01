// Dashboard Drag and Drop Module
const dashboardDragDrop = {
    init: function() {
        console.log('Dashboard drag and drop module initialized');
        this.setupDragAndDrop();
    },

    // Setup drag and drop functionality
    setupDragAndDrop: function() {
        const draggableElements = document.querySelectorAll('.draggable');
        const dropZones = document.querySelectorAll('.drop-zone');

        draggableElements.forEach(element => {
            element.setAttribute('draggable', true);
            
            element.addEventListener('dragstart', (e) => {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id);
            });

            element.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const draggedId = e.dataTransfer.getData('text/plain');
                const draggedElement = document.getElementById(draggedId);
                
                if (draggedElement && zone.children.length === 0) {
                    zone.appendChild(draggedElement);
                    this.saveLayout();
                }
            });
        });
    },

    // Save current layout after drag and drop
    saveLayout: function() {
        const layout = {};
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach((zone, index) => {
            if (zone.children.length > 0) {
                const elementId = zone.children[0].id;
                layout[elementId] = {
                    position: index,
                    zoneId: zone.id
                };
            }
        });

        localStorage.setItem('dashboardDragDropLayout', JSON.stringify(layout));
        
        // Notify customizer to update its layout
        if (window.dashboardCustomizer) {
            window.dashboardCustomizer.saveLayout();
        }
    },

    // Load saved layout
    loadLayout: function() {
        const savedLayout = localStorage.getItem('dashboardDragDropLayout');
        if (savedLayout) {
            try {
                const layout = JSON.parse(savedLayout);
                this.applyLayout(layout);
            } catch (error) {
                console.error('Error loading drag and drop layout:', error);
            }
        }
    },

    // Apply saved layout
    applyLayout: function(layout) {
        Object.entries(layout).forEach(([elementId, position]) => {
            const element = document.getElementById(elementId);
            const zone = document.getElementById(position.zoneId);
            
            if (element && zone) {
                zone.appendChild(element);
            }
        });
    }
};

// Initialize dashboard drag and drop
document.addEventListener('DOMContentLoaded', () => {
    dashboardDragDrop.init();
});

// Export dashboard drag and drop
window.dashboardDragDrop = dashboardDragDrop;
