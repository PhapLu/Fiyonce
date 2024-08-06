import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/v1/api/auth/google'; // Ensure this points to your back-end server
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
