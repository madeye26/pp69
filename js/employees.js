// Employee Management Functions

// Render Employee Form
function renderEmployeeForm(container) {
    container.innerHTML = `
        <div class="form-card">
            <h4 class="mb-4">إدخال بيانات الموظف</h4>
            <form id="employee-form" class="needs-validation" novalidate>
                <div class="row">
                    <!-- Basic Information -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label">كود الموظف</label>
                        <input type="text" class="form-control" id="employee-code" required>
                        <div class="invalid-feedback">كود الموظف مطلوب</div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">اسم الموظف</label>
                        <input type="text" class="form-control" id="employee-name" required>
                        <div class="invalid-feedback">اسم الموظف مطلوب</div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">الوظيفة</label>
                        <input type="text" class="form-control" id="job-title" required>
                        <div class="invalid-feedback">الوظيفة مطلوبة</div>
                    </div>

                    <!-- Salary Information -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label">قيمة الوحدة اليومية</label>
                        <input type="number" class="form-control" id="daily-rate" required>
                        <div class="invalid-feedback">قيمة الوحدة اليومية مطلوبة</div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">قيمة اليوم بالحوافز</label>
                        <input type="number" class="form-control" id="daily-incentive" value="0">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">قيمة وحدة الأوفرتايم</label>
                        <input type="number" class="form-control" id="overtime-rate" value="0">
                    </div>

                    <!-- Additional Information -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label">الراتب الأساسي</label>
                        <input type="number" class="form-control" id="basic-salary" required>
                        <div class="invalid-feedback">الراتب الأساسي مطلوب</div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">الحوافز الشهرية</label>
                        <input type="number" class="form-control" id="monthly-incentives" value="0">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">تاريخ التعيين</label>
                        <input type="date" class="form-control" id="hire-date" required>
                        <div class="invalid-feedback">تاريخ التعيين مطلوب</div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ البيانات
                        </button>
                        <button type="reset" class="btn btn-secondary me-2">
                            <i class="fas fa-undo"></i> إعادة تعيين
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;

    // Add form submit handler
    const form = document.getElementById('employee-form');
    form.addEventListener('submit', handleEmployeeSubmit);

    // Add calculation handlers
    setupCalculationHandlers();
}

// Handle Employee Form Submit
async function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    try {
        window.toggleLoading(true);

        const employeeData = {
            code: document.getElementById('employee-code').value,
            name: document.getElementById('employee-name').value,
            jobTitle: document.getElementById('job-title').value,
            dailyRate: parseFloat(document.getElementById('daily-rate').value),
            dailyIncentive: parseFloat(document.getElementById('daily-incentive').value) || 0,
            overtimeRate: parseFloat(document.getElementById('overtime-rate').value) || 0,
            basicSalary: parseFloat(document.getElementById('basic-salary').value),
            monthlyIncentives: parseFloat(document.getElementById('monthly-incentives').value) || 0,
            hireDate: document.getElementById('hire-date').value,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        // Validate employee data
        const validation = window.validationUtils.validateEmployee(employeeData);
        if (!validation.isValid) {
            validation.errors.forEach(error => window.showAlert(error, 'warning'));
            return;
        }

        // Save to Firebase
        await window.firebaseOperations.employees.add(employeeData);
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Show success message
        window.showAlert('تم حفظ بيانات الموظف بنجاح', 'success');

        // Refresh employee list if we're showing it
        const mainContent = document.getElementById('main-content');
        if (mainContent && mainContent.querySelector('.employees-list')) {
            renderEmployeesList(mainContent);
        }

    } catch (error) {
        console.error('Error saving employee:', error);
        window.showAlert('حدث خطأ أثناء حفظ البيانات', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Setup Calculation Handlers
function setupCalculationHandlers() {
    const calculationInputs = ['daily-rate', 'daily-incentive', 'overtime-rate'];
    calculationInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateSalaryCalculations);
        }
    });
}

// Update Salary Calculations
function updateSalaryCalculations() {
    const dailyRate = parseFloat(document.getElementById('daily-rate').value) || 0;
    const dailyIncentive = parseFloat(document.getElementById('daily-incentive').value) || 0;
    const workingDays = 26; // Default working days per month

    const basicSalary = dailyRate * workingDays;
    const monthlyIncentives = dailyIncentive * workingDays;

    document.getElementById('basic-salary').value = basicSalary;
    document.getElementById('monthly-incentives').value = monthlyIncentives;
}

// Render Employees List
async function renderEmployeesList(container) {
    try {
        window.toggleLoading(true);

        // Get employees from Firebase
        const employees = await window.firebaseOperations.employees.getAll();

        container.innerHTML = `
            <div class="form-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4>قائمة الموظفين</h4>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success" onclick="exportToExcel()">
                            <i class="fas fa-file-excel"></i> تصدير Excel
                        </button>
                        <button class="btn btn-primary" onclick="printEmployeesList()">
                            <i class="fas fa-print"></i> طباعة
                        </button>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الاسم</th>
                                <th>الوظيفة</th>
                                <th>الراتب الأساسي</th>
                                <th>الحوافز</th>
                                <th>تاريخ التعيين</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(emp => `
                                <tr>
                                    <td>${emp.code}</td>
                                    <td>${emp.name}</td>
                                    <td>${emp.jobTitle}</td>
                                    <td>${emp.basicSalary.toLocaleString()} ج.م</td>
                                    <td>${emp.monthlyIncentives.toLocaleString()} ج.م</td>
                                    <td>${new Date(emp.hireDate).toLocaleDateString('ar-EG')}</td>
                                    <td>
                                        <span class="badge bg-${emp.status === 'active' ? 'success' : 'danger'}">
                                            ${emp.status === 'active' ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="handleEditEmployee('${emp.code}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="handleDeleteEmployee('${emp.code}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading employees:', error);
        window.showAlert('حدث خطأ أثناء تحميل بيانات الموظفين', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Handle Edit Employee
async function handleEditEmployee(employeeCode) {
    try {
        window.toggleLoading(true);

        // Get employee data
        const employee = await window.firebaseOperations.employees.getByCode(employeeCode);
        if (!employee) {
            window.showAlert('لم يتم العثور على الموظف', 'warning');
            return;
        }

        // Switch to employee form
        const mainContent = document.getElementById('main-content');
        renderEmployeeForm(mainContent);

        // Fill form with employee data
        Object.keys(employee).forEach(key => {
            const input = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (input) {
                input.value = employee[key];
            }
        });

    } catch (error) {
        console.error('Error loading employee:', error);
        window.showAlert('حدث خطأ أثناء تحميل بيانات الموظف', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Handle Delete Employee
async function handleDeleteEmployee(employeeCode) {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
        return;
    }

    try {
        window.toggleLoading(true);
        await window.firebaseOperations.employees.delete(employeeCode);
        window.showAlert('تم حذف الموظف بنجاح', 'success');
        
        // Refresh the list
        const mainContent = document.getElementById('main-content');
        renderEmployeesList(mainContent);
    } catch (error) {
        console.error('Error deleting employee:', error);
        window.showAlert('حدث خطأ أثناء حذف الموظف', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Export to Excel
function exportToExcel() {
    window.excelUtils.exportTableToExcel('employees-table', 'employees_list');
}

// Print Employees List
function printEmployeesList() {
    window.print();
}

// Export necessary functions
window.renderEmployeeForm = renderEmployeeForm;
window.renderEmployeesList = renderEmployeesList;
window.handleEditEmployee = handleEditEmployee;
window.handleDeleteEmployee = handleDeleteEmployee;
window.exportToExcel = exportToExcel;
window.printEmployeesList = printEmployeesList;
