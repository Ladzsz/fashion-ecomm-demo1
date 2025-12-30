import React, { useState } from 'react';

// Hard-coded examples
const responses = {
  'what are your return policies?': 'Returns are accepted within 30 days for store credit.',
  'how do i measure for tailoring?': 'Use our sizing guide: chest, waist, etc.',
  'shipping time?': 'Standard shipping takes 5-7 days.',
  default: 'Sorry, I can only answer a few questions. Contact support for more.'
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { text: input, from: 'user' }]);
    const reply = responses[input.toLowerCase()] || responses.default;
    setMessages((prev) => [...prev, { text: reply, from: 'bot' }]);
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '60px', right: '20px', border: '1px solid #ccc', padding: '10px', width: '300px', background: '#fff' }}>
      <h3>Chatbot</h3>
      <div style={{ height: '200px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>{msg.text}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;