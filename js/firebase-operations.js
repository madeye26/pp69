// Firebase Database Operations

class FirebaseOperations {
    constructor() {
        this.db = window.db;
        this.auth = window.auth;
        this.collections = window.COLLECTIONS;
    }

    // Generic error handler
    handleError(error, operation) {
        console.error(`Error in ${operation}:`, error);
        if (window.showAlert) {
            window.showAlert(`حدث خطأ أثناء ${operation}`, 'danger');
        }
        throw error;
    }

    // Employee Operations
    employees = {
        // Add new employee
        add: async (data) => {
            try {
                const docRef = this.db.collection(this.collections.EMPLOYEES).doc(data.code);
                await docRef.set({
                    ...data,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return true;
            } catch (error) {
                this.handleError(error, 'إضافة موظف');
            }
        },

        // Update employee
        update: async (code, data) => {
            try {
                await this.db.collection(this.collections.EMPLOYEES).doc(code).update({
                    ...data,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return true;
            } catch (error) {
                this.handleError(error, 'تحديث بيانات الموظف');
            }
        },

        // Delete employee
        delete: async (code) => {
            try {
                await this.db.collection(this.collections.EMPLOYEES).doc(code).delete();
                return true;
            } catch (error) {
                this.handleError(error, 'حذف الموظف');
            }
        },

        // Get all employees
        getAll: async () => {
            try {
                const snapshot = await this.db.collection(this.collections.EMPLOYEES).get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                this.handleError(error, 'تحميل بيانات الموظفين');
            }
        },

        // Get employee by code
        getByCode: async (code) => {
            try {
                const doc = await this.db.collection(this.collections.EMPLOYEES).doc(code).get();
                if (doc.exists) {
                    return { id: doc.id, ...doc.data() };
                }
                return null;
            } catch (error) {
                this.handleError(error, 'تحميل بيانات الموظف');
            }
        }
    };

    // Salary Operations
    salaries = {
        // Calculate and save salary
        calculate: async (employeeCode, month, data) => {
            try {
                const docId = `${employeeCode}_${month}`;
                await this.db.collection(this.collections.SALARIES).doc(docId).set({
                    ...data,
                    calculatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return true;
            } catch (error) {
                this.handleError(error, 'حساب الراتب');
            }
        },

        // Get salary by employee and month
        get: async (employeeCode, month) => {
            try {
                const docId = `${employeeCode}_${month}`;
                const doc = await this.db.collection(this.collections.SALARIES).doc(docId).get();
                if (doc.exists) {
                    return { id: doc.id, ...doc.data() };
                }
                return null;
            } catch (error) {
                this.handleError(error, 'تحميل بيانات الراتب');
            }
        },

        // Get all salaries for a month
        getByMonth: async (month) => {
            try {
                const snapshot = await this.db.collection(this.collections.SALARIES)
                    .where('month', '==', month)
                    .get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                this.handleError(error, 'تحميل كشف الرواتب');
            }
        }
    };

    // Advances Operations
    advances = {
        // Add new advance
        add: async (data) => {
            try {
                const docRef = await this.db.collection(this.collections.ADVANCES).add({
                    ...data,
                    status: 'pending',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return docRef.id;
            } catch (error) {
                this.handleError(error, 'إضافة سلفة');
            }
        },

        // Update advance status
        updateStatus: async (id, status) => {
            try {
                await this.db.collection(this.collections.ADVANCES).doc(id).update({
                    status,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return true;
            } catch (error) {
                this.handleError(error, 'تحديث حالة السلفة');
            }
        },

        // Get advances by employee
        getByEmployee: async (employeeCode) => {
            try {
                const snapshot = await this.db.collection(this.collections.ADVANCES)
                    .where('employeeCode', '==', employeeCode)
                    .get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                this.handleError(error, 'تحميل بيانات السلف');
            }
        }
    };

    // Attendance Operations
    attendance = {
        // Record attendance
        record: async (data) => {
            try {
                const docRef = await this.db.collection(this.collections.ATTENDANCE).add({
                    ...data,
                    recordedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                return docRef.id;
            } catch (error) {
                this.handleError(error, 'تسجيل الحضور');
            }
        },

        // Get attendance by employee and month
        getByEmployeeAndMonth: async (employeeCode, month) => {
            try {
                const snapshot = await this.db.collection(this.collections.ATTENDANCE)
                    .where('employeeCode', '==', employeeCode)
                    .where('month', '==', month)
                    .get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                this.handleError(error, 'تحميل بيانات الحضور');
            }
        }
    };
}

// Create and export Firebase operations instance
const firebaseOperations = new FirebaseOperations();
window.firebaseOperations = firebaseOperations;
