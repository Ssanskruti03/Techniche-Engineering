// Function to generate plData dynamically from projects (loaded from projects.js)
function generatePlData() {
    const plData = {};
    projects.forEach(project => {
        const plNo = "PL" + project.id.toString().padStart(3, '0');
        const consumed = project.juniorCompleted + project.seniorCompleted;
        const variation = project.variationHours || 0;
        plData[plNo] = {
            projectName: project.name,
            total: project.totalHours,
            consumed: consumed,
            variation: variation
        };
    });
    return plData;
}

const plData = generatePlData();

const ctx = document.getElementById('hoursChart').getContext('2d');
let hoursChart = null;

function renderChart(consumed, balance, variation) {
    if (hoursChart) {
        hoursChart.destroy();
    }

    hoursChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed Hours', 'Balance', 'Variation Hours'],
            datasets: [{
                label: 'Hours',
                data: [consumed, balance, variation],
                backgroundColor: [
                    'rgba(135, 206, 250, 0.7)',  // light sky blue
                    'rgba(255, 165, 0, 0.7)',    // orange
                    'rgba(144, 238, 144, 0.7)',  // light green
                    'rgba(255, 182, 193, 0.7)'   // light pink
                ],
                borderColor: [
                    'rgba(135, 206, 250, 1)',
                    'rgba(255, 165, 0, 1)',
                    'rgba(144, 238, 144, 1)',
                    'rgba(255, 182, 193, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function findPLByProjectName(name) {
    for (const pl in plData) {
        if (plData[pl].projectName.toLowerCase() === name.toLowerCase()) {
            return pl;
        }
    }
    return null;
}

document.getElementById('search-btn').addEventListener('click', () => {
    let plNo = document.getElementById('pl-no').value.trim();
    let projectName = document.getElementById('project-name').value.trim();

    if (plNo === "" && projectName === "") {
        alert("Please enter PL No or Project Name");
        return;
    }

    if (plNo === "" && projectName !== "") {
        plNo = findPLByProjectName(projectName);
        if (!plNo) {
            alert("Project Name not found");
            return;
        }
        document.getElementById('pl-no').value = plNo;
    } else if (plNo !== "" && projectName === "") {
        if (!(plNo in plData)) {
            alert("PL No not found");
            return;
        }
        projectName = plData[plNo].projectName;
        document.getElementById('project-name').value = projectName;
    } else {
        // Both filled, verify consistency
        if (!(plNo in plData) || plData[plNo].projectName.toLowerCase() !== projectName.toLowerCase()) {
            alert("PL No and Project Name do not match");
            return;
        }
    }

    const data = plData[plNo];
    const balance = data.total - data.consumed;
    const percent = ((data.consumed / data.total) * 100).toFixed(2);

    document.getElementById('project-details').style.display = 'block';
    document.getElementById('res-total').textContent = data.total;
    document.getElementById('res-consumed').textContent = data.consumed;
    document.getElementById('res-balance').textContent = balance;
    document.getElementById('res-percent').textContent = percent + '%';

    renderChart(data.consumed, balance, data.variation);
    document.getElementById('hoursChart').style.display = 'block';
});

// Add Employee Report link to sidebar menu
document.addEventListener('DOMContentLoaded', () => {
    const sidebarMenu = document.querySelector('.sidebar-menu ul');
    if (!sidebarMenu) return;

    // Check if Employee Report link already exists
    const existingLink = sidebarMenu.querySelector('a[href="employee-report.html"]');
    if (existingLink) return;

    // Create new list item and link
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = 'employee-report.html';
    a.innerHTML = '<i class="fas fa-file-alt"></i><span>Employee Report</span>';

    li.appendChild(a);

    // Insert the new link after the Hours Tracking link
    const hoursTrackingLi = sidebarMenu.querySelector('li.active');
    if (hoursTrackingLi && hoursTrackingLi.nextSibling) {
        sidebarMenu.insertBefore(li, hoursTrackingLi.nextSibling);
    } else {
        sidebarMenu.appendChild(li);
    }
});
