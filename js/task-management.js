// Task Management Module
const taskManagement = {
    init: function() {
        console.log('Task management module initialized');
    },

    // Create new task
    createTask: async function(data) {
        try {
            if (!data.employeeCode || !data.title) {
                window.showAlert('يرجى ملء جميع الحقول المطلوبة', 'warning');
                return false;
            }

            const task = {
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            await window.firebaseOperations.saveTask(task);
            window.showAlert('تم إنشاء المهمة بنجاح', 'success');
            return true;
        } catch (error) {
            console.error('Error creating task:', error);
            window.showAlert('حدث خطأ أثناء إنشاء المهمة', 'danger');
            return false;
        }
    }
};

// Initialize task management
document.addEventListener('DOMContentLoaded', () => {
    taskManagement.init();
});

// Export task management
window.taskManagement = taskManagement;
