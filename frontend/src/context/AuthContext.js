import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

// Create context
const AuthContext = createContext();

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default header with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setLoading(false);
            return;
          }
          
          // Get user data
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
        } catch (err) {
          console.error('Auth error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        toast.success('Registration successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        toast.success('Login successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Send OTP
  const sendOTP = async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { phone });
      setLoading(false);
      toast.success('OTP sent successfully!');
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to send OTP';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
      
      if (res.data.success && !res.data.isNewUser) {
        localStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        toast.success('Login successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'OTP verification failed';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully!');
  };

  // Update user profile
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/users/${userId}`, userData);
      
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile updated successfully!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        sendOTP,
        verifyOTP,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 