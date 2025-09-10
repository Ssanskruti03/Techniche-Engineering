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

let currentEmployee = null;

// Autofill employee name when code is entered
function autoFillFromCode() {
  const codeInput = document.getElementById("employeeCodeSearch").value.trim().toUpperCase();
  if (employees[codeInput]) {
    const emp = employees[codeInput];
    document.getElementById("employeeNameSearch").value = emp.firstName + " " + emp.lastName;
  }
}

// Autofill employee code when name is entered
function autoFillFromName() {
  const nameInput = document.getElementById("employeeNameSearch").value.trim().toLowerCase();
  const empEntry = Object.entries(employees).find(([code, emp]) => (emp.firstName + " " + emp.lastName).toLowerCase() === nameInput);
  if (empEntry) {
    document.getElementById("employeeCodeSearch").value = empEntry[0];
  }
}

// Search employee by code or name and display details and projects
function searchEmployee() {
  const codeInput = document.getElementById("employeeCodeSearch").value.trim().toUpperCase();
  const nameInput = document.getElementById("employeeNameSearch").value.trim().toLowerCase();

  currentEmployee = employees[codeInput] || Object.values(employees).find(emp => (emp.firstName + " " + emp.lastName).toLowerCase() === nameInput);

  const empDetailsDiv = document.getElementById("employeeDetails");
  const filterSection = document.getElementById("filterSection");
  const projectSection = document.getElementById("projectSection");
  const errorMsgDiv = document.getElementById("errorMsg");

  if (currentEmployee) {
    errorMsgDiv.style.display = "none";
    empDetailsDiv.style.display = "block";
    filterSection.style.display = "block";
    projectSection.style.display = "block";

    empDetailsDiv.innerHTML = `
      <h3>Employee Details</h3>
      <p><b>Name:</b> ${currentEmployee.firstName} ${currentEmployee.lastName}</p>
      <p><b>Department:</b> ${currentEmployee.department}</p>
      <p><b>Role:</b> ${currentEmployee.role}</p>
    `;

    displayProjects(currentEmployee.projects);
    document.getElementById("exportBtn").style.display = "block";
  } else {
    empDetailsDiv.style.display = "none";
    filterSection.style.display = "none";
    projectSection.style.display = "none";
    document.getElementById("exportBtn").style.display = "none";
    errorMsgDiv.style.display = "block";
    errorMsgDiv.textContent = "❌ Employee not found!";
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
  if (!currentEmployee) {
    alert("Please search for an employee first.");
    return;
  }

  // Create CSV header with employee information
  let csv = "Employee Report\n";
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

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentEmployee.firstName}_${currentEmployee.lastName}_projects.csv`;
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
