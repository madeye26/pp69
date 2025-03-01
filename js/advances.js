// Advances Management Module

// Render Advances Management View
function renderAdvances(container) {
    container.innerHTML = `
        <div class="form-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4>إدارة السلف</h4>
                <button class="btn btn-primary" onclick="showAdvanceForm()">
                    <i class="fas fa-plus"></i> سلفة جديدة
                </button>
            </div>

            <!-- Advances List -->
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>الموظف</th>
                            <th>المبلغ</th>
                            <th>تاريخ التقديم</th>
                            <th>تاريخ السداد المتوقع</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="advances-table-body">
                        <!-- Will be populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Advance Form Modal -->
        <div class="modal fade" id="advanceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">إضافة سلفة جديدة</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="advance-form" class="needs-validation" novalidate>
                            <div class="mb-3">
                                <label class="form-label">الموظف</label>
                                <select class="form-select" id="employee-select" required>
                                    <option value="">اختر الموظف</option>
                                </select>
                                <div class="invalid-feedback">يرجى اختيار الموظف</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">مبلغ السلفة</label>
                                <input type="number" class="form-control" id="advance-amount" required>
                                <div class="invalid-feedback">يرجى إدخال مبلغ السلفة</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">تاريخ التقديم</label>
                                <input type="date" class="form-control" id="submission-date" required>
                                <div class="invalid-feedback">يرجى إدخال تاريخ التقديم</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">تاريخ السداد المتوقع</label>
                                <input type="date" class="form-control" id="expected-repayment-date" required>
                                <div class="invalid-feedback">يرجى إدخال تاريخ السداد المتوقع</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                        <button type="button" class="btn btn-primary" onclick="handleAdvanceSubmit()">حفظ</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize the view
    loadEmployeeOptions();
    loadAdvances();
}

// Load Employee Options
async function loadEmployeeOptions() {
    try {
        const employees = await window.firebaseOperations.employees.getAll();
        const select = document.getElementById('employee-select');
        
        if (select) {
            select.innerHTML = `
                <option value="">اختر الموظف</option>
                ${employees
                    .filter(emp => emp.status === 'active')
                    .map(emp => `
                        <option value="${emp.code}">${emp.name} (${emp.code})</option>
                    `).join('')}
            `;
        }
    } catch (error) {
        console.error('Error loading employees:', error);
        window.showAlert('حدث خطأ أثناء تحميل بيانات الموظفين', 'danger');
    }
}

// Load Advances
async function loadAdvances() {
    try {
        window.toggleLoading(true);
        const advances = await window.firebaseOperations.advances.getAll();
        const tableBody = document.getElementById('advances-table-body');
        
        if (tableBody) {
            tableBody.innerHTML = advances.map(advance => {
                const employee = window.appState.employees.find(emp => emp.code === advance.employeeCode);
                const statusClass = {
                    'pending': 'warning',
                    'paid': 'success',
                    'partial': 'info',
                    'delayed': 'danger'
                }[advance.status] || 'secondary';

                const statusText = {
                    'pending': 'معلق',
                    'paid': 'مسدد',
                    'partial': 'سداد جزئي',
                    'delayed': 'مؤجل'
                }[advance.status] || 'غير معروف';

                return `
                    <tr>
                        <td>${employee ? employee.name : advance.employeeCode}</td>
                        <td>${advance.amount.toLocaleString()} ج.م</td>
                        <td>${new Date(advance.submissionDate).toLocaleDateString('ar-EG')}</td>
                        <td>${new Date(advance.expectedRepaymentDate).toLocaleDateString('ar-EG')}</td>
                        <td>
                            <span class="badge bg-${statusClass}">${statusText}</span>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-info" onclick="updateAdvanceStatus('${advance.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ${advance.status === 'pending' ? `
                                    <button class="btn btn-sm btn-danger" onclick="deleteAdvance('${advance.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading advances:', error);
        window.showAlert('حدث خطأ أثناء تحميل بيانات السلف', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Show Advance Form
function showAdvanceForm() {
    const modal = new bootstrap.Modal(document.getElementById('advanceModal'));
    modal.show();
}

// Handle Advance Submit
async function handleAdvanceSubmit() {
    const form = document.getElementById('advance-form');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    try {
        window.toggleLoading(true);

        const advanceData = {
            employeeCode: document.getElementById('employee-select').value,
            amount: parseFloat(document.getElementById('advance-amount').value),
            submissionDate: document.getElementById('submission-date').value,
            expectedRepaymentDate: document.getElementById('expected-repayment-date').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Validate dates
        if (new Date(advanceData.expectedRepaymentDate) <= new Date(advanceData.submissionDate)) {
            window.showAlert('تاريخ السداد المتوقع يجب أن يكون بعد تاريخ التقديم', 'warning');
            return;
        }

        await window.firebaseOperations.advances.add(advanceData);
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('advanceModal'));
        modal.hide();
        form.reset();
        form.classList.remove('was-validated');
        
        // Refresh advances list
        loadAdvances();
        
        window.showAlert('تم إضافة السلفة بنجاح', 'success');

    } catch (error) {
        console.error('Error saving advance:', error);
        window.showAlert('حدث خطأ أثناء حفظ السلفة', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Update Advance Status
async function updateAdvanceStatus(advanceId) {
    try {
        const status = await window.promptForAdvanceStatus();
        if (!status) return;

        window.toggleLoading(true);
        await window.firebaseOperations.advances.updateStatus(advanceId, status);
        loadAdvances();
        window.showAlert('تم تحديث حالة السلفة بنجاح', 'success');
    } catch (error) {
        console.error('Error updating advance status:', error);
        window.showAlert('حدث خطأ أثناء تحديث حالة السلفة', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Delete Advance
async function deleteAdvance(advanceId) {
    if (!confirm('هل أنت متأكد من حذف هذه السلفة؟')) {
        return;
    }

    try {
        window.toggleLoading(true);
        await window.firebaseOperations.advances.delete(advanceId);
        loadAdvances();
        window.showAlert('تم حذف السلفة بنجاح', 'success');
    } catch (error) {
        console.error('Error deleting advance:', error);
        window.showAlert('حدث خطأ أثناء حذف السلفة', 'danger');
    } finally {
        window.toggleLoading(false);
    }
}

// Export necessary functions
window.renderAdvances = renderAdvances;
window.showAdvanceForm = showAdvanceForm;
window.handleAdvanceSubmit = handleAdvanceSubmit;
window.updateAdvanceStatus = updateAdvanceStatus;
window.deleteAdvance = deleteAdvance;
