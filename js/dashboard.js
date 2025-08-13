document.addEventListener('DOMContentLoaded', function() {
    // Get employee code from session storage
    const employeeCode = sessionStorage.getItem('employeeCode') || 'EMP001';
    
    // Mock employee data (in a real app, this would come from a database)
    const employeeData = {
        'EMP001': { name: 'Keshav Mane', position: 'Jr IT Support Engineer' },
        'EMP002': { name: 'John Doe', position: 'Senior Developer' },
        'EMP003': { name: 'Jane Smith', position: 'Project Manager' },
        'ADMIN001': { name: 'Admin User', position: 'System Administrator' }
    };

    // Set employee information
    document.getElementById('employee-code').value = employeeCode;
    document.getElementById('employee-name').textContent = employeeData[employeeCode]?.name || 'Unknown Employee';
    document.getElementById('employee-name-input').value = employeeData[employeeCode]?.name || 'Unknown Employee';
    // Map full position to select value
function mapPositionToSelectValue(position) {
    if (!position) return 'Select';
    if (position.toLowerCase().includes('junior')) return 'Junior';
    if (position.toLowerCase().includes('senior')) return 'Senior';
    if (position.toLowerCase().includes('manager')) return 'Manager';
    return 'Select'; // default
}

document.getElementById('position').value = mapPositionToSelectValue(employeeData[employeeCode]?.position);
    // Set default dates for the current week
    setDefaultWeekDates();

    // Initialize timesheet table
    initializeTimesheetTable();

    // Toggle sidebar
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
    });

    // Add row button
    document.getElementById('add-row-btn').addEventListener('click', function() {
        addTimesheetRow();
    });


    // Hours modal functionality
    const hoursModal = document.getElementById('hours-modal');
    const closeModal = document.querySelector('.close-modal');
    const hoursForm = document.getElementById('hours-form');
    
    let currentCell = null;

    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        hoursModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === hoursModal) {
            hoursModal.style.display = 'none';
        }
    });

    // Updated form submission handler in dashboardd.js
    // Update the hoursForm submit event handler
hoursForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentCell) return;
    
    const hours = parseFloat(document.getElementById('work-hours').value) || 0;
    const activityCode = document.getElementById('activity-code').value;
    const shiftType = document.querySelector('input[name="shift-type"]:checked').value;
    
    if (hours === 0 || !activityCode) {
        alert('Please enter hours and select activity code');
        return;
    }
    
    // OR Gate Condition: Determine hours type based on shift selection
    const normalHours = shiftType === 'normal' ? hours : 0;
    const overtimeHours = shiftType === 'overtime' ? hours : 0;
    
    // Update the cell
    currentCell.innerHTML = `<span class="normal-hours">${normalHours}</span>/<span class="overtime-hours">${overtimeHours}</span>`;
    currentCell.setAttribute('data-normal-hours', normalHours);
    currentCell.setAttribute('data-overtime-hours', overtimeHours);
    currentCell.setAttribute('data-activity-code', activityCode);
    currentCell.classList.add('has-hours');
    
    // Update totals
    updateTotals();
    updateRowTotal(currentCell.parentElement);
    
    // Close the modal
    hoursModal.style.display = 'none';
});

