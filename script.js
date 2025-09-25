let logoDataUrl = '';

// Handle logo upload
document.getElementById('logoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoDataUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Add new item row
function addItem() {
    const itemsList = document.getElementById('itemsList');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Item name" class="item-name">
        <input type="number" placeholder="Qty" class="item-qty" step="1">
        <input type="number" placeholder="Price" class="item-price" step="0.01">
        <button type="button" onclick="removeItem(this)" style="background: #dc3545;">×</button>
    `;
    itemsList.appendChild(newRow);
}

// Remove item row
function removeItem(button) {
    button.parentElement.remove();
}

// Generate receipt
function generateReceipt() {
    const storeName = document.getElementById('storeName').value || 'YOUR STORE';
    const storeAddress = document.getElementById('storeAddress').value || 'Store Address';
    const receiptNumber = document.getElementById('receiptNumber').value || '001';
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    
    // Get all items
    const itemRows = document.querySelectorAll('.item-row');
    const items = [];
    let subtotal = 0;
    
    itemRows.forEach(row => {
        const name = row.querySelector('.item-name').value;
        const qty = parseInt(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        
        if (name && qty > 0 && price > 0) {
            const total = qty * price;
            items.push({ name, qty, price, total });
            subtotal += total;
        }
    });
    
    const tax = subtotal * (taxRate / 100);
    const finalTotal = subtotal + tax;
    const currentDate = new Date().toLocaleString();
    
    // Generate receipt HTML
    const receiptHTML = `
        <div class="receipt-header">
            ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo" class="receipt-logo">` : ''}
            <div class="receipt-store-name">${storeName}</div>
            <div class="receipt-address">${storeAddress.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div class="receipt-info">
            <span>Receipt #: ${receiptNumber}</span>
            <span>${currentDate}</span>
        </div>
        
        <div class="receipt-items">
            ${items.map(item => `
                <div class="receipt-item">
                    <div class="item-details">
                        <div>${item.name}</div>
                        <div>${item.qty} x $${item.price.toFixed(2)}</div>
                    </div>
                    <div class="item-total">$${item.total.toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-totals">
            <div class="receipt-total-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            ${tax > 0 ? `
                <div class="receipt-total-line">
                    <span>Tax (${taxRate}%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="receipt-total-line receipt-final-total">
                <span>TOTAL:</span>
                <span>$${finalTotal.toFixed(2)}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 15px; font-size: 10px;">
            Thank you for your business!
        </div>
    `;
    
    document.getElementById('receipt').innerHTML = receiptHTML;
    document.getElementById('printBtn').style.display = 'block';
}

// Print receipt
function printReceipt() {
    window.print();
}