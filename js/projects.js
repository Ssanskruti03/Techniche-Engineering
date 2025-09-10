// Modern Project Management JavaScript

// Sample employees data (copied from user-management.js)
let employees = [
    {
        id: 1,
        firstName: "Keshav",
        lastName: "Mane",
        employeeId: "EMP001",
        username: "keshav.mane",
        email: "keshav.mane@company.com",
        role: "admin",
        department: "IT"
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        employeeId: "EMP002",
        username: "jane.smith",
        email: "jane.smith@company.com",
        role: "manager",
        department: "HR"
    },
    {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        employeeId: "EMP003",
        username: "mike.johnson",
        email: "mike.johnson@company.com",
        role: "employee",
        department: "Finance"
    }
];

// Sample initial projects data
let projects = [
    {
        id: 1,
        plNo: "PL001",
        name: "Website Redesign",
        totalHours: 120,
        juniorHours: 80,
        juniorCompleted: 65,
        seniorHours: 40,
        seniorCompleted: 30,
        status: "active",
        startDate: "2024-01-15",
        endDate: "2024-03-15",
        assignedEmployees: [1, 2] // Sample assigned employees
    },
    {
        id: 2,
        plNo: "PL002",
        name: "Mobile App Development",
        totalHours: 200,
        juniorHours: 120,
        juniorCompleted: 90,
        seniorHours: 80,
        seniorCompleted: 60,
        status: "active",
        startDate: "2024-02-01",
        endDate: "2024-05-01",
        assignedEmployees: [2, 3]
    },
    {
        id: 3,
        plNo: "PL003",
        name: "Database Migration",
        totalHours: 80,
        juniorHours: 30,
        juniorCompleted: 25,
        seniorHours: 50,
        seniorCompleted: 50,
        status: "completed",
        startDate: "2023-11-01",
        endDate: "2024-01-15",
        assignedEmployees: [1]
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    updateOverviewCards();
    populateEmployeeSelect();

    // Form submission handler - handles both add and edit
    document.getElementById('addProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const editId = this.dataset.editId;
        if (editId) {
            updateProject(parseInt(editId));
        } else {
            addProject();
        }
    });

    // Search and filter handlers
    document.getElementById('searchProjects').addEventListener('input', filterProjects);
    document.getElementById('filterStatus').addEventListener('change', filterProjects);
});

// Toggle add project modal
function toggleAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addProjectModal');
    const assignedModal = document.getElementById('assignedEmployeesModal');
    if (event.target === addModal) {
        addModal.style.display = 'none';
    }
    if (event.target === assignedModal) {
        closeAssignedEmployeesModal();
    }
}

