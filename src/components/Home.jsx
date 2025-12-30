import React, { useState } from 'react';

// Hard-coded products
const products = [
  { id: 1, type: 'Suit', name: 'Men\'s Tailored Suit', price: 299, image: 'https://via.placeholder.com/150?text=Suit', description: 'Custom-fit suit for professionals.' },
  { id: 2, type: 'Dress', name: 'Women\'s Evening Dress', price: 199, image: 'https://via.placeholder.com/150?text=Dress', description: 'Elegant dress for special occasions.' },
  { id: 3, type: 'Shirt', name: 'Custom Shirt', price: 99, image: 'https://via.placeholder.com/150?text=Shirt', description: 'Tailored shirt in various fabrics.' },
];

const Home = ({ user }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // return (
  //   <div>
  //     <h1>Fashion & Tailoring E-Commerce</h1>
  //     {user && <p>Welcome, {user.email}! Check out our referral program for credits.</p>}
  //     <h2>Product Gallery</h2>
  //     <div style={{ display: 'flex', flexWrap: 'wrap' }}>
  //       {products.map((product) => (
  //         <div key={product.id} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
  //           <img src={product.image} alt={product.name} />
  //           <h3>{product.name} ({product.type})</h3>
  //           <p>{product.description}</p>
  //           <p>${product.price}</p>
  //           <button onClick={() => addToCart(product)}>Add to Cart</button>
  //         </div>
  //       ))}
  //     </div>
  //     <h3>Simulated Cart</h3>
  //     <ul>{cart.map((item, idx) => <li key={idx}>{item.name} - ${item.price}</li>)}</ul>
  //   </div>
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', margin: '40px 0', color: '#e91e63' }}>Fashion & Professional Tailoring</h1>
        {user && <p style={{ textAlign: 'center', fontSize: '18px' }}>Welcome, {user.email}! Earn credits with our referral program.</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
          {products.map((product) => (
            <div key={product.id} className="card" style={{ textAlign: 'center' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
              <h3 style={{ color: '#e91e63' }}>{product.name}</h3>
              <p>{product.description}</p>
              <p style={{ fontWeight: 'bold', fontSize: '20px' }}>${product.price}</p>
              <button onClick={() => addToCart(product)} className="btn-primary">Add to Cart</button>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '50px' }}>
          <h2>Your Cart ({cart.length} items)</h2>
          {cart.length === 0 ? <p>Cart is empty</p> : 
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cart.map((item, idx) => <li key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{item.name} - ${item.price}</li>)}
            </ul>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;