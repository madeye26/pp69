// Reports Management Functions

// Render Reports View
function renderReports(container) {
    container.innerHTML = `
        <div class="form-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>التقارير</h4>
            </div>

            <!-- Report Type Selection -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <label class="form-label">نوع التقرير</label>
                    <select class="form-select" id="report-type">
                        <option value="salary">كشف الرواتب</option>
                        <option value="attendance">تقرير الحضور والغياب</option>
                        <option value="advances">تقرير السلف</option>
                        <option value="employee">تقرير بيانات الموظفين</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">الشهر</label>
                    <input type="month" class="form-control" id="report-month">
                </div>
                <div class="col-md-4">
                    <label class="form-label">الموظف</label>
                    <select class="form-select" id="report-employee">
                        <option value="">جميع الموظفين</option>
                        ${generateEmployeeOptions()}
                    </select>
                </div>
            </div>

            <!-- Report Controls -->
            <div class="row mb-4">
                <div class="col-12">
                    <button class="btn btn-primary" onclick="generateReport()">
                        <i class="fas fa-sync"></i> إنشاء التقرير
                    </button>
                    <button class="btn btn-success" onclick="exportReport()">
                        <i class="fas fa-file-excel"></i> تصدير Excel
                    </button>
                    <button class="btn btn-info" onclick="printReport()">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
            </div>

            <!-- Report Content -->
            <div id="report-content"></div>
        </div>
    `;

    // Add event listeners
    setupReportEventListeners();
}

// Generate Employee Options
function generateEmployeeOptions() {
    return appState.employees
        .filter(emp => emp.status === 'active')
        .map(emp => `
            <option value="${emp.code}">${emp.name} (${emp.code})</option>
        `).join('');
}

// Setup Report Event Listeners
function setupReportEventListeners() {
    const reportType = document.getElementById('report-type');
    const employeeSelect = document.getElementById('report-employee');
    const monthInput = document.getElementById('report-month');

    if (reportType) {
        reportType.addEventListener('change', updateReportControls);
    }

    // Set default month to current month
    if (monthInput) {
        const now = new Date();
        monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
}

// Update Report Controls based on Report Type
function updateReportControls() {
    const reportType = document.getElementById('report-type').value;
    const monthInput = document.getElementById('report-month');
    const employeeSelect = document.getElementById('report-employee');

    // Show/hide controls based on report type
    switch (reportType) {
        case 'salary':
            monthInput.style.display = 'block';
            employeeSelect.style.display = 'block';
            break;
        case 'attendance':
            monthInput.style.display = 'block';
            employeeSelect.style.display = 'block';
            break;
        case 'advances':
            monthInput.style.display = 'block';
            employeeSelect.style.display = 'block';
            break;
        case 'employee':
            monthInput.style.display = 'none';
            employeeSelect.style.display = 'block';
            break;
    }
}

// Generate Report
async function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const month = document.getElementById('report-month').value;
    const employeeCode = document.getElementById('report-employee').value;
    const reportContent = document.getElementById('report-content');

    try {
        toggleLoading(true);

        let reportData;
        switch (reportType) {
            case 'salary':
                reportData = await generateSalaryReport(month, employeeCode);
                break;
            case 'attendance':
                reportData = await generateAttendanceReport(month, employeeCode);
                break;
            case 'advances':
                reportData = await generateAdvancesReport(month, employeeCode);
                break;
            case 'employee':
                reportData = await generateEmployeeReport(employeeCode);
                break;
        }

        reportContent.innerHTML = reportData;

    } catch (error) {
        console.error('Error generating report:', error);
        showAlert('حدث خطأ أثناء إنشاء التقرير', 'danger');
    } finally {
        toggleLoading(false);
    }
}

