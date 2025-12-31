// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
//   return (
//     <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#f0f0f0' }}>
//       <Link to="/">Home/Gallery</Link>
//       {isLoggedIn ? (
//         <>
//           <Link to="/referral">Referral</Link>
//           {isAdmin && <Link to="/admin-crm">Admin CRM</Link>}
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <Link to="/login">Login</Link>
//           <Link to="/register">Register</Link>
//         </>
//       )}
//     </nav>
//   );
// };


//2
// const Navbar = ({ isLoggedIn, isAdmin, handleLogout }) => {
//   return (
//     <nav style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 40px',
//       background: '#000000',
//       color: 'white',
//       boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
//     }}>
//       <h1 style={{ margin: 0, fontSize: '28px' }}>TailorChic</h1>
//       <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
//         <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px' }}>Gallery</Link>
//         {isLoggedIn ? (
//           <>
//             <Link to="/referral">Referrals</Link>
//             {isAdmin && <Link to="/admin-crm">Admin CRM</Link>}
//             <button onClick={handleLogout} className="btn-secondary">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link } from "react-router-dom";

/* -----------------------------
   Types
--------------------------------*/

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  handleLogout: () => void;
}

/* -----------------------------
   Component
--------------------------------*/

export default function Navbar({
  isLoggedIn,
  isAdmin,
  handleLogout,
}: NavbarProps) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#000000",
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "28px" }}>
        TailorChic
      </h1>

      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: "white",
            textDecoration: "none",
          }}
        >
          Gallery
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/referral"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Referrals
            </Link>

            {isAdmin && (
              <Link
                to="/admin-crm"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Admin CRM
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                background: "#e91e63",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/search"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Search
            </Link>

            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
