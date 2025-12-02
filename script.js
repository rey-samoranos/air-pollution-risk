// script.js - COMPLETE STATIC VERSION FOR GITHUB PAGES
// Metro Manila Air Pollution Risk Assessment System
// ============================================
// CONFIGURATION
// ============================================
const IS_STATIC_MODE = true; // Set to true for GitHub Pages
const STATIC_ACCURACY = 85.0; // Model accuracy for static mode
// ============================================
// DOM ELEMENTS
// ============================================
const apiAlert = document.getElementById('apiAlert');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsContainer = document.getElementById('resultsContainer');
const noResultsMessage = document.getElementById('noResultsMessage');
const modelAccuracyElement = document.getElementById('modelAccuracy');
const apiStatusElement = document.getElementById('apiStatus');
const locationSelect = document.getElementById('location');
const airQualityData = document.getElementById('airQualityData');
const noDataMessage = document.getElementById('noDataMessage');
const dataLoading = document.getElementById('dataLoading');
// Chart instances
let riskDistributionChart = null;
let parameterChart = null;
// ============================================
// LOCATION DATA FROM YOUR SAMPLE_PREDICTIONS.JSON
// ============================================
const locationData = {
    'quezon_city': {
        name: 'Quezon City',
        data: {
            pm25: 11.982980700673147,
            pm10: 22.34049111283503,
            no2: 6.092642015347082,
            so2: 4.094349885648196,
            co: 1.6966382471870314,
            o3: 6.141619455645308,
            temperature: 30.55145728694283,
            humidity: 73.36073458149015
        },
        actual: 'Low',
        predicted: 'Low',
        probabilities: { High: 0.01, Low: 0.92, Moderate: 0.07 }
    },
    'manila': {
        name: 'Manila',
        data: {
            pm25: 9.470435275959751,
            pm10: 20.50298796097736,
            no2: 15.439890782544639,
            so2: 7.030418302289834,
            co: 1.595470503398148,
            o3: 7.155570183044689,
            temperature: 27.84926461513918,
            humidity: 53.34926000943665
        },
        actual: 'Low',
        predicted: 'Low',
        probabilities: { High: 0.01, Low: 0.95, Moderate: 0.04 }
    },
    'makati': {
        name: 'Makati',
        data: {
            pm25: 11.176490629552724,
            pm10: 23.40898834043082,
            no2: 6.090960003088268,
            so2: 6.097711031685186,
            co: 1.304889105881046,
            o3: 7.067071397787838,
            temperature: 27.355183119219987,
            humidity: 71.20810524969326
        },
        actual: 'Low',
        predicted: 'Low',
        probabilities: { High: 0.01, Low: 0.93, Moderate: 0.06 }
    },
    'pasig': {
        name: 'Pasig',
        data: {
            pm25: 17.4155914224128,
            pm10: 36.30394413377597,
            no2: 8.37932827942674,
            so2: 3.5003300076807786,
            co: 1.4940573725407007,
            o3: 6.581031471269159,
            temperature: 27.503802426212637,
            humidity: 60.790761818951786
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.05, Low: 0.10, Moderate: 0.85 }
    },
    'taguig': {
        name: 'Taguig',
        data: {
            pm25: 23.07912034276706,
            pm10: 42.77985400351244,
            no2: 5.849146677072817,
            so2: 3.3390037474398295,
            co: 1.3053520159486354,
            o3: 7.980784748071898,
            temperature: 22.119928515286624,
            humidity: 85.77966333265174
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.20, Low: 0.05, Moderate: 0.75 }
    },
    'paranaque': {
        name: 'Parañaque',
        data: {
            pm25: 16.203765693334148,
            pm10: 29.354259577131,
            no2: 3.638885729895513,
            so2: 2.7372140101071403,
            co: 1.7496513088543597,
            o3: 5.17047932088577,
            temperature: 28.597936704735307,
            humidity: 68.11392918411876
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.04, Low: 0.08, Moderate: 0.88 }
    },
    'las_pinas': {
        name: 'Las Piñas',
        data: {
            pm25: 12.818143192649856,
            pm10: 26.935114007761523,
            no2: 9.006287015158648,
            so2: 3.6892437871634827,
            co: 2.2626036186740546,
            o3: 5.881136277913254,
            temperature: 25.730539182646908,
            humidity: 85.97751037714592
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.03, Low: 0.15, Moderate: 0.82 }
    },
    'muntinlupa': {
        name: 'Muntinlupa',
        data: {
            pm25: 25.764714096966536,
            pm10: 46.385858790983825,
            no2: 5.265298991689453,
            so2: 4.8699091040659575,
            co: 1.6922161129241846,
            o3: 7.6627729016298956,
            temperature: 29.943100749205854,
            humidity: 39.77911373975564
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.28, Low: 0.02, Moderate: 0.70 }
    },
    'marikina': {
        name: 'Marikina',
        data: {
            pm25: 10.418486366840332,
            pm10: 19.042808495623685,
            no2: 6.005700726376792,
            so2: 3.4039872127354878,
            co: 1.949445677406179,
            o3: 8.309850511271405,
            temperature: 26.37395560768004,
            humidity: 74.55425112744554
        },
        actual: 'Low',
        predicted: 'Low',
        probabilities: { High: 0.01, Low: 0.94, Moderate: 0.05 }
    },
    'mandaluyong': {
        name: 'Mandaluyong',
        data: {
            pm25: 20.398465331727518,
            pm10: 42.44687610327989,
            no2: 9.997257022158268,
            so2: 3.955418829156594,
            co: 1.3558193877654288,
            o3: 6.167684310398416,
            temperature: 23.620274440443687,
            humidity: 69.07168996120737
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.13, Low: 0.07, Moderate: 0.80 }
    },
    'san_juan': {
        name: 'San Juan',
        data: {
            pm25: 14.5,
            pm10: 28.7,
            no2: 12.3,
            so2: 5.2,
            co: 1.4,
            o3: 35.8,
            temperature: 27.8,
            humidity: 72.5
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.1, Low: 0.2, Moderate: 0.7 }
    },
    'caloocan': {
        name: 'Caloocan',
        data: {
            pm25: 18.2,
            pm10: 34.8,
            no2: 18.7,
            so2: 8.9,
            co: 1.8,
            o3: 42.3,
            temperature: 29.1,
            humidity: 68.2
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.15, Low: 0.15, Moderate: 0.7 }
    },
    'malabon': {
        name: 'Malabon',
        data: {
            pm25: 21.5,
            pm10: 38.2,
            no2: 22.4,
            so2: 9.8,
            co: 2.1,
            o3: 38.7,
            temperature: 29.5,
            humidity: 75.3
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.3, Low: 0.1, Moderate: 0.6 }
    },
    'navotas': {
        name: 'Navotas',
        data: {
            pm25: 22.8,
            pm10: 40.5,
            no2: 24.1,
            so2: 10.2,
            co: 2.3,
            o3: 36.9,
            temperature: 29.8,
            humidity: 77.1
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.4, Low: 0.05, Moderate: 0.55 }
    },
    'valenzuela': {
        name: 'Valenzuela',
        data: {
            pm25: 16.8,
            pm10: 32.4,
            no2: 15.8,
            so2: 7.2,
            co: 1.6,
            o3: 40.2,
            temperature: 28.6,
            humidity: 69.8
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.1, Low: 0.25, Moderate: 0.65 }
    },
    'pasay': {
        name: 'Pasay',
        data: {
            pm25: 15.2,
            pm10: 30.1,
            no2: 14.2,
            so2: 6.5,
            co: 1.5,
            o3: 43.8,
            temperature: 28.3,
            humidity: 71.5
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.08, Low: 0.3, Moderate: 0.62 }
    },
    'pateros': {
        name: 'Pateros',
        data: {
            pm25: 13.7,
            pm10: 27.9,
            no2: 10.8,
            so2: 4.8,
            co: 1.3,
            o3: 45.2,
            temperature: 27.9,
            humidity: 73.2
        },
        actual: 'Moderate',
        predicted: 'Moderate',
        probabilities: { High: 0.05, Low: 0.4, Moderate: 0.55 }
    }
};
// ============================================
// MODEL ACCURACY HANDLING
// ============================================
function updateModelAccuracy(accuracy) {
    if (modelAccuracyElement) {
        modelAccuracyElement.textContent = `${accuracy.toFixed(1)}%`;
       
        // Color coding based on accuracy
        if (accuracy >= 90) {
            modelAccuracyElement.style.color = '#00ff88';
        } else if (accuracy >= 80) {
            modelAccuracyElement.style.color = '#f9d423';
        } else if (accuracy >= 70) {
            modelAccuracyElement.style.color = '#ff9800';
        } else {
            modelAccuracyElement.style.color = '#ff416c';
        }
    }
}
// ============================================
// DASHBOARD DATA AND CHARTS
// ============================================
async function loadDashboardData() {
    try {
        // Try to load from JSON file
        const response = await fetch('dashboard_data.json');
        if (!response.ok) throw new Error('Failed to load dashboard data');
       
        const data = await response.json();
        updateCharts(data);
       
        // Update accuracy from dashboard
        if (data.summary?.model_accuracy) {
            updateModelAccuracy(data.summary.model_accuracy);
        }
       
        console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
        console.warn('Using fallback dashboard data:', error);
       
        // Use fallback data
        const fallbackData = {
            risk_distribution: {Low: 48.8, Moderate: 49.5, High: 1.6},
            monthly_trends: [
                {period: '2025-01', pm25: 28},
                {period: '2025-02', pm25: 32},
                {period: '2025-03', pm25: 35},
                {period: '2025-04', pm25: 30},
                {period: '2025-05', pm25: 25},
                {period: '2025-06', pm25: 22},
                {period: '2025-07', pm25: 28},
                {period: '2025-08', pm25: 33},
                {period: '2025-09', pm25: 38},
                {period: '2025-10', pm25: 35},
                {period: '2025-11', pm25: 32}
            ],
            summary: {
                total_samples: 1320729,
                avg_pm25: 13.79,
                model_accuracy: 85.0
            }
        };
       
        updateCharts(fallbackData);
        updateModelAccuracy(85.0);
    }
}
function updateCharts(dashboardData) {
    // Risk Distribution Chart (Doughnut)
    const riskCtx = document.getElementById('riskDistributionChart')?.getContext('2d');
    if (!riskCtx) return;
   
    if (riskDistributionChart) {
        riskDistributionChart.destroy();
    }
   
    const riskLabels = Object.keys(dashboardData.risk_distribution || {});
    const riskData = Object.values(dashboardData.risk_distribution || {});
    const riskColors = ['#00b09b', '#f9d423', '#ff416c'];
   
    riskDistributionChart = new Chart(riskCtx, {
        type: 'doughnut',
        data: {
            labels: riskLabels,
            datasets: [{
                data: riskData,
                backgroundColor: riskColors,
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: { family: "'Poppins', sans-serif" },
                    bodyFont: { family: "'Poppins', sans-serif" }
                }
            },
            cutout: '65%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
   
    // Parameter Comparison Chart
    const paramCtx = document.getElementById('parameterChart')?.getContext('2d');
    if (!paramCtx) return;
   
    if (parameterChart) {
        parameterChart.destroy();
    }
   
    // Use default data for initial chart
    const parameters = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'];
    const safetyThresholds = [12, 50, 30, 10, 1.5, 40];
   
    parameterChart = new Chart(paramCtx, {
        type: 'bar',
        data: {
            labels: parameters,
            datasets: [
                {
                    label: 'Select a city to see data',
                    data: safetyThresholds.map(t => t * 0.8),
                    backgroundColor: '#e0e0e0',
                    borderColor: '#b0b0b0',
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}
// ============================================
// PREDICTION ENGINE (STATIC VERSION)
// ============================================
function calculateAQI(pm25) {
    if (pm25 <= 12) {
        return pm25 * (50/12); // Good (0-50)
    } else if (pm25 <= 35.4) {
        return 51 + (pm25 - 12.1) * (49/23.3); // Moderate (51-100)
    } else if (pm25 <= 55.4) {
        return 101 + (pm25 - 35.5) * (49/19.9); // Unhealthy for Sensitive Groups (101-150)
    } else if (pm25 <= 150.4) {
        return 151 + (pm25 - 55.5) * (49/94.9); // Unhealthy (151-200)
    } else {
        return 201 + (pm25 - 150.5) * (99/49.5); // Very Unhealthy (201-300)
    }
}
function getAQICategory(aqi) {
    if (aqi <= 50) return "Good";
    else if (aqi <= 100) return "Moderate";
    else if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    else if (aqi <= 200) return "Unhealthy";
    else if (aqi <= 300) return "Very Unhealthy";
    else return "Hazardous";
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
// ============================================
// LOAD LOCATION DATA
// ============================================
function loadLocationData() {
    const locationId = locationSelect.value;
   
    if (!locationId) {
        noDataMessage.style.display = 'block';
        airQualityData.style.display = 'none';
        resultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'block';
        return;
    }
   
    const location = locationData[locationId];
    if (!location) return;
   
    // Show loading
    dataLoading.style.display = 'block';
    noDataMessage.style.display = 'none';
    airQualityData.style.display = 'none';
    resultsContainer.style.display = 'none';
    noResultsMessage.style.display = 'none';
   
    // Simulate loading delay
    setTimeout(() => {
        dataLoading.style.display = 'none';
        airQualityData.style.display = 'block';
       
        // Update data display
        updateDataDisplay(location);
       
        // AUTO-PREDICT when location is selected
        generatePredictionForLocation(location);
       
        showAlert(`✅ Loaded air quality data for ${location.name}`, 'success');
    }, 500);
}
function updateDataDisplay(location) {
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
   
    // PM10 status
    const pm10Status = document.getElementById('pm10Status');
    if (data.pm10 <= 50) {
        pm10Status.textContent = 'Good';
        pm10Status.className = 'data-status status-good';
    } else if (data.pm10 <= 100) {
        pm10Status.textContent = 'Moderate';
        pm10Status.className = 'data-status status-moderate';
    } else {
        pm10Status.textContent = 'Poor';
        pm10Status.className = 'data-status status-poor';
    }
}
// ============================================
// MAIN PREDICTION FUNCTION
// ============================================
function generatePredictionForLocation(location) {
    // Show loading briefly
    dataLoading.style.display = 'block';
   
    // Simulate prediction delay
    setTimeout(() => {
        dataLoading.style.display = 'none';
       
        // Display the prediction
        displayPredictionResults(location);
       
        // Update charts with location data
        updateParameterChartWithLocation(location.data, location.name);
       
        showAlert(`✅ Prediction generated for ${location.name}`, 'success');
    }, 300);
}
function generatePrediction() {
    const locationId = locationSelect.value;
    if (!locationId) {
        showAlert('⚠️ Please select a location first', 'error');
        return;
    }
   
    const location = locationData[locationId];
    generatePredictionForLocation(location);
}
function displayPredictionResults(location) {
    // Hide "no results" message and show results
    noResultsMessage.style.display = 'none';
    resultsContainer.style.display = 'block';
   
    // Update location and time
    document.getElementById('predictionLocation').textContent = location.name;
    document.getElementById('predictionTime').textContent = new Date().toLocaleString();
   
    // Get the predicted risk from the location data
    const predictedRisk = location.predicted || 'Moderate';
    const actualRisk = location.actual || 'Moderate';
    const probabilities = location.probabilities || { High: 0.0, Low: 0.0, Moderate: 1.0 };
   
    // Calculate confidence (max probability)
    const confidence = Math.max(probabilities.High, probabilities.Low, probabilities.Moderate) * 100;
   
    // Calculate AQI from PM2.5
    const aqi = calculateAQI(location.data.pm25);
    const aqiCategory = getAQICategory(aqi);
   
    // Update risk display
    const riskDisplay = document.getElementById('riskDisplay');
    const riskText = document.getElementById('riskLevelText');
    const riskTitle = document.getElementById('riskTitle');
   
    riskText.textContent = `${predictedRisk} Risk`;
    document.getElementById('confidenceValue').textContent = `${confidence.toFixed(1)}%`;
    document.getElementById('aqiValue').textContent = aqi.toFixed(1);
    document.getElementById('aqiCategory').textContent = aqiCategory;
   
    // Style based on risk level
    riskDisplay.className = 'risk-level-display';
    if (predictedRisk === 'Low') {
        riskDisplay.classList.add('risk-low');
        riskTitle.innerHTML = '<i class="fas fa-check-circle"></i> Low Risk';
    } else if (predictedRisk === 'Moderate') {
        riskDisplay.classList.add('risk-moderate');
        riskTitle.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Moderate Risk';
    } else {
        riskDisplay.classList.add('risk-high');
        riskTitle.innerHTML = '<i class="fas fa-skull-crossbones"></i> High Risk';
    }
   
    // Update probabilities
    document.getElementById('probLow').textContent = `${(probabilities.Low * 100).toFixed(1)}%`;
    document.getElementById('probModerate').textContent = `${(probabilities.Moderate * 100).toFixed(1)}%`;
    document.getElementById('probHigh').textContent = `${(probabilities.High * 100).toFixed(1)}%`;
   
    // Add dataset comparison if we have actual risk
    const comparisonDiv = document.querySelector('.dataset-comparison');
    if (comparisonDiv) {
        comparisonDiv.remove();
    }
   
    if (actualRisk) {
        const comparison = document.createElement('div');
        comparison.className = 'dataset-comparison';
        comparison.innerHTML = `
            <p><i class="fas fa-clipboard-check"></i>
            Dataset validation: Actual was <strong>${actualRisk}</strong>,
            Predicted was <strong>${predictedRisk}</strong>
            ${actualRisk === predictedRisk ? '✅' : '❌'}</p>
        `;
        riskDisplay.appendChild(comparison);
    }
   
    // Update recommendations
    const recommendations = getRecommendations(predictedRisk, aqi);
    updateRecommendationList('generalRecs', recommendations.general);
    updateRecommendationList('sensitiveRecs', recommendations.sensitive_groups);
    updateRecommendationList('actionRecs', recommendations.actions);
   
    // Add animation to results
    riskDisplay.style.animation = 'none';
    setTimeout(() => {
        riskDisplay.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
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
function updateParameterChartWithLocation(data, locationName) {
    const ctx = document.getElementById('parameterChart')?.getContext('2d');
    if (!ctx) return;
   
    if (parameterChart) {
        parameterChart.destroy();
    }
   
    const parameters = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'];
    const currentValues = [data.pm25, data.pm10, data.no2, data.so2, data.co, data.o3];
    const safetyThresholds = [12, 50, 30, 10, 1.5, 40];
   
    parameterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: parameters,
            datasets: [
                {
                    label: `${locationName} Values`,
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
                    text: `Parameter Comparison - ${locationName}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}
// ============================================
// FORM HANDLING FUNCTIONS
// ============================================
function resetForm() {
    // Reset location select
    locationSelect.value = '';
   
    // Hide data and results
    airQualityData.style.display = 'none';
    resultsContainer.style.display = 'none';
    noDataMessage.style.display = 'block';
    noResultsMessage.style.display = 'block';
   
    // Reset charts to default
    updateCharts({
        risk_distribution: {Low: 48.8, Moderate: 49.5, High: 1.6},
        summary: {model_accuracy: 85.0}
    });
   
    showAlert('✅ Form reset to default values', 'success');
}
// ============================================
// ALERT FUNCTIONS
// ============================================
function showAlert(message, type) {
    if (!apiAlert) return;
   
    apiAlert.innerHTML = message;
    apiAlert.className = `alert alert-${type}`;
    apiAlert.style.display = 'block';
   
    // Add icon based on type
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i> ';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i> ';
   
    apiAlert.innerHTML = icon + message;
   
    // Auto-hide success alerts after 5 seconds
    if (type === 'success') {
        setTimeout(hideAlert, 5000);
    }
}
function hideAlert() {
    if (apiAlert) {
        apiAlert.style.display = 'none';
    }
}
// ============================================
// INITIALIZATION ON PAGE LOAD
// ============================================
function initializePage() {
    console.log('🚀 Initializing Air Pollution Risk Assessment System...');
   
    // Set initial model accuracy
    updateModelAccuracy(STATIC_ACCURACY);
   
    // Set API status for static mode
    if (apiStatusElement) {
        apiStatusElement.innerHTML =
            '<span style="color: #00b09b; font-weight: bold;">● Static Mode (No API Required)</span>';
    }
   
    // Load dashboard data
    loadDashboardData();
   
    // Set up location select event
    locationSelect.addEventListener('change', loadLocationData);
   
    // Show welcome message
    setTimeout(() => {
        showAlert(
            '🌐 Welcome to Metro Manila Air Pollution Risk Assessment<br>' +
            'Select a city to view air quality data and predictions',
            'success'
        );
    }, 1000);
   
    console.log('✅ Page initialization complete');
}
// ============================================
// ADD CSS ANIMATIONS DYNAMICALLY
// ============================================
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
       
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
       
        .risk-level-display {
            animation: fadeIn 0.5s ease-in;
        }
       
        .probability-item:hover {
            animation: pulse 0.5s ease;
        }
       
        .card {
            animation: fadeIn 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}
// ============================================
// EVENT LISTENERS AND GLOBAL EXPORTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations
    addAnimations();
   
    // Initialize the page
    initializePage();
   
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to predict
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            generatePrediction();
        }
        // Escape to reset
        if (e.key === 'Escape') {
            resetForm();
        }
    });
});
// Expose functions to global scope for button onclick events
window.loadLocationData = loadLocationData;
window.generatePrediction = generatePrediction;
window.resetForm = resetForm;
// For debugging
console.log('📊 Air Pollution Risk Assessment System Loaded');
console.log('Mode:', IS_STATIC_MODE ? 'Static (GitHub Pages)' : 'API Mode');
console.log('Model Accuracy:', STATIC_ACCURACY + '%');
