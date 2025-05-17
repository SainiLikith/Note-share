import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // useForm with Yup resolver
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegister = async (data) => {
  try {
    // Send registration data to backend
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // { username, email, password }
    });
        console.log(data);
        
    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const result = await response.json();

    // Assuming result.token is returned from backend
    const token = result.token;

    // Save token in localStorage
    localStorage.setItem('authToken', token);

    // Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error.message);
    alert('Registration failed. Please try again.');
  }
};

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <div>
        <label>Username:</label>
        <input {...register("username")} />
        <p style={{ color: "red" }}>{errors.username?.message}</p>
      </div>

      <div>
        <label>Email:</label>
        <input {...register("email")} />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>

      <div>
        <label>Password:</label>
        <input type="password" {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
