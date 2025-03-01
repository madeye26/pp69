// Time Tracking Module
const timeTracker = {
    init: function() {
        console.log('Time tracking module initialized');
    },

    startTracking: function(employeeCode) {
        if (!employeeCode) {
            window.showAlert('يرجى اختيار الموظف', 'warning');
            return;
        }

        const session = {
            employeeCode: employeeCode,
            startTime: new Date().toISOString()
        };

        localStorage.setItem('activeTimeTracking', JSON.stringify(session));
    },

    stopTracking: async function() {
        const activeSession = localStorage.getItem('activeTimeTracking');
        if (!activeSession) return;

        const session = JSON.parse(activeSession);
        session.endTime = new Date().toISOString();

        try {
            await window.firebaseOperations.saveTimeTracking(session);
            localStorage.removeItem('activeTimeTracking');
            window.showAlert('تم حفظ وقت العمل بنجاح', 'success');
        } catch (error) {
            console.error('Error saving time tracking:', error);
            window.showAlert('حدث خطأ أثناء حفظ وقت العمل', 'danger');
        }
    }
};

// Initialize time tracker
document.addEventListener('DOMContentLoaded', () => {
    timeTracker.init();
});

// Export time tracker
window.timeTracker = timeTracker;
