/**
 * docgen.js
 * * Contains all functions responsible for generating, rendering, and printing
 * the various shipment documents (Label, Receipt, POD, Challan, Office Copy).
 * * IMPORTANT: These functions rely on the following global variables being
 * defined and populated in the main script (shipment_test.html or data.js):
 * - JsBarcode (from CDN)
 * - ui (The DOM element map)
 * - allOrders
 * - b2b2cDataMap, productDataMap, multiboxDataMap, trackDataMap, modeDataMap
 */

// Placeholder function for external use (e.g., from the shipment list)
function generateDocument(docType, reference) {
    console.log(`Called generateDocument:`);
    console.log(`  Document Type: ${docType}`);
    console.log(`  Reference: ${reference}`);
    
    // Scroll to the specific document section
    const sectionId = `doc-section-${docType.toLowerCase()}`;
    const section = document.getElementById(sectionId);
    if (section) {
        // Open the details section if it's closed
        if (!section.hasAttribute('open')) {
            section.setAttribute('open', '');
        }
        // Scroll to it
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.warn(`Section ${sectionId} not found. Falling back to re-render.`);
        // Fallback: re-select the shipment to render everything
        const order = allOrders.find(o => o.REFERANCE === reference);
        if(order) {
            renderDocumentWorkshop(order); 
        }
    }

    // Return false to prevent the <a> tag from navigating
    return false;
}


function formatDateForDisplay(dateInput) {
    if (!dateInput) return 'N/A';
    let date;
    try {
        // 1. Try DD/MM/YYYY HH:MM:SS format
        if (typeof dateInput === 'string' && dateInput.includes('/') && dateInput.includes(':')) {
            const parts = dateInput.split(' ');
            const dateParts = parts[0].split('/');
            const timeParts = parts.length > 1 ? parts[1].split(':') : ['0', '0', '0'];
            date = new Date(Date.UTC(
                parseInt(dateParts[2], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0], 10),
                parseInt(timeParts[0], 10) || 0, parseInt(timeParts[1], 10) || 0, parseInt(timeParts[2], 10) || 0
            ));
        }
        // 2. Try ISO format (already UTC)
        else if (typeof dateInput === 'string' && dateInput.includes('T') && dateInput.includes('Z')) {
            date = new Date(dateInput);
        }
         // 3. Try number format (Excel Serial Date)
        else if (typeof dateInput === 'number' || (typeof dateInput === 'string' && !isNaN(parseFloat(dateInput)) && isFinite(parseFloat(dateInput)))) {
            const serial = parseFloat(dateInput);
             const utc_days = Math.floor(serial - 25569);
             const utc_value = utc_days * 86400; 
             date = new Date(utc_value * 1000); 
        }
        // 4. Try generic parsing (might be local time, fallback)
        else {
            date = new Date(dateInput);
        }

        if (isNaN(date.getTime())) {
            console.warn("formatDateForDisplay: Invalid date value:", dateInput);
            return 'Invalid Date';
        }
        
        // Format to DD-MM-YYYY
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    } catch (e) {
        console.error("formatDateForDisplay: Error parsing date:", dateInput, e);
        return 'Error Date';
    }
}


function renderDocumentWorkshop(order) {
    // We still have access to all the data, e.g.:
    const ref = order.REFERANCE;
    const cnor = b2b2cDataMap.get(order.CONSIGNOR);
    const cnee = b2b2cDataMap.get(order.CONSIGNEE);
    const products = productDataMap.get(ref) || [];
    const multiboxItems = multiboxDataMap.get(ref) || []; 
    const tracking = trackDataMap.get(ref);
    const pieces = order.PIECS || 1;
    
    let workshopContent = `
        <div class="space-y-4">
            <!-- Section 1: RECIEPT -->
            <details class="doc-section" id="doc-section-reciept">
                <summary>RECIEPT</summary>
                <div class="doc-section-content">
                    ${buildReceipt(order, cnor, cnee, products, tracking)}
                </div>
            </details>

            <!-- Section 2: LABLE -->
            <details class="doc-section" id="doc-section-lable" open>
                <summary>LABLE</summary>
                <div class="doc-section-content">
                    <!-- Print Button -->
                    <div class="flex justify-end mb-4">
                        <button onclick="printLabel(${pieces})" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8a2 2 0 01-2-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 01-2 2z"></path></svg>
                            Print Label
                        </button>
                    </div>
                    <!-- End Print Button -->

                    ${buildLabel(order, cnor, cnee, products, multiboxItems)}
                </div>
            </details>

            <!-- Section 3: POD -->
            <details class="doc-section" id="doc-section-pod">
                <summary>POD</summary>
                <div class="doc-section-content">
                    ${buildPOD(order, cnor, cnee, products, tracking)}
                </div>
            </details>

            <!-- Section 4: CHALLAN -->
            <details class="doc-section" id="doc-section-challan">
                <summary>CHALLAN</summary>
                <div class="doc-section-content">
                    ${buildChallan(order, cnor, cnee, products, tracking)}
                </div>
            </details>

            <!-- Section 5: OFFICE COPY -->
            <details class="doc-section" id="doc-section-office_copy">
                <summary>OFFICE COPY</summary>
                <div class="doc-section-content">
                    ${buildOfficeCopy(order, cnor, cnee, products, tracking)}
                </div>
            </details>
        </div>
    `;
    
    ui.documentWorkshop.innerHTML = `
        <div class="flex justify-between items-center mb-4">
             <h2 class="text-xl font-bold text-gray-800">Document Workshop: ${ref}</h2>
        </div>
        ${workshopContent}
    `;

    // Call JsBarcode AFTER setting innerHTML
    const awbForBarcode = order.AWB_NUMBER || order.REFERANCE;
    if (awbForBarcode) {
        try {
            JsBarcode("#shipping-barcode", awbForBarcode, {
                format: "CODE128",
                displayValue: false,
                text: awbForBarcode,
                fontSize: 16,
                margin: 10,
                height: 70,
                width: 3
            });
        } catch (e) {
            console.error("JsBarcode error:", e);
            const barcodeEl = document.getElementById('shipping-barcode-container');
            if(barcodeEl) barcodeEl.innerHTML = `<div class="text-red-500 text-xs">Error generating barcode.</div>`;
        }
    }
}


function buildLabel(order, cnor, cnee, products, multiboxItems) {
    const orderDate = formatDateForDisplay(order.ORDER_DATE);
    const ref = order.REFERANCE || 'N/A';
    const awb = order.AWB_NUMBER || ref;
    
    const cnorName = cnor?.NAME || 'N/A';
    const cnorAddress = `${cnor?.ADDRESS || ''}, ${cnor?.CITY || ''}, ${cnor?.STATE || ''} - ${cnor?.PINCODE || ''}`;
    
    const cneeName = cnee?.NAME || 'N/A';
    const cneeAddress = `${cnee?.ADDRESS || ''}, ${cnee?.CITY || ''}, ${cnee?.STATE || ''}, ${cnee?.PINCODE || ''}`;
    const cneeMobile = cnee?.MOBILE || 'N/A';
    const cneePincode = cnee?.PINCODE || 'N/A';
    const cneeCity = cnee?.CITY || 'N/A';

    let paymentMode = "PREPAID";
    let orderValue = 'N/A';
    if (order.COD && parseFloat(order.COD) > 0) {
        paymentMode = "COD";
        orderValue = parseFloat(order.COD).toFixed(2);
    } else if (order.TOPAY && parseFloat(order.TOPAY) > 0) {
        paymentMode = "TO PAY";
        orderValue = parseFloat(order.TOPAY).toFixed(2);
    }
    
    const weight = order.WEIGHT || '0.50';
    const pieces = order.PIECS || 1;
    const productDesc = (products.length > 0 && products[0].PRODUCT) ? products[0].PRODUCT : 'N/A';
    const carrierName = order.CARRIER || 'CARRIER';

    const modeShort = order.MODE || 'N/A';
    const modeName = modeDataMap.get(modeShort) || modeShort;

    // --- Build Multibox/Summary Table ---
    let summaryTableHtml = '';
    
    if (multiboxItems && multiboxItems.length > 0) {
        summaryTableHtml = `
            <table class="label-table">
                <thead>
                    <tr>
                        <th>BOX#</th>
                        <th>WEIGHT</th>
                        <th>L*B*H</th>
                        <th>CHG WT</th>
                    </tr>
                </thead>
                <tbody>
        `;
        multiboxItems.forEach((box, index) => {
            const L = box.LENGTH || box.L || 'N/A';
            const B = box.BREADTH || box.B || 'N/A';
            const H = box.HEIGHT || box.H || box.HEG || box.HIGHT || 'N/A';
            
            let chgWtDisplay = 'N/A';
            const chgWtVal = box.CHG_WT;
            if (chgWtVal && !isNaN(parseFloat(chgWtVal))) {
                chgWtDisplay = parseFloat(chgWtVal).toFixed(2);
            }
            
            summaryTableHtml += `
                <tr>
                    <td>${box.BOX_NO || (index + 1)}</td>
                    <td>${box.WEIGHT || box.WT || 'N/A'}</td>
                    <td>${L}*${B}*${H}</td>
                    <td>${chgWtDisplay}</td>
                </tr>
            `;
        });
        summaryTableHtml += `
                </tbody>
            </table>
        `;
    } else {
        // Default summary row if not multibox
        summaryTableHtml = `
            <table class="label-table">
                <thead>
                    <tr>
                        <th>Order Value (INR)</th>
                        <th>Weight (KGs)</th>
                        <th>Dimension</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${orderValue}</td>
                        <td>${weight}</td>
                        <td>N/A</td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    // --- Build Product Table ---
    let productTableHtml = `
        <table class="label-table" style="margin-top: -1px;">
            <thead>
                <tr>
                    <th>PRODUCT</th>
                    <th>DOC#</th>
                    <th>EWAY</th>
                    <th>AMT</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    if (products && products.length > 0) {
        products.forEach((p) => {
            const docNo = p.DOC_NO || p.DOCNO || p.DOC || p.DOC_NUMBER || 'N/A';
            const eway = p.EWAY || p.EWAY_NO || p.EWAYBILLNO || p.EWAY_IF || 'N/A';
            const amt = p.AMT || p.AMOUNT || 'N/A';

            productTableHtml += `
                <tr>
                    <td>${p.PRODUCT || 'N/A'}</td>
                    <td>${docNo}</td>
                    <td>${eway}</td>
                    <td>${amt}</td>
                </tr>
            `;
        });
    } else {
        // Fallback to order-level info if no product data
        productTableHtml += `
            <tr>
                <td>${productDesc}</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
            </tr>
        `;
    }
    
    productTableHtml += `
            </tbody>
        </table>
    `;


    // Self-contained styles for the new label.
    const styles = `
        <style>
            .label-wrapper {
                border: 1px solid #000;
                width: 100%;
                max-width: 42rem;
                margin: 0 auto;
                font-family: 'Arial', sans-serif;
                background: #fff;
                color: #000;
                font-size: 12px;
                line-height: 1.4;
            }
            .label-row {
                display: flex;
                border-bottom: 1px solid #000;
            }
            .label-row:last-child {
                border-bottom: none;
            }
            .label-cell {
                padding: 6px 8px;
                border-right: 1px solid #000;
                width: 100%;
                box-sizing: border-box;
            }
            .label-cell:last-child {
                border-right: none;
            }
            /* Flex utils */
            .flex-1 { flex: 1; }
            .flex-2 { flex: 2; }
            .flex-3 { flex: 3; }
            .w-1-3 { width: 33.33%; }
            .w-2-3 { width: 66.66%; }
            .w-1-2 { width: 50%; }
            
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .font-xl { font-size: 20px; }
            .font-xxl { font-size: 28px; font-weight: bold; line-height: 1.2; }
            
            .label-header-sm {
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 2px;
            }
            .label-logo {
                font-size: 24px;
                font-weight: bold;
                color: #000;
                text-transform: uppercase; 
            }
            .barcode-container {
                text-align: center;
                padding: 10px 20px;
            }
            .barcode-container svg {
                width: 100%;
                height: auto;
            }
            .barcode-number {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                letter-spacing: 2px;
                margin-top: 4px;
            }
            .consignee-details {
                font-size: 14px;
                line-height: 1.5;
            }
            .consignee-details strong {
                font-size: 16px;
            }
            .label-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
            }
            .label-table th, .label-table td {
                border-top: 1px solid #000;
                border-right: 1px solid #000;
                padding: 6px 8px;
                text-align: left;
            }
            .label-table th:last-child, .label-table td:last-child {
                border-right: none;
            }
            .label-table th {
                font-weight: bold;
                background-color: #f4f4f4;
            }
        </style>
    `;
    
    // HTML structure for the new label
    return `
        ${styles}
        <div class="label-wrapper">
            <!-- Row 1: Logo, Info, Payment -->
            <div class="label-row">
                <div class="label-cell w-1-3">
                    <div class="label-logo">${carrierName}</div>
                </div>
                <div class="label-cell w-1-3">
                    Date: <strong>${orderDate}</strong><br>
                    <span class="font-bold" style="font-size: 18px;">${paymentMode}</span>
                </div>
                <div class="label-cell w-1-3">
                    <div class="label-logo">PCS: ${pieces}</div>
                </div>
            </div>

            <!-- Row 2: Category, Order ID -->
            <div class="label-row">
                <div class="label-cell w-1-2">
                    Mode: <strong>${modeName}</strong>
                </div>
                <div class="label-cell w-1-2">
                    Ref No: <strong>${ref}</strong>
                </div>
            </div>
            
            <!-- Row 3: Barcode -->
            <div class="label-row">
                <div class="label-cell">
                    <div class="barcode-container" id="shipping-barcode-container">
                        <svg id="shipping-barcode"></svg>
                    </div>
                    <div class="barcode-number">${awb}</div>
                </div>
            </div>

            <!-- Row 4: Destination -->
            <div class="label-row">
                <div class="label-cell w-1-2">
                    <div class="label-header-sm">Destination Pincode</div>
                    <div class="font-xxl">${cneePincode}</div>
                </div>
                <div class="label-cell w-1-2">
                    <div class="label-header-sm">Destination</div>
                    <div class="font-xxl">${cneeCity}</div>
                </div>
            </div>

            <!-- Row 5: Consignee -->
            <div class="label-row">
                <div class="label-cell consignee-details">
                    <strong>Ship To:</strong><br>
                    <strong style="font-size: 16px;">${cneeName}</strong><br>
                    ${cneeAddress}<br>
                    Contact No: <strong>${cneeMobile}</strong>
                </div>
            </div>

            <!-- Row 6: Details Table -->
            <div class="label-row">
                <div class="label-cell" style="padding: 0;">
                    ${summaryTableHtml}
                    ${productTableHtml}
                </div>
            </div>

            <!-- Row 7: Return Address -->
            <div class="label-row">
                <div class="label-cell">
                    Return Address:<br>
                    <strong>${cnorName},</strong> ${cnorAddress}
                </div>
            </div>

        </div>
    `;
}


function buildReceipt(order, cnor, cnee, products, tracking) {
    // This is a placeholder for a full receipt
    return `<div class="p-4 border rounded-md bg-gray-50 text-gray-700">
                <h3 class="font-bold text-lg mb-2">Shipment Receipt</h3>
                <p><strong>AWB:</strong> ${order.AWB_NUMBER || 'N/A'}</p>
                <p><strong>Reference:</strong> ${order.REFERANCE || 'N/A'}</p>
                <p><strong>From:</strong> ${cnor?.NAME || 'N/A'}</p>
                <p><strong>To:</strong> ${cnee?.NAME || 'N/A'}</p>
                <p class="mt-4 text-sm text-gray-500">(Full receipt template to be built here)</p>
           </div>`;
}

function buildPOD(order, cnor, cnee, products, tracking) {
     // Check if tracking status is delivered
     const deliveryDate = (tracking && tracking.STATUS && tracking.STATUS.toUpperCase() === 'DELIVERED') 
                        ? formatDateForDisplay(tracking.DATE) 
                        : 'N/A (Not Delivered)';

    // This is a placeholder for Proof of Delivery
    return `<div class="p-4 border rounded-md bg-gray-50 text-gray-700">
                <h3 class="font-bold text-lg mb-2">Proof of Delivery (POD)</h3>
                <p><strong>AWB:</strong> ${order.AWB_NUMBER || 'N/A'}</p>
                <p><strong>Reference:</strong> ${order.REFERANCE || 'N/A'}</p>
                <p><strong>Receiver:</strong> ${cnee?.NAME || 'N/A'}</p>
                <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
                <p class="mt-4 text-sm text-gray-500">(Full POD template to be built here)</p>
           </div>`;
}

function buildChallan(order, cnor, cnee, products, tracking) {
    let productList = products.map(p => `<li>${p.PRODUCT || 'N/A'} (Qty: ${p.QTY || 1})</li>`).join('');
    if (!productList) productList = '<li>No product details available.</li>';

    // This is a placeholder for the Delivery Challan
    return `<div class="p-4 border rounded-md bg-gray-50 text-gray-700">
                <h3 class="font-bold text-lg mb-2">Delivery Challan</h3>
                <p><strong>From:</strong> ${cnor?.NAME || 'N/A'}</p>
                <p><strong>To:</strong> ${cnee?.NAME || 'N/A'}</p>
                <p class="mt-2 font-semibold">Products:</p>
                <ul class="list-disc list-inside text-sm">${productList}</ul>
                <p class="mt-4 text-sm text-gray-500">(Full challan template to be built here)</p>
           </div>`;
}

function buildOfficeCopy(order, cnor, cnee, products, tracking) {
    // This is a placeholder for the Office Copy
    return `<div class="p-4 border rounded-md bg-gray-50 text-gray-700">
                <h3 class="font-bold text-lg mb-2">Office Copy</h3>
                <p><strong>AWB:</strong> ${order.AWB_NUMBER || 'N/A'}</p>
                <p><strong>Reference:</strong> ${order.REFERANCE || 'N/A'}</p>
                <p><strong>Carrier:</strong> ${order.CARRIER || 'N/A'}</p>
                <p><strong>Date:</strong> ${formatDateForDisplay(order.ORDER_DATE)}</p>
                <p class="mt-4 text-sm text-gray-500">(Full office copy template to be built here)</p>
           </div>`;
}


function printLabel(pieces) {
    const labelSection = document.getElementById('doc-section-lable').querySelector('.doc-section-content');
    if (!labelSection) {
        console.error('Could not find label content to print.');
        return;
    }

    const labelStyles = labelSection.querySelector('style');
    const labelHtml = labelSection.querySelector('.label-wrapper');

    if (!labelStyles || !labelHtml) {
        console.error('Label content is missing styles or wrapper.');
        return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Label</title>');
    
    // Write the self-contained styles from buildLabel
    printWindow.document.write(labelStyles.outerHTML);
    
    // Add print-specific overrides for landscape A4, 2-up printing
    printWindow.document.write(`
        <style>
            @page {
                size: A4 landscape;
                margin: 5mm;
            }
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
            }
            /* Flex container for side-by-side labels */
            body {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                align-items: flex-start;
                align-content: flex-start;
                gap: 10px;
            }
            .label-wrapper { 
                /* Set to ~A5 width in landscape, and add border back */
                width: 49%;
                max-width: 49% !important; 
                border: 1px solid #000 !important;
                box-shadow: none !important;
                margin: 0;
                padding: 0;
                box-sizing: border-box; 
                page-break-inside: avoid;

                /* CRITICAL FIX: Set exact height to 200mm as requested */
                height: 200mm !important; 
                
                /* Added to ensure content sticks to top and bottom */
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                overflow: hidden;
            }

            /* Make the last row stick to the bottom (Return Address) */
            .label-wrapper .label-row:last-child {
                margin-top: auto;
                border-bottom: none !important;
            }
            /* Make the Consignee section (Row 5) fill middle space, if possible */
            .label-wrapper .label-row:nth-of-type(5) { 
                flex-grow: 1;
            }
            /* Ensure tables section (Row 6) does not get shrunk */
            .label-wrapper .label-row:nth-of-type(6) {
                flex-shrink: 0;
            }
        </style>
    `);
    printWindow.document.write('</head><body>');
    
    // Write the label content (pieces + 1) times
    const totalLabels = (pieces || 1) + 1;
    for (let i = 0; i < totalLabels; i++) {
        printWindow.document.write(labelHtml.outerHTML);
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    // Use a small delay to ensure content is loaded before printing
    setTimeout(() => {
        try {
            printWindow.print();
        } catch (e) {
            console.error("Print failed:", e);
        }
    }, 250);
}
