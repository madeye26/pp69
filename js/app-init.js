// Application Initialization

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6_qOKjIDRe1rawujXK1FmT5tmZrEzqmM",
    authDomain: "badr-payroll-hr.firebaseapp.com",
    projectId: "badr-payroll-hr",
    storageBucket: "badr-payroll-hr.firebasestorage.app",
    messagingSenderId: "1010480703757",
    appId: "1:1010480703757:web:43b501199e8956659c6844"
};

// Collection names
const COLLECTIONS = {
    EMPLOYEES: 'employees',
    SALARIES: 'salaries',
    ADVANCES: 'advances',
    ATTENDANCE: 'attendance'
};

// Initialize Firebase
let app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let auth = firebase.auth();

// Make instances globally available
window.db = db;
window.auth = auth;
window.COLLECTIONS = COLLECTIONS;

// Initialize Application
async function initializeApplication() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const appContainer = document.getElementById('app');

    try {
        // Show loading overlay
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

        // Wait for auth state to be ready
        await new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (!user) {
                    try {
                        await auth.signInAnonymously();
                        console.log('Signed in anonymously');
                    } catch (error) {
                        console.error('Anonymous auth error:', error);
                    }
                } else {
                    console.log('User already signed in');
                }
                unsubscribe();
                resolve();
            });
        });

        // Initialize main application
        if (window.initializeApp) {
            await window.initializeApp();
        }

        // Hide loading overlay and show app
        if (loadingOverlay && appContainer) {
            loadingOverlay.style.display = 'none';
            appContainer.style.display = 'block';
        }

        // Show success message
        if (window.showAlert) {
            window.showAlert('تم تهيئة النظام بنجاح', 'success');
        }

        console.log('Application initialized successfully');
        return true;

    } catch (error) {
        console.error('Application initialization error:', error);
        if (window.showAlert) {
            window.showAlert('حدث خطأ أثناء تهيئة النظام', 'danger');
        }
        // Keep loading overlay visible on error
        if (appContainer) {
            appContainer.style.display = 'none';
        }
        throw error;
    }
}

// Monitor online/offline status
function setupConnectionMonitoring() {
    const onlineStatus = document.getElementById('online-status');
    const offlineStatus = document.getElementById('offline-status');

    function updateConnectionStatus(isOnline) {
        if (onlineStatus && offlineStatus) {
            onlineStatus.classList.toggle('d-none', !isOnline);
            offlineStatus.classList.toggle('d-none', isOnline);
        }

        if (window.showAlert) {
            if (isOnline) {
                window.showAlert('تم استعادة الاتصال بقاعدة البيانات', 'success');
            } else {
                window.showAlert('فقدت الاتصال بقاعدة البيانات. سيتم العمل في وضع عدم الاتصال.', 'warning');
            }
        }
    }

    window.addEventListener('online', () => updateConnectionStatus(true));
    window.addEventListener('offline', () => updateConnectionStatus(false));
    updateConnectionStatus(navigator.onLine);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication()
        .then(() => {
            setupConnectionMonitoring();
        })
        .catch(error => {
            console.error('Fatal initialization error:', error);
        });
});