// Load and display projects
function loadProjects() {
    console.log('Loading projects:', projects); // Log the projects array
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

// Create project card HTML
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const juniorProgress = project.juniorHours > 0 ? (project.juniorCompleted / project.juniorHours * 100).toFixed(1) : 0;
    const seniorProgress = project.seniorHours > 0 ? (project.seniorCompleted / project.seniorHours * 100).toFixed(1) : 0;
    const totalProgress = project.totalHours > 0 ? ((project.juniorCompleted + project.seniorCompleted) / project.totalHours * 100).toFixed(1) : 0;

    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-title">${project.name}</h3>
                <div class="project-pl-no">PL No: ${project.plNo}</div>
            </div>
            <span class="project-status status-${project.status}">${project.status}</span>
        </div>

        <div class="project-stats">
            <div class="stat-item">
                <div class="stat-label">Total Hours</div>
                <div class="stat-value">${project.totalHours}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Completed</div>
                <div class="stat-value">${project.juniorCompleted + project.seniorCompleted}</div>
            </div>
            ${project.variationHours && project.variationHours !== 0 ? `
            <div class="stat-item">
                <div class="stat-label">Provided Hours</div>
                <div class="stat-value">${project.originalTotalHours || project.totalHours}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Variation Hours</div>
                <div class="stat-value ${project.variationHours > 0 ? 'variation-positive' : 'variation-negative'}">
                    ${project.variationHours > 0 ? '+' : ''}${project.variationHours}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="progress-section">
            <div class="progress-label">
                <span>Junior Progress</span>
                <span>${juniorProgress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${juniorProgress}%"></div>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-label">
                <span>Senior Progress</span>
                <span>${seniorProgress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${seniorProgress}%"></div>
            </div>
        </div>

        <div class="project-actions">
            <button class="action-btn" onclick="showAssignedEmployees(${project.id})">
                <i class="fas fa-users"></i> Assigned Employees
            </button>
            <button class="action-btn" onclick="editProject(${project.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn delete" onclick="deleteProject(${project.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>

        <div class="project-download">
            <button class="download-btn" onclick="downloadProjectExcel(${project.id})">
                <i class="fas fa-download"></i> Download Excel
            </button>
        </div>
    `;

    return card;
}

// Show assigned employees modal
function showAssignedEmployees(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const assignedIds = project.assignedEmployees || [];
    const assignedEmps = employees.filter(emp => assignedIds.includes(emp.id));

    let employeeList = '';
    if (assignedEmps.length === 0) {
        employeeList = '<p>No employees assigned to this project.</p>';
    } else {
        employeeList = '<ul class="assigned-employees-list">';
        assignedEmps.forEach(emp => {
            employeeList += `<li>${emp.firstName} ${emp.lastName} (${emp.employeeId}) - ${emp.role}</li>`;
        });
        employeeList += '</ul>';
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'assignedEmployeesModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Assigned Employees - ${project.name}</h2>
                <span class="close" onclick="closeAssignedEmployeesModal()">&times;</span>
            </div>
            <div class="modal-body">
                ${employeeList}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Close assigned employees modal
function closeAssignedEmployeesModal() {
    const modal = document.getElementById('assignedEmployeesModal');
    if (modal) {
        modal.remove();
    }
}

// Populate employee select dropdown
function populateEmployeeSelect() {
    const select = document.getElementById('assignedEmployees');
    if (!select) return;

    select.innerHTML = '';
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.firstName} ${employee.lastName} (${employee.employeeId}) - ${employee.role}`;
        select.appendChild(option);
    });
}

// Add project
function addProject() {
    const form = document.getElementById('addProjectForm');
    const formData = new FormData(form);

    // Get selected employees
    const selectedEmployees = Array.from(formData.getAll('assignedEmployees')).map(id => parseInt(id));

    const newProject = {
        id: projects.length + 1,
        plNo: "PL" + (projects.length + 1).toString().padStart(3, '0'),
        name: formData.get('projectName'),
        totalHours: parseInt(formData.get('totalHours')),
        juniorHours: parseInt(formData.get('juniorHours')) || 0,
        juniorCompleted: parseInt(formData.get('juniorCompleted')) || 0,
        seniorHours: parseInt(formData.get('seniorHours')) || 0,
        seniorCompleted: parseInt(formData.get('seniorCompleted')) || 0,
        status: formData.get('projectStatus') || 'active',
        originalTotalHours: parseInt(formData.get('totalHours')), // store original assigned hours
        variationHours: 0, // initial variation is zero
        assignedEmployees: selectedEmployees
    };

    projects.push(newProject);
    loadProjects();
    updateOverviewCards();

    // Reset form and close modal
    form.reset();
    toggleAddProjectModal();

    // Show success message
    showNotification('Project added successfully!');
}

// Edit project
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        // Populate form with project data
        document.getElementById('projectName').value = project.name;
        document.getElementById('totalHours').value = project.totalHours;
        document.getElementById('juniorHours').value = project.juniorHours;
        document.getElementById('juniorCompleted').value = project.juniorCompleted;
        document.getElementById('seniorHours').value = project.seniorHours;
        document.getElementById('seniorCompleted').value = project.seniorCompleted;
        document.getElementById('projectStatus').value = project.status;

        // Populate assigned employees
        const select = document.getElementById('assignedEmployees');
        if (select) {
            // Clear all selections first
            Array.from(select.options).forEach(option => {
                option.selected = false;
            });

            // Select the assigned employees
            const assignedIds = project.assignedEmployees || [];
            assignedIds.forEach(employeeId => {
                const option = select.querySelector(`option[value="${employeeId}"]`);
                if (option) {
                    option.selected = true;
                }
            });
        }

        // Display variation hours if they exist
        const variationDisplay = document.getElementById('variationDisplay');
        if (variationDisplay) {
            if (project.variationHours && project.variationHours !== 0) {
                variationDisplay.innerHTML = `
                    <div class="variation-info">
                        <label>Variation Hours:</label>
                        <span class="${project.variationHours > 0 ? 'variation-positive' : 'variation-negative'}">
                            ${project.variationHours > 0 ? '+' : ''}${project.variationHours} hours
                        </span>
                    </div>
                `;
                variationDisplay.style.display = 'block';
            } else {
                variationDisplay.style.display = 'none';
            }
        }

        // Change modal title and button text
        document.querySelector('#addProjectModal .modal-header h2').textContent = 'Edit Project';
        document.querySelector('#addProjectModal .btn-primary').textContent = 'Save Changes';

        // Store project ID as data attribute
        document.getElementById('addProjectForm').dataset.editId = id;

        // Show modal
        toggleAddProjectModal();
    }
}

// Update project
function updateProject(id) {
    const form = document.getElementById('addProjectForm');
    const formData = new FormData(form);

    // Get selected employees
    const selectedEmployees = Array.from(formData.getAll('assignedEmployees')).map(id => parseInt(id));

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
        const oldProject = projects[projectIndex];
        const newTotalHours = parseInt(formData.get('totalHours'));

        // Calculate variation hours as difference between new and original total hours
        const variationHours = newTotalHours - (oldProject.originalTotalHours || oldProject.totalHours);

        // Store the updated values, preserving originalTotalHours and updating variationHours
        const updatedProject = {
            id: id, // Keep the same ID
            plNo: oldProject.plNo, // Keep the same PL No
            name: formData.get('projectName'),
            totalHours: newTotalHours,
            juniorHours: parseInt(formData.get('juniorHours')) || 0,
            juniorCompleted: parseInt(formData.get('juniorCompleted')) || 0,
            seniorHours: parseInt(formData.get('seniorHours')) || 0,
            seniorCompleted: parseInt(formData.get('seniorCompleted')) || 0,
            status: formData.get('projectStatus') || 'active',
            originalTotalHours: oldProject.originalTotalHours || oldProject.totalHours,
            variationHours: variationHours,
            assignedEmployees: selectedEmployees
        };

        // Replace the project in the array
        projects[projectIndex] = updatedProject;

        loadProjects();
        updateOverviewCards();

        // Reset form and close modal
        form.reset();
        toggleAddProjectModal();

        // Reset modal title and button text
        document.querySelector('#addProjectModal .modal-header h2').textContent = 'Add New Project';
        document.querySelector('#addProjectModal .btn-primary').textContent = 'Add Project';

        // Clear edit mode
        document.getElementById('addProjectForm').dataset.editId = '';

        showNotification('Project updated successfully!');
    }
}

// Update overview cards
function updateOverviewCards() {
    const totalProjects = projects.length;
    const providedHours = projects.reduce((sum, p) => sum + (p.originalTotalHours || p.totalHours), 0);
    const variationHours = projects.reduce((sum, p) => sum + (p.variationHours || 0), 0);
    const totalHours = projects.reduce((sum, p) => sum + p.totalHours, 0);
    const completedHours = projects.reduce((sum, p) => sum + p.juniorCompleted + p.seniorCompleted, 0);

    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('providedHours').textContent = providedHours;
    document.getElementById('variationHours').textContent = variationHours;
    document.getElementById('totalHours').textContent = totalHours;
    document.getElementById('completedHours').textContent = completedHours;
}

// Delete project
function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        loadProjects();
        updateOverviewCards();
        renderHoursChart();
        renderProgressChart();
        showNotification('Project deleted successfully!');
    }
}

// Filter projects
function filterProjects() {
    const searchTerm = document.getElementById('searchProjects').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

// Removed renderHoursChart function as the bar graph has been removed from the page

// Removed renderProgressChart function as it's no longer needed

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Toggle sidebar functionality
document.getElementById('toggle-sidebar').addEventListener('click', function() {
    document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
});

// Download project data as Excel (CSV format)
function downloadProjectExcel(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Project not found!');
        return;
    }

    // Get assigned employees details
    const assignedIds = project.assignedEmployees || [];
    const assignedEmps = employees.filter(emp => assignedIds.includes(emp.id));

    // Calculate progress percentages
    const juniorProgress = project.juniorHours > 0 ? (project.juniorCompleted / project.juniorHours * 100).toFixed(1) : 0;
    const seniorProgress = project.seniorHours > 0 ? (project.seniorCompleted / project.seniorHours * 100).toFixed(1) : 0;
    const totalProgress = project.totalHours > 0 ? ((project.juniorCompleted + project.seniorCompleted) / project.totalHours * 100).toFixed(1) : 0;

    // Create CSV content
    let csvContent = 'Project Details\n';
    csvContent += 'Field,Value\n';
    csvContent += `Project Name,"${project.name}"\n`;
    csvContent += `PL Number,"${project.plNo}"\n`;
    csvContent += `Status,"${project.status}"\n`;
    csvContent += `Start Date,"${project.startDate || 'Not Set'}"\n`;
    csvContent += `End Date,"${project.endDate || 'Not Set'}"\n`;
    csvContent += `Total Hours,"${project.totalHours}"\n`;
    csvContent += `Original Total Hours,"${project.originalTotalHours || project.totalHours}"\n`;
    csvContent += `Variation Hours,"${project.variationHours || 0}"\n`;
    csvContent += `Completed Hours,"${project.juniorCompleted + project.seniorCompleted}"\n`;
    csvContent += `Overall Progress,"${totalProgress}%"\n`;
    csvContent += '\nJunior Level Details\n';
    csvContent += 'Field,Value\n';
    csvContent += `Junior Hours,"${project.juniorHours}"\n`;
    csvContent += `Junior Completed,"${project.juniorCompleted}"\n`;
    csvContent += `Junior Progress,"${juniorProgress}%"\n`;
    csvContent += '\nSenior Level Details\n';
    csvContent += 'Field,Value\n';
    csvContent += `Senior Hours,"${project.seniorHours}"\n`;
    csvContent += `Senior Completed,"${project.seniorCompleted}"\n`;
    csvContent += `Senior Progress,"${seniorProgress}%"\n`;

    // Add assigned employees section
    csvContent += '\nAssigned Employees\n';
    if (assignedEmps.length > 0) {
        csvContent += 'Employee ID,Name,Role,Department,Email\n';
        assignedEmps.forEach(emp => {
            csvContent += `"${emp.employeeId}","${emp.firstName} ${emp.lastName}","${emp.role}","${emp.department}","${emp.email}"\n`;
        });
    } else {
        csvContent += 'No employees assigned to this project.\n';
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Excel report downloaded successfully!');
}

// Generate comprehensive employee report
function generateEmployeeReport() {
    // Create CSV content for employee report
    let csvContent = 'Employee Report\n';
    csvContent += 'Generated on,' + new Date().toLocaleDateString() + '\n\n';

    // Employee Overview Section
    csvContent += 'Employee Overview\n';
    csvContent += 'Employee ID,Name,Role,Department,Email,Total Projects Assigned\n';

    employees.forEach(employee => {
        // Count projects assigned to this employee
        const assignedProjects = projects.filter(project =>
            project.assignedEmployees && project.assignedEmployees.includes(employee.id)
        ).length;

        csvContent += `"${employee.employeeId}","${employee.firstName} ${employee.lastName}","${employee.role}","${employee.department}","${employee.email}","${assignedProjects}"\n`;
    });

    csvContent += '\n';

    // Detailed Employee-Project Assignments
    csvContent += 'Employee-Project Assignments\n';
    csvContent += 'Employee ID,Employee Name,Project Name,PL Number,Project Status,Start Date,End Date,Total Hours,Completed Hours,Progress (%)\n';

    employees.forEach(employee => {
        const employeeProjects = projects.filter(project =>
            project.assignedEmployees && project.assignedEmployees.includes(employee.id)
        );

        if (employeeProjects.length > 0) {
            employeeProjects.forEach(project => {
                const completedHours = project.juniorCompleted + project.seniorCompleted;
                const progress = project.totalHours > 0 ? ((completedHours / project.totalHours) * 100).toFixed(1) : 0;

                csvContent += `"${employee.employeeId}","${employee.firstName} ${employee.lastName}","${project.name}","${project.plNo}","${project.status}","${project.startDate || 'Not Set'}","${project.endDate || 'Not Set'}","${project.totalHours}","${completedHours}","${progress}%"`;
                csvContent += '\n';
            });
        } else {
            csvContent += `"${employee.employeeId}","${employee.firstName} ${employee.lastName}",No projects assigned,,,,,,,,`;
            csvContent += '\n';
        }
    });

    csvContent += '\n';

    // Project Summary by Department
    csvContent += 'Department Summary\n';
    csvContent += 'Department,Total Employees,Active Projects,Completed Projects,Total Hours Allocated\n';

    const departments = [...new Set(employees.map(emp => emp.department))];

    departments.forEach(dept => {
        const deptEmployees = employees.filter(emp => emp.department === dept);
        const deptEmployeeIds = deptEmployees.map(emp => emp.id);

        const deptProjects = projects.filter(project =>
            project.assignedEmployees &&
            project.assignedEmployees.some(empId => deptEmployeeIds.includes(empId))
        );

        const activeProjects = deptProjects.filter(p => p.status === 'active').length;
        const completedProjects = deptProjects.filter(p => p.status === 'completed').length;
        const totalHours = deptProjects.reduce((sum, p) => sum + p.totalHours, 0);

        csvContent += `"${dept}","${deptEmployees.length}","${activeProjects}","${completedProjects}","${totalHours}"\n`;
    });

    csvContent += '\n';

    // Project Status Summary
    csvContent += 'Project Status Summary\n';
    csvContent += 'Status,Count,Total Hours,Completed Hours\n';

    const statusSummary = {};
    projects.forEach(project => {
        if (!statusSummary[project.status]) {
            statusSummary[project.status] = {
                count: 0,
                totalHours: 0,
                completedHours: 0
            };
        }
        statusSummary[project.status].count++;
        statusSummary[project.status].totalHours += project.totalHours;
        statusSummary[project.status].completedHours += project.juniorCompleted + project.seniorCompleted;
    });

    Object.keys(statusSummary).forEach(status => {
        csvContent += `"${status}","${statusSummary[status].count}","${statusSummary[status].totalHours}","${statusSummary[status].completedHours}"\n`;
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Employee report downloaded successfully!');
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
