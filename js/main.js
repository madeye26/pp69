// Main Application Logic

// Show/Hide Loading Spinner
function toggleLoading(show) {
    const spinner = document.getElementById('loading-overlay');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Show Alert Message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Toggle Sidebar
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('wrapper').classList.toggle('toggled');
        });
    }

    // Navigation Links
    const navLinks = document.querySelectorAll('.list-group-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
        });
    });

    // Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await firebase.auth().signOut();
                showAlert('تم تسجيل الخروج بنجاح', 'success');
                window.location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                showAlert('حدث خطأ أثناء تسجيل الخروج', 'danger');
            }
        });
    }
}

// Navigation Handler
function navigateToPage(page) {
    // Update active state in sidebar
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Update page title
    const pageTitle = document.querySelector('.navbar-title');
    if (pageTitle) {
        pageTitle.textContent = getPageTitle(page);
    }

    // Render page content
    renderPage(page);
}

// Get Page Title
function getPageTitle(page) {
    const titles = {
        'dashboard': 'لوحة التحكم',
        'employees-form': 'إدخال بيانات الموظفين',
        'employees-list': 'قائمة الموظفين',
        'payroll': 'كشف الرواتب',
        'advances': 'السلف',
        'attendance': 'الحضور والغياب',
        'reports': 'التقارير'
    };
    return titles[page] || 'لوحة التحكم';
}

// Render Page Content
function renderPage(page) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    switch (page) {
        case 'dashboard':
            renderDashboard(mainContent);
            break;
        case 'employees-form':
            renderEmployeeForm(mainContent);
            break;
        case 'employees-list':
            renderEmployeesList(mainContent);
            break;
        case 'payroll':
            renderPayroll(mainContent);
            break;
        case 'advances':
            renderAdvances(mainContent);
            break;
        case 'attendance':
            renderAttendance(mainContent);
            break;
        case 'reports':
            renderReports(mainContent);
            break;
        default:
            renderDashboard(mainContent);
    }
}

// Render Dashboard
function renderDashboard(container) {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h5>إجمالي الموظفين</h5>
                    <h3>0</h3>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <h5>إجمالي الرواتب</h5>
                    <h3>0 ج.م</h3>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <h5>إجمالي السلف</h5>
                    <h3>0 ج.م</h3>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h5>السلف المعلقة</h5>
                    <h3>0</h3>
                </div>
            </div>
        </div>
    `;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Make functions globally available
    window.showAlert = showAlert;
    window.toggleLoading = toggleLoading;

    // Setup event listeners
    setupEventListeners();

    // Navigate to default page
    navigateToPage('dashboard');
});
