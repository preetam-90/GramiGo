import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassInput from '../../components/common/GlassInput';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneForm = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    
    if (otpSent && !formData.otp) newErrors.otp = 'OTP is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validatePhoneForm()) return;
    
    try {
      await sendOTP(formData.phone);
      setOtpSent(true);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validatePhoneForm()) return;
    
    try {
      await verifyOTP(formData.phone, formData.otp);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        otp: error.response?.data?.message || 'Invalid OTP. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img
                className="h-12 w-auto mx-auto"
                src="/src/assets/logo.png"
                alt="GramiGo"
              />
            </Link>
            <h2 className="mt-4 text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-300">
              Sign in to access your account
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex mb-6 bg-white/5 backdrop-blur-sm rounded-lg p-1">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'email'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('email')}
            >
              Email
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'phone'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              Phone
            </button>
          </div>

          {activeTab === 'email' ? (
            <form onSubmit={handleEmailLogin}>
              <GlassInput
                label="Email"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                error={errors.email}
              />
              <GlassInput
                label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                error={errors.password}
              />
              <div className="flex items-center justify-between mt-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-white/10 backdrop-blur-md rounded border-white/20 focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </Link>
                </div>
              </div>
              {errors.submit && (
                <div className="mb-4 p-2 bg-red-500/20 backdrop-blur-md rounded-md text-sm text-red-200">
                  {errors.submit}
                </div>
              )}
              <GlassButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </GlassButton>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
              <GlassInput
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                error={errors.phone}
                disabled={otpSent}
              />
              {otpSent && (
                <GlassInput
                  label="OTP"
                  id="otp"
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  name="otp"
                  error={errors.otp}
                />
              )}
              {errors.submit && (
                <div className="mb-4 p-2 bg-red-500/20 backdrop-blur-md rounded-md text-sm text-red-200">
                  {errors.submit}
                </div>
              )}
              <GlassButton
                type="submit"
                variant="primary"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span className="ml-2">{otpSent ? 'Verifying...' : 'Sending OTP...'}</span>
                  </div>
                ) : (
                  otpSent ? 'Verify OTP' : 'Send OTP'
                )}
              </GlassButton>
              {otpSent && (
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full mt-3 text-sm text-primary-400 hover:text-primary-300"
                >
                  Change phone number
                </button>
              )}
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login; 