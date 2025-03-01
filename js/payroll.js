// Payroll Management Functions

// Render Payroll View
function renderPayroll(container) {
    container.innerHTML = `
        <div class="form-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>كشف الرواتب</h4>
                <div class="d-flex gap-2">
                    <button class="btn btn-success" onclick="exportPayrollToExcel()">
                        <i class="fas fa-file-excel"></i> تصدير Excel
                    </button>
                    <button class="btn btn-primary" onclick="printPayroll()">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
            </div>

            <!-- Payroll Form -->
            <form id="payroll-form" class="mb-4">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">الموظف</label>
                        <select class="form-select" id="employee-select" required>
                            <option value="">اختر الموظف</option>
                            ${generateEmployeeOptions()}
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">الشهر</label>
                        <input type="month" class="form-control" id="salary-month" required>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">عدد أيام العمل</label>
                        <input type="number" class="form-control" id="work-days" value="26" required>
                    </div>
                </div>

                <div class="row">
                    <!-- Basic Salary Information -->
                    <div class="col-md-3 mb-3">
                        <label class="form-label">الراتب الأساسي</label>
                        <input type="number" class="form-control" id="basic-salary" readonly>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">الحوافز الشهرية</label>
                        <input type="number" class="form-control" id="monthly-incentives" readonly>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">ساعات الأوفرتايم</label>
                        <input type="number" class="form-control" id="overtime-hours" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">قيمة الأوفرتايم</label>
                        <input type="number" class="form-control" id="overtime-value" readonly>
                    </div>

                    <!-- Deductions -->
                    <div class="col-md-3 mb-3">
                        <label class="form-label">المشتريات</label>
                        <input type="number" class="form-control" id="purchases" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">السلف</label>
                        <input type="number" class="form-control" id="advances" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">أيام الغياب</label>
                        <input type="number" class="form-control" id="absence-days" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">خصم الغياب</label>
                        <input type="number" class="form-control" id="absence-deduction" readonly>
                    </div>

                    <!-- Additional Deductions -->
                    <div class="col-md-3 mb-3">
                        <label class="form-label">الساعات المتأخرة</label>
                        <input type="number" class="form-control" id="late-hours" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">خصم التأخير</label>
                        <input type="number" class="form-control" id="late-deduction" readonly>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">أيام الجزاءات</label>
                        <input type="number" class="form-control" id="penalty-days" value="0">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">قيمة الجزاءات</label>
                        <input type="number" class="form-control" id="penalties" readonly>
                    </div>

                    <!-- Totals -->
                    <div class="col-md-4 mb-3">
                        <label class="form-label">إجمالي المستحقات</label>
                        <input type="number" class="form-control" id="total-earnings" readonly>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">إجمالي الخصومات</label>
                        <input type="number" class="form-control" id="total-deductions" readonly>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">صافي الراتب</label>
                        <input type="number" class="form-control" id="net-salary" readonly>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-calculator"></i> احتساب الراتب
                        </button>
                        <button type="button" class="btn btn-success me-2" onclick="saveSalary()">
                            <i class="fas fa-save"></i> حفظ
                        </button>
                        <button type="reset" class="btn btn-secondary me-2">
                            <i class="fas fa-undo"></i> إعادة تعيين
                        </button>
                    </div>
                </div>
            </form>

            <!-- Saved Salaries Table -->
            <div class="table-responsive mt-4">
                <table class="table">
                    <thead>
                        <tr>
                            <th>الموظف</th>
                            <th>الشهر</th>
                            <th>الراتب الأساسي</th>
                            <th>الحوافز</th>
                            <th>الخصومات</th>
                            <th>صافي الراتب</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="salaries-table-body">
                        <!-- Will be populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Add event listeners
    setupPayrollEventListeners();
    loadSavedSalaries();
}

// Generate Employee Options
function generateEmployeeOptions() {
    return appState.employees
        .filter(emp => emp.status === 'active')
        .map(emp => `
            <option value="${emp.code}">${emp.name} (${emp.code})</option>
        `).join('');
}

// Setup Payroll Event Listeners
function setupPayrollEventListeners() {
    // Employee selection change
    const employeeSelect = document.getElementById('employee-select');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', loadEmployeeData);
    }

    // Form calculations
    const calculationInputs = [
        'work-days', 'overtime-hours', 'purchases', 'advances',
        'absence-days', 'late-hours', 'penalty-days'
    ];

    calculationInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateSalary);
        }
    });

    // Form submission
    const form = document.getElementById('payroll-form');
    if (form) {
        form.addEventListener('submit', handlePayrollSubmit);
    }
}

// Load Employee Data
function loadEmployeeData() {
    const employeeCode = document.getElementById('employee-select').value;
    const employee = appState.employees.find(emp => emp.code === employeeCode);

    if (employee) {
        document.getElementById('basic-salary').value = employee.basicSalary;
        document.getElementById('monthly-incentives').value = employee.monthlyIncentives;
        calculateSalary();
    }
}

// Calculate Salary
function calculateSalary() {
    const basicSalary = parseFloat(document.getElementById('basic-salary').value) || 0;
    const monthlyIncentives = parseFloat(document.getElementById('monthly-incentives').value) || 0;
    const workDays = parseInt(document.getElementById('work-days').value) || 26;
    const overtimeHours = parseInt(document.getElementById('overtime-hours').value) || 0;
    const purchases = parseFloat(document.getElementById('purchases').value) || 0;
    const advances = parseFloat(document.getElementById('advances').value) || 0;
    const absenceDays = parseInt(document.getElementById('absence-days').value) || 0;
    const lateHours = parseInt(document.getElementById('late-hours').value) || 0;
    const penaltyDays = parseInt(document.getElementById('penalty-days').value) || 0;

    // Calculate daily rate
    const dailyRate = basicSalary / 26;
    const hourlyRate = dailyRate / 8;

    // Calculate values
    const overtimeValue = overtimeHours * (hourlyRate * 1.5);
    const absenceDeduction = absenceDays * dailyRate;
    const lateDeduction = lateHours * hourlyRate;
    const penalties = penaltyDays * dailyRate;

    // Update calculated fields
    document.getElementById('overtime-value').value = overtimeValue;
    document.getElementById('absence-deduction').value = absenceDeduction;
    document.getElementById('late-deduction').value = lateDeduction;
    document.getElementById('penalties').value = penalties;

    // Calculate totals
    const totalEarnings = basicSalary + monthlyIncentives + overtimeValue;
    const totalDeductions = purchases + advances + absenceDeduction + lateDeduction + penalties;
    const netSalary = totalEarnings - totalDeductions;

    // Update totals
    document.getElementById('total-earnings').value = totalEarnings;
    document.getElementById('total-deductions').value = totalDeductions;
    document.getElementById('net-salary').value = netSalary;
}

// Handle Payroll Submit
async function handlePayrollSubmit(e) {
    e.preventDefault();
    
    try {
        toggleLoading(true);

        const employeeCode = document.getElementById('employee-select').value;
        const month = document.getElementById('salary-month').value;

        const salaryData = {
            employeeCode,
            month,
            basicSalary: parseFloat(document.getElementById('basic-salary').value),
            monthlyIncentives: parseFloat(document.getElementById('monthly-incentives').value),
            workDays: parseInt(document.getElementById('work-days').value),
            overtimeHours: parseInt(document.getElementById('overtime-hours').value),
            overtimeValue: parseFloat(document.getElementById('overtime-value').value),
            purchases: parseFloat(document.getElementById('purchases').value),
            advances: parseFloat(document.getElementById('advances').value),
            absenceDays: parseInt(document.getElementById('absence-days').value),
            absenceDeduction: parseFloat(document.getElementById('absence-deduction').value),
            lateHours: parseInt(document.getElementById('late-hours').value),
            lateDeduction: parseFloat(document.getElementById('late-deduction').value),
            penaltyDays: parseInt(document.getElementById('penalty-days').value),
            penalties: parseFloat(document.getElementById('penalties').value),
            totalEarnings: parseFloat(document.getElementById('total-earnings').value),
            totalDeductions: parseFloat(document.getElementById('total-deductions').value),
            netSalary: parseFloat(document.getElementById('net-salary').value),
            calculatedAt: new Date().toISOString()
        };

        await firebaseOperations.salaries.calculate(employeeCode, month, salaryData);
        showAlert('تم احتساب وحفظ الراتب بنجاح', 'success');
        loadSavedSalaries();

    } catch (error) {
        console.error('Error calculating salary:', error);
        showAlert('حدث خطأ أثناء احتساب الراتب', 'danger');
    } finally {
        toggleLoading(false);
    }
}

// Load Saved Salaries
async function loadSavedSalaries() {
    try {
        const currentMonth = document.getElementById('salary-month').value;
        if (!currentMonth) return;

        const salaries = await firebaseOperations.salaries.getByMonth(currentMonth);
        const tableBody = document.getElementById('salaries-table-body');
        
        if (tableBody) {
            tableBody.innerHTML = salaries.map(salary => {
                const employee = appState.employees.find(emp => emp.code === salary.employeeCode);
                return `
                    <tr>
                        <td>${employee ? employee.name : salary.employeeCode}</td>
                        <td>${new Date(salary.month).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</td>
                        <td>${salary.basicSalary.toLocaleString()} ج.م</td>
                        <td>${salary.monthlyIncentives.toLocaleString()} ج.م</td>
                        <td>${salary.totalDeductions.toLocaleString()} ج.م</td>
                        <td>${salary.netSalary.toLocaleString()} ج.م</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="printSalarySlip('${salary.employeeCode}', '${salary.month}')">
                                <i class="fas fa-print"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading salaries:', error);
        showAlert('حدث خطأ أثناء تحميل الرواتب', 'danger');
    }
}

// Print Salary Slip
function printSalarySlip(employeeCode, month) {
    // Implementation will be added later
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

// Export to Excel
function exportPayrollToExcel() {
    // Implementation will be added later
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

// Print Payroll
function printPayroll() {
    window.print();
}

// Export necessary functions
window.renderPayroll = renderPayroll;
window.printSalarySlip = printSalarySlip;
window.exportPayrollToExcel = exportPayrollToExcel;
window.printPayroll = printPayroll;
