/**
 * Calculates the freight charge based on various rate parameters.
 * @param {string} transportType - The selected mode of transport (e.g., 'E', 'P').
 * @param {number} rate - The base rate for the zone.
 * @param {number} addRate - The additional rate for weight increments.
 * @param {number} weightCeiling - The calculated weight ceiling.
 * @param {number} weightZone - The determined weight zone.
 * @returns {number} The calculated freight cost.
 */
function calculateFreight(transportType, rate, addRate, weightCeiling, weightZone) {
    if (isNaN(rate) || isNaN(weightCeiling)) return 0;

    let freight = 0;
    const selectedMode = transportType;

    if (selectedMode === 'E' || selectedMode === 'P') {
        if (!isNaN(addRate)) {
            freight = rate + ((weightCeiling * 2) - 1) * addRate;
        } else {
            freight = rate;
        }
    } else {
        if (!isNaN(addRate) && !isNaN(weightZone)) {
            const weightDiv = weightCeiling - weightZone;
            freight = rate + (weightDiv * addRate);
        } else {
            freight = weightCeiling * rate;
        }
    }
    return freight > 0 ? freight : 0;
}

/**
 * Determines helper data for rate calculation (weight ceiling, zone, rate UID, etc.).
 * @param {number} chgWt - The chargeable weight.
 * @param {object} selectedCustomerDetails - Details of the selected customer.
 * @param {string} transportType - The selected mode of transport.
 * @param {string} receiverZone - The zone of the receiver.
 * @param {Array} ratesData - The array of rate objects.
 * @returns {object} An object containing all helper data for display.
 */
function getHelperTableData(chgWt, selectedCustomerDetails, transportType, receiverZone, ratesData) {
    let weightCeiling = 0;
    const weightChange = parseFloat(selectedCustomerDetails.WEIGHT_CHANGE);

    // --- THIS IS THE UPDATED LOGIC BLOCK ---
    if (!isNaN(weightChange) && chgWt <= weightChange) {
        // CONDITION 1: weightChange is valid AND chgWt is LESS than or EQUAL to it.
        // Rounds the weight up to the nearest 0.5 kg.
        weightCeiling = Math.ceil(chgWt * 2) / 2;
    } else {
        // CONDITION 2: weightChange is valid AND chgWt is GREATER than it.
        // OR FALLBACK: weightChange is NOT a valid number (isNaN).
        // Rounds the weight up to the next whole integer.
        weightCeiling = Math.ceil(chgWt);
    }
    // --- END OF UPDATED LOGIC BLOCK ---

    let weightZone = '---';
    if (transportType) {
        if (transportType === 'E' || transportType === 'P') {
            weightZone = 0.5;
        } else {
            const zoneThresholds = [3, 10, 25, 50, 100, 500, 1000];
            let calculatedZone = 0;
            for (const threshold of zoneThresholds) {
                if (weightCeiling >= threshold) calculatedZone = threshold;
                else break;
            }
            weightZone = calculatedZone;
        }
    }

    let rateUid = '---';
    const customerCode = selectedCustomerDetails.CODE;
    if (customerCode && transportType && weightZone !== '---') {
        rateUid = `${customerCode}${transportType}${weightZone}`;
    }

    let rate = '---', addRate = '---';
    if (rateUid !== '---' && receiverZone && ratesData) {
        const rateRow = ratesData.find(r => r.UID === rateUid);
        if (rateRow && rateRow[receiverZone]) rate = rateRow[receiverZone];
        const addRateUid = `${rateUid}A`;
        const addRateRow = ratesData.find(r => r.UID === addRateUid);
        if (addRateRow && addRateRow[receiverZone]) addRate = addRateRow[receiverZone];
    }

    return {
        weight_ceiling: weightCeiling, // Returns a number
        weight_zone: weightZone,
        rate_uid: rateUid,
        rate: rate,
        add_rate: addRate
    };
}

/**
 * Calculates all additional charges, taxes, and the final total.
 * @param {number} freightValue - The base freight value.
 * @param {object} summaryTotals - Object containing total amount.
 * @param {object} selectedCustomerDetails - Details of the selected customer.
 * @param {object} paymentCheckboxes - Object with the state of payment checkboxes.
 * @param {Array} consignmentProducts - Array of product objects.
 * @param {number} chgWt - The chargeable weight.
 * @returns {object} An object containing all calculated charge values.
 */
function calculateAllCharges(freightValue, summaryTotals, selectedCustomerDetails, paymentCheckboxes, consignmentProducts, chgWt) {
    const totalValue = summaryTotals.totalAmount;
    
    const codCheckbox = paymentCheckboxes.cod;
    const topayCheckbox = paymentCheckboxes.topay;
    const fovCheckbox = paymentCheckboxes.fov;
    
    let codCharge = 0, topayCharge = 0, fovCharge = 0, awbCharge = 0, fuelCharge = 0, ewayCharge = 0, packCharge = 0, devCharge = 0;

    if(Object.keys(selectedCustomerDetails).length > 0){
        if (codCheckbox.checked && selectedCustomerDetails['%_COD_IF']) {
            const rate = parseFloat(selectedCustomerDetails['%_COD_IF']);
            codCharge = Math.max(150, totalValue * rate);
        }
        if (topayCheckbox.checked && selectedCustomerDetails['%_TOPAY_IF']) {
            const rate = parseFloat(selectedCustomerDetails['%_TOPAY_IF']);
            topayCharge = Math.max(150, freightValue * rate);
        }
        if (fovCheckbox.checked && selectedCustomerDetails['%_FOV_IF']) {
            const rate = parseFloat(selectedCustomerDetails['%_FOV_IF']);
            fovCharge = Math.max(100, totalValue * rate);
        }
        awbCharge = parseFloat(selectedCustomerDetails['AWB_CHARGES']) || 0;
        fuelCharge = freightValue * (parseFloat(selectedCustomerDetails['FUEL_CHARGES']) || 0);
        const ewayCount = consignmentProducts.filter(p => p.ewayBill).length;
        ewayCharge = ewayCount * (parseFloat(selectedCustomerDetails['EWAY_IF']) || 0);
        packCharge = chgWt * (parseFloat(selectedCustomerDetails['PACKING_CHARGES']) || 0);
        devCharge = freightValue * (parseFloat(selectedCustomerDetails['DEV_CHARGES']) || 0);
    }
    
    const otherCharges = fuelCharge + codCharge + topayCharge + fovCharge + ewayCharge + awbCharge + packCharge + devCharge;

    const subtotal = freightValue + otherCharges;
    let taxableAmount = 0, sgst = 0, cgst = 0, igst = 0, total = 0;

    if (selectedCustomerDetails.GST_INC === 'Y') {
        taxableAmount = subtotal;
        if (selectedCustomerDetails.BILLING_STATE === 'Uttarakhand-05') {
            const totalTax = taxableAmount / 1.18 * 0.18;
            sgst = totalTax / 2;
            cgst = totalTax / 2;
        } else {
            igst = taxableAmount / 1.18 * 0.18;
        }
        total = taxableAmount;
    } else {
        taxableAmount = subtotal;
        if (selectedCustomerDetails.BILLING_STATE === 'Uttarakhand-05') {
            sgst = taxableAmount * 0.09;
            cgst = taxableAmount * 0.09;
        } else {
            igst = taxableAmount * 0.18;
        }
        total = taxableAmount + sgst + cgst + igst;
    }
    const totalGst = sgst + cgst + igst;

    // Returns raw numbers for calculations
    return {
        freight: freightValue,
        other_chg: otherCharges,
        gst_total: totalGst,
        total: total,
        fuel_chg: fuelCharge,
        cod_chg: codCharge,
        topay_chg: topayCharge,
        fov_chg: fovCharge,
        eway_chg: ewayCharge,
        awb_chg: awbCharge,
        pack_chg: packCharge,
        dev_chg: devCharge,
        taxable: taxableAmount,
        sgst: sgst,
        cgst: cgst,
        igst: igst
    };
}

/**
 * Recalculates weights for all boxes in the consignment.
 * @param {Array} consignmentBoxes - The array of box objects.
 * @param {number} volIngr - The volumetric ingredient/divisor for the current mode.
 * @returns {Array} The updated array of box objects.
 */
function recalculateAllBoxWeights(consignmentBoxes, volIngr) {
    const volDivisor = volIngr || 4700;
    
    // Returns a NEW array instead of modifying the original
    return consignmentBoxes.map(box => {
        const volWeight = (box.length * box.breadth * box.height) / volDivisor;
        const chargeWeight = Math.max(box.actualWeight, volWeight);
        
        // Creates a new box object with the new properties
        return {
            ...box,
            volWeight: volWeight,
            chargeWeight: chargeWeight
        };
    });
}
