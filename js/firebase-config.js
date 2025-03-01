// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6_qOKjIDRe1rawujXK1FmT5tmZrEzqmM",
    authDomain: "badr-payroll-hr.firebaseapp.com",
    projectId: "badr-payroll-hr",
    storageBucket: "badr-payroll-hr.firebasestorage.app",
    messagingSenderId: "1010480703757",
    appId: "1:1010480703757:web:43b501199e8956659c6844",
    measurementId: "G-9WHWXDRE2Z"
};

// Collection names
const COLLECTIONS = {
    EMPLOYEES: 'employees',
    SALARIES: 'salaries',
    ADVANCES: 'advances',
    ATTENDANCE: 'attendance'
};

// Initialize Firebase
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
} catch (error) {
    if (error.code === 'app/duplicate-app') {
        app = firebase.app();
    } else {
        console.error('Firebase initialization error:', error);
        throw error;
    }
}

// Initialize Firestore
const db = firebase.firestore();

// Initialize Auth
const auth = firebase.auth();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.warn('The current browser does not support persistence');
        }
    });

// Create initial collections
async function createInitialCollections() {
    try {
        const batch = db.batch();
        
        // Create config documents for each collection
        Object.values(COLLECTIONS).forEach(collectionName => {
            const configRef = db.collection(collectionName).doc('_config');
            batch.set(configRef, {
                collectionName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        });

        await batch.commit();
        console.log('Initial collections created');
        return true;
    } catch (error) {
        console.error('Error creating initial collections:', error);
        return false;
    }
}

// Initialize Firebase
async function initializeFirebase() {
    try {
        // Enable anonymous auth
        if (!auth.currentUser) {
            await auth.signInAnonymously();
            console.log('Signed in anonymously');
        }

        // Create initial collections
        await createInitialCollections();

        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
    }
}

// Export Firebase instances and functions
window.db = db;
window.auth = auth;
window.COLLECTIONS = COLLECTIONS;
window.initializeFirebase = initializeFirebase;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase().catch(error => {
        console.error('Firebase initialization error:', error);
        if (window.showAlert) {
            window.showAlert('حدث خطأ في الاتصال بقاعدة البيانات', 'danger');
        }
    });
});
