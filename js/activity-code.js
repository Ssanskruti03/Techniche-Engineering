document.addEventListener('DOMContentLoaded', function() {
    const activityGrid = document.getElementById('activityGrid');
    const searchInput = document.getElementById('searchActivity');
    const addActivityModal = document.getElementById('addActivityModal');
    const addActivityForm = document.getElementById('addActivityForm');
    const departmentSelect = document.getElementById('departmentSelect');
    const activityCodesHeader = document.getElementById('activityCodesHeader');

    // Full list of activity codes with departments from user-provided screenshots
    let activityCodes = [
        // Process Department
        { department: 'Process', code: 'A1', name: 'Process Calculation (e.g., pressure drop, line sizing, pump sizing)', description: '' },
        { department: 'Process', code: 'A2', name: 'Heat & Mass Balance Development', description: '' },
        { department: 'Process', code: 'A3', name: 'Process Datasheet Preparation (for equipment, instruments, etc.)', description: '' },
        { department: 'Process', code: 'A4', name: 'Line List and Equipment List Preparation', description: '' },
        { department: 'Process', code: 'A5', name: 'Process Design Basis Preparation', description: '' },
        { department: 'Process', code: 'A6', name: 'Hydraulic Calculation', description: '' },
        { department: 'Process', code: 'A7', name: 'Control Philosophy Preparation', description: '' },
        { department: 'IT', code: 'A1', name: 'Desktop / Laptop / Server Support', description: '' },
        { department: 'HR', code: 'A1', name: 'Recruitment & Talent Acquisition', description: '' },
        { department: 'BD', code: 'A1', name: 'Document Preparation', description: '' },
        { department: 'Electrical', code: 'A1', name: 'Study of input data', description: '' },
        { department: 'Admin/Accounts', code: 'A1', name: 'Accounts Payable', description: '' }
    ];

    // Function to render activity codes in the grid
    function renderActivityCodes(codes) {
        activityGrid.innerHTML = '';
        if (codes.length === 0) {
            activityGrid.innerHTML = '<p>No activity codes found.</p>';
            return;
        }
        codes.forEach(code => {
            const div = document.createElement('div');
            div.classList.add('activity-code-item');
            div.innerHTML = `
                <p><strong>${code.code}:</strong> ${code.name}</p>
            `;
            activityGrid.appendChild(div);
        });
    }

    // Function to filter and render activity codes by selected department and search query
    function filterAndRender() {
        const selectedDept = departmentSelect.value;
        const query = searchInput.value.toLowerCase();

        if (!selectedDept) {
            activityGrid.style.display = 'none';
            activityCodesHeader.style.display = 'none';
            return;
        }

        activityGrid.style.display = 'block';
        activityCodesHeader.style.display = 'flex';

        const filtered = activityCodes.filter(code =>
            code.department === selectedDept &&
            (code.code.toLowerCase().includes(query) || code.name.toLowerCase().includes(query))
        );

        renderActivityCodes(filtered);
    }

    // Event listeners
    departmentSelect.addEventListener('change', function() {
        searchInput.value = '';
        filterAndRender();
    });

    searchInput.addEventListener('input', filterAndRender);

    // Open and close modal functions
    window.openAddActivityModal = function() {
        if (!departmentSelect.value) {
            alert('Please select a department first.');
            return;
        }
        addActivityModal.style.display = 'block';
        // Set the category select to the selected department
        addActivityForm.activityCategory.value = departmentSelect.value;
    };

    window.closeAddActivityModal = function() {
        addActivityModal.style.display = 'none';
        addActivityForm.reset();
    };

    // Handle form submission to add new activity code
    addActivityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const code = this.activityCode.value.trim();
        const name = this.activityName.value.trim();
        const description = this.activityDescription.value.trim();
        const category = this.activityCategory.value.trim();

        if (!code || !name) {
            alert('Please fill in required fields.');
            return;
        }

        // Add new activity code to the list
        activityCodes.push({
            department: category || 'Other',
            code: code,
            name: name,
            description: description
        });

        // Re-render the list filtered by current department
        filterAndRender();

        // Close modal and reset form
        closeAddActivityModal();
    });

    // Close modal when clicking outside content
    window.onclick = function(event) {
        if (event.target == addActivityModal) {
            closeAddActivityModal();
        }
    };

    // Initial state: hide activity codes section until department selected
    activityGrid.style.display = 'none';
    activityCodesHeader.style.display = 'none';
});
