// Employee Report JavaScript

// Sample employees data
const employees = {
  "EMP001": {
    firstName: "Keshav",
    lastName: "Mane",
    employeeId: "EMP001",
    department: "IT",
    role: "admin",
    projects: [
      { name: "Website Redesign", plNo: "PL001", status: "Active", startDate: "2024-01-15", endDate: "2024-03-15", totalHours: 120, completedHours: 95 },
      { name: "Database Migration", plNo: "PL003", status: "Completed", startDate: "2023-11-01", endDate: "2024-01-15", totalHours: 80, completedHours: 80 }
    ]
  },
  "EMP002": {
    firstName: "Jane",
    lastName: "Smith",
    employeeId: "EMP002",
    department: "HR",
    role: "manager",
    projects: [
      { name: "Mobile App Development", plNo: "PL002", status: "Active", startDate: "2024-02-01", endDate: "2024-05-01", totalHours: 200, completedHours: 150 }
    ]
  },
  "EMP003": {
    firstName: "Mike",
    lastName: "Johnson",
    employeeId: "EMP003",
    department: "Finance",
    role: "employee",
    projects: []
  }
};

// Sample projects data from @projects
const projects = [
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
    assignedEmployees: [1, 2] // Note: IDs from projects.js employees
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

// Mapping from employee ID in projects to employeeId in employees
const employeeIdMapping = {
  1: "EMP001",
  2: "EMP002",
  3: "EMP003"
};

let currentEmployee = null;
let currentProject = null;
let searchType = 'employee';

// Autofill employee name or project name when code is entered
function autoFillFromCode() {
  const codeInput = document.getElementById("employeeCodeSearch").value.trim().toUpperCase();
  if (employees[codeInput]) {
    const emp = employees[codeInput];
    document.getElementById("employeeNameSearch").value = emp.firstName + " " + emp.lastName;
  } else {
    // Check if it's a PL No.
    const project = projects.find(p => p.plNo.toUpperCase() === codeInput);
    if (project) {
      document.getElementById("employeeNameSearch").value = project.name;
    }
  }
}

// Autofill employee code or PL No. when name is entered
function autoFillFromName() {
  const nameInput = document.getElementById("employeeNameSearch").value.trim().toLowerCase();
  const empEntry = Object.entries(employees).find(([code, emp]) => (emp.firstName + " " + emp.lastName).toLowerCase() === nameInput);
  if (empEntry) {
    document.getElementById("employeeCodeSearch").value = empEntry[0];
  } else {
    // Check if it's a project name
    const project = projects.find(p => p.name.toLowerCase() === nameInput);
    if (project) {
      document.getElementById("employeeCodeSearch").value = project.plNo;
    }
  }
}

// Search employee by code or name and display details and projects
function searchEmployee() {
  const codeInput = document.getElementById("employeeCodeSearch").value.trim().toUpperCase();
  const nameInput = document.getElementById("employeeNameSearch").value.trim().toLowerCase();

  currentEmployee = null;
  currentProject = null;
  searchType = 'employee';

  currentEmployee = employees[codeInput] || Object.values(employees).find(emp => (emp.firstName + " " + emp.lastName).toLowerCase() === nameInput);

  // If not found, check if codeInput is PL No.
  if (!currentEmployee) {
    const projectByPL = projects.find(p => p.plNo.toUpperCase() === codeInput);
    if (projectByPL) {
      currentProject = projectByPL;
      searchType = 'project';
    }
  }

  // If still not found, check if nameInput is project name
  if (!currentEmployee && !currentProject) {
    const projectByName = projects.find(p => p.name.toLowerCase() === nameInput);
    if (projectByName) {
      currentProject = projectByName;
      searchType = 'project';
    }
  }

  const empDetailsDiv = document.getElementById("employeeDetails");
  const filterSection = document.getElementById("filterSection");
  const projectSection = document.getElementById("projectSection");
  const errorMsgDiv = document.getElementById("errorMsg");

  if (currentEmployee || currentProject) {
    errorMsgDiv.style.display = "none";
    empDetailsDiv.style.display = "block";
    projectSection.style.display = "block";

    if (searchType === 'project') {
      // Display project details
      const proj = currentProject;
      const assignedEmps = proj.assignedEmployees.map(id => employees[employeeIdMapping[id]]);
      const departments = [...new Set(assignedEmps.map(emp => emp.department))].join(", ");
      const empNames = assignedEmps.map(emp => emp.firstName + " " + emp.lastName).join(", ");
      const consumedHours = proj.juniorCompleted + proj.seniorCompleted;

      empDetailsDiv.innerHTML = `
        <h3>Project Details</h3>
        <p><b>Project Name:</b> ${proj.name}</p>
        <p><b>PL No.:</b> ${proj.plNo}</p>
        <p><b>Departments Assigned:</b> ${departments}</p>
        <p><b>Employees Assigned:</b> ${empNames}</p>
        <p><b>Start Date:</b> ${proj.startDate}</p>
        <p><b>End Date:</b> ${proj.endDate}</p>
       <p><b>Total Hours:</b> ${proj.totalHours}</p>
        <p><b>Consumed Hours:</b> ${consumedHours}</p>
      `;

      filterSection.style.display = "none";
      projectSection.style.display = "none";
      document.getElementById("exportBtn").style.display = "block";
    } else {
      // Display employee details
      empDetailsDiv.innerHTML = `
        <h3>Employee Details</h3>
        <p><b>Name:</b> ${currentEmployee.firstName} ${currentEmployee.lastName}</p>
        <p><b>Department:</b> ${currentEmployee.department}</p>
        <p><b>Role:</b> ${currentEmployee.role}</p>
      `;

      filterSection.style.display = "block";
      displayProjects(currentEmployee.projects);
      document.getElementById("exportBtn").style.display = "block";
    }
  } else {
    empDetailsDiv.style.display = "none";
    filterSection.style.display = "none";
    projectSection.style.display = "none";
    document.getElementById("exportBtn").style.display = "none";
    errorMsgDiv.style.display = "block";
    errorMsgDiv.textContent = "❌ Employee or Project not found!";
  }
}

// Display projects in the project list div
function displayProjects(projects) {
  const projectListDiv = document.getElementById("projectList");
  projectListDiv.innerHTML = "";
  projects.forEach(proj => {
    const projDiv = document.createElement("div");
    projDiv.className = "project";
    const statusClass = "status-" + proj.status.toLowerCase().replace(" ", "").replace("-", "");
    projDiv.innerHTML = `
      <span>${proj.name}</span>
      <span class="${statusClass}">${proj.status}</span>
    `;
    projectListDiv.appendChild(projDiv);
  });
}

// Filter projects by status from dropdown
function filterProjects() {
  const filterValue = document.getElementById("statusFilter").value;
  if (!currentEmployee) return;

  if (filterValue === "All") {
    displayProjects(currentEmployee.projects);
  } else {
    const filtered = currentEmployee.projects.filter(p => p.status === filterValue);
    displayProjects(filtered);
  }
}

// Export to Excel (CSV format)
function exportToExcel() {
  if (!currentEmployee && !currentProject) {
    alert("Please search for an employee or project first.");
    return;
  }

  let csv = "";
  let filename = "";

  if (searchType === 'project') {
    const proj = currentProject;
    const assignedEmps = proj.assignedEmployees.map(id => employees[employeeIdMapping[id]]);
    const departments = [...new Set(assignedEmps.map(emp => emp.department))].join(", ");
    const empNames = assignedEmps.map(emp => emp.firstName + " " + emp.lastName).join(", ");
    const consumedHours = proj.juniorCompleted + proj.seniorCompleted;

    csv = "Project Report\n";
    csv += `Project Name: ${proj.name}\n`;
    csv += `PL No.: ${proj.plNo}\n`;
    csv += `Departments Assigned: ${departments}\n`;
    csv += `Employees Assigned: ${empNames}\n`;
    csv += `Start Date: ${proj.startDate}\n`;
    csv += `End Date: ${proj.endDate}\n`;
    csv += `Total Hours: ${proj.totalHours}\n`;
    csv += `Consumed Hours: ${consumedHours}\n`;
    csv += `Generated on: ${new Date().toLocaleDateString()}\n`;

    filename = `${proj.name.replace(/\s+/g, '_')}_report.csv`;
  } else {
    // Create CSV header with employee information
    csv = "Employee Report\n";
    csv += `Employee Name: ${currentEmployee.firstName} ${currentEmployee.lastName}\n`;
    csv += `Employee ID: ${currentEmployee.employeeId}\n`;
    csv += `Department: ${currentEmployee.department}\n`;
    csv += `Role: ${currentEmployee.role}\n`;
    csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Projects section with enhanced details
    csv += "Assigned Projects\n";
    csv += "Project Name,PL Number,Status,Start Date,End Date,Total Hours,Completed Hours,Progress (%)\n";

    currentEmployee.projects.forEach(proj => {
      const progress = proj.totalHours > 0 ? ((proj.completedHours / proj.totalHours) * 100).toFixed(1) : 0;
      // Show current project's start date (if project is active or on hold)
      const startDate = proj.startDate; // Always show start date
      const endDate = proj.status === "Completed" ? proj.endDate : ''; // Show end date only if completed
      csv += `"${proj.name}","${proj.plNo}","${proj.status}","${startDate}","${endDate}","${proj.totalHours}","${proj.completedHours}","${progress}%"`;
      csv += "\n";
    });

    // Summary section
    const totalProjects = currentEmployee.projects.length;
    const totalHours = currentEmployee.projects.reduce((sum, p) => sum + p.totalHours, 0);
    const completedHours = currentEmployee.projects.reduce((sum, p) => sum + p.completedHours, 0);
    const activeProjects = currentEmployee.projects.filter(p => p.status.toLowerCase() === 'active').length;
    const completedProjects = currentEmployee.projects.filter(p => p.status.toLowerCase() === 'completed').length;

    csv += "\nSummary\n";
    csv += "Total Projects,Active Projects,Completed Projects,Total Hours,Completed Hours\n";
    csv += `"${totalProjects}","${activeProjects}","${completedProjects}","${totalHours}","${completedHours}"\n`;

    filename = `${currentEmployee.firstName}_${currentEmployee.lastName}_projects.csv`;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  // Hide error message initially
  document.getElementById("errorMsg").style.display = "none";
  // Hide employee details, filter, and projects initially
  document.getElementById("employeeDetails").style.display = "none";
  document.getElementById("filterSection").style.display = "none";
  document.getElementById("projectSection").style.display = "none";
  document.getElementById("exportBtn").style.display = "none";
});