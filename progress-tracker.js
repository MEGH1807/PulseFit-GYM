/**
 * PROGRESS TRACKER - PulseFit Center
 * Features: Chart.js visualizations, data tracking, goal management
 * with localStorage persistence
 */

// ============================================
// STATE MANAGEMENT
// ============================================
const trackerState = {
    workouts: [],
    weightEntries: [],
    measurements: [],
    nutritionEntries: [],
    goals: []
};

// ============================================
// SAMPLE DATA
// ============================================
const sampleWorkouts = [
    { date: '2024-10-20', type: 'strength', duration: 60, calories: 450, notes: 'Great session!' },
    { date: '2024-10-18', type: 'cardio', duration: 45, calories: 520, notes: 'High intensity' },
    { date: '2024-10-17', type: 'yoga', duration: 60, calories: 180, notes: 'Relaxing' },
    { date: '2024-10-15', type: 'hiit', duration: 30, calories: 400, notes: 'Tough workout' },
    { date: '2024-10-14', type: 'strength', duration: 55, calories: 420, notes: 'PR on deadlift!' },
    { date: '2024-10-12', type: 'cardio', duration: 40, calories: 480, notes: 'Steady pace' },
    { date: '2024-10-10', type: 'strength', duration: 65, calories: 470, notes: 'Upper body focus' }
];

const sampleWeightEntries = [
    { date: '2024-10-20', weight: 152.0 },
    { date: '2024-10-15', weight: 153.5 },
    { date: '2024-10-10', weight: 155.0 },
    { date: '2024-10-05', weight: 156.5 },
    { date: '2024-10-01', weight: 158.0 },
    { date: '2024-09-25', weight: 159.5 },
    { date: '2024-09-20', weight: 161.0 },
    { date: '2024-09-15', weight: 162.5 },
    { date: '2024-09-10', weight: 163.5 },
    { date: '2024-09-05', weight: 165.0 }
];

const sampleMeasurements = [
    { date: '2024-10-01', chest: 36, waist: 28, hips: 37, arms: 12, thighs: 22, bodyFat: 22 },
    { date: '2024-09-01', chest: 37, waist: 30, hips: 38, arms: 12.5, thighs: 23, bodyFat: 25 },
    { date: '2024-08-01', chest: 38, waist: 32, hips: 40, arms: 13, thighs: 24, bodyFat: 28 }
];

const sampleGoals = [
    {
        id: 1,
        title: 'Lose 20 lbs',
        description: 'Reach target weight of 145 lbs',
        progress: 65,
        deadline: '2024-12-31'
    },
    {
        id: 2,
        title: 'Bench Press 150 lbs',
        description: 'Increase bench press strength',
        progress: 80,
        deadline: '2024-11-30'
    },
    {
        id: 3,
        title: 'Run 5K under 30 minutes',
        description: 'Improve cardio endurance',
        progress: 45,
        deadline: '2024-12-15'
    }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTracker();
    setupEventListeners();
    initializeCharts();
    loadTrackerData();
});

function initTracker() {
    // Load data from localStorage or use sample data
    const savedWorkouts = localStorage.getItem('pulsefitWorkouts');
    const savedWeight = localStorage.getItem('pulsefitWeight');
    const savedMeasurements = localStorage.getItem('pulsefitMeasurements');
    const savedGoals = localStorage.getItem('pulsefitGoals');

    trackerState.workouts = savedWorkouts ? JSON.parse(savedWorkouts) : sampleWorkouts;
    trackerState.weightEntries = savedWeight ? JSON.parse(savedWeight) : sampleWeightEntries;
    trackerState.measurements = savedMeasurements ? JSON.parse(savedMeasurements) : sampleMeasurements;
    trackerState.goals = savedGoals ? JSON.parse(savedGoals) : sampleGoals;
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Workout form
    document.getElementById('workoutEntryForm')?.addEventListener('submit', handleWorkoutSubmit);
    
    // Weight form
    document.getElementById('weightEntryForm')?.addEventListener('submit', handleWeightSubmit);
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('workoutDate')?.setAttribute('value', today);
    document.getElementById('weightDate')?.setAttribute('value', today);
}

function showTrackerSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.tracker-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.tracker-nav-item')?.classList.add('active');

    // Update sections
    document.querySelectorAll('.tracker-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId)?.classList.add('active');
}

// ============================================
// CHART INITIALIZATION
// ============================================
let charts = {};

function initializeCharts() {
    // Set global Chart.js defaults
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Montserrat', sans-serif";
        Chart.defaults.color = '#7f8c8d';
    }

    // Initialize all charts
    initWeeklyActivityChart();
    initWeightProgressChart();
    initWorkoutDistributionChart();
    initCaloriesBurnedChart();
    initMonthlyWorkoutChart();
    initWeightTrackingChart();
    initMeasurementsChart();
    initNutritionChart();
}

