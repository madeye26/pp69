// Theme Color Selector Functionality

// Available theme colors
const themeColors = {
    blue: {
        primary: '#3a8eff',
        hover: '#2a7de9',
        focus: 'rgba(58, 142, 255, 0.5)'
    },
    green: {
        primary: '#4caf50',
        hover: '#3d8b40',
        focus: 'rgba(76, 175, 80, 0.5)'
    },
    purple: {
        primary: '#9c27b0',
        hover: '#7b1fa2',
        focus: 'rgba(156, 39, 176, 0.5)'
    },
    orange: {
        primary: '#ff9800',
        hover: '#f57c00',
        focus: 'rgba(255, 152, 0, 0.5)'
    },
    teal: {
        primary: '#009688',
        hover: '#00796b',
        focus: 'rgba(0, 150, 136, 0.5)'
    }
};

// Function to create the theme color selector
function createThemeColorSelector() {
    // Check if the selector already exists
    if (document.querySelector('.theme-color-selector')) {
        // If it exists, make sure it has the event listener
        const existingSelector = document.querySelector('.theme-color-selector');
        
        // Remove existing event listeners to avoid duplicates
        const newSelector = existingSelector.cloneNode(true);
        existingSelector.parentNode.replaceChild(newSelector, existingSelector);
        
        // Add the click event listener
        newSelector.addEventListener('click', toggleColorOptions);
        return;
    }
    
    // Create the theme color selector button
    const themeColorSelector = document.createElement('div');
    themeColorSelector.className = 'theme-color-selector';
    themeColorSelector.setAttribute('title', 'تخصيص الألوان');
    themeColorSelector.innerHTML = '<i class="fas fa-palette"></i>';
    themeColorSelector.addEventListener('click', toggleColorOptions);
    
    // Create the color options container
    const colorOptions = document.createElement('div');
    colorOptions.className = 'theme-color-options';
    
    // Add color options
    Object.keys(themeColors).forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${color}`;
        colorOption.setAttribute('data-color', color);
        colorOption.setAttribute('title', color);
        colorOption.addEventListener('click', () => applyThemeColor(color));
        colorOptions.appendChild(colorOption);
    });
    
    // Close color options when clicking outside
    document.addEventListener('click', (event) => {
        const selector = document.querySelector('.theme-color-selector');
        const options = document.querySelector('.theme-color-options');
        if (selector && options && !selector.contains(event.target) && !options.contains(event.target)) {
            options.classList.remove('show');
        }
    });
    
    // Append elements to the body
    document.body.appendChild(themeColorSelector);
    document.body.appendChild(colorOptions);
}

// Function to toggle color options visibility
function toggleColorOptions() {
    const colorOptions = document.querySelector('.theme-color-options');
    if (colorOptions) {
        colorOptions.classList.toggle('show');
    }
}

// Function to apply the selected theme color
function applyThemeColor(color) {
    // Get the selected color theme
    const selectedTheme = themeColors[color];
    if (!selectedTheme) return;
    
    // Remove existing theme classes
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-teal');
    
    // Add the new theme class
    document.body.classList.add(`theme-${color}`);
    
    // Update CSS variables for both light and dark mode
    document.documentElement.style.setProperty('--primary-color', selectedTheme.primary);
    document.documentElement.style.setProperty('--dark-primary', selectedTheme.primary);
    
    // Save the selected theme to localStorage
    localStorage.setItem('themeColor', color);
}

// Function to initialize the theme color
function initializeThemeColor() {
    // Create the theme color selector
    createThemeColorSelector();
    
    // Check for saved theme color preference
    const savedThemeColor = localStorage.getItem('themeColor');
    
    // Apply saved theme color or default to blue
    if (savedThemeColor && themeColors[savedThemeColor]) {
        applyThemeColor(savedThemeColor);
    }
}

// Initialize theme color when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeThemeColor);