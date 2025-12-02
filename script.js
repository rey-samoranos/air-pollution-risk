// script.js - Simplified version for location-based predictions
// Metro Manila Air Pollution Risk Assessment System

// ============================================
// DOM ELEMENTS
// ============================================
const apiAlert = document.getElementById('apiAlert');
const modelAccuracyElement = document.getElementById('modelAccuracy');
const locationSelect = document.getElementById('location');
const dataLoading = document.getElementById('dataLoading');
const airQualityData = document.getElementById('airQualityData');
const noDataMessage = document.getElementById('noDataMessage');
const resultsContainer = document.getElementById('resultsContainer');
const noResultsMessage = document.getElementById('noResultsMessage');
const predictBtn = document.getElementById('predictBtn');

// Chart instances
let riskHistoryChart = null;
let parameterChart = null;

// ============================================
// SAMPLE DATA FOR EACH LOCATION (from your trained dataset)
// ============================================
const locationData = {
    'quezon_city': {
        name: 'Quezon City',
        data: {
            pm25: 15.8, pm10: 32.5, no2: 24.3, so2: 8.7,
            co: 1.8, o3: 42.5, temperature: 28.5, humidity: 68
        },
        last_updated: '2025-03-15 14:30'
    },
    'manila': {
        name: 'Manila',
        data: {
            pm25: 18.2, pm10: 35.8, no2: 28.7, so2: 10.2,
            co: 2.1, o3: 38.9, temperature: 29.2, humidity: 72
        },
        last_updated: '2025-03-15 14:30'
    },
    'makati': {
        name: 'Makati',
        data: {
            pm25: 16.5, pm10: 33.2, no2: 26.4, so2: 9.1,
            co: 1.9, o3: 40.3, temperature: 28.8, humidity: 65
        },
        last_updated: '2025-03-15 14:30'
    },
    'pasig': {
        name: 'Pasig',
        data: {
            pm25: 17.1, pm10: 34.7, no2: 25.8, so2: 9.5,
            co: 2.0, o3: 39.7, temperature: 29.0, humidity: 70
        },
        last_updated: '2025-03-15 14:30'
    },
    'taguig': {
        name: 'Taguig',
        data: {
            pm25: 16.8, pm10: 33.9, no2: 25.1, so2: 9.3,
            co: 1.9, o3: 41.2, temperature: 28.7, humidity: 67
        },
        last_updated: '2025-03-15 14:30'
    },
    'paranaque': {
        name: 'Parañaque',
        data: {
            pm25: 15.2, pm10: 31.8, no2: 23.5, so2: 8.2,
            co: 1.7, o3: 43.1, temperature: 28.3, humidity: 71
        },
        last_updated: '2025-03-15 14:30'
    },
    'las_pinas': {
        name: 'Las Piñas',
        data: {
            pm25: 14.7, pm10: 30.9, no2: 22.8, so2: 7.9,
            co: 1.6, o3: 44.3, temperature: 28.1, humidity: 69
        },
        last_updated: '2025-03-15 14:30'
    },
    'muntinlupa': {
        name: 'Muntinlupa',
        data: {
            pm25: 14.9, pm10: 31.2, no2: 23.1, so2: 8.1,
            co: 1.6, o3: 43.8, temperature: 28.2, humidity: 68
        },
        last_updated: '2025-03-15 14:30'
    },
    'marikina': {
        name: 'Marikina',
        data: {
            pm25: 15.5, pm10: 32.1, no2: 24.0, so2: 8.5,
            co: 1.7, o3: 42.7, temperature: 28.4, humidity: 66
        },
        last_updated: '2025-03-15 14:30'
    },
    'mandaluyong': {
        name: 'Mandaluyong',
        data: {
            pm25: 17.3, pm10: 34.9, no2: 26.9, so2: 9.7,
            co: 2.0, o3: 39.2, temperature: 29.1, humidity: 70
        },
        last_updated: '2025-03-15 14:30'
    },
    'san_juan': {
        name: 'San Juan',
        data: {
            pm25: 16.1, pm10: 33.0, no2: 24.8, so2: 8.9,
            co: 1.8, o3: 41.5, temperature: 28.6, humidity: 67
        },
        last_updated: '2025-03-15 14:30'
    },
    'caloocan': {
        name: 'Caloocan',
        data: {
            pm25: 16.9, pm10: 34.3, no2: 25.5, so2: 9.4,
            co: 1.9, o3: 40.8, temperature: 28.9, humidity: 69
        },
        last_updated: '2025-03-15 14:30'
    },
    'malabon': {
        name: 'Malabon',
        data: {
            pm25: 17.5, pm10: 35.2, no2: 27.2, so2: 9.9,
            co: 2.1, o3: 38.5, temperature: 29.3, humidity: 73
        },
        last_updated: '2025-03-15 14:30'
    },
    'navotas': {
        name: 'Navotas',
        data: {
            pm25: 17.7, pm10: 35.5, no2: 27.5, so2: 10.1,
            co: 2.2, o3: 38.2, temperature: 29.4, humidity: 74
        },
        last_updated: '2025-03-15 14:30'
    },
    'valenzuela': {
        name: 'Valenzuela',
        data: {
            pm25: 16.3, pm10: 33.5, no2: 25.0, so2: 9.0,
            co: 1.8, o3: 41.0, temperature: 28.7, humidity: 68
        },
        last_updated: '2025-03-15 14:30'
    },
    'pasay': {
        name: 'Pasay',
        data: {
            pm25: 16.6, pm10: 33.8, no2: 26.1, so2: 9.2,
            co: 1.9, o3: 40.5, temperature: 28.8, humidity: 66
        },
        last_updated: '2025-03-15 14:30'
    },
    'pateros': {
        name: 'Pateros',
        data: {
            pm25: 15.0, pm10: 31.5, no2: 23.3, so2: 8.3,
            co: 1.7, o3: 43.5, temperature: 28.3, humidity: 70
        },
        last_updated: '2025-03-15 14:30'
    }
};

// ============================================
// LOAD LOCATION DATA
// ============================================
function loadLocationData() {
    const locationId = locationSelect.value;
    
    if (!locationId) {
        noDataMessage.style.display = 'block';
        airQualityData.style.display = 'none';
        predictBtn.disabled = true;
        return;
    }
    
    const location = locationData[locationId];
    if (!location) return;
    
    // Show loading
    dataLoading.style.display = 'block';
    noDataMessage.style.display = 'none';
    airQualityData.style.display = 'none';
    
    // Simulate loading delay
    setTimeout(() => {
        dataLoading.style.display = 'none';
        airQualityData.style.display = 'block';
        
        // Update data display
        updateDataDisplay(location);
        predictBtn.disabled = false;
        
        showAlert(`✅ Loaded air quality data for ${location.name}`, 'success');
    }, 800);
}

function updateDataDisplay(location) {
    // Update location name in hidden field (if needed)
    document.getElementById('predictionLocation').textContent = location.name;
    
    // Update data values
    document.getElementById('actualPm25').textContent = location.data.pm25.toFixed(1);
    document.getElementById('actualPm10').textContent = location.data.pm10.toFixed(1);
    document.getElementById('actualNo2').textContent = location.data.no2.toFixed(1);
    document.getElementById('actualSo2').textContent = location.data.so2.toFixed(1);
    document.getElementById('actualCo').textContent = location.data.co.toFixed(1);
    document.getElementById('actualO3').textContent = location.data.o3.toFixed(1);
    document.getElementById('actualTemp').textContent = location.data.temperature.toFixed(1);
    document.getElementById('actualHumidity').textContent = location.data.humidity.toFixed(1);
    
    // Update status indicators
    updateStatusIndicators(location.data);
    
    // Update timestamp
    document.getElementById('lastUpdated').textContent = location.last_updated;
}

function updateStatusIndicators(data) {
    // PM2.5 status
    const pm25Status = document.getElementById('pm25Status');
    if (data.pm25 <= 12) {
        pm25Status.textContent = 'Good';
        pm25Status.className = 'data-status status-good';
    } else if (data.pm25 <= 35.4) {
        pm25Status.textContent = 'Moderate';
        pm25Status.className = 'data-status status-moderate';
    } else {
        pm25Status.textContent = 'Poor';
        pm25Status.className = 'data-status status-poor';
    }
    
    // Add similar logic for other parameters...
}

// ============================================
// GENERATE PREDICTION
// ============================================
function generatePrediction() {
    const locationId = locationSelect.value;
    if (!locationId) return;
    
    const location = locationData[locationId];
    const data = location.data;
    
    // Show loading
    const loading = document.createElement('div');
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating prediction...';
    loading.className = 'spinner';
    
    // Hide current results
    noResultsMessage.style.display = 'none';
    
    // Simulate prediction delay
    setTimeout(() => {
        // Generate prediction based on data
        const prediction = calculatePrediction(data);
        
        // Display results
        displayPredictionResults(prediction, location.name);
        
        // Update charts
        updateCharts(data, location.name);
        
        showAlert(`✅ Prediction generated for ${location.name}`, 'success');
    }, 1000);
}

function calculatePrediction(data) {
    // Use PM2.5 as primary indicator (from your trained model logic)
    const pm25 = data.pm25;
    
    let prediction, confidence;
    let probLow, probModerate, probHigh;
    
    if (pm25 <= 12) {
        prediction = "Low";
        confidence = 95;
        probLow = 90;
        probModerate = 8;
        probHigh = 2;
    } else if (pm25 <= 35.4) {
        prediction = "Moderate";
        confidence = 90;
        probLow = 10;
        probModerate = 85;
        probHigh = 5;
    } else {
        prediction = "High";
        confidence = 85;
        probLow = 2;
        probModerate = 8;
        probHigh = 90;
    }
    
    // Calculate AQI
    const aqi = calculateAQI(pm25);
    const aqiCategory = getAQICategory(aqi);
    
    return {
        prediction: prediction,
        confidence: confidence,
        probabilities: {
            low: probLow,
            moderate: probModerate,
            high: probHigh
        },
        aqi: aqi,
        aqiCategory: aqiCategory,
        parameters: data
    };
}

function calculateAQI(pm25) {
    if (pm25 <= 12) return pm25 * (50/12);
    else if (pm25 <= 35.4) return 51 + (pm25-12.1) * (49/23.3);
    else if (pm25 <= 55.4) return 101 + (pm25-35.5) * (49/19.9);
    else if (pm25 <= 150.4) return 151 + (pm25-55.5) * (49/94.9);
    else return 201 + (pm25-150.5) * (99/49.5);
}

function getAQICategory(aqi) {
    if (aqi <= 50) return "Good";
    else if (aqi <= 100) return "Moderate";
    else if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    else if (aqi <= 200) return "Unhealthy";
    else return "Very Unhealthy";
}

function displayPredictionResults(result, locationName) {
    // Show results container
    resultsContainer.style.display = 'block';
    
    // Update location and time
    document.getElementById('predictionLocation').textContent = locationName;
    document.getElementById('predictionTime').textContent = new Date().toLocaleString();
    
    // Update risk display
    const riskDisplay = document.getElementById('riskDisplay');
    const riskText = document.getElementById('riskLevelText');
    const riskTitle = document.getElementById('riskTitle');
    
    riskText.textContent = `${result.prediction} Risk`;
    document.getElementById('confidenceValue').textContent = `${result.confidence}%`;
    document.getElementById('aqiValue').textContent = result.aqi.toFixed(1);
    document.getElementById('aqiCategory').textContent = result.aqiCategory;
    
    // Style based on risk level
    riskDisplay.className = 'risk-level-display';
    if (result.prediction === 'Low') {
        riskDisplay.classList.add('risk-low');
        riskTitle.innerHTML = '<i class="fas fa-check-circle"></i> Low Risk';
    } else if (result.prediction === 'Moderate') {
        riskDisplay.classList.add('risk-moderate');
        riskTitle.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Moderate Risk';
    } else {
        riskDisplay.classList.add('risk-high');
        riskTitle.innerHTML = '<i class="fas fa-skull-crossbones"></i> High Risk';
    }
    
    // Update probabilities
    document.getElementById('probLow').textContent = `${result.probabilities.low.toFixed(1)}%`;
    document.getElementById('probModerate').textContent = `${result.probabilities.moderate.toFixed(1)}%`;
    document.getElementById('probHigh').textContent = `${result.probabilities.high.toFixed(1)}%`;
    
    // Update recommendations
    updateRecommendations(result);
}

function updateRecommendations(result) {
    const recommendations = getRecommendations(result.prediction, result.aqi);
    
    updateRecommendationList('generalRecs', recommendations.general);
    updateRecommendationList('sensitiveRecs', recommendations.sensitive_groups);
    updateRecommendationList('actionRecs', recommendations.actions);
}