function initWeeklyActivityChart() {
    const ctx = document.getElementById('weeklyActivityChart');
    if (!ctx) return;

    const last7Days = getLast7Days();
    const workoutCounts = last7Days.map(date => {
        return trackerState.workouts.filter(w => w.date === date).length;
    });

    charts.weeklyActivity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days.map(d => formatDateShort(d)),
            datasets: [{
                label: 'Workouts',
                data: workoutCounts,
                backgroundColor: 'rgba(255, 71, 87, 0.8)',
                borderColor: '#ff4757',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2c3e50',
                    padding: 12,
                    borderRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function initWeightProgressChart() {
    const ctx = document.getElementById('weightProgressChart');
    if (!ctx) return;

    const sortedEntries = [...trackerState.weightEntries].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    charts.weightProgress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedEntries.map(e => formatDateShort(e.date)),
            datasets: [{
                label: 'Weight (lbs)',
                data: sortedEntries.map(e => e.weight),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: 'Goal',
                data: sortedEntries.map(() => 145),
                borderColor: '#27ae60',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: '#2c3e50',
                    padding: 12,
                    borderRadius: 8
                }
            },
            scales: {
                y: {
                    suggestedMin: 140,
                    suggestedMax: 170
                }
            }
        }
    });
}

function initWorkoutDistributionChart() {
    const ctx = document.getElementById('workoutDistributionChart');
    if (!ctx) return;

    const distribution = {};
    trackerState.workouts.forEach(w => {
        distribution[w.type] = (distribution[w.type] || 0) + 1;
    });

    const colors = {
        strength: '#3498db',
        cardio: '#e74c3c',
        hiit: '#f39c12',
        yoga: '#27ae60',
        sports: '#9b59b6'
    };

    charts.workoutDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(distribution).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            datasets: [{
                data: Object.values(distribution),
                backgroundColor: Object.keys(distribution).map(k => colors[k] || '#95a5a6'),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    backgroundColor: '#2c3e50',
                    padding: 12,
                    borderRadius: 8
                }
            }
        }
    });
}

