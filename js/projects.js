// Modern Project Management JavaScript

// Sample initial projects data
let projects = [
    {
        id: 1,
        name: "Website Redesign",
        totalHours: 120,
        juniorHours: 80,
        juniorCompleted: 65,
        seniorHours: 40,
        seniorCompleted: 30,
        status: "active"
    },
    {
        id: 2,
        name: "Mobile App Development",
        totalHours: 200,
        juniorHours: 120,
        juniorCompleted: 90,
        seniorHours: 80,
        seniorCompleted: 60,
        status: "active"
    },
    {
        id: 3,
        name: "Database Migration",
        totalHours: 80,
        juniorHours: 30,
        juniorCompleted: 25,
        seniorHours: 50,
        seniorCompleted: 50,
        status: "completed"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    updateOverviewCards();
    
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
    const modal = document.getElementById('addProjectModal');
    if (event.target === modal) {
        modal.style.display = 'none';
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
            <button class="action-btn" onclick="editProject(${project.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn delete" onclick="deleteProject(${project.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

// Update overview cards
function updateOverviewCards() {
    const totalProjects = projects.length;
    const totalHours = projects.reduce((sum, p) => sum + p.totalHours, 0);
    const completedHours = projects.reduce((sum, p) => sum + p.juniorCompleted + p.seniorCompleted, 0);
    
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('totalHours').textContent = totalHours;
    document.getElementById('completedHours').textContent = completedHours;
}

// Add new project
function addProject() {
    const form = document.getElementById('addProjectForm');
    const formData = new FormData(form);
    
    const newProject = {
        id: projects.length + 1,
        name: formData.get('projectName'),
        totalHours: parseInt(formData.get('totalHours')),
        juniorHours: parseInt(formData.get('juniorHours')) || 0,
        juniorCompleted: parseInt(formData.get('juniorCompleted')) || 0,
        seniorHours: parseInt(formData.get('seniorHours')) || 0,
        seniorCompleted: parseInt(formData.get('seniorCompleted')) || 0,
        status: formData.get('projectStatus') || 'active'
    };
    
    projects.push(newProject);
        loadProjects();
        updateOverviewCards();
        renderHoursChart();
    
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
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
        // Store the updated values
        const updatedProject = {
            id: id, // Keep the same ID
            name: formData.get('projectName'),
            totalHours: parseInt(formData.get('totalHours')),
            juniorHours: parseInt(formData.get('juniorHours')) || 0,
            juniorCompleted: parseInt(formData.get('juniorCompleted')) || 0,
            seniorHours: parseInt(formData.get('seniorHours')) || 0,
            seniorCompleted: parseInt(formData.get('seniorCompleted')) || 0,
            status: formData.get('projectStatus') || 'active'
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
