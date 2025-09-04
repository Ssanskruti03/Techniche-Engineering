document.addEventListener('DOMContentLoaded', function() {
    // Mock data for submitted timesheets
    const submittedTimesheets = [
        { srNo: 1, employeeCode: 'EMP001', projectCode: 'PROJ001', submittedDate: '2024-06-01', status: 'Approved' },
        { srNo: 2, employeeCode: 'EMP002', projectCode: 'PROJ002', submittedDate: '2024-06-02', status: 'Pending' },
        { srNo: 3, employeeCode: 'EMP003', projectCode: 'PROJ003', submittedDate: '2024-06-03', status: 'Rejected' }
    ];

    // Mock data for resubmitted timesheets
    const resubmittedTimesheets = [
        { srNo: 1, employeeCode: 'EMP001', projectCode: 'PROJ001', resubmittedDate: '2024-06-05', status: 'Resubmitted' },
        { srNo: 2, employeeCode: 'EMP002', projectCode: 'PROJ002', resubmittedDate: '2024-06-06', status: 'Pending' }
    ];

    // Mock data for project codes
    const projectCodes = [
        { srNo: 1, projectCode: 'PROJ001', description: 'Project Alpha' },
        { srNo: 2, projectCode: 'PROJ002', description: 'Project Beta' },
        { srNo: 3, projectCode: 'PROJ003', description: 'Project Gamma' }
    ];

    // Function to create status badge HTML
    function createStatusBadge(status) {
        const statusClassMap = {
            'Approved': 'status-approved',
            'Pending': 'status-pending',
            'Rejected': 'status-rejected',
            'Resubmitted': 'status-resubmitted'
        };
        const cssClass = statusClassMap[status] || 'status-pending';
        return `<span class="status-badge ${cssClass}">${status}</span>`;
    }

    // Populate submitted timesheets table
    const submittedTableBody = document.getElementById('submitted-timesheets');
    submittedTimesheets.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.srNo}</td>
            <td class="employee-code">${item.employeeCode}</td>
            <td class="project-code">${item.projectCode}</td>
            <td class="date-cell">${item.submittedDate}</td>
            <td>${createStatusBadge(item.status)}</td>
        `;
        submittedTableBody.appendChild(row);
    });

    // Populate resubmitted timesheets table
    const resubmittedTableBody = document.getElementById('resubmitted-timesheets');
    resubmittedTimesheets.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.srNo}</td>
            <td class="employee-code">${item.employeeCode}</td>
            <td class="project-code">${item.projectCode}</td>
            <td class="date-cell">${item.resubmittedDate}</td>
            <td>${createStatusBadge(item.status)}</td>
        `;
        resubmittedTableBody.appendChild(row);
    });

    // Populate project codes table
    const projectCodesTableBody = document.getElementById('project-codes');
    projectCodes.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.srNo}</td>
            <td class="project-code">${item.projectCode}</td>
            <td>${item.description}</td>
        `;
        projectCodesTableBody.appendChild(row);
    });

    // Access Denied Modal functionality
    const adminBtn = document.getElementById('admin-btn');
    const accessDeniedModal = document.getElementById('access-denied-modal');
    const closeAccessModalBtn = document.getElementById('close-access-modal');
    const closeModalSpan = document.querySelector('.close-modal');

    adminBtn.addEventListener('click', function() {
        accessDeniedModal.style.display = 'block';
    });

    closeAccessModalBtn.addEventListener('click', function() {
        accessDeniedModal.style.display = 'none';
    });

    closeModalSpan.addEventListener('click', function() {
        accessDeniedModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === accessDeniedModal) {
            accessDeniedModal.style.display = 'none';
        }
    });
});
