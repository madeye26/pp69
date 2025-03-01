// Firebase Initialization
document.addEventListener('DOMContentLoaded', async function() {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyB6_qOKjIDRe1rawujXK1FmT5tmZrEzqmM",
        authDomain: "badr-payroll-hr.firebaseapp.com",
        projectId: "badr-payroll-hr",
        storageBucket: "badr-payroll-hr.firebasestorage.app",
        messagingSenderId: "1010480703757",
        appId: "1:1010480703757:web:43b501199e8956659c6844"
    };

    try {
        // Initialize Firebase app
        const app = firebase.initializeApp(firebaseConfig);
        console.log('Firebase app initialized');

        // Initialize Firestore with settings
        const db = firebase.firestore();
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
            merge: true
        });
        console.log('Firestore initialized');

        // Initialize Auth
        const auth = firebase.auth();
        console.log('Auth initialized');

        // Make instances globally available
        window.db = db;
        window.auth = auth;
        window.COLLECTIONS = {
            EMPLOYEES: 'employees',
            SALARIES: 'salaries',
            ADVANCES: 'advances',
            ATTENDANCE: 'attendance'
        };

        // Enable offline persistence
        await db.enablePersistence()
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence enabled in first tab only');
                } else if (err.code === 'unimplemented') {
                    console.warn('Browser doesn\'t support persistence');
                }
            });

        // Function to initialize collections
        async function initializeCollections() {
            try {
                const batch = db.batch();
                Object.entries(window.COLLECTIONS).forEach(([name, path]) => {
                    const configRef = db.collection(path).doc('_config');
                    batch.set(configRef, {
                        name,
                        path,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                });
                await batch.commit();
                console.log('Initial collections created');
                return true;
            } catch (error) {
                console.error('Error creating collections:', error);
                return false;
            }
        }

        // Function to show/hide app
        function toggleApp(show) {
            const loadingOverlay = document.getElementById('loading-overlay');
            const appContainer = document.getElementById('app');
            
            if (loadingOverlay) loadingOverlay.style.display = show ? 'none' : 'flex';
            if (appContainer) appContainer.style.display = show ? 'block' : 'none';
        }

        // Function to initialize app
        async function initializeApp() {
            try {
                // Try to initialize collections
                await initializeCollections();

                // Show app
                toggleApp(true);

                // Show success message
                if (window.showAlert) {
                    window.showAlert('تم تهيئة النظام بنجاح', 'success');
                }

                return true;
            } catch (error) {
                console.error('Error initializing app:', error);
                if (window.showAlert) {
                    window.showAlert('حدث خطأ في تهيئة النظام', 'danger');
                }
                return false;
            }
        }

        // Try to use existing auth
        const user = auth.currentUser;
        if (user) {
            console.log('Using existing auth:', user.uid);
            await initializeApp();
        } else {
            // Try anonymous auth
            try {
                const credential = await auth.signInAnonymously();
                console.log('Anonymous auth successful:', credential.user.uid);
                await initializeApp();
            } catch (error) {
                console.error('Anonymous auth error:', error);
                // Show error but still try to initialize app
                if (window.showAlert) {
                    window.showAlert('حدث خطأ في تسجيل الدخول', 'warning');
                }
                await initializeApp();
            }
        }

        // Monitor online/offline status
        function updateConnectionStatus(isOnline) {
            const onlineStatus = document.getElementById('online-status');
            const offlineStatus = document.getElementById('offline-status');
            
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

    } catch (error) {
        console.error('Fatal Firebase initialization error:', error);
        if (window.showAlert) {
            window.showAlert('حدث خطأ في تهيئة النظام', 'danger');
        }
        throw error;
    }
});
