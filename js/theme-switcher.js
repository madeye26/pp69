// Theme Switcher Module

const themeSwitcher = {
    // Theme states
    isDarkMode: false,
    currentTheme: 'light',

    // Initialize theme switcher
    init: function() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        // Add theme toggle button listener
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Add system theme preference listener
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            this.setTheme(e.matches ? 'dark' : 'light');
        });

        console.log('Theme switcher initialized');
    },

    // Toggle between light and dark themes
    toggleTheme: function() {
        const newTheme = this.isDarkMode ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    // Set specific theme
    setTheme: function(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        
        this.isDarkMode = theme === 'dark';
        this.currentTheme = theme;
        
        // Save theme preference
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="fas fa-${this.isDarkMode ? 'sun' : 'moon'}"></i>`;
        }
    }
};

// Initialize theme switcher on page load
document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher.init();
});

// Export theme switcher
window.themeSwitcher = themeSwitcher;
