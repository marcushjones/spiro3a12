
// Coefficients for Predicted Values (Jones et al. 2020)
window.coefMalePrev = {
    intercept: { cvf: -11.358191, vef1: -10.434226, vef1cvf: 1.760961, fef2575: -6.957857, fef2575cvf: 6.185501 },
    lnAltura: { cvf: 2.419817, vef1: 2.207609, vef1cvf: -0.176748, fef2575: 1.527303, fef2575cvf: -1.044205 },
    lnIdade: { cvf: 0.115477, vef1: 0.114001, vef1cvf: 0, fef2575: 0.138649, fef2575cvf: 0 },
    cor: { cvf: -0.028745, vef1: -0.031836, vef1cvf: 0, fef2575: 0, fef2575cvf: 0.093297 }
};

window.coefFemalePrev = {
    intercept: { cvf: -10.741935, vef1: -9.967774, vef1cvf: 1.437685, fef2575: -7.385469, fef2575cvf: 5.041747 },
    lnAltura: { cvf: 2.261976, vef1: 2.08895, vef1cvf: -0.106215, fef2575: 1.594033, fef2575cvf: -0.785773 },
    lnIdade: { cvf: 0.156836, vef1: 0.150386, vef1cvf: 0, fef2575: 0.203576, fef2575cvf: 0 },
    cor: { cvf: -0.041015, vef1: -0.048582, vef1cvf: 0, fef2575: 0, fef2575cvf: 0.046472 }
};

window.coefMaleLIN = {
    intercept: { cvf: -9.32749, vef1: -8.960184, vef1cvf: 1.94278, fef2575: -5.356269, fef2575cvf: 4.579022 },
    lnAltura: { cvf: 1.890179, vef1: 1.820202, vef1cvf: -0.231255, fef2575: 1.085145, fef2575cvf: -0.78661 },
    lnIdade: { cvf: 0.268924, vef1: 0.208981, vef1cvf: 0, fef2575: 0.211021, fef2575cvf: 0 },
    cor: { cvf: -0.042377, vef1: -0.026383, vef1cvf: 0, fef2575: 0, fef2575cvf: 0.036968 }
};

window.coefFemaleLIN = {
    intercept: { cvf: -10.325884, vef1: -8.934018, vef1cvf: 1.313149, fef2575: -7.85519, fef2575cvf: 3.919387 },
    lnAltura: { cvf: 2.098703, vef1: 1.768038, vef1cvf: -0.100805, fef2575: 1.673427, fef2575cvf: -0.642607 },
    lnIdade: { cvf: 0.23022, vef1: 0.290733, vef1cvf: 0, fef2575: 0.056126, fef2575cvf: 0 },
    cor: { cvf: -0.073692, vef1: -0.054695, vef1cvf: 0, fef2575: 0, fef2575cvf: 0.027623 }
};

window.seeMale = { cvf: 0.1362, vef1: 0.1284, vef1cvf: 0.04988, fef2575: 0.224, fef2575cvf: 0.2694 };
window.seeFemale = { cvf: 0.1443, vef1: 0.1369, vef1cvf: 0.05075, fef2575: 0.2297, fef2575cvf: 0.2929 };

window.calculatePredictedValues = (coefsPrev, lnHeight, lnAge, colorCode) => {
    const lnPrevCVF = coefsPrev.intercept.cvf + (lnHeight * coefsPrev.lnAltura.cvf) + (lnAge * coefsPrev.lnIdade.cvf) + (colorCode * coefsPrev.cor.cvf);
    const prevCVF = Math.exp(lnPrevCVF);
    const lnPrevVEF1 = coefsPrev.intercept.vef1 + (lnHeight * coefsPrev.lnAltura.vef1) + (lnAge * coefsPrev.lnIdade.vef1) + (colorCode * coefsPrev.cor.vef1);
    const prevVEF1 = Math.exp(lnPrevVEF1);
    const prevVEF1CVF = coefsPrev.intercept.vef1cvf + (lnHeight * coefsPrev.lnAltura.vef1cvf) + (lnAge * coefsPrev.lnIdade.vef1cvf) + (colorCode * coefsPrev.cor.vef1cvf);
    const lnPrevFEF2575 = coefsPrev.intercept.fef2575 + (lnHeight * coefsPrev.lnAltura.fef2575) + (lnAge * coefsPrev.lnIdade.fef2575) + (colorCode * coefsPrev.cor.fef2575);
    const prevFEF2575 = Math.exp(lnPrevFEF2575);
    const prevFEF2575CVF = coefsPrev.intercept.fef2575cvf + (lnHeight * coefsPrev.lnAltura.fef2575cvf) + (lnAge * coefsPrev.lnIdade.fef2575cvf) + (colorCode * coefsPrev.cor.fef2575cvf);
    return { prevCVF, prevVEF1, prevVEF1CVF, prevFEF2575, prevFEF2575CVF, lnPrevCVF, lnPrevVEF1, lnPrevFEF2575 };
};

window.calculateLINValues = (coefsLIN, lnHeight, lnAge, colorCode) => {
    const lnLINCVF = coefsLIN.intercept.cvf + (lnHeight * coefsLIN.lnAltura.cvf) + (lnAge * coefsLIN.lnIdade.cvf) + (colorCode * coefsLIN.cor.cvf);
    const linCVF = Math.exp(lnLINCVF);
    const lnLINVEF1 = coefsLIN.intercept.vef1 + (lnHeight * coefsLIN.lnAltura.vef1) + (lnAge * coefsLIN.lnIdade.vef1) + (colorCode * coefsLIN.cor.vef1);
    const linVEF1 = Math.exp(lnLINVEF1);
    const linVEF1CVF = coefsLIN.intercept.vef1cvf + (lnHeight * coefsLIN.lnAltura.vef1cvf) + (lnAge * coefsLIN.lnIdade.vef1cvf) + (colorCode * coefsLIN.cor.vef1cvf);
    const lnLINFEF2575 = coefsLIN.intercept.fef2575 + (lnHeight * coefsLIN.lnAltura.fef2575) + (lnAge * coefsLIN.lnIdade.fef2575) + (colorCode * coefsLIN.cor.fef2575);
    const linFEF2575 = Math.exp(lnLINFEF2575);
    const linFEF2575CVF = coefsLIN.intercept.fef2575cvf + (lnHeight * coefsLIN.lnAltura.fef2575cvf) + (lnAge * coefsLIN.lnIdade.fef2575cvf) + (colorCode * coefsLIN.cor.fef2575cvf);
    return { linCVF, linVEF1, linVEF1CVF, linFEF2575, linFEF2575CVF };
};

window.computeDerivedObserved = (obsVEF1, obsCVF, obsFEF2575) => {
    const computedObsVEF1CVF = (obsVEF1 !== null && obsCVF !== null && obsCVF !== 0) ? (obsVEF1 / obsCVF) : null;
    return { computedObsVEF1CVF };
};

window.calculateZScore = (obsVal, prevValRaw, seeVal, isLogTransformed) => {
    if (obsVal === null || isNaN(obsVal) || prevValRaw === null || isNaN(prevValRaw) || seeVal === 0 || isNaN(seeVal)) return null;
    let numerator;
    if (isLogTransformed) {
        if (obsVal <= 0) return null;
        numerator = Math.log(obsVal) - Math.log(prevValRaw);
    } else {
        numerator = obsVal - prevValRaw;
    }
    return numerator / seeVal;
};

window.calculatePercentage = (observed, predicted) => {
    if (observed === null || isNaN(observed) || predicted === null || isNaN(predicted) || predicted === 0) return 'N/A';
    return ((observed / predicted) * 100).toFixed(2);
};

window.calculateDiffPercentOfPredicted = (obsPre, obsPost, predicted) => {
    if (obsPre === null || obsPost === null || isNaN(obsPre) || isNaN(obsPost) || predicted === null || isNaN(predicted) || predicted === 0) return null;
    const absDiff = obsPost - obsPre;
    return (absDiff / predicted) * 100;
};

window.formatValue = (value, decimals = 2) => value === null || isNaN(value) ? 'N/A' : value.toFixed(decimals);

window.generateSingleInterpretation = (obsCVF, linCVF, obsVEF1, linVEF1, computedObsVEF1CVF, linVEF1CVF, zScoreCVF, label, classPreBD = null, obsCVF_pre_param = null, obsVEF1_pre_param = null, prevCVF_param = null, prevVEF1_param = null) => {
    let baseInterpretationText = "";
    let calculatedClassification = "Sem Classificação";

    const isCVFValid = obsCVF !== null && !isNaN(obsCVF);
    const isVEF1Valid = obsVEF1 !== null && !isNaN(obsVEF1);
    const isVEF1CVFValid = computedObsVEF1CVF !== null && !isNaN(computedObsVEF1CVF);
    const isZScoreCVFValid = zScoreCVF !== null && !isNaN(zScoreCVF);

    if (isCVFValid && isVEF1Valid && isVEF1CVFValid) {
        if (obsCVF >= linCVF && obsVEF1 >= linVEF1 && computedObsVEF1CVF >= linVEF1CVF) {
            calculatedClassification = "Normal";
            baseInterpretationText = `Todos os parâmetros (CVF: ${formatValue(obsCVF)} L, VEF1: ${formatValue(obsVEF1)} L, VEF1/CVF: ${formatValue(computedObsVEF1CVF, 3)}) encontram-se dentro dos limites da normalidade. Função pulmonar normal.`;
        } else if (isZScoreCVFValid && zScoreCVF >= 1 && isVEF1Valid && obsVEF1 > linVEF1 && computedObsVEF1CVF < linVEF1CVF) {
            calculatedClassification = "Considerar Disanapsis";
            baseInterpretationText = `CVF com Z-score >= 1 (Z-score CVF: ${formatValue(zScoreCVF, 2)}), VEF1 acima do LIN (${formatValue(obsVEF1)} L), mas a relação VEF1/CVF está reduzida (${formatValue(computedObsVEF1CVF, 3)}). Estes achados podem sugerir disanapsis (desproporção entre o tamanho das vias aéreas e o volume pulmonar). Recomenda-se correlação clínica.`;
        } else if (obsCVF >= linCVF && computedObsVEF1CVF < linVEF1CVF) {
            calculatedClassification = "Obstrutivo";
            baseInterpretationText = `CVF encontra-se dentro da normalidade (${formatValue(obsCVF)} L), mas o índice VEF1/CVF está abaixo do LIN (${formatValue(computedObsVEF1CVF, 3)}). Isto é compatível com um padrão obstrutivo.`;
        } else if (obsCVF < linCVF && isVEF1Valid && obsVEF1 < linVEF1 && computedObsVEF1CVF >= linVEF1CVF) {
            calculatedClassification = "Restritivo";
            baseInterpretationText = `A Capacidade Vital Forçada (CVF: ${formatValue(obsCVF)} L) e o Volume Expiratório Forçado no primeiro segundo (VEF1: ${formatValue(obsVEF1)} L) estão abaixo do LIN, mas o índice VEF1/CVF (${formatValue(computedObsVEF1CVF, 3)}) está dentro da normalidade. Isto sugere um padrão restritivo.`;
        } else if (obsCVF < linCVF && computedObsVEF1CVF < linVEF1CVF) {
            calculatedClassification = "Misto";
            baseInterpretationText = `Tanto o CVF (${formatValue(obsCVF)} L) quanto o índice VEF1/CVF (${formatValue(computedObsVEF1CVF, 3)}) estão abaixo do LIN. Isto indica um padrão misto (obstrutivo e restritivo).`;
        } else {
            baseInterpretationText = "A combinação dos resultados não se enquadra claramente nos padrões definidos acima. Avaliação clínica detalhada é recomendada.";
        }
    } else {
        baseInterpretationText = "Não foi possível classificar devido a dados insuficientes para os parâmetros chave (CVF, VEF1, VEF1/CVF).";
        calculatedClassification = "Dados Insuficientes";
    }

    let postBdSpecificText = "";
    if (label === "Pós-Broncodilatador") {
        let postBdCommentsArray = [];

        if (calculatedClassification === "Normal" && classPreBD !== null && classPreBD !== "Normal") {
            postBdCommentsArray.push("Houve normalização da função pulmonar global após o uso do broncodilatador.");
        }

        if (obsCVF_pre_param !== null && linCVF !== null && obsCVF_pre_param < linCVF && obsCVF !== null && obsCVF >= linCVF) {
            postBdCommentsArray.push("Houve normalização da CVF (que estava reduzida) após o broncodilatador.");
        } else if (obsCVF !== null && linCVF !== null && obsCVF >= linCVF && !(obsCVF_pre_param !== null && obsCVF_pre_param >= linCVF)) {
            postBdCommentsArray.push("A CVF encontra-se dentro dos limites da normalidade após o broncodilatador.");
        }

        let vef1Reversible = false;
        let cvfReversible = false;
        let reversibilityTitle = "Resposta ao broncodilatador:";
        let individualResponseStatements = [];

        if (obsVEF1_pre_param !== null && obsVEF1 !== null && prevVEF1_param !== null && prevVEF1_param !== 0) {
            const varVEF1PercPrev = calculateDiffPercentOfPredicted(obsVEF1_pre_param, obsVEF1, prevVEF1_param);
            if (varVEF1PercPrev !== null) {
                if (varVEF1PercPrev >= 10) {
                    vef1Reversible = true;
                    individualResponseStatements.push(`O VEF1 apresentou resposta significativa (${formatValue(varVEF1PercPrev, 1)}% do previsto).`);
                } else {
                    individualResponseStatements.push(`O VEF1 apresentou variação não significativa de ${formatValue(varVEF1PercPrev, 1)}% do previsto.`);
                }
            }
        }

        if (obsCVF_pre_param !== null && obsCVF !== null && prevCVF_param !== null && prevCVF_param !== 0) {
            const varCVFPercPrev = calculateDiffPercentOfPredicted(obsCVF_pre_param, obsCVF, prevCVF_param);
            if (varCVFPercPrev !== null) {
                let cvfStatementForPush = "";
                if (varCVFPercPrev >= 10) {
                    cvfReversible = true;
                    cvfStatementForPush = `A CVF apresentou resposta significativa (${formatValue(varCVFPercPrev, 1)}% do previsto).`;
                    cvfStatementForPush += " Esta resposta na CVF sugere a presença de aprisionamento aéreo na fase pré-broncodilatador.";
                    if (classPreBD === "Misto") {
                        cvfStatementForPush += " Sendo o padrão Pré-BD classificado como Misto, esta melhora da CVF Pós-BD sugere redução do aprisionamento de ar.";
                    }
                } else {
                    cvfStatementForPush = `A CVF apresentou variação não significativa de ${formatValue(varCVFPercPrev, 1)}% do previsto.`;
                }
                individualResponseStatements.push(cvfStatementForPush);
            }
        }

        if (individualResponseStatements.length > 0) {
            postBdCommentsArray.push(reversibilityTitle + "<br>" + individualResponseStatements.join("<br>"));
        }

        if (postBdCommentsArray.length > 0) {
            postBdSpecificText = "<br><br>" + postBdCommentsArray.join("<br><br>");
        }
    }

    const classificationHTML = `<strong>Classificação (${label}): ${calculatedClassification}</strong><br><br>`;
    return {
        text: classificationHTML + baseInterpretationText + postBdSpecificText,
        classification: calculatedClassification
    };
};

