document.addEventListener('DOMContentLoaded', function() {
    // Get employee code from session storage
    const employeeCode = sessionStorage.getItem('employeeCode') || 'EMP001';
    
    // Mock employee data (in a real app, this would come from a database)
    const employeeData = {
        'EMP001': { name: 'Keshav Mane', department: 'Process' },
        'EMP002': { name: 'John Doe', department: 'Business Development' },
        'EMP003': { name: 'Jane Smith', department: 'Project' },
        'ADMIN001': { name: 'Admin User', department: 'Admin' }
    };

    // Set employee information
    document.getElementById('employee-code').value = employeeCode;
    document.getElementById('employee-name').textContent = employeeData[employeeCode]?.name || 'Unknown Employee';
    document.getElementById('employee-name-input').value = employeeData[employeeCode]?.name || 'Unknown Employee';

    // Store logged-in employee code for permission checks
    const loggedInEmployeeCode = employeeCode;

    // Function to enable or disable editing based on permission
    function updateEditingPermissions(viewedEmployeeCode) {
        const isOwner = viewedEmployeeCode === loggedInEmployeeCode;
        // Employee Code and Name inputs
        document.getElementById('employee-code').readOnly = !isOwner;
        document.getElementById('employee-name-input').readOnly = !isOwner;

        // Timesheet inputs and selects
        const timesheetBody = document.getElementById('timesheet-body');
        const inputs = timesheetBody.querySelectorAll('input, select, button');
        inputs.forEach(input => {
            input.disabled = !isOwner;
        });

        // Save and Submit buttons
        document.getElementById('save-timesheet-btn').disabled = !isOwner;
        document.getElementById('submit-timesheet-btn').disabled = !isOwner;
    }

    // Initial permission update
    updateEditingPermissions(employeeCode);

    // Remove event listeners to prevent changing employee code or name
    // Set employee code and name inputs readonly and fixed to logged-in employee
    document.getElementById('employee-code').value = employeeCode;
    document.getElementById('employee-name-input').value = employeeData[employeeCode]?.name || 'Unknown Employee';
    document.getElementById('employee-code').setAttribute('readonly', 'readonly');
    document.getElementById('employee-name-input').setAttribute('readonly', 'readonly');

    // Set editing permissions for logged-in employee only
    updateEditingPermissions(employeeCode);
    
    
    // Map full department to select value
    function mapDepartmentToSelectValue(department) {
        if (!department) return 'Select';
        const departments = [
            'Project',
            'Process',
            'PHA',
            'Loss Prevention',
            'Electrical and Instrumentation',
            'Business Development',
            'Admin',
            'HR',
            'Accounts'
        ];
        if (departments.includes(department)) return department;
        return 'Select'; // default
    }
 
    const departmentValue = employeeData[employeeCode]?.department;
    document.getElementById('department').value = departmentValue && departmentValue !== '' ? mapDepartmentToSelectValue(departmentValue) : 'Select';
    
    // Set default dates for the current week
    setDefaultWeekDates();

    // Update day dates and disabled cells
    updateDayDates();

    // Add event listeners for date changes
    document.getElementById('week-start-date').addEventListener('change', updateDayDates);
    document.getElementById('week-end-date').addEventListener('change', updateDayDates);

    // Show access denied modal when admin button is clicked
    console.log("Admin button clicked"); // Debugging log
    document.getElementById('admin-btn').addEventListener('click', function() {
                console.log("Admin button clicked, showing modal.");
                const modal = document.getElementById('access-denied-modal');
                modal.style.display = 'block';
    });

    // Show access denied modal when projects button is clicked
    document.getElementById('projects-btn').addEventListener('click', function() {
        const modal = document.getElementById('access-denied-modal');
        modal.style.display = 'block';
    });

    // Close access denied modal when clicking the close button
    document.getElementById('close-access-modal').addEventListener('click', function() {
        document.getElementById('access-denied-modal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('access-denied-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal when clicking the X in modal content (fix for projects and admin modal close button)
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Initialize timesheet table
    initializeTimesheetTable();

    // Toggle sidebar
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        // Toggle sidebar functionality
    });

    // Save timesheet button functionality
    document.getElementById('save-timesheet-btn').addEventListener('click', function() {
        // Placeholder save functionality
        alert('Timesheet saved successfully!');
        // You can extend this function to implement actual save logic
    });

    // Submit timesheet button functionality
    document.getElementById('submit-timesheet-btn').addEventListener('click', function() {
        // Placeholder submit functionality
        alert('Timesheet submitted successfully!');
        // You can extend this function to implement actual submit logic
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

    // Handle hours form submission
    hoursForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!currentCell) return;

        const hoursType = document.getElementById('hours-type').value;
        const enteredHours = parseFloat(document.getElementById('work-hours').value) || 0;
        const activityCode = document.getElementById('activity-code').value;

        if (enteredHours === 0 || !activityCode) {
            alert('Please enter hours and activity code');
            return;
        }

        // Get existing hours from the cell
        let normalHours = parseFloat(currentCell.getAttribute('data-normal-hours')) || 0;
        let overtimeHours = parseFloat(currentCell.getAttribute('data-overtime-hours')) || 0;

        // Update only the selected hours type, preserve the other
        if (hoursType === 'normal') {
            normalHours = enteredHours;
        } else if (hoursType === 'overtime') {
            overtimeHours = enteredHours;
        }

        // Update the cell with the combined hours values
        currentCell.innerHTML = `<span class="normal-hours">${normalHours}</span>/<span class="overtime-hours">${overtimeHours}</span>`;
        currentCell.setAttribute('data-normal-hours', normalHours);
        currentCell.setAttribute('data-overtime-hours', overtimeHours);
        currentCell.setAttribute('data-activity-code', activityCode);
        currentCell.classList.add('has-hours');

        // Update totals
        updateTotals();

        // Close the modal
        hoursModal.style.display = 'none';
    });
    
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

        // Action column with delete button
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-trash delete-row-btn';
        deleteBtn.title = 'Delete Row';
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        timesheetBody.appendChild(row);
        updateRowNumbers();
    }  

    // Function to open hours modal
    function openHoursModal(cell) {
        currentCell = cell;
        
        // Reset form
        const normalHours = parseFloat(cell.getAttribute('data-normal-hours')) || 0;
        const overtimeHours = parseFloat(cell.getAttribute('data-overtime-hours')) || 0;
        const activityCode = cell.getAttribute('data-activity-code') || '';
        
        // Determine which hours type to show based on existing data
        if (normalHours > 0) {
            document.getElementById('hours-type').value = 'normal';
            document.getElementById('work-hours').value = normalHours;
        } else if (overtimeHours > 0) {
            document.getElementById('hours-type').value = 'overtime';
            document.getElementById('work-hours').value = overtimeHours;
        } else {
            document.getElementById('hours-type').value = 'normal';
            document.getElementById('work-hours').value = '0';
        }
        
        document.getElementById('activity-code').value = activityCode;
        
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
    

    // Function to update row numbers after deletion
    function updateRowNumbers() {
        const rows = document.querySelectorAll('#timesheet-body tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Function to update day dates based on start date
    function updateDayDates() {
        const startDateInput = document.getElementById('week-start-date').value;
        if (!startDateInput) return;

        const startDate = new Date(startDateInput);
        const startDay = startDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

        // Adjust to Monday=0, Sunday=6
        let adjustedStartDay = startDay - 1;
        if (adjustedStartDay < 0) adjustedStartDay = 6;

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for (let i = 0; i < days.length; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + (i - adjustedStartDay));
            const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
            document.getElementById(`date-${days[i]}`).textContent = dateStr;
        }

        updateDisabledCells(adjustedStartDay);
    }

    // Function to update disabled state of time cells
    function updateDisabledCells(startDayIndex) {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        days.forEach((day, index) => {
            const cells = document.querySelectorAll(`.time-cell[data-day="${day}"]`);
            cells.forEach(cell => {
                if (index < startDayIndex) {
                    cell.classList.add('disabled');
                    cell.style.pointerEvents = 'none';
                    cell.style.opacity = '0.5';
                } else {
                    cell.classList.remove('disabled');
                    cell.style.pointerEvents = 'auto';
                    cell.style.opacity = '1';
                }
            });
        });
    }
});
