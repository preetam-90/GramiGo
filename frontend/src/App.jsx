import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Layouts
import Layout from './components/layout/Layout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Dashboard from './pages/Dashboard';
// import EquipmentList from './pages/equipment/EquipmentList';
// import EquipmentDetail from './pages/equipment/EquipmentDetail';
// import BookingForm from './pages/bookings/BookingForm';
// import BookingHistory from './pages/bookings/BookingHistory';
// import BookingDetail from './pages/bookings/BookingDetail';
// import Profile from './pages/profile/Profile';
// import NotFound from './pages/NotFound';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/equipment" element={<Layout><EquipmentList /></Layout>} />
              <Route path="/equipment/:id" element={<Layout><EquipmentDetail /></Layout>} />
              <Route path="/bookings/new/:equipmentId" element={<Layout><BookingForm /></Layout>} />
              <Route path="/bookings" element={<Layout><BookingHistory /></Layout>} />
              <Route path="/bookings/:id" element={<Layout><BookingDetail /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} /> */}
            </Route>
            
            {/* 404 Route */}
            {/* <Route path="*" element={<Layout><NotFound /></Layout>} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