function initCaloriesBurnedChart() {
    const ctx = document.getElementById('caloriesBurnedChart');
    if (!ctx) return;

    const last7Days = getLast7Days();
    const caloriesPerDay = last7Days.map(date => {
        return trackerState.workouts
            .filter(w => w.date === date)
            .reduce((sum, w) => sum + (w.calories || 0), 0);
    });

    charts.caloriesBurned = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => formatDateShort(d)),
            datasets: [{
                label: 'Calories Burned',
                data: caloriesPerDay,
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2c3e50',
                    padding: 12,
                    borderRadius: 8
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function initMonthlyWorkoutChart() {
    const ctx = document.getElementById('monthlyWorkoutChart');
    if (!ctx) return;

    const last30Days = getLast30Days();
    const workoutCounts = last30Days.map(date => {
        return trackerState.workouts.filter(w => w.date === date).length;
    });

    charts.monthlyWorkout = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last30Days.map(d => formatDateShort(d)),
            datasets: [{
                label: 'Workouts',
                data: workoutCounts,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: '#3498db',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function initWeightTrackingChart() {
    const ctx = document.getElementById('weightTrackingChart');
    if (!ctx) return;

    const sortedEntries = [...trackerState.weightEntries].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    charts.weightTracking = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedEntries.map(e => formatDateShort(e.date)),
            datasets: [{
                label: 'Actual Weight',
                data: sortedEntries.map(e => e.weight),
                borderColor: '#ff4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Target',
                data: sortedEntries.map(() => 145),
                borderColor: '#27ae60',
                borderDash: [10, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    suggestedMin: 140,
                    suggestedMax: 170
                }
            }
        }
    });
}

function initMeasurementsChart() {
    const ctx = document.getElementById('measurementsChart');
    if (!ctx) return;

    const sortedMeasurements = [...trackerState.measurements].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    charts.measurements = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMeasurements.map(m => formatDateShort(m.date)),
            datasets: [
                {
                    label: 'Waist (in)',
                    data: sortedMeasurements.map(m => m.waist),
                    borderColor: '#3498db',
                    tension: 0.4
                },
                {
                    label: 'Hips (in)',
                    data: sortedMeasurements.map(m => m.hips),
                    borderColor: '#e74c3c',
                    tension: 0.4
                },
                {
                    label: 'Body Fat %',
                    data: sortedMeasurements.map(m => m.bodyFat),
                    borderColor: '#f39c12',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function initNutritionChart() {
    const ctx = document.getElementById('nutritionChart');
    if (!ctx) return;

    const last7Days = getLast7Days();
    const dailyCalories = [2100, 1850, 1920, 2050, 1900, 1800, 1850];

    charts.nutrition = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days.map(d => formatDateShort(d)),
            datasets: [{
                label: 'Calories Consumed',
                data: dailyCalories,
                backgroundColor: 'rgba(39, 174, 96, 0.8)',
                borderColor: '#27ae60',
                borderWidth: 2,
                borderRadius: 8
            }, {
                label: 'Target',
                data: last7Days.map(() => 2000),
                type: 'line',
                borderColor: '#e74c3c',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// ============================================
// DATA MANAGEMENT
// ============================================
function loadTrackerData() {
    loadWorkoutHistory();
    loadMeasurementsTable();
    loadGoals();
}

function loadWorkoutHistory() {
    const container = document.getElementById('workoutHistoryList');
    if (!container) return;

    const sortedWorkouts = [...trackerState.workouts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    if (sortedWorkouts.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d;">No workouts logged yet.</p>';
        return;
    }

    container.innerHTML = sortedWorkouts.map(workout => `
        <div class="workout-entry">
            <div class="workout-entry-header">
                <div>
                    <h4>${capitalizeFirst(workout.type)} Training</h4>
                    <div class="workout-entry-date">${formatDate(workout.date)}</div>
                </div>
            </div>
            <div class="workout-entry-stats">
                <span><i class="fas fa-clock"></i> ${workout.duration} min</span>
                ${workout.calories ? `<span><i class="fas fa-fire"></i> ${workout.calories} cal</span>` : ''}
            </div>
            ${workout.notes ? `<p style="margin-top: 10px; color: #7f8c8d;">${workout.notes}</p>` : ''}
        </div>
    `).join('');
}

function loadMeasurementsTable() {
    const tbody = document.getElementById('measurementsTableBody');
    if (!tbody) return;

    const sortedMeasurements = [...trackerState.measurements]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedMeasurements.map(m => `
        <tr>
            <td>${formatDate(m.date)}</td>
            <td>${m.chest}"</td>
            <td>${m.waist}"</td>
            <td>${m.hips}"</td>
            <td>${m.arms}"</td>
            <td>${m.thighs}"</td>
            <td>${m.bodyFat}%</td>
        </tr>
    `).join('');
}

function loadGoals() {
    const container = document.getElementById('goalsGrid');
    if (!container) return;

    container.innerHTML = trackerState.goals.map(goal => `
        <div class="goal-card">
            <h4>${goal.title}</h4>
            <p class="goal-description">${goal.description}</p>
            <div class="goal-progress-info">
                <span>Progress</span>
                <span>${goal.progress}%</span>
            </div>
            <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
            </div>
            <div class="goal-deadline">
                <i class="fas fa-calendar"></i>
                <span>Target: ${formatDate(goal.deadline)}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// FORM HANDLERS
// ============================================
function showWorkoutForm() {
    document.getElementById('workoutForm').hidden = false;
}

function hideWorkoutForm() {
    document.getElementById('workoutForm').hidden = true;
    document.getElementById('workoutEntryForm').reset();
}

function handleWorkoutSubmit(e) {
    e.preventDefault();

    const workout = {
        date: document.getElementById('workoutDate').value,
        type: document.getElementById('workoutType').value,
        duration: parseInt(document.getElementById('workoutDuration').value),
        calories: parseInt(document.getElementById('workoutCalories').value) || 0,
        notes: document.getElementById('workoutNotes').value
    };

    trackerState.workouts.unshift(workout);
    saveData('pulsefitWorkouts', trackerState.workouts);
    
    hideWorkoutForm();
    loadWorkoutHistory();
    updateCharts();
    
    showNotification('Workout logged successfully!', 'success');
}

function showWeightForm() {
    document.getElementById('weightForm').hidden = false;
}

function hideWeightForm() {
    document.getElementById('weightForm').hidden = true;
    document.getElementById('weightEntryForm').reset();
}

function handleWeightSubmit(e) {
    e.preventDefault();

    const entry = {
        date: document.getElementById('weightDate').value,
        weight: parseFloat(document.getElementById('weightValue').value),
        notes: document.getElementById('weightNotes').value
    };

    trackerState.weightEntries.unshift(entry);
    saveData('pulsefitWeight', trackerState.weightEntries);
    
    hideWeightForm();
    updateCharts();
    
    showNotification('Weight entry logged successfully!', 'success');
}

function showMeasurementForm() {
    alert('Measurement form coming soon!');
}

function showNutritionForm() {
    alert('Nutrition tracking form coming soon!');
}

function showGoalForm() {
    alert('Goal creation form coming soon!');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function updateCharts() {
    // Update relevant charts with new data
    if (charts.weeklyActivity) {
        const last7Days = getLast7Days();
        const workoutCounts = last7Days.map(date => {
            return trackerState.workouts.filter(w => w.date === date).length;
        });
        charts.weeklyActivity.data.datasets[0].data = workoutCounts;
        charts.weeklyActivity.update();
    }

    if (charts.weightTracking) {
        const sortedEntries = [...trackerState.weightEntries].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        charts.weightTracking.data.labels = sortedEntries.map(e => formatDateShort(e.date));
        charts.weightTracking.data.datasets[0].data = sortedEntries.map(e => e.weight);
        charts.weightTracking.update();
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

function getLast30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
