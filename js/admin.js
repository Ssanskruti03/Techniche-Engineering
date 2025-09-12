document.addEventListener('DOMContentLoaded', function() {
    // Get admin code from session storage
    const adminCode = sessionStorage.getItem('adminCode') || 'ADMIN001';
    
    // Mock admin data (in a real app, this would come from a database)
    const adminData = {
        'ADMIN001': { name: 'Admin User' },
        'ADMIN002': { name: 'Super Admin' }
    };

    // Set admin name
    document.getElementById('admin-name').textContent = adminData[adminCode]?.name || 'Admin';

    // Toggle sidebar
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
    });

    // Action buttons functionality
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const action = this.querySelector('i').className;
                const row = this.closest('tr');
                const employee = row.cells[0].textContent;
                const week = row.cells[1].textContent;
                
                if (action.includes('fa-eye')) {
                    // View timesheet details
                    alert(`Viewing timesheet details for ${employee} (${week})`);
                } else if (action.includes('fa-check')) {
                    // Approve timesheet
                    row.querySelector('.status').className = 'status approved';
                    row.querySelector('.status').textContent = 'Approved';
                    
                    // Disable approve and reject buttons
                    row.querySelectorAll('.action-btn:not(:first-child)').forEach(btn => {
                        btn.disabled = true;
                    });
                    
                    alert(`Timesheet for ${employee} (${week}) has been approved`);
                } else if (action.includes('fa-times')) {
                    // Reject timesheet
                    row.querySelector('.status').className = 'status rejected';
                    row.querySelector('.status').textContent = 'Rejected';
                    
                    // Disable reject button, keep approve button active
                    row.querySelector('.action-btn:last-child').disabled = true;
                    
                    alert(`Timesheet for ${employee} (${week}) has been rejected`);
                }
            });
        }
    });

// Download Dashboard Report as Excel
function downloadExcel() {
    const reportContent = `
        Employee Timesheet Dashboard Report
        Generated: ${new Date().toLocaleString()}
        
        Summary:
        - Total Employees: 24
        - Active Projects: 8
        - Approved Timesheets: 18
        
        Recent Timesheets:
        - Keshav Mane: 40 hours (Pending)
        - John Doe: 38 hours (Approved)
        - Jane Smith: 42 hours (Rejected)
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Download Dashboard Report as PDF
function downloadPDF() {
    const reportContent = `
        Employee Timesheet Dashboard Report
        Generated: ${new Date().toLocaleString()}

        Summary:
        - Total Employees: 24
        - Active Projects: 8
        - Approved Timesheets: 18

        Recent Timesheets:
        - Keshav Mane: 40 hours (Pending)
        - John Doe: 38 hours (Approved)
        - Jane Smith: 42 hours (Rejected)
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_report.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Download Excel Report for Specific Employee
function downloadExcelForEmployee(employeeName) {
    const reportContent = `
        Employee Timesheet Report for ${employeeName}
        Generated: ${new Date().toLocaleString()}

        Employee Details:
        - Name: ${employeeName}
        - Week: May 1 - May 7, 2023
        - Total Hours: 40 (Example)
        - Status: Pending (Example)

        Timesheet Details:
        - Monday: 8 hours
        - Tuesday: 8 hours
        - Wednesday: 8 hours
        - Thursday: 8 hours
        - Friday: 8 hours
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employeeName.replace(' ', '_')}_timesheet.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

    // In a real application, you would have more functionality here:
    // - Fetching real data from a backend API
    // - Pagination for tables
    // - Filtering and sorting
    // - Charts and graphs for analytics
    // - User management
    // - Project management
    // - etc.
});