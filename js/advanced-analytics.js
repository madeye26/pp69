// Advanced Analytics Module
const advancedAnalytics = {
    init: function() {
        console.log('Advanced analytics module initialized');
    },

    // Calculate employee performance metrics
    calculatePerformanceMetrics: function(employeeCode) {
        try {
            const employee = window.appState.employees.find(emp => emp.code === employeeCode);
            if (!employee) return null;

            return {
                taskCompletion: this.calculateTaskCompletionRate(employeeCode),
                attendance: this.calculateAttendanceRate(employeeCode),
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error calculating performance metrics:', error);
            return null;
        }
    },

    // Calculate task completion rate
    calculateTaskCompletionRate: function(employeeCode) {
        const tasks = window.appState.tasks?.filter(task => task.employeeCode === employeeCode) || [];
        if (!tasks.length) return 0;
        
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        return (completedTasks / tasks.length) * 100;
    },

    // Calculate attendance rate
    calculateAttendanceRate: function(employeeCode) {
        const timeRecords = window.appState.timeTracking?.filter(record => 
            record.employeeCode === employeeCode
        ) || [];
        
        if (!timeRecords.length) return 0;
        const totalDays = 22; // Assuming 22 working days per month
        return (timeRecords.length / totalDays) * 100;
    }
};

// Initialize advanced analytics
document.addEventListener('DOMContentLoaded', () => {
    advancedAnalytics.init();
});

// Export advanced analytics
window.advancedAnalytics = advancedAnalytics;
