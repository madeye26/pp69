// Leave Management Module
const leaveManagement = {
    init: function() {
        console.log('Leave management module initialized');
    },

    // Request leave
    requestLeave: async function(employeeCode, startDate, endDate, type) {
        try {
            if (!employeeCode || !startDate || !endDate || !type) {
                window.showAlert('يرجى ملء جميع الحقول المطلوبة', 'warning');
                return false;
            }

            const leaveRequest = {
                employeeCode,
                startDate,
                endDate,
                type,
                status: 'pending',
                requestDate: new Date().toISOString()
            };

            await window.firebaseOperations.saveLeaveRequest(leaveRequest);
            window.showAlert('تم تقديم طلب الإجازة بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('Error submitting leave request:', error);
            window.showAlert('حدث خطأ أثناء تقديم طلب الإجازة', 'danger');
            return false;
        }
    }
};

// Initialize leave management
document.addEventListener('DOMContentLoaded', () => {
    leaveManagement.init();
});

// Export leave management
window.leaveManagement = leaveManagement;