function getRecommendations(riskLevel, aqi) {
    const recommendations = {
        general: [],
        sensitive_groups: [],
        actions: []
    };
    
    if (riskLevel === "Low" || aqi <= 50) {
        recommendations.general = [
            "Air quality is satisfactory",
            "Normal outdoor activities are safe"
        ];
        recommendations.sensitive_groups = [
            "No special precautions needed"
        ];
        recommendations.actions = [
            "Continue regular outdoor activities",
            "Maintain current pollution control measures"
        ];
    } else if (riskLevel === "Moderate" || aqi <= 100) {
        recommendations.general = [
            "Air quality is acceptable",
            "Unusually sensitive people should consider reducing prolonged outdoor exertion"
        ];
        recommendations.sensitive_groups = [
            "Children, elderly, and people with respiratory conditions",
            "Consider reducing strenuous outdoor activities"
        ];
        recommendations.actions = [
            "Reduce vehicle idling",
            "Limit outdoor burning",
            "Use public transportation when possible"
        ];
    } else {
        recommendations.general = [
            "Air quality is unhealthy",
            "Everyone may begin to experience health effects"
        ];
        recommendations.sensitive_groups = [
            "Avoid all outdoor activities",
            "Stay indoors with air purifiers if possible"
        ];
        recommendations.actions = [
            "Issue public health advisory",
            "Implement traffic reduction measures",
            "Activate emergency pollution control protocols"
        ];
    }
    
    return recommendations;
}

function updateRecommendationList(elementId, items) {
    const listElement = document.getElementById(elementId);
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.marginBottom = '5px';
        li.style.paddingLeft = '5px';
        listElement.appendChild(li);
    });
}

// ============================================
// CHARTS
// ============================================
function updateCharts(data, locationName) {
    // Update risk history chart
    updateRiskHistoryChart(locationName);
    
    // Update parameter comparison chart
    updateParameterChart(data);
}

function updateRiskHistoryChart(locationName) {
    const ctx = document.getElementById('riskHistoryChart').getContext('2d');
    
    if (riskHistoryChart) {
        riskHistoryChart.destroy();
    }
    
    // Sample historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const riskScores = [65, 70, 68, 72, 75, 78, 80, 77]; // Risk scores (0-100)
    
    riskHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: `Risk Score - ${locationName}`,
                data: riskScores,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Historical Risk Trends',
                    font: { size: 14 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Risk Score'
                    }
                }
            }
        }
    });
}

function updateParameterChart(data) {
    const ctx = document.getElementById('parameterChart').getContext('2d');
    
    if (parameterChart) {
        parameterChart.destroy();
    }
    
    const parameters = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'];
    const currentValues = [data.pm25, data.pm10, data.no2, data.so2, data.co, data.o3];
    const safetyThresholds = [12, 50, 30, 10, 1.5, 40]; // Standard thresholds
    
    parameterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: parameters,
            datasets: [
                {
                    label: 'Current Value',
                    data: currentValues,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                },
                {
                    label: 'Safety Threshold',
                    data: safetyThresholds,
                    type: 'line',
                    borderColor: '#e74c3c',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Parameter Comparison'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function refreshData() {
    const locationId = locationSelect.value;
    if (!locationId) {
        showAlert('⚠️ Please select a location first', 'error');
        return;
    }
    
    loadLocationData();
    showAlert('🔄 Refreshing data...', 'success');
}

function showAlert(message, type) {
    const alert = document.getElementById('apiAlert');
    if (!alert) return;
    
    alert.innerHTML = message;
    alert.className = `alert alert-${type}`;
    alert.style.display = 'block';
    
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i> ';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i> ';
    
    alert.innerHTML = icon + message;
    
    if (type === 'success') {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// INITIALIZATION
// ============================================
function initializePage() {
    // Set model accuracy
    if (modelAccuracyElement) {
        modelAccuracyElement.textContent = '85.0%';
        modelAccuracyElement.style.color = '#f9d423'; // Yellow for 85%
    }
    
    // Set up location select event
    locationSelect.addEventListener('change', loadLocationData);
    
    // Load initial dashboard data
    loadDashboardData();
    
    showAlert('✅ Air Pollution Risk Assessment System Ready', 'success');
}

function loadDashboardData() {
    // You can load actual dashboard data here if available
    console.log('Dashboard data loaded');
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', initializePage);

// Expose functions to global scope
window.loadLocationData = loadLocationData;
window.generatePrediction = generatePrediction;
window.refreshData = refreshData;
