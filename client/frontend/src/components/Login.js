import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './Login.css';
import { useNavigate } from 'react-router-dom';


const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = ({onLogin}) => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data) => {
  try {
  
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const result = await response.json();
    const token = result.token;
    localStorage.setItem('authToken', token);
    onLogin(token); // Call the onLogin function passed as a prop
    console.log('Login successful:', result);
    alert('Login successful!');
    navigate('/dashboard');

  

  } catch (error) {
    console.error('Login failed:', error.message);
    navigate('/register');
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          {...register('email')}
          placeholder="Enter your email"
        />
        <p className="error-text">{errors.email?.message}</p>

        <label>Password</label>
        <input
          type="password"
          {...register('password')}
          placeholder="Enter your password"
        />
        <p className="error-text">{errors.password?.message}</p>

        <button type="submit">Login</button>
        <p className="signup-text">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;