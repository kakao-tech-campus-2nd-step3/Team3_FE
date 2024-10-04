import React from "react";

const LoginModal: React.FC = () => {
  return (
    <div>
      <h1>Login Modal</h1>
      <p>Please login to access your account.</p>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button>Login</button>
    </div>
  );
};

export default LoginModal;