window.generateConclusion = (preClassification, postClassification, vef1ChangePercent, cvfChangePercent) => {
    let conclusion = "";

    if (preClassification === "Normal") {
        conclusion = "Espirometria dentro dos limites da normalidade.";
    } else if (preClassification === "Obstrutivo") {
        conclusion = "Distúrbio ventilatório obstrutivo.";
    } else if (preClassification === "Restritivo") {
        conclusion = "Distúrbio ventilatório restritivo.";
    } else if (preClassification === "Misto") {
        conclusion = "Distúrbio ventilatório misto (obstrutivo e restritivo).";
    } else if (preClassification === "Considerar Disanapsis") {
        conclusion = "Espirometria sugestiva de Disanapsis (desproporção via aérea/parênquima).";
    } else {
        conclusion = "Alterações ventilatórias inespecíficas.";
    }

    if (postClassification) {
        const significantVEF1 = vef1ChangePercent !== null && vef1ChangePercent >= 10;
        const significantCVF = cvfChangePercent !== null && cvfChangePercent >= 10;

        if (significantVEF1 || significantCVF) {
            conclusion += " Resposta significativa ao broncodilatador";
            if (significantVEF1 && significantCVF) conclusion += " (VEF1 e CVF).";
            else if (significantVEF1) conclusion += " (VEF1).";
            else if (significantCVF) conclusion += " (CVF).";

            if (postClassification === "Normal") {
                conclusion += " Normalização completa dos fluxos e volumes após broncodilatador.";
            }
        } else {
            conclusion += " Prova broncodilatadora negativa (sem variação significativa de fluxos ou volumes).";
        }
    }

    return conclusion;
};
