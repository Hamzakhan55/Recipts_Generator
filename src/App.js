import React, { useState } from 'react';

function App() {
  const [logo, setLogo] = useState('');
  const [storeInfo, setStoreInfo] = useState({
    name: 'CITY MALL',
    address: 'PANJAGUTTA, HYDERABAD ROAD, DAAB',
    phone: 'CONTACT: 040-23456789',
    gst: 'GSTIN: 36AABCU9603R1ZM'
  });
  const [items, setItems] = useState([
    { name: 'SAMPLE ITEM', qty: 1, rate: 100.00, amount: 100.00 }
  ]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'qty' || field === 'rate') {
      newItems[index].amount = newItems[index].qty * newItems[index].rate;
    }
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (itemList) => {
    const subtotal = itemList.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    setTotals({ subtotal, discount: 0, tax, total });
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Form Section */}
      <div className="w-1/2 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Receipt Generator</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Store Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Store Name</label>
          <input 
            type="text" 
            value={storeInfo.name}
            onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Address</label>
          <input 
            type="text" 
            value={storeInfo.address}
            onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="flex-1 p-2 border rounded text-sm"
              />
              <input 
                type="number" 
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                className="w-16 p-2 border rounded text-sm"
              />
              <input 
                type="number" 
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                className="w-20 p-2 border rounded text-sm"
              />
            </div>
          ))}
          <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded text-sm">Add Item</button>
        </div>

        <button onClick={printReceipt} className="bg-green-500 text-white px-6 py-3 rounded font-semibold">Print Receipt</button>
      </div>

      {/* Receipt Preview */}
      <div className="w-1/2 p-6">
        <div id="receipt" className="receipt-paper bg-white mx-auto" style={{width: '80mm', fontFamily: 'Arial, Helvetica, sans-serif'}}>
          {/* Header */}
          <div className="text-center border-b border-dashed border-black pb-2 mb-2">
            {logo && <img src={logo} alt="Logo" className="w-40 h-40 mx-auto mb-2 object-contain" />}
            <div className="font-bold text-sm">{storeInfo.name}</div>
            <div className="text-xs leading-tight">{storeInfo.address}</div>
            <div className="text-xs">{storeInfo.phone}</div>
            <div className="text-xs">{storeInfo.gst}</div>
          </div>

          {/* Receipt Info */}
          <div className="flex justify-between text-xs mb-2">
            <span>BILL NO: 001</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-xs mb-3">
            <span>CASHIER: ADMIN</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>

          {/* Items Header */}
          <div className="border-b border-dashed border-black pb-1 mb-2">
            <div className="flex justify-between text-xs font-bold">
              <span>ITEM</span>
              <span>QTY</span>
              <span>RATE</span>
              <span>AMT</span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-3">
            {items.map((item, index) => (
              <div key={index} className="mb-1">
                <div className="text-xs font-semibold">{item.name}</div>
                <div className="flex justify-between text-xs">
                  <span></span>
                  <span>{item.qty}</span>
                  <span>{item.rate.toFixed(2)}</span>
                  <span>{item.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-black pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>TOTAL BILL:</span>
              <span>{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span>GST TOTAL:</span>
              <span>{totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-solid border-black pt-1">
              <span>NET TOTAL:</span>
              <span>{totals.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs mt-4 border-t border-dashed border-black pt-2">
            <div>THANK YOU FOR SHOPPING</div>
            <div>VISIT AGAIN</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * { visibility: hidden; }
          #receipt, #receipt * { visibility: visible; }
          #receipt { position: absolute; left: 0; top: 0; width: 80mm !important; }
          .receipt-paper { box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default App;