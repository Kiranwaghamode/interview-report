import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');

  const {loading, handleRegister} = useAuth()
  const navigate = useNavigate()

    const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({username, email, password})
    navigate('/')
    }; 

  

  if(loading){
    return(
      <h1>Loading...</h1>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">



        {/* Heading */}
        <h2 className="login-title">Welcome </h2>
        <p className="login-subtitle">Register</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
        
        {/* User Name */}
        <div className="form-group">
        <label htmlFor="username">Username</label>
        <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            </svg>
            <input
            id="username"
            type="text"
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

        
          {/* Submit */}
          <button type="submit" className="btn-primary">Register</button>

        </form>

        {/* Sign Up Link */}
        <p className="signup-text">
          Don't have an account? <Link to={'/Login'}>Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register