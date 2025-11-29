// Imports removed for non-module usage
// Functions are now loaded globally from calculations.js

let spirometryChart = null;
let currentExamId = null;

const generateNewId = (doctorName) => {
    if (!doctorName) return Date.now().toString(); // Fallback

    // Extract initials: "Marcus H Jones" -> "MHJ"
    const initials = doctorName.trim().split(/\s+/).map(n => n[0].toUpperCase()).join('');

    const database = JSON.parse(localStorage.getItem('spiroDatabase') || '[]');
    let maxNum = 0;

    // Pattern to match: INITIALS + 4 digits (e.g., MHJ0001)
    // We escape initials just in case they contain special regex chars
    const escapedInitials = initials.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^${escapedInitials}(\\d{4})$`);

    database.forEach(exam => {
        if (exam.id) {
            const match = exam.id.match(pattern);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) maxNum = num;
            }
        }
    });

    const nextNum = maxNum + 1;
    return `${initials}${String(nextNum).padStart(4, '0')}`;
};

const autoSaveExam = () => {
    const patientName = document.getElementById('patientName').value.trim();
    const examDate = document.getElementById('examDate').value;
    const doctorName = document.getElementById('doctorName').value.trim();

    if (!patientName || !examDate) return; // Don't save incomplete records

    // Generate ID only if it's a new exam
    if (!currentExamId) {
        currentExamId = generateNewId(doctorName);
    }

    const examData = {
        id: currentExamId,
        patientName,
        examDate,
        doctorName,
        doctorCRM: document.getElementById('doctorCRM').value,
        doctorSpecialty: document.getElementById('doctorSpecialty').value,
        clinicName: document.getElementById('clinicName').value,
        ageYears: parseFloat(document.getElementById('ageYears').value),
        ageMonths: parseFloat(document.getElementById('ageMonths').value),
        heightCm: parseFloat(document.getElementById('heightCm').value),
        weightKg: parseFloat(document.getElementById('weightKg').value),
        gender: document.getElementById('gender').value,
        colorCode: parseFloat(document.getElementById('colorCode').value),
        diagnosis: document.getElementById('diagnosis').value,
        obsCVF_pre: parseFloat(document.getElementById('obsCVF_pre').value) || null,
        obsVEF1_pre: parseFloat(document.getElementById('obsVEF1_pre').value) || null,
        obsFEF2575_pre: parseFloat(document.getElementById('obsFEF2575_pre').value) || null,
        obsCVF_post: parseFloat(document.getElementById('obsCVF_post').value) || null,
        obsVEF1_post: parseFloat(document.getElementById('obsVEF1_post').value) || null,
        obsFEF2575_post: parseFloat(document.getElementById('obsFEF2575_post').value) || null,
        timestamp: new Date().toISOString()
    };

    let database = JSON.parse(localStorage.getItem('spiroDatabase') || '[]');

    if (currentExamId) {
        // Update existing or add new (since we just set currentExamId)
        const index = database.findIndex(item => item.id === currentExamId);
        if (index !== -1) {
            database[index] = examData;
        } else {
            database.push(examData);
        }
    }

    localStorage.setItem('spiroDatabase', JSON.stringify(database));
    console.log('Exame salvo automaticamente:', currentExamId);
};

document.addEventListener('DOMContentLoaded', () => {
    // Restore saved values
    const savedDoctorName = localStorage.getItem('doctorName');
    if (savedDoctorName) document.getElementById('doctorName').value = savedDoctorName;
    const savedCRM = localStorage.getItem('doctorCRM');
    if (savedCRM) document.getElementById('doctorCRM').value = savedCRM;
    const savedSpecialty = localStorage.getItem('doctorSpecialty');
    if (savedSpecialty) document.getElementById('doctorSpecialty').value = savedSpecialty;
    const savedClinicName = localStorage.getItem('clinicName');
    if (savedClinicName) document.getElementById('clinicName').value = savedClinicName;

    // Set today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('examDate').value = `${yyyy}-${mm}-${dd}`;

    // Initialize Chart (Scatterplot)
    const ctx = document.getElementById('spirometryChart').getContext('2d');
    spirometryChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Z-Score VEF1/CVF' },
                    min: -4,
                    max: 4,
                    grid: {
                        color: (context) => context.tick.value === -1.645 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
                        lineWidth: (context) => context.tick.value === -1.645 ? 2 : 1
                    }
                },
                y: {
                    title: { display: true, text: 'Z-Score CVF' },
                    min: -4,
                    max: 4,
                    grid: {
                        color: (context) => context.tick.value === -1.645 ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
                        lineWidth: (context) => context.tick.value === -1.645 ? 2 : 1
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        normal: {
                            type: 'box',
                            xMin: -1.645, xMax: 4,
                            yMin: -1.645, yMax: 4,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            label: { content: 'Normal', display: true, position: 'center' }
                        },
                        obstructive: {
                            type: 'box',
                            xMin: -4, xMax: -1.645,
                            yMin: -1.645, yMax: 4,
                            backgroundColor: 'rgba(255, 205, 86, 0.2)',
                            label: { content: 'Obstrutivo', display: true, position: 'center' }
                        },
                        restrictive: {
                            type: 'box',
                            xMin: -1.645, xMax: 4,
                            yMin: -4, yMax: -1.645,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            label: { content: 'Restritivo', display: true, position: 'center' }
                        },
                        mixed: {
                            type: 'box',
                            xMin: -4, xMax: -1.645,
                            yMin: -4, yMax: -1.645,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            label: { content: 'Misto', display: true, position: 'center' }
                        }
                    }
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                        }
                    }
                }
            }
        }
    });

    // Logic to hide Post-BD for Healthy Patients
    document.getElementById('diagnosis').addEventListener('change', function () {
        const isHealthy = this.value === "Sadio e Assintomático";
        const postBdColumn = document.getElementById('postBdColumn');
        if (isHealthy) {
            postBdColumn.style.display = 'none';
            // Clear values to avoid confusion
            document.getElementById('obsCVF_post').value = '';
            document.getElementById('obsVEF1_post').value = '';
            document.getElementById('obsFEF2575_post').value = '';
        } else {
            postBdColumn.style.display = 'block';
        }
    });

    // Chart Visibility Toggle
    const chartCheckbox = document.getElementById('showChartCheckbox');
    const chartContainer = document.getElementById('chartContainer');

    if (chartCheckbox && chartContainer) {
        chartCheckbox.addEventListener('change', function () {
            chartContainer.style.display = this.checked ? 'block' : 'none';
        });
    }
});

document.getElementById('doctorName').addEventListener('input', (e) => localStorage.setItem('doctorName', e.target.value));
document.getElementById('doctorCRM').addEventListener('input', (e) => localStorage.setItem('doctorCRM', e.target.value));
document.getElementById('doctorSpecialty').addEventListener('input', (e) => localStorage.setItem('doctorSpecialty', e.target.value));
document.getElementById('clinicName').addEventListener('input', (e) => localStorage.setItem('clinicName', e.target.value));

document.getElementById('spirometryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Reset errors and warnings
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.getElementById('ageRangeWarning').style.display = 'none';
    document.getElementById('healthyOlderMessage').style.display = 'none';

    let isValid = true;
    const getVal = (id) => document.getElementById(id).value;
    const getNum = (id) => parseFloat(document.getElementById(id).value);

    const patientName = getVal('patientName').trim();
    const examDateInput = getVal('examDate');
    const doctorName = getVal('doctorName').trim();
    const doctorCRM = getVal('doctorCRM').trim();
    const doctorSpecialty = getVal('doctorSpecialty').trim();
    const clinicName = getVal('clinicName').trim();
    const ageYears = getNum('ageYears');
    const ageMonths = getNum('ageMonths');
    const heightCm = getNum('heightCm');
    const weightKg = getNum('weightKg');
    const gender = getVal('gender');
    const colorCode = getNum('colorCode');
    const diagnosis = getVal('diagnosis');

    const obsCVF_pre = getNum('obsCVF_pre') || null;
    const obsVEF1_pre = getNum('obsVEF1_pre') || null;
    const obsFEF2575_pre = getNum('obsFEF2575_pre') || null;

    const obsCVF_post = getNum('obsCVF_post') || null;
    const obsVEF1_post = getNum('obsVEF1_post') || null;
    const obsFEF2575_post = getNum('obsFEF2575_post') || null;

    // Validation
    if (!patientName) { document.getElementById('patientNameError').style.display = 'block'; isValid = false; }
    if (!examDateInput) { document.getElementById('examDateError').style.display = 'block'; isValid = false; }
    if (!doctorName) { document.getElementById('doctorNameError').style.display = 'block'; isValid = false; }
    if (!clinicName) { document.getElementById('clinicNameError').style.display = 'block'; isValid = false; }
    if (!clinicName) { document.getElementById('clinicNameError').style.display = 'block'; isValid = false; }

    // Age validation: 3-12 normally, 3-99 for "Sadio e Assintomático"
    const maxAge = diagnosis === "Sadio e Assintomático" ? 99 : 12;
    if (isNaN(ageYears) || ageYears < 3 || ageYears > maxAge) {
        document.getElementById('ageError').textContent = `A idade deve estar entre 3 e ${maxAge} anos.`;
        document.getElementById('ageError').style.display = 'block';
        isValid = false;
    }

    if (isNaN(ageMonths) || ageMonths < 0 || ageMonths > 11) { document.getElementById('ageMonthsError').style.display = 'block'; isValid = false; }
    if (isNaN(heightCm) || heightCm <= 0) { document.getElementById('heightError').style.display = 'block'; isValid = false; }
    if (isNaN(weightKg) || weightKg <= 0) { document.getElementById('weightError').style.display = 'block'; isValid = false; }
    if (gender === "") { document.getElementById('genderError').style.display = 'block'; isValid = false; }
    if (isNaN(colorCode)) { document.getElementById('colorCodeError').style.display = 'block'; isValid = false; }
    if (getVal('diagnosis') === "") { document.getElementById('diagnosisError').style.display = 'block'; isValid = false; }

    if (!isValid) {
        document.getElementById('results').style.display = 'none';
        return;
    }

    // Display Header Info
    document.getElementById('displayPatientName').textContent = patientName;
    document.getElementById('displayPatientAge').textContent = `${ageYears} anos` + (ageMonths > 0 ? ` e ${ageMonths} meses` : '');
    document.getElementById('displayPatientHeight').textContent = formatValue(heightCm, 1) + ' cm';
    document.getElementById('displayPatientWeight').textContent = formatValue(weightKg, 1) + ' Kg';
    const dateParts = examDateInput.split('-');
    document.getElementById('displayExamDate').textContent = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    document.getElementById('displayDoctorName').textContent = doctorName;
    document.getElementById('displayClinicName').textContent = clinicName;

    // Calculations
    const totalAgeInYears = ageYears + (ageMonths / 12);


    // Special logic for Healthy Patients >= 13
    if (diagnosis === "Sadio e Assintomático" && totalAgeInYears >= 13) {
        // Skip calculations, show success message
        document.getElementById('healthyOlderMessage').style.display = 'block';

        // Hide standard result sections
        document.querySelector('#results table').style.display = 'none'; // Pre table
        document.querySelector('#results h2').style.display = 'none'; // "Resultados Pré..."
        document.getElementById('postBdSection').style.display = 'none';
        document.querySelector('.citation').style.display = 'none';
        document.querySelector('.chart-container').style.display = 'none';
        document.getElementById('interpretation-unified-section').style.display = 'none';

        // Show "Enviar Dados" button
        document.getElementById('sendHealthyButton').style.display = 'inline-block';
        document.getElementById('printButton').style.display = 'none'; // Usually not needed for just saving?
        document.getElementById('copyHtmlButton').style.display = 'none';

        document.getElementById('results').style.display = 'block';
        document.getElementById('spirometryForm').style.display = 'none';

        autoSaveExam(); // Auto-save for healthy patients

        return; // Exit function
    }

    // Reset visibility for standard patients (in case it was hidden)
    document.querySelector('#results table').style.display = 'table';
    document.querySelector('#results h2').style.display = 'block';
    document.querySelector('.citation').style.display = 'block';

    // Respect checkbox state
    const showChart = document.getElementById('showChartCheckbox').checked;
    document.getElementById('chartContainer').style.display = showChart ? 'block' : 'none';

    document.getElementById('interpretation-unified-section').style.display = 'block';
    document.getElementById('printButton').style.display = 'inline-block';
    document.getElementById('copyHtmlButton').style.display = 'inline-block';

    if (totalAgeInYears < 3 || totalAgeInYears >= 13) {
        document.getElementById('ageRangeWarning').style.display = 'block';
    }

    const currentCoefsPrev = gender === 'male' ? coefMalePrev : coefFemalePrev;
    const currentCoefsLIN = gender === 'male' ? coefMaleLIN : coefFemaleLIN;
    const currentSEE = gender === 'male' ? seeMale : seeFemale;

    const lnHeight = Math.log(heightCm);
    const lnAge = Math.log(totalAgeInYears);

    const { prevCVF, prevVEF1, prevVEF1CVF, prevFEF2575 } = calculatePredictedValues(currentCoefsPrev, lnHeight, lnAge, colorCode);
    const { linCVF, linVEF1, linVEF1CVF, linFEF2575 } = calculateLINValues(currentCoefsLIN, lnHeight, lnAge, colorCode);

    const { computedObsVEF1CVF: computedObsVEF1CVF_pre } = computeDerivedObserved(obsVEF1_pre, obsCVF_pre, obsFEF2575_pre);
    const { computedObsVEF1CVF: computedObsVEF1CVF_post } = computeDerivedObserved(obsVEF1_post, obsCVF_post, obsFEF2575_post);

    // Z-Scores Pre
    const zScoreCVF_pre = calculateZScore(obsCVF_pre, prevCVF, currentSEE.cvf, true);
    const zScoreVEF1_pre = calculateZScore(obsVEF1_pre, prevVEF1, currentSEE.vef1, true);
    const zScoreVEF1CVF_pre = calculateZScore(computedObsVEF1CVF_pre, prevVEF1CVF, currentSEE.vef1cvf, false);
    const zScoreFEF2575_pre = calculateZScore(obsFEF2575_pre, prevFEF2575, currentSEE.fef2575, true);

    // Z-Scores Post
    const zScoreCVF_post = calculateZScore(obsCVF_post, prevCVF, currentSEE.cvf, true);
    const zScoreVEF1_post = calculateZScore(obsVEF1_post, prevVEF1, currentSEE.vef1, true);
    const zScoreVEF1CVF_post = calculateZScore(computedObsVEF1CVF_post, prevVEF1CVF, currentSEE.vef1cvf, false);
    const zScoreFEF2575_post = calculateZScore(obsFEF2575_post, prevFEF2575, currentSEE.fef2575, true);

    // Render Pre Table
    const tbodyPre = document.getElementById('resultsTableBodyPre');
    tbodyPre.innerHTML = '';
    const addRow = (name, obs, prev, lin, z) => {
        const row = tbodyPre.insertRow();
        row.insertCell().textContent = name;
        const cellObs = row.insertCell(); cellObs.textContent = formatValue(obs);
        row.insertCell().textContent = formatValue(prev);
        row.insertCell().textContent = formatValue(lin);
        const cellPerc = row.insertCell(); cellPerc.textContent = calculatePercentage(obs, prev) + '%';
        const cellZ = row.insertCell(); cellZ.textContent = formatValue(z, 3);
        if (obs !== null && lin !== null && obs < lin) {
            cellObs.classList.add('value-below-lin');
            cellPerc.classList.add('value-below-lin');
            cellZ.classList.add('value-below-lin');
        }
    };
    addRow('CVF (L)', obsCVF_pre, prevCVF, linCVF, zScoreCVF_pre);
    addRow('VEF1 (L)', obsVEF1_pre, prevVEF1, linVEF1, zScoreVEF1_pre);
    addRow('VEF1/CVF', computedObsVEF1CVF_pre, prevVEF1CVF, linVEF1CVF, zScoreVEF1CVF_pre);
    addRow('FEF25-75% (L/s)', obsFEF2575_pre, prevFEF2575, linFEF2575, zScoreFEF2575_pre);

    // Render Post Table (Conditional)
    // For Healthy patients, we never show Post-BD results (as they don't do it)
    const hasPostBDValues = diagnosis !== "Sadio e Assintomático" && (obsCVF_post !== null || obsVEF1_post !== null || obsFEF2575_post !== null);
    const postSection = document.getElementById('postBdSection');

    if (hasPostBDValues) {
        postSection.style.display = 'block';
        const tbodyPost = document.getElementById('resultsTableBodyPostAndReversibility');
        tbodyPost.innerHTML = '';
        const addPostRow = (name, obsPost, prev, lin, zPost, obsPre, unit) => {
            const row = tbodyPost.insertRow();
            row.insertCell().textContent = name;
            const cellObs = row.insertCell(); cellObs.textContent = formatValue(obsPost);
            const cellPerc = row.insertCell(); cellPerc.textContent = calculatePercentage(obsPost, prev) + '%';
            const cellZ = row.insertCell(); cellZ.textContent = formatValue(zPost, 3);
            if (obsPost !== null && lin !== null && obsPost < lin) {
                cellObs.classList.add('value-below-lin');
                cellPerc.classList.add('value-below-lin');
                cellZ.classList.add('value-below-lin');
            }
            const cellAbsDiff = row.insertCell();
            const cellPercDiff = row.insertCell();

            const absDiff = (obsPost !== null && obsPre !== null) ? (obsPost - obsPre) : null;
            const percDiff = calculateDiffPercentOfPredicted(obsPre, obsPost, prev);

            let fmtAbsDiff = 'N/A';
            if (absDiff !== null) {
                if (unit === 'L') fmtAbsDiff = formatValue(absDiff * 1000, 0) + ' mL';
                else if (unit === 'L/s') fmtAbsDiff = formatValue(absDiff) + ' L/s';
                else fmtAbsDiff = formatValue(absDiff, 3);
            }
            cellAbsDiff.textContent = fmtAbsDiff;
            cellPercDiff.textContent = formatValue(percDiff) + '%';

            if (percDiff !== null && percDiff >= 10 && (unit === 'L')) { // Only color significant change for volumes usually
                cellPercDiff.classList.add('change-significant-green');
            }
        };
        addPostRow('CVF (L)', obsCVF_post, prevCVF, linCVF, zScoreCVF_post, obsCVF_pre, 'L');
        addPostRow('VEF1 (L)', obsVEF1_post, prevVEF1, linVEF1, zScoreVEF1_post, obsVEF1_pre, 'L');
        addPostRow('VEF1/CVF', computedObsVEF1CVF_post, prevVEF1CVF, linVEF1CVF, zScoreVEF1CVF_post, computedObsVEF1CVF_pre, 'ratio');
        addPostRow('FEF25-75% (L/s)', obsFEF2575_post, prevFEF2575, linFEF2575, zScoreFEF2575_post, obsFEF2575_pre, 'L/s');
    } else {
        postSection.style.display = 'none';
    }

    // Interpretation
    const preBDResult = generateSingleInterpretation(obsCVF_pre, linCVF, obsVEF1_pre, linVEF1, computedObsVEF1CVF_pre, linVEF1CVF, zScoreCVF_pre, "Pré-Broncodilatador");
    document.getElementById('interpretation-text-pre').value = preBDResult.text.replace(/<br>/g, '\n').replace(/<strong>|<\/strong>/g, ''); // Strip HTML for textarea
    const preBDClassification = preBDResult.classification;

    const postBDInterpretationArea = document.getElementById('interpretation-text-post');
    let postBDClassification = null;
    let vef1Change = null;
    let cvfChange = null;

    if (hasPostBDValues) {
        postBDInterpretationArea.style.display = 'block';
        if (computedObsVEF1CVF_post !== null && zScoreCVF_post !== null && obsVEF1_post !== null && obsCVF_post !== null) {
            const postBDResult = generateSingleInterpretation(obsCVF_post, linCVF, obsVEF1_post, linVEF1, computedObsVEF1CVF_post, linVEF1CVF, zScoreCVF_post, "Pós-Broncodilatador", preBDClassification, obsCVF_pre, obsVEF1_pre, prevCVF, prevVEF1);
            postBDInterpretationArea.value = postBDResult.text.replace(/<br>/g, '\n').replace(/<strong>|<\/strong>/g, '');
            postBDClassification = postBDResult.classification;

            // Calculate changes for conclusion
            if (obsVEF1_pre !== null && obsVEF1_post !== null && prevVEF1 !== null) {
                vef1Change = calculateDiffPercentOfPredicted(obsVEF1_pre, obsVEF1_post, prevVEF1);
            }
            if (obsCVF_pre !== null && obsCVF_post !== null && prevCVF !== null) {
                cvfChange = calculateDiffPercentOfPredicted(obsCVF_pre, obsCVF_post, prevCVF);
            }

        } else {
            postBDInterpretationArea.value = "Dados Pós-Broncodilatador insuficientes para interpretação completa.";
        }
    } else {
        postBDInterpretationArea.style.display = 'none';
        postBDInterpretationArea.value = "";
    }

    // Generate Conclusion
    const conclusionText = generateConclusion(preBDClassification, postBDClassification, vef1Change, cvfChange);
    document.getElementById('conclusion-text').value = conclusionText;

    // Update Chart (Scatterplot)
    const datasets = [];

    if (zScoreVEF1CVF_pre !== null && zScoreCVF_pre !== null) {
        datasets.push({
            label: 'Pré-BD',
            data: [{ x: zScoreVEF1CVF_pre, y: zScoreCVF_pre }],
            backgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 8,
            pointHoverRadius: 10
        });
    }

    if (hasPostBDValues && zScoreVEF1CVF_post !== null && zScoreCVF_post !== null) {
        datasets.push({
            label: 'Pós-BD',
            data: [{ x: zScoreVEF1CVF_post, y: zScoreCVF_post }],
            backgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 8,
            pointHoverRadius: 10
        });
    }

    // Update Annotations (Labels)
    const annotations = spirometryChart.options.plugins.annotation.annotations;

    // Clear previous annotations
    Object.keys(annotations).forEach(key => {
        if (key !== 'normal' && key !== 'obstructive' && key !== 'restrictive' && key !== 'mixed') {
            delete annotations[key];
        }
    });

    if (zScoreVEF1CVF_pre !== null && zScoreCVF_pre !== null) {
        annotations.labelPre = {
            type: 'label',
            xValue: zScoreVEF1CVF_pre,
            yValue: zScoreCVF_pre,
            yAdjust: -15, // Position above the point
            content: 'Pré-BD',
            font: {
                size: 10,
                family: "'Inter', sans-serif"
            },
            color: 'rgba(54, 162, 235, 1)',
            position: 'center'
        };
    }

    if (hasPostBDValues && zScoreVEF1CVF_post !== null && zScoreCVF_post !== null) {
        annotations.labelPost = {
            type: 'label',
            xValue: zScoreVEF1CVF_post,
            yValue: zScoreCVF_post,
            yAdjust: -15, // Position above the point
            content: 'Pós-BD',
            font: {
                size: 10,
                family: "'Inter', sans-serif"
            },
            color: 'rgba(75, 192, 192, 1)',
            position: 'center'
        };
    }

    spirometryChart.data.datasets = datasets;
    spirometryChart.update();

    // Update Signature
    document.getElementById('signatureDoctorName').textContent = doctorName;
    const details = [];
    if (doctorCRM) details.push(`CRM: ${doctorCRM}`);
    if (doctorSpecialty) details.push(doctorSpecialty);
    document.getElementById('signatureDoctorDetails').textContent = details.join(' - ');

    document.getElementById('doctorSignatureBlock').style.display = 'block';

    document.getElementById('results').style.display = 'block';
    document.getElementById('spirometryForm').style.display = 'none';

    // Show "Enviar Dados (Sadios)" button if applicable
    if (diagnosis === "Sadio e Assintomático") {
        document.getElementById('sendHealthyButton').style.display = 'inline-block';
    } else {
        document.getElementById('sendHealthyButton').style.display = 'none';
    }

    autoSaveExam(); // Auto-save after calculation
});

document.getElementById('resetButton').addEventListener('click', function () {
    currentExamId = null; // Reset current exam ID for new exam
    document.getElementById('spirometryForm').reset();

    // Restore saved values immediately after reset
    const savedDoctorName = localStorage.getItem('doctorName');
    if (savedDoctorName) document.getElementById('doctorName').value = savedDoctorName;
    const savedCRM = localStorage.getItem('doctorCRM');
    if (savedCRM) document.getElementById('doctorCRM').value = savedCRM;
    const savedSpecialty = localStorage.getItem('doctorSpecialty');
    if (savedSpecialty) document.getElementById('doctorSpecialty').value = savedSpecialty;
    const savedClinicName = localStorage.getItem('clinicName');
    if (savedClinicName) document.getElementById('clinicName').value = savedClinicName;

    // Reset date and other defaults
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('examDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('ageMonths').value = '0';

    document.getElementById('results').style.display = 'none';
    document.getElementById('spirometryForm').style.display = 'block';
    document.getElementById('ageRangeWarning').style.display = 'none';
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
});

document.getElementById('printButton').addEventListener('click', function () {
    const originalTitle = document.title;
    const patientName = document.getElementById('patientName').value.trim();
    const examDateInput = document.getElementById('examDate').value;

    if (patientName && examDateInput) {
        const safePatientName = patientName.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
        document.title = `spirometry_${safePatientName}_${examDateInput}`;
    }

    window.print();
    document.title = originalTitle;
});

document.getElementById('copyHtmlButton').addEventListener('click', function () {
    const resultsDiv = document.getElementById('results');

    // Create a clone to modify without affecting the display
    const clone = resultsDiv.cloneNode(true);

    // Remove the author/license info from the clone
    const footer = clone.querySelector('.author-license-info');
    if (footer) {
        footer.remove();
    }

    // We need to append the clone to the document to select it, but we can hide it
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    const range = document.createRange();
    range.selectNode(clone);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        document.execCommand('copy');
        alert('Resultados copiados (sem rodapé)!');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar resultados.');
    } finally {
        window.getSelection().removeAllRanges();
        document.body.removeChild(clone);
    }
});

const exportHealthyDatabase = () => {
    const database = JSON.parse(localStorage.getItem('spiroDatabase') || '[]');
    const healthyPatients = database.filter(item => item.diagnosis === "Sadio e Assintomático");

    if (healthyPatients.length === 0) {
        alert('Não há pacientes com diagnóstico "Sadio e Assintomático" para exportar.');
        return;
    }

    // CSV Header for Healthy Patients (Anonymized)
    const headers = [
        'ID', 'Nome do Médico', 'CRM', 'Data', 'Sexo', 'Altura (cm)', 'Peso (Kg)',
        'CVF Pré (L)', 'VEF1 Pré (L)', 'FEF25-75 Pré (L/s)',
        'CVF Pós (L)', 'VEF1 Pós (L)', 'FEF25-75 Pós (L/s)'
    ];

    // CSV Rows
    const rows = healthyPatients.map(exam => [
        exam.id,
        `"${exam.doctorName}"`,
        `"${exam.doctorCRM}"`,
        exam.examDate,
        exam.gender,
        exam.heightCm,
        exam.weightKg || '',
        exam.obsCVF_pre,
        exam.obsVEF1_pre,
        exam.obsFEF2575_pre,
        exam.obsCVF_post,
        exam.obsVEF1_post,
        exam.obsFEF2575_post
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Download Link
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);

    const doctorName = document.getElementById('doctorName').value.trim() || 'Medico';
    const doctorCRM = document.getElementById('doctorCRM').value.trim() || 'CRM';
    const safeDoctorName = doctorName.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
    const safeCRM = doctorCRM.replace(/[^a-zA-Z0-9_-\s]/g, '');

    const filename = `Sadios_${safeDoctorName}-${safeCRM}.csv`;
    link.setAttribute('download', filename);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return filename; // Return filename for email subject
};

const sendHealthyEmail = () => {
    const filename = exportHealthyDatabase();
    if (!filename) return;

    const subject = `Dados Sadios - ${filename}`;
    const body = `Prezados,\n\nSegue em anexo o arquivo ${filename} com os dados dos pacientes sadios.\n\nAtenciosamente,\n${document.getElementById('doctorName').value}`;

    const mailtoLink = `mailto:espirometriabrasil@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open default email client
    window.location.href = mailtoLink;

    alert('O arquivo CSV foi baixado. Por favor, anexe-o ao e-mail que será aberto em seguida.');
};

