import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

// Create context
const AuthContext = createContext();

// API URL
const API_URL = 'http://localhost:5000/api'; // Change to your API URL in production

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          
          // Get user data
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Auth error:', err);
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (res.data.success) {
        await AsyncStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        Alert.alert('Success', 'Registration successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      Alert.alert('Error', message);
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
        await AsyncStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        Alert.alert('Success', 'Login successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      Alert.alert('Error', message);
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
      Alert.alert('Success', 'OTP sent successfully!');
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to send OTP';
      setError(message);
      Alert.alert('Error', message);
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
        await AsyncStorage.setItem('token', res.data.user.token);
        setToken(res.data.user.token);
        setUser(res.data.user);
        Alert.alert('Success', 'Login successful!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'OTP verification failed';
      setError(message);
      Alert.alert('Error', message);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      Alert.alert('Success', 'Logged out successfully!');
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  // Update user profile
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/users/${userId}`, userData);
      
      if (res.data.success) {
        setUser(res.data.data);
        Alert.alert('Success', 'Profile updated successfully!');
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      Alert.alert('Error', message);
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