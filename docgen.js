// --- MOVED TO GLOBAL SCOPE ---
// *** THIS FUNCTION HAS BEEN UPDATED to handle "YYYY-MM-DD" ***
function formatDateForDisplay(dateInput) {
     if (!dateInput) return 'N/A';
     let date;
     try {
         // 1. Try our new YYYY-MM-DD format (from GAS fix)
         // This must be the FIRST check.
         if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
             // Parse as UTC to avoid local timezone offset issues
             // "2025-01-17" becomes 2025-01-17T00:00:00.000Z
             date = new Date(dateInput + 'T00:00:00Z');
         }
         // 2. Try full ISO format (e.g., "2023-10-27T10:00:00.000Z")
         else if (typeof dateInput === 'string' && dateInput.includes('T') && dateInput.includes('Z')) {
             date = new Date(dateInput);
         }
         // 3. Try DD/MM/YYYY HH:MM:SS format (old format)
         else if (typeof dateInput === 'string' && dateInput.includes('/') && dateInput.includes(':')) {
             const parts = dateInput.split(' ');
             const dateParts = parts[0].split('/');
             const timeParts = parts.length > 1 ? parts[1].split(':') : ['0', '0', '0'];
             date = new Date(Date.UTC(
                 parseInt(dateParts[2], 10), // year
                 parseInt(dateParts[1], 10) - 1, // monthIndex
                 parseInt(dateParts[0], 10), // day
                 parseInt(timeParts[0], 10) || 0, 
                 parseInt(timeParts[1], 10) || 0, 
                 parseInt(timeParts[2], 10) || 0 
             ));
         }
          // 4. Try number format (Excel Serial Date)
         else if (typeof dateInput === 'number' || (typeof dateInput === 'string' && !isNaN(parseFloat(dateInput)) && isFinite(parseFloat(dateInput)))) {
             const serial = parseFloat(dateInput);
              const utc_days = Math.floor(serial - 25569);
              const utc_value = utc_days * 86400; // seconds
              date = new Date(utc_value * 1000); // milliseconds
         }
         // 5. Try generic parsing as a fallback
         else {
             date = new Date(dateInput);
         }

         if (isNaN(date.getTime())) {
             console.warn("formatDateForDisplay: Invalid date value:", dateInput);
             return 'Invalid Date';
         }
         
         // Use UTC methods to match the UTC parsing
         const year = date.getUTCFullYear();
         const month = String(date.getUTCMonth() + 1).padStart(2, '0');
         const day = String(date.getUTCDate()).padStart(2, '0');
         return `${year}-${month}-${day}`;

     } catch (e) {
         console.error("formatDateForDisplay: Error parsing date:", dateInput, e);
         return 'Error Date';
     }
 }
// ------------------------------

// --- HELPER FUNCTION: Get data for the currently selected shipment ---
function getSelectedShipmentData() {
    // These variables are in the global scope of Shipments.html
    if (typeof currentSelectedRef === 'undefined' || currentSelectedRef === null) {
        alert("Please select a shipment first.");
        return null;
    }

    const order = allOrders.find(o => String(o.REFERANCE) === String(currentSelectedRef));
    if (!order) {
        alert("Could not find data for the selected shipment.");
        return null;
    }

    const cnor = b2b2cDataMap.get(order.CONSIGNOR) || {};
    const cnee = b2b2cDataMap.get(order.CONSIGNEE) || {};
    const trk = trackDataMap.get(order.REFERANCE) || {};
    const logs = logsDataMap.get(order.REFERANCE) || [];
    const prods = productDataMap.get(order.REFERANCE) || [];
    const boxes = multiboxDataMap.get(order.REFERANCE) || [];
    const mode = modeDataMap.get(order.MODE) || 'N/A';
    const cnorBranch = b2b2cDataMap.get(cnor.BRANCH) || {};

    // Get print layout from dropdown
    const layoutSelect = document.getElementById('label-print-layout');
    const printLayout = layoutSelect ? layoutSelect.value : '2up-landscape'; // Default

    return { order, cnor, cnee, trk, logs, prods, boxes, mode, cnorBranch, printLayout };
}


