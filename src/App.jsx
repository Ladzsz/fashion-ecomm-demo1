import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Referral from './Referral';
import AdminCRM from './AdminCRM';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import ClientProfile from './ClientProfile';
import { initialCrmData } from './crmData';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [crmData, setCrmData] = useState(initialCrmData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  useEffect(() => {
    const storedCrm = localStorage.getItem('crmData');
    if (storedCrm) {
      try {
        setCrmData(JSON.parse(storedCrm));
      } catch (e) {
        console.error('Failed to parse stored CRM data:', e);
        setCrmData(initialCrmData);
      }
    } else {
      localStorage.setItem('crmData', JSON.stringify(initialCrmData));
    }
    setLoading(false);
  }, []);

  const updateCrmData = (newData) => {
    localStorage.setItem('crmData', JSON.stringify(newData));
    setCrmData(newData);
  };

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    setIsAdmin(userData.role === 'admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Loading...</div>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isLoggedIn ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/referral" element={isLoggedIn ? <Referral user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/admin-crm" element={isAdmin ? <AdminCRM crmData={crmData} updateCrmData={updateCrmData} /> : <Navigate to="/login" />} />
          <Route path="/admin-crm/client/:id" element={isAdmin ? <ClientProfile crmData={crmData} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      
      <button onClick={() => setShowChatbot(!showChatbot)} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        {showChatbot ? 'Close Chat' : 'Open Chat'}
      </button>
      {showChatbot && <Chatbot />}
    </Router>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Home from './Home';
// import Login from './Login';
// import Register from './Register';
// import Referral from './Referral';
// import AdminCRM from './AdminCRM';
// import Navbar from './Navbar';
// import Chatbot from './Chatbot';
// import ClientProfile from './ClientProfile';
// import { initialCrmData } from './crmData';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [user, setUser] = useState(null);
//   const [showChatbot, setShowChatbot] = useState(false);
//    const [crmData, setCrmData] = useState(initialCrmData);
//    const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUser(parsedUser);
//         setIsAdmin(parsedUser.role === 'admin');
//       } catch (e) {
//         console.error('Failed to parse stored user:', e);
//       }
//     }
//   }, []);
//    useEffect(() => {
//      const storedCrm = localStorage.getItem('crmData');
//     if (storedCrm) {
//       try {
//         setCrmData(JSON.parse(storedCrm));
//       } catch (e) {
//         console.error('Failed to parse stored CRM data:', e);
//         setCrmData(initialCrmData);
//       }
//     } else {
//       localStorage.setItem('crmData', JSON.stringify(initialCrmData));
//     }
//     setLoading(false);
//   }, []);

//   const updateCrmData = (newData) => {
//     localStorage.setItem('crmData', JSON.stringify(newData));
//     setCrmData(newData);
//   };

//   const handleLogin = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsLoggedIn(true);
//     setUser(userData);
//     setIsAdmin(userData.role === 'admin');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUser(null);
//     setIsAdmin(false);
//   };

//   return (
//     <Router>
//       <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
//       <div className="container">
//         <Routes>
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
//         <Route path="/register" element={!isLoggedIn ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />
//         <Route path="/referral" element={isLoggedIn ? <Referral user={user} setUser={setUser} /> : <Navigate to="/login" />} />
//         {/* <Route path="/admin-crm" element={isAdmin ? <AdminCRM /> : <Navigate to="/login" />} /> */}
//         <Route path="/admin-crm" element={isAdmin ? <AdminCRM crmData={crmData} updateCrmData={updateCrmData} /> : <Navigate to="/login" />} />
//         <Route path="/admin-crm/client/:id" element={isAdmin ? <ClientProfile crmData={crmData} /> : <Navigate to="/login" />} />
//       </Routes>

//       </div>
      
//       <button onClick={() => setShowChatbot(!showChatbot)} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
//         {showChatbot ? 'Close Chat' : 'Open Chat'}
//       </button>
//       {showChatbot && <Chatbot />}
//     </Router>
//   );
// };

// export default App;