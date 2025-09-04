document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });

    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Forgot password modal
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password');
    const modal = document.getElementById('forgot-password-modal');
    const closeModal = document.querySelector('.close-modal');

    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission
    const employeeForm = document.getElementById('employee-login-form');
    const adminForm = document.getElementById('admin-login-form');
    const resetForm = document.getElementById('reset-password-form');

    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const employeeCode = document.getElementById('employee-code').value;
        const password = document.getElementById('employee-password').value;
        
        // For demo purposes, we'll use a simple validation
        if (employeeCode && password) {
            // Store employee code in session storage for dashboard use
            sessionStorage.setItem('employeeCode', employeeCode);
            window.location.href = 'dashboard.html';
        } else {
            alert('Please enter both employee code and password');
        }
    });

    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const adminCode = document.getElementById('admin-code').value;
        const password = document.getElementById('admin-password').value;
        
        // For demo purposes, we'll use a simple validation
        if (adminCode && password) {
            // Store admin code in session storage
            sessionStorage.setItem('adminCode', adminCode);
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Please enter both admin code and password');
        }
    });

    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const resetEmployeeCode = document.getElementById('reset-employee-code').value;
        const resetEmail = document.getElementById('reset-email').value;
        
        if (resetEmployeeCode && resetEmail) {
            alert('Password reset link has been sent to your email address.');
            modal.style.display = 'none';
        } else {
            alert('Please enter both employee code and email address');
        }
    });
});