// --- 1. PRINT LABEL ---
function printSelectedShipmentLabel() {
    const data = getSelectedShipmentData();
    if (!data) return;
    
    const { order, cnor, cnee, mode, printLayout } = data;
    const awb = String(order.AWB_NUMBER || 'N/A');
    const ref = String(order.REFERANCE || 'N/A');

    // --- *** DATE FIX *** ---
    // Use the *new* robust date formatter for DD/MM/YYYY format
    const orderDate = formatDateForReceipt(order.ORDER_DATE); 
    
    const cnorAddr = `${cnor.ADDRESS || ''}, ${cnor.CITY || ''}, ${cnor.STATE || ''} - ${cnor.PINCODE || ''}`;
    const cneeAddr = `${cnee.ADDRESS || ''}, ${cnee.CITY || ''}, ${cnee.STATE || ''} - ${cnee.PINCODE || ''}`;
    
    const destCode = (trk.DEST_CODE || 'N/A');
    const pieces = `${order.PIECS || '1'} / ${order.PIECS || '1'}`; // Pcs / Total Pcs
    const weight = `${order.CHG_WT || order.WEIGHT || 0} Kg`;
    const cod = (order.COD && String(order.COD).toUpperCase() !== 'N') ? `COD: ${order.COD}` : '';
    
    // Build the HTML for the label
    const labelContent = buildLabel(awb, ref, orderDate, cnor, cnee, cnorAddr, cneeAddr, destCode, pieces, weight, cod, mode);
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Label</title>');
    printWindow.document.write('<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"><\/script>');
    
    // Add layout-specific styles
    if (printLayout === '4up-portrait') {
        printWindow.document.write(`
            <style>
                @page { size: A4 portrait; margin: 0.5cm; }
                body { margin: 0; padding: 0; display: grid; grid-template-columns: 50% 50%; grid-template-rows: 50% 50%; height: 100vh; box-sizing: border-box; }
                .label-wrapper { width: 100%; height: 100%; border: 1px dashed #999; box-sizing: border-box; page-break-inside: avoid; overflow: hidden; }
            </style>
        `);
    } else { // Default to '2up-landscape'
        printWindow.document.write(`
            <style>
                @page { size: A4 landscape; margin: 0.5cm; }
                body { margin: 0; padding: 0; display: grid; grid-template-columns: 50% 50%; height: 100vh; box-sizing: border-box; }
                .label-wrapper { width: 100%; height: 100%; border: 1px dashed #999; box-sizing: border-box; page-break-inside: avoid; overflow: hidden; }
            </style>
        `);
    }

    printWindow.document.write('</head><body>');
    
    // Write the label content based on layout
    const labelCount = (printLayout === '4up-portrait') ? 4 : 2;
    for (let i = 0; i < labelCount; i++) {
        printWindow.document.write(`<div class="label-wrapper">${labelContent}</div>`);
    }

    printWindow.document.write(`
        <script>
            window.onload = function() {
                try {
                    JsBarcode(".label-barcode", "${awb}", {
                        format: "CODE128", displayValue: false, text: "${awb}",
                        fontSize: 18, margin: 10, height: 60, width: 2.5
                    });
                    JsBarcode(".ref-barcode", "${ref}", {
                        format: "CODE128", displayValue: true, text: "Ref: ${ref}",
                        fontSize: 14, margin: 5, height: 40, width: 2
                    });
                } catch (e) {
                    console.error("Print window JsBarcode error:", e);
                }
                
                setTimeout(function() {
                    window.print();
                    // window.close();
                }, 250);
            };
        <\/script>
    `);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
}

function buildLabel(awb, ref, orderDate, cnor, cnee, cnorAddr, cneeAddr, destCode, pieces, weight, cod, mode) {
    return `
    <div style="font-family: Arial, sans-serif; padding: 10px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; border: 2px solid black; background: white;">
        
        <!-- Top Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid black; padding-bottom: 5px;">
            <div style="flex: 1; text-align: left;">
                <img src="logo.png" alt="Logo" style="height: 40px; width: auto; margin-bottom: 5px;">
                <div style="font-size: 10px; font-weight: bold;">Return Address: ${cnor.NAME || 'N/A'}</div>
                <div style="font-size: 10px;">${cnorAddr}</div>
            </div>
            <div style="flex: 2; text-align: center; padding: 0 10px;">
                <img class="label-barcode" jsbarcode-value="${awb}" style="width: 100%; height: 60px;" />
                <div style="font-size: 12px; font-weight: bold; margin-top: 5px;">AWB: ${awb}</div>
            </div>
            <div style="flex: 1; text-align: right;">
                <div style="font-size: 12px; font-weight: bold;">${orderDate}</div>
                <div style="font-size: 28px; font-weight: bold; margin-top: 10px;">${destCode}</div>
                <div style="font-size: 18px; font-weight: bold; color: white; background: black; padding: 2px 5px; margin-top: 5px; display: inline-block;">${mode}</div>
            </div>
        </div>

        <!-- Middle Section (Consignee) -->
        <div style="border-bottom: 2px solid black; padding: 10px 5px; min-height: 100px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Consignee / Deliver To:</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${cnee.NAME || 'N/A'}</div>
            <div style="font-size: 14px; margin-top: 5px;">${cneeAddr}</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 5px;">Mobile: ${cnee.MOBILE || 'N/A'}</div>
        </div>

        <!-- Bottom Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px;">
            <div style="flex: 1; text-align: left;">
                <div style="font-size: 16px; font-weight: bold;">Pieces: ${pieces}</div>
                <div style="font-size: 16px; font-weight: bold;">Weight: ${weight}</div>
                <div style="font-size: 16px; font-weight: bold; margin-top: 10px;">${cod}</div>
            </div>
            <div style="flex: 1.5; text-align: center;">
                <img class="ref-barcode" jsbarcode-value="${ref}" style="width: 100%; height: 40px;" />
            </div>
        </div>
    </div>
    `;
}


// --- 2. PRINT CHALLAN ---
// (Needs implementation - currently just a placeholder in Shipments.html)
// ...


// --- 3. PRINT RECEIPT ---
function printSelectedShipmentReceipt() {
    const data = getSelectedShipmentData();
    if (!data) return;

    const receiptContent = buildReceipt(data);
    const awb = String(data.order.AWB_NUMBER || 'N/A');

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"><\/script>');
    printWindow.document.write(`
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .receipt-wrapper { 
                width: 700px; 
                margin: 20px auto; 
                padding: 20px; 
                border: 1px solid #ccc; 
                background: #fff; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; }
            .header h1 { margin: 0 0 5px 0; font-size: 24px; }
            .header p { margin: 0; font-size: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-top: 15px; }
            .info-item { font-size: 12px; }
            .info-item strong { display: block; font-size: 10px; color: #555; text-transform: uppercase; margin-bottom: 2px; }
            .barcode-section { text-align: center; padding: 15px 0; border-top: 2px dashed #333; margin-top: 15px; }
            .footer { text-align: center; font-size: 10px; margin-top: 15px; }
            @media print {
                body { background-color: #fff; margin: 0; padding: 0; }
                .receipt-wrapper { 
                    width: 100% !important;
                    max-width: 100% !important; 
                    border: 1px solid #333 !important; 
                    box-shadow: none !important;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box; 
                    page-break-inside: avoid;
                }
            }
        </style>
    `);
    printWindow.document.write('</head><body>');
    
    // Write the Receipt HTML
    printWindow.document.write(receiptContent);

    printWindow.document.write(`
        <script>
            window.onload = function() {
                try {
                    JsBarcode("#receipt-barcode", "${awb}", {
                        format: "CODE128",
                        displayValue: true,
                        text: "${awb}",
                        fontSize: 14,
                        margin: 5,
                        height: 40,
                        width: 2
                    });
                } catch (e) {
                    console.error("Print window JsBarcode error:", e);
                }
                
                setTimeout(function() {
                    window.print();
                    // window.close();
                }, 250);
            };
        <\/script>
    `);

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
}

// *** THIS FUNCTION HAS BEEN UPDATED to handle "YYYY-MM-DD" ***
function formatDateForReceipt(dateString) {
    if (!dateString) return 'N/A';
    try {
        let date;
        // 1. Try our new YYYY-MM-DD format (from GAS fix)
        if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(dateString + 'T00:00:00Z');
        } 
        // 2. Try full ISO format
        else if (typeof dateString === 'string' && dateString.includes('T') && dateString.includes('Z')) {
            date = new Date(dateString);
        } 
        // 3. Fallback for any other format
        else {
            date = new Date(dateString); 
        }

        if (isNaN(date.getTime())) {
            console.warn("formatDateForReceipt: Invalid date:", dateString);
            return 'N/A';
        }
        
        // Use UTC methods to read the date back correctly
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        console.error("formatDateForReceipt error:", e);
        return 'N/A';
    }
}

