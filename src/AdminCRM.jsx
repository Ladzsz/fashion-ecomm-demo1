import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Add uuid via npm install uuid
import CreateClient from './CreateClient';
import MergeClients from './MergeClients';
import ReferralTree from './ReferralTree';
import OrderWizard from './OrderWizard';
import OrderPipeline from './OrderPipeline';

const AdminCRM = ({ crmData, updateCrmData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
   const [showWizard, setShowWizard] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = crmData.clients.filter(client =>
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  if (!crmData || !crmData.clients) {
  return <div>Loading CRM data...</div>;
}

  return (
    <div>
      <h2>Admin CRM Dashboard</h2>
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
        style={{ width: '100%', padding: '12px', marginBottom: '20px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, background: '#fff', border: '1px solid #ddd', maxHeight: '200px', overflowY: 'auto' }}>
          {suggestions.map(client => (
            <li key={client.client_id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <Link to={`/admin-crm/client/${client.client_id}`}>{client.first_name} {client.last_name} ({client.email})</Link>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setShowCreate(true)} className="btn-primary">Create New Client</button>
      <button onClick={() => setShowMerge(true)} className="btn-primary" style={{ marginLeft: '10px' }}>Merge Clients</button>
      {showCreate && <CreateClient crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowCreate(false)} />}
      {showMerge && <MergeClients crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowMerge(false)} />}
      <h3>Referral Network Visualization</h3>
      <ReferralTree crmData={crmData} />
  
<button onClick={() => setShowWizard(true)} className="btn-primary">New Order (Wizard)</button>
{showWizard && <OrderWizard crmData={crmData} updateCrmData={updateCrmData} onClose={() => setShowWizard(false)} />}
<h2>Order Pipeline (Kanban)</h2>
<OrderPipeline crmData={crmData} updateCrmData={updateCrmData} />
    </div>
  );
};

// Hard-coded customers for demo
// const initialCustomers = [
//   { id: 1, email: 'customer1@example.com', credits: 10, notes: 'Loyal customer' },
//   { id: 2, email: 'customer2@example.com', credits: 5, notes: '' },
// ];

// const AdminCRM = () => {
//   const [customers, setCustomers] = useState(initialCustomers);
//   const [notes, setNotes] = useState({});

//   const handleNoteChange = (id, note) => {
//     setNotes({ ...notes, [id]: note });
//   };

//   const saveNote = (id) => {
//     const updated = customers.map(c => c.id === id ? { ...c, notes: notes[id] } : c);
//     setCustomers(updated);
//   };

//   return (
//     <div>
//       <h2>Admin CRM Dashboard</h2>
//       <table>
//         <thead>
//           <tr><th>Email</th><th>Credits</th><th>Notes</th><th>Action</th></tr>
//         </thead>
//         <tbody>
//           {customers.map((cust) => (
//             <tr key={cust.id}>
//               <td>{cust.email}</td>
//               <td>{cust.credits}</td>
//               <td>
//                 <input
//                   value={notes[cust.id] || cust.notes}
//                   onChange={(e) => handleNoteChange(cust.id, e.target.value)}
//                 />
//               </td>
//               <td><button onClick={() => saveNote(cust.id)}>Save</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default AdminCRM;