// Update the openHoursModal function
function openHoursModal(cell) {
    currentCell = cell;
    
    // Reset form with shift selection
    document.getElementById('work-hours').value = 
        parseFloat(cell.getAttribute('data-normal-hours') || 0) + 
        parseFloat(cell.getAttribute('data-overtime-hours') || 0) || '0';
        
    document.getElementById('activity-code').value = 
        cell.getAttribute('data-activity-code') || '';
    
    // Set shift type based on existing data
    const shiftRadios = document.getElementsByName('shift-type');
    if (parseFloat(cell.getAttribute('data-overtime-hours') || 0) > 0) {
        shiftRadios[1].checked = true; // Overtime
    } else {
        shiftRadios[0].checked = true; // Normal
    }
    
    // Show modal
    hoursModal.style.display = 'block';
}    
    // Handle delete row functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-row-btn')) {
            if (confirm('Are you sure you want to delete this row?')) {
                const row = e.target.closest('tr');
                row.remove();
                updateRowNumbers();
                updateTotals();
            }
        }
    });

    // Function to set default week dates
    function setDefaultWeekDates() {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
        
        // Calculate the date of Monday (start of week)
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If today is Sunday, go back 6 days, otherwise calculate days since Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        
        // Calculate the date of Sunday (end of week)
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        // Format dates for input fields (YYYY-MM-DD)
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        document.getElementById('week-start-date').value = formatDate(monday);
        document.getElementById('week-end-date').value = formatDate(sunday);
    }

    // Function to initialize timesheet table
    function initializeTimesheetTable() {
        const timesheetBody = document.getElementById('timesheet-body');
        
        // Clear existing rows
        timesheetBody.innerHTML = '';
        
        // Add initial rows
        for (let i = 0; i < 3; i++) {
            addTimesheetRow();
        }
    }

    // Function to add a new timesheet row
    function addTimesheetRow() {
        const timesheetBody = document.getElementById('timesheet-body');
        const rowCount = timesheetBody.children.length;
        
        const row = document.createElement('tr');
        
        // Serial Number
        const srCell = document.createElement('td');
        srCell.textContent = rowCount + 1;
        row.appendChild(srCell);
        
        // Project Code
        const projectCell = document.createElement('td');
        const projectSelect = document.createElement('select');
        projectSelect.innerHTML = `
            <option value="">Select</option>
            <option value="PROJ001">PROJ001</option>
            <option value="PROJ002">PROJ002</option>
            <option value="PROJ003">PROJ003</option>
        `;
        projectCell.appendChild(projectSelect);
        row.appendChild(projectCell);
        
        // Location
        const locationCell = document.createElement('td');
        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.placeholder = 'Enter location';
        locationCell.appendChild(locationInput);
        row.appendChild(locationCell);
        
        // Days of the week (Mon-Sun)
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        
        days.forEach(day => {
            const dayCell = document.createElement('td');
            dayCell.className = 'time-cell';
            dayCell.innerHTML = '<span class="normal-hours">0</span>/<span class="overtime-hours">0</span>';
            dayCell.setAttribute('data-day', day);
            dayCell.setAttribute('data-normal-hours', '0');
            dayCell.setAttribute('data-overtime-hours', '0');
            dayCell.setAttribute('data-activity-code', '');
            
            // Add click event to open hours modal
            dayCell.addEventListener('click', function() {
                openHoursModal(this);
            });
            
            row.appendChild(dayCell);
        });
        
        // Total column
        const totalCell = document.createElement('td');
        totalCell.className = 'row-total';
        totalCell.innerHTML = '<span class="normal-hours">0</span>/<span class="overtime-hours">0</span>';
        row.appendChild(totalCell);
        
        // Action column with delete button
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-trash delete-row-btn';
        deleteBtn.title = 'Delete Row';
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        
        timesheetBody.appendChild(row);
        updateRowTotal(row);
        updateRowNumbers();
    }  

    // Function to open hours modal
    function openHoursModal(cell) {
        currentCell = cell;
        
        // Reset form
        document.getElementById('work-hours').value = cell.getAttribute('data-normal-hours') || '0';
        document.getElementById('overtime-hours').value = cell.getAttribute('data-overtime-hours') || '0';
        document.getElementById('activity-code').value = cell.getAttribute('data-activity-code') || '';
        
        // Show modal
        document.getElementById('hours-modal').style.display = 'block';
    }

    // Function to update totals
    function updateTotals() {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        let weekTotalNormal = 0;
        let weekTotalOvertime = 0;
        
        days.forEach(day => {
            const cells = document.querySelectorAll(`.time-cell[data-day="${day}"]`);
            let totalNormal = 0;
            let totalOvertime = 0;
            
            cells.forEach(cell => {
                const normalHours = parseFloat(cell.getAttribute('data-normal-hours')) || 0;
                const overtimeHours = parseFloat(cell.getAttribute('data-overtime-hours')) || 0;
                totalNormal += normalHours;
                totalOvertime += overtimeHours;
            });
            
            const totalElement = document.getElementById(`total-${day}`);
            totalElement.querySelector('.normal-hours').textContent = totalNormal;
            totalElement.querySelector('.overtime-hours').textContent = totalOvertime;
            
            weekTotalNormal += totalNormal;
            weekTotalOvertime += totalOvertime;
        });
        
        // Update week total
        const weekTotalElement = document.getElementById('total-week');
        weekTotalElement.querySelector('.normal-hours').textContent = weekTotalNormal;
        weekTotalElement.querySelector('.overtime-hours').textContent = weekTotalOvertime;
    }
    
    // Function to update row totals
    function updateRowTotal(row) {
        const dayCells = row.querySelectorAll('.time-cell');
        let rowTotalNormal = 0;
        let rowTotalOvertime = 0;
        
        dayCells.forEach(cell => {
            const normalHours = parseFloat(cell.getAttribute('data-normal-hours')) || 0;
            const overtimeHours = parseFloat(cell.getAttribute('data-overtime-hours')) || 0;
            rowTotalNormal += normalHours;
            rowTotalOvertime += overtimeHours;
        });
        
        const totalCell = row.querySelector('.row-total');
        totalCell.innerHTML = `<span class="normal-hours">${rowTotalNormal}</span>/<span class="overtime-hours">${rowTotalOvertime}</span>`;
    }
    
    // Function to update row numbers after deletion
    function updateRowNumbers() {
        const rows = document.querySelectorAll('#timesheet-body tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }
});