const exportDatabase = () => {
    const database = JSON.parse(localStorage.getItem('spiroDatabase') || '[]');

    if (database.length === 0) {
        alert('O banco de dados está vazio.');
        return;
    }

    // CSV Header
    const headers = [
        'ID', 'Nome do Paciente', 'Data Nasc/Idade', 'Data Exame', 'Sexo', 'Cor', 'Altura (cm)', 'Peso (Kg)',
        'Diagnóstico', 'Médico', 'CRM', 'Clínica',
        'CVF Pré (L)', 'VEF1 Pré (L)', 'FEF25-75 Pré (L/s)',
        'CVF Pós (L)', 'VEF1 Pós (L)', 'FEF25-75 Pós (L/s)'
    ];

    // CSV Rows
    const rows = database.map(exam => [
        exam.id,
        `"${exam.patientName}"`,
        exam.ageYears + 'a ' + exam.ageMonths + 'm',
        exam.examDate,
        exam.gender,
        exam.colorCode === 0 ? 'Branco' : 'Negro/Pardo',
        exam.heightCm,
        exam.weightKg,
        `"${exam.diagnosis}"`,
        `"${exam.doctorName}"`,
        `"${exam.doctorCRM}"`,
        `"${exam.clinicName}"`,
        exam.obsCVF_pre,
        exam.obsVEF1_pre,
        exam.obsFEF2575_pre,
        exam.obsCVF_post,
        exam.obsVEF1_post,
        exam.obsFEF2575_post
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Download Link
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);

    const doctorName = document.getElementById('doctorName').value.trim() || 'Medico';
    const doctorCRM = document.getElementById('doctorCRM').value.trim() || 'CRM';
    const safeDoctorName = doctorName.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
    const safeCRM = doctorCRM.replace(/[^a-zA-Z0-9_-\s]/g, '');

    const filename = `SpiroDB_${safeDoctorName}_${safeCRM}.csv`;
    link.setAttribute('download', filename);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const saveExam = () => {
    const patientName = document.getElementById('patientName').value.trim();
    const examDate = document.getElementById('examDate').value;

    if (!patientName || !examDate) {
        alert('Por favor, preencha pelo menos o Nome do Paciente e a Data do Exame.');
        return;
    }

    // Reuse the logic from autoSaveExam but with user feedback
    autoSaveExam();
    alert(`Exame de ${patientName} salvo com sucesso!`);
};

document.getElementById('saveExamButton').addEventListener('click', saveExam);
document.getElementById('exportDbButton').addEventListener('click', exportDatabase);
document.getElementById('sendHealthyButton').addEventListener('click', sendHealthyEmail);