function buildReceipt(data) {
    const { order, cnor, cnee, mode, cnorBranch } = data;

    // Use the updated, robust date formatter
    const orderDate = formatDateForReceipt(order.ORDER_DATE);
    const transitDate = formatDateForReceipt(order.TRANSIT_DATE);

    const cnorAddr = `${cnor.ADDRESS || ''}, ${cnor.CITY || ''}, ${cnor.STATE || ''} - ${cnor.PINCODE || ''}`;
    const cneeAddr = `${cnee.ADDRESS || ''}, ${cnee.CITY || ''}, ${cnee.STATE || ''} - ${cnee.PINCODE || ''}`;
    const branchAddr = `${cnorBranch.ADDRESS || ''}, ${cnorBranch.CITY || ''}, ${cnorBranch.STATE || ''} - ${cnorBranch.PINCODE || ''}`;

    return `
    <div class="receipt-wrapper">
        <div class="header">
            <h1>${cnorBranch.NAME || 'Postman'}</h1>
            <p>${branchAddr}</p>
            <p><strong>GST:</strong> ${cnorBranch.GST_ID_PAN_ADHAR || 'N/A'} | <strong>Ph:</strong> ${cnorBranch.MOBILE || 'N/A'}</p>
        </div>

        <div style="text-align: center; margin-top: 10px;">
            <h2 style="margin: 0; font-size: 20px;">Booking Receipt</h2>
        </div>

        <div class="info-grid" style="border-bottom: 1px dashed #ccc; padding-bottom: 15px;">
            <div class="info-item"><strong>AWB No:</strong> ${order.AWB_NUMBER || 'N/A'}</div>
            <div class="info-item"><strong>Ref No:</strong> ${order.REFERANCE || 'N/A'}</div>
            <div class="info-item"><strong>Booked On:</strong> ${orderDate}</div>
            <div class="info-item"><strong>Est. Delivery:</strong> ${transitDate}</div>
            <div class="info-item"><strong>Mode:</strong> ${mode}</div>
            <div class="info-item"><strong>Carrier:</strong> ${order.CARRIER || 'N/A'}</div>
        </div>

        <div class="info-grid" style="border-bottom: 1px dashed #ccc; padding-bottom: 15px;">
            <div class="info-item">
                <strong>Consignor:</strong>
                ${cnor.NAME || 'N/A'}<br>
                ${cnorAddr}<br>
                Ph: ${cnor.MOBILE || 'N/A'}
            </div>
            <div class="info-item">
                <strong>Consignee:</strong>
                ${cnee.NAME || 'N/A'}<br>
                ${cneeAddr}<br>
                Ph: ${cnee.MOBILE || 'N/A'}
            </div>
        </div>

        <div class="info-grid">
            <div class="info-item"><strong>Pcs:</strong> ${order.PIECS || 'N/A'}</div>
            <div class="info-item"><strong>Weight (Kg):</strong> ${order.WEIGHT || 'N/A'}</div>
            <div class="info-item"><strong>Chg. Wt (Kg):</strong> ${order.CHG_WT || 'N/A'}</div>
            <div class="info-item"><strong>Inv. Value:</strong> ${order.VALUE || 'N/A'}</div>
            <div class="info-item"><strong>COD:</strong> ${order.COD || 'N/A'}</div>
            <div class="info-item"><strong>ToPay:</strong> ${order.TOPAY || 'N/A'}</div>
        </div>
        
        <div class="barcode-section">
            <svg id="receipt-barcode"></svg>
        </div>

        <div class="footer">
            This is a computer-generated receipt and does not require a signature.
        </div>
    </div>
    `;
}

// --- 4. PRINT POD ---
// (No specific build function, relies on data in Shipments.html)


// --- 5. PRINT OFFICE COPY (NEW) ---
function printSelectedShipmentOfficeCopy() {
    const data = getSelectedShipmentData();
    if (!data) return;

    // We can just re-use the receipt builder
    const officeCopyContent = buildReceipt(data); 
    const awb = String(data.order.AWB_NUMBER || 'N/A');

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Office Copy</title>');
    printWindow.document.write('<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"><\/script>');
    printWindow.document.write(`
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .receipt-wrapper { 
                width: 700px; 
                margin: 20px auto; 
                padding: 20px; 
                border: 1px solid #ccc; 
                background: #fff; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; }
            .header h1 { margin: 0 0 5px 0; font-size: 24px; }
            .header p { margin: 0; font-size: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-top: 15px; }
            .info-item { font-size: 12px; }
            .info-item strong { display: block; font-size: 10px; color: #555; text-transform: uppercase; margin-bottom: 2px; }
            .barcode-section { text-align: center; padding: 15px 0; border-top: 2px dashed #333; margin-top: 15px; }
            .footer { text-align: center; font-size: 10px; margin-top: 15px; }
            @media print {
                body { background-color: #fff; margin: 0; padding: 0; }
                .receipt-wrapper { 
                    width: 100% !important;
                    max-width: 100% !important; 
                    border: 1px solid #333 !important; 
                    box-shadow: none !important;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box; 
                    page-break-inside: avoid;
                }
            }
        </style>
    `);
    printWindow.document.write('</head><body>');
    
    // Write the Office Copy HTML
    printWindow.document.write(officeCopyContent);

    printWindow.document.write(`
        <script>
            window.onload = function() {
                try {
                    JsBarcode("#receipt-barcode", "${awb}", { // ID is still receipt-barcode
                        format: "CODE128",
                        displayValue: true,
                        text: "${awb}",
                        fontSize: 14,
                        margin: 5,
                        height: 40,
                        width: 2
                    });
                } catch (e) {
                    console.error("Print window JsBarcode error (Office Copy):", e);
                }
                
                setTimeout(function() {
                    window.print();
                    // window.close();
                }, 250);
            };
        <\/script>
    `);

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
}
// --- END OF NEW FUNCTION ---
