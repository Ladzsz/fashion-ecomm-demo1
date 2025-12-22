import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const steps = ['Type & Client', 'Measurements Snapshot', 'Fabric & Specs', 'Pricing & Payment'];

const OrderWizard = ({ crmData, updateCrmData, onClose }) => {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState({
    client_id: '', order_type: 'Custom Suit', status: 'Consultation',
    specifications: {}, total_price: 0, deposit_paid: 0, financing_type: 'None', photos: []
  });
  const [notification, setNotification] = useState('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSave = () => {
    const newOrder = {
      ...order,
      order_id: uuidv4(),
      fabric_id: order.fabric_id || null,
      balance_due: order.total_price - order.deposit_paid,
      due_date: new Date().toISOString().split('T')[0],
      photos: order.photos || []
    };
    const newData = { ...crmData, orders: [...crmData.orders, newOrder] };
    updateCrmData(newData);

    // Simulate notification
    if (['First Fitting', 'Ready'].includes(newOrder.status)) {
      setNotification(`Notification: Order ready for ${newOrder.status === 'First Fitting' ? 'fitting' : 'pickup'}!`);
    }
    onClose();
  };

  // Render logic per step (simplified – full form inputs omitted for brevity)
  return (
    <div className="card" style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', zIndex: 1000 }}>
      <h3>Create Order – Step {step + 1}: {steps[step]}</h3>
      {/* Step 0: Client & Type */}
      {step === 0 && (
        <>
          <select onChange={(e) => setOrder({ ...order, client_id: e.target.value })}>
            <option>Select Client</option>
            {crmData.clients.map(c => <option key={c.client_id} value={c.client_id}>{c.first_name} {c.last_name}</option>)}
          </select>
          <select onChange={(e) => setOrder({ ...order, order_type: e.target.value })}>
            <option>Custom Suit</option><option>Custom Shirt</option><option>Alteration</option><option>Accessory</option>
          </select>
        </>
      )}
      {/* Step 1: Snapshot measurements from client */}
      {step === 1 && order.client_id && (
        <p>Measurements snapshot taken from client profile.</p>
      )}
      {/* Step 2: Fabric & Specs */}
      {step === 2 && (
        <>
          <select onChange={(e) => setOrder({ ...order, fabric_id: e.target.value })}>
            {crmData.fabrics.map(f => <option key={f.fabric_id} value={f.fabric_id}>{f.name}</option>)}
          </select>
          <textarea placeholder="Specifications (JSON)" onChange={(e) => setOrder({ ...order, specifications: JSON.parse(e.target.value || '{}') })} />
        </>
      )}
      {/* Step 3: Pricing */}
      {step === 3 && (
        <>
          <input type="number" placeholder="Total Price" onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })} />
          <input type="number" placeholder="Deposit Paid" onChange={(e) => setOrder({ ...order, deposit_paid: Number(e.target.value) })} />
          <input placeholder="Photo URLs (comma separated)" onChange={(e) => setOrder({ ...order, photos: e.target.value.split(',') })} />
        </>
      )}
      <div>
        {step > 0 && <button onClick={prevStep}>Back</button>}
        {step < steps.length - 1 && <button onClick={nextStep} className="btn-primary">Next</button>}
        {step === steps.length - 1 && <button onClick={handleSave} className="btn-primary">Create Order</button>}
        <button onClick={onClose}>Cancel</button>
      </div>
      {notification && <p style={{ color: 'green' }}>{notification}</p>}
    </div>
  );
};

export default OrderWizard;