// Generate Salary Report
async function generateSalaryReport(month, employeeCode) {
    let salaries;
    if (employeeCode) {
        const salary = await firebaseOperations.salaries.get(employeeCode, month);
        salaries = salary ? [salary] : [];
    } else {
        salaries = await firebaseOperations.salaries.getByMonth(month);
    }

    return `
        <div class="table-responsive mt-4">
            <h5 class="mb-3">تقرير الرواتب - ${new Date(month).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>الموظف</th>
                        <th>الراتب الأساسي</th>
                        <th>الحوافز</th>
                        <th>الأوفرتايم</th>
                        <th>الخصومات</th>
                        <th>صافي الراتب</th>
                    </tr>
                </thead>
                <tbody>
                    ${salaries.map(salary => {
                        const employee = appState.employees.find(emp => emp.code === salary.employeeCode);
                        return `
                            <tr>
                                <td>${employee ? employee.name : salary.employeeCode}</td>
                                <td>${salary.basicSalary.toLocaleString()} ج.م</td>
                                <td>${salary.monthlyIncentives.toLocaleString()} ج.م</td>
                                <td>${salary.overtimeValue.toLocaleString()} ج.م</td>
                                <td>${salary.totalDeductions.toLocaleString()} ج.م</td>
                                <td>${salary.netSalary.toLocaleString()} ج.م</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr class="table-primary">
                        <td>الإجمالي</td>
                        <td>${salaries.reduce((sum, s) => sum + s.basicSalary, 0).toLocaleString()} ج.م</td>
                        <td>${salaries.reduce((sum, s) => sum + s.monthlyIncentives, 0).toLocaleString()} ج.م</td>
                        <td>${salaries.reduce((sum, s) => sum + s.overtimeValue, 0).toLocaleString()} ج.م</td>
                        <td>${salaries.reduce((sum, s) => sum + s.totalDeductions, 0).toLocaleString()} ج.م</td>
                        <td>${salaries.reduce((sum, s) => sum + s.netSalary, 0).toLocaleString()} ج.م</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

// Generate Attendance Report
async function generateAttendanceReport(month, employeeCode) {
    let attendance;
    if (employeeCode) {
        attendance = await firebaseOperations.attendance.getByEmployeeAndMonth(employeeCode, month);
    } else {
        attendance = await firebaseOperations.attendance.getByMonth(month);
    }

    return `
        <div class="table-responsive mt-4">
            <h5 class="mb-3">تقرير الحضور والغياب - ${new Date(month).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>الموظف</th>
                        <th>أيام العمل</th>
                        <th>أيام الغياب</th>
                        <th>ساعات التأخير</th>
                        <th>ساعات الأوفرتايم</th>
                    </tr>
                </thead>
                <tbody>
                    ${attendance.map(record => {
                        const employee = appState.employees.find(emp => emp.code === record.employeeCode);
                        return `
                            <tr>
                                <td>${employee ? employee.name : record.employeeCode}</td>
                                <td>${record.workDays}</td>
                                <td>${record.absenceDays}</td>
                                <td>${record.lateHours}</td>
                                <td>${record.overtimeHours}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate Advances Report
async function generateAdvancesReport(month, employeeCode) {
    let advances;
    if (employeeCode) {
        advances = await firebaseOperations.advances.getByEmployee(employeeCode);
    } else {
        advances = await firebaseOperations.advances.getByMonth(month);
    }

    return `
        <div class="table-responsive mt-4">
            <h5 class="mb-3">تقرير السلف - ${new Date(month).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>الموظف</th>
                        <th>المبلغ</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    ${advances.map(advance => {
                        const employee = appState.employees.find(emp => emp.code === advance.employeeCode);
                        return `
                            <tr>
                                <td>${employee ? employee.name : advance.employeeCode}</td>
                                <td>${advance.amount.toLocaleString()} ج.م</td>
                                <td>${new Date(advance.date).toLocaleDateString('ar-EG')}</td>
                                <td>
                                    <span class="badge bg-${advance.status === 'paid' ? 'success' : 'warning'}">
                                        ${advance.status === 'paid' ? 'مسدد' : 'معلق'}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr class="table-primary">
                        <td>الإجمالي</td>
                        <td colspan="3">${advances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()} ج.م</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

// Generate Employee Report
async function generateEmployeeReport(employeeCode) {
    let employees = employeeCode ? 
        [await firebaseOperations.employees.getByCode(employeeCode)] :
        await firebaseOperations.employees.getAll();

    return `
        <div class="table-responsive mt-4">
            <h5 class="mb-3">تقرير بيانات الموظفين</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>الكود</th>
                        <th>الاسم</th>
                        <th>الوظيفة</th>
                        <th>تاريخ التعيين</th>
                        <th>الراتب الأساسي</th>
                        <th>الحوافز</th>
                        <th>الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => `
                        <tr>
                            <td>${emp.code}</td>
                            <td>${emp.name}</td>
                            <td>${emp.jobTitle}</td>
                            <td>${new Date(emp.hireDate).toLocaleDateString('ar-EG')}</td>
                            <td>${emp.basicSalary.toLocaleString()} ج.م</td>
                            <td>${emp.monthlyIncentives.toLocaleString()} ج.م</td>
                            <td>
                                <span class="badge bg-${emp.status === 'active' ? 'success' : 'danger'}">
                                    ${emp.status === 'active' ? 'نشط' : 'غير نشط'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Export Report to Excel
function exportReport() {
    // Implementation will be added later
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

// Print Report
function printReport() {
    window.print();
}

// Export necessary functions
window.renderReports = renderReports;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.printReport = printReport;
