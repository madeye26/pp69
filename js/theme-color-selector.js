// Theme Color Selector Module

const themeColorSelector = {
    // Available color themes
    colors: {
        default: {
            primary: '#0d6efd',
            secondary: '#6c757d',
            success: '#198754',
            info: '#0dcaf0',
            warning: '#ffc107',
            danger: '#dc3545'
        },
        blue: {
            primary: '#1976d2',
            secondary: '#607d8b',
            success: '#43a047',
            info: '#03a9f4',
            warning: '#ffb300',
            danger: '#e53935'
        },
        green: {
            primary: '#2e7d32',
            secondary: '#546e7a',
            success: '#388e3c',
            info: '#00acc1',
            warning: '#ffa000',
            danger: '#d32f2f'
        }
    },

    // Initialize color selector
    init: function() {
        // Check for saved color theme
        const savedTheme = localStorage.getItem('colorTheme');
        if (savedTheme && this.colors[savedTheme]) {
            this.applyColorTheme(savedTheme);
        }

        // Create color selector if it doesn't exist
        this.createColorSelector();

        console.log('Theme color selector initialized');
    },

    // Create color selector UI
    createColorSelector: function() {
        const container = document.createElement('div');
        container.className = 'color-selector';
        container.innerHTML = `
            <div class="color-selector-toggle">
                <i class="fas fa-palette"></i>
            </div>
            <div class="color-selector-menu">
                ${Object.keys(this.colors).map(theme => `
                    <div class="color-option" data-theme="${theme}">
                        <span class="color-preview" style="background-color: ${this.colors[theme].primary}"></span>
                        <span class="color-name">${theme}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                this.applyColorTheme(option.dataset.theme);
            });
        });

        // Add toggle functionality
        const toggle = container.querySelector('.color-selector-toggle');
        const menu = container.querySelector('.color-selector-menu');
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        document.body.appendChild(container);
    },

    // Apply color theme
    applyColorTheme: function(themeName) {
        if (!this.colors[themeName]) return;

        const theme = this.colors[themeName];
        const root = document.documentElement;

        // Set CSS variables
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${key}-color`, value);
        });

        // Save theme preference
        localStorage.setItem('colorTheme', themeName);

        // Update active state in selector
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === themeName);
        });
    }
};

// Initialize color selector on page load
document.addEventListener('DOMContentLoaded', () => {
    themeColorSelector.init();
});

// Export theme color selector
window.themeColorSelector = themeColorSelector;
