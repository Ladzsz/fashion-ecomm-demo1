import React from 'react';
import { useParams } from 'react-router-dom';

const ClientProfile = ({ crmData }) => {
  const { id } = useParams();
  const client = crmData.clients.find(c => c.client_id === id);
  if (!client) return <p>Client not found</p>;

  const measurements = crmData.measurements.find(m => m.client_id === id) || {};
  const preferences = crmData.style_preferences.find(p => p.client_id === id) || {};
  const orders = crmData.orders.filter(o => o.client_id === id);
  const activities = crmData.activities.filter(a => a.client_id === id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="card">
      <h2>{client.first_name} {client.last_name} {client.vip_status && <span style={{ color: '#e91e63' }}>VIP</span>}</h2>
      <section>
        <h3>Contact Info</h3>
        <p>Email: {client.email}</p>
        <p>Phone: {client.phone}</p>
        <p>Address: {Object.values(client.address).join(', ')}</p>
        <p>Communication Pref: {client.communication_pref}</p>
        <p>Notes: {client.notes}</p>
      </section>
      <section>
        <h3>Measurements</h3>
        <table>
          <tbody>
            {Object.entries(measurements).filter(([k]) => k !== 'client_id').map(([key, value]) => (
              <tr key={key}><td>{key.replace('_', ' ')}</td><td>{value} in</td></tr>
            ))}
          </tbody>
        </table>
<button onClick={() => {
  const newMeas = prompt('Enter new chest measurement', measurements.chest);
  if (newMeas) {
    const updated = crmData.measurements.map(m => m.client_id === id ? { ...m, chest: Number(newMeas) } : m);
    updateCrmData({ ...crmData, measurements: updated });
  }
}}>Edit Chest</button>
      </section>
      <section>
        <h3>Style Preferences</h3>
        <ul>
          {Object.entries(preferences).filter(([k]) => k !== 'client_id').map(([key, value]) => (
            <li key={key}>{key.replace('_', ' ')}: {JSON.stringify(value)}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Order History</h3>
        <table>
          <thead><tr><th>Type</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}><td>{order.order_type}</td><td>{order.status}</td><td>${order.total_price}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Activity Timeline</h3>
        <ul>
          {activities.map(activity => (
            <li key={activity.activity_id}>{activity.created_at}: {activity.activity_type} - {activity.subject}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ClientProfile;