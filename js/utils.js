// Utility Functions

// Date Formatting
const dateUtils = {
    // Format date to Arabic locale
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get current month in YYYY-MM format
    getCurrentMonth: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    },

    // Convert month string to Arabic
    monthToArabic: (monthStr) => {
        return new Date(monthStr + '-01').toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    }
};

// Number Formatting
const numberUtils = {
    // Format currency
    formatCurrency: (amount) => {
        return amount.toLocaleString('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        });
    },

    // Format number with thousand separator
    formatNumber: (number) => {
        return number.toLocaleString('ar-EG');
    },

    // Convert number to Arabic words
    numberToArabicWords: (number) => {
        const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
        const teens = ['', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
        const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
        const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

        if (number === 0) return 'صفر';
        if (number < 0) return 'سالب ' + numberToArabicWords(Math.abs(number));

        // Handle thousands
        if (number >= 1000) {
            if (number >= 1000000) {
                const millions = Math.floor(number / 1000000);
                const remainder = number % 1000000;
                return numberToArabicWords(millions) + ' مليون ' + (remainder > 0 ? numberToArabicWords(remainder) : '');
            }
            const thousands = Math.floor(number / 1000);
            const remainder = number % 1000;
            return numberToArabicWords(thousands) + ' ألف ' + (remainder > 0 ? numberToArabicWords(remainder) : '');
        }

        // Handle hundreds
        if (number >= 100) {
            const hundred = Math.floor(number / 100);
            const remainder = number % 100;
            return hundreds[hundred] + (remainder > 0 ? ' و' + numberToArabicWords(remainder) : '');
        }

        // Handle tens and units
        if (number >= 20) {
            const ten = Math.floor(number / 10);
            const unit = number % 10;
            return unit > 0 ? units[unit] + ' و' + tens[ten] : tens[ten];
        }

        if (number > 10) return teens[number - 10];
        return units[number];
    }
};

// Excel Export Functions
const excelUtils = {
    // Export table to Excel
    exportTableToExcel: (tableId, fileName) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    },

    // Export data to Excel
    exportDataToExcel: (data, fileName) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    },

    // Export salary report
    exportSalaryReport: (month, data) => {
        const fileName = `salary_report_${month}`;
        const headers = [
            'كود الموظف',
            'اسم الموظف',
            'الراتب الأساسي',
            'الحوافز',
            'الأوفرتايم',
            'الخصومات',
            'صافي الراتب'
        ];

        const wsData = [headers, ...data.map(row => [
            row.employeeCode,
            row.employeeName,
            row.basicSalary,
            row.incentives,
            row.overtime,
            row.deductions,
            row.netSalary
        ])];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Salary Report");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
};

// Print Functions
const printUtils = {
    // Print specific element
    printElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html dir="rtl"><head><title>طباعة</title>');
        
        // Add styles
        document.querySelectorAll('link[rel="stylesheet"]').forEach(styleSheet => {
            printWindow.document.write(styleSheet.outerHTML);
        });
        
        printWindow.document.write('</head><body>');
        printWindow.document.write(element.innerHTML);
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    },

    // Print salary slip
    printSalarySlip: (employeeCode, month) => {
        const employee = appState.employees.find(emp => emp.code === employeeCode);
        const salary = appState.salaries.find(s => s.employeeCode === employeeCode && s.month === month);
        
        if (!employee || !salary) return;

        const content = `
            <div class="salary-slip">
                <div class="text-center mb-4">
                    <h3>قسيمة راتب</h3>
                    <h4>${dateUtils.monthToArabic(month)}</h4>
                </div>
                
                <div class="employee-info mb-4">
                    <div class="row">
                        <div class="col-6">
                            <p><strong>اسم الموظف:</strong> ${employee.name}</p>
                            <p><strong>الوظيفة:</strong> ${employee.jobTitle}</p>
                        </div>
                        <div class="col-6">
                            <p><strong>كود الموظف:</strong> ${employee.code}</p>
                            <p><strong>تاريخ التعيين:</strong> ${dateUtils.formatDate(employee.hireDate)}</p>
                        </div>
                    </div>
                </div>

                <div class="salary-details">
                    <div class="row">
                        <div class="col-6">
                            <h5>المستحقات</h5>
                            <table class="table table-bordered">
                                <tr>
                                    <td>الراتب الأساسي</td>
                                    <td>${numberUtils.formatCurrency(salary.basicSalary)}</td>
                                </tr>
                                <tr>
                                    <td>الحوافز</td>
                                    <td>${numberUtils.formatCurrency(salary.monthlyIncentives)}</td>
                                </tr>
                                <tr>
                                    <td>الأوفرتايم</td>
                                    <td>${numberUtils.formatCurrency(salary.overtimeValue)}</td>
                                </tr>
                                <tr>
                                    <th>إجمالي المستحقات</th>
                                    <th>${numberUtils.formatCurrency(salary.totalEarnings)}</th>
                                </tr>
                            </table>
                        </div>
                        <div class="col-6">
                            <h5>الخصومات</h5>
                            <table class="table table-bordered">
                                <tr>
                                    <td>السلف</td>
                                    <td>${numberUtils.formatCurrency(salary.advances)}</td>
                                </tr>
                                <tr>
                                    <td>الغياب</td>
                                    <td>${numberUtils.formatCurrency(salary.absenceDeduction)}</td>
                                </tr>
                                <tr>
                                    <td>الجزاءات</td>
                                    <td>${numberUtils.formatCurrency(salary.penalties)}</td>
                                </tr>
                                <tr>
                                    <th>إجمالي الخصومات</th>
                                    <th>${numberUtils.formatCurrency(salary.totalDeductions)}</th>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div class="net-salary mt-4">
                        <h4>صافي الراتب: ${numberUtils.formatCurrency(salary.netSalary)}</h4>
                        <p class="text-muted">${numberUtils.numberToArabicWords(salary.netSalary)} جنيه مصري فقط لا غير</p>
                    </div>
                </div>
            </div>
        `;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html dir="rtl"><head><title>قسيمة راتب</title>');
        
        // Add styles
        document.querySelectorAll('link[rel="stylesheet"]').forEach(styleSheet => {
            printWindow.document.write(styleSheet.outerHTML);
        });
        
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
};

// Validation Functions
const validationUtils = {
    // Validate employee data
    validateEmployee: (data) => {
        const errors = [];

        if (!data.code) errors.push('كود الموظف مطلوب');
        if (!data.name) errors.push('اسم الموظف مطلوب');
        if (!data.jobTitle) errors.push('الوظيفة مطلوبة');
        if (!data.basicSalary) errors.push('الراتب الأساسي مطلوب');
        if (!data.hireDate) errors.push('تاريخ التعيين مطلوب');

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate salary data
    validateSalary: (data) => {
        const errors = [];

        if (!data.employeeCode) errors.push('كود الموظف مطلوب');
        if (!data.month) errors.push('الشهر مطلوب');
        if (!data.basicSalary) errors.push('الراتب الأساسي مطلوب');

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Export utilities
window.dateUtils = dateUtils;
window.numberUtils = numberUtils;
window.excelUtils = excelUtils;
window.printUtils = printUtils;
window.validationUtils = validationUtils;
