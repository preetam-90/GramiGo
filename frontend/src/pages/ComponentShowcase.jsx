import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookingCard,
  StatusBadge,
  FeatureCard,
  NavigationPills,
  ProgressIndicator,
  HeroSection,
  GlassButton,
  GlassCard
} from '../components/common';

const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [bookingStep, setBookingStep] = useState(1);

  // Sample data for demonstrations
  const sampleBookings = [
    {
      id: 1,
      title: "John Deere 8370R Tractor",
      image: "/api/placeholder/400/300",
      price: 350,
      rating: 4.8,
      location: "Fresno County, CA",
      availability: "available",
      features: ["GPS Guidance", "Air Conditioning", "540/1000 PTO", "AutoTrac Ready", "4WD"],
      variant: "featured"
    },
    {
      id: 2,
      title: "Case IH Axial-Flow 9250",
      image: "/api/placeholder/400/300",
      price: 480,
      rating: 4.9,
      location: "Kern County, CA",
      availability: "available",
      features: ["700+ HP", "Yield Monitor", "Auto Header Height", "Extended Wear Package"],
      variant: "premium"
    },
    {
      id: 3,
      title: "New Holland T8.435",
      image: "/api/placeholder/400/300",
      price: 290,
      rating: 4.6,
      location: "Tulare County, CA",
      availability: "busy",
      features: ["CVT Transmission", "IntelliSteer", "Eco Blue Technology", "420 HP"],
      variant: "default"
    }
  ];

  const navigationItems = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'cards', label: 'Booking Cards', icon: '🚜' },
    { id: 'features', label: 'Features', icon: '⭐' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'badges', label: 'Status Badges', icon: '🏷️' }
  ];

  const agricultureFeatures = [
    {
      icon: "🌾",
      title: "Crop Management",
      description: "Advanced equipment for planting, cultivating, and harvesting all types of crops with precision technology.",
      variant: "primary"
    },
    {
      icon: "🚜",
      title: "Heavy Machinery",
      description: "Access to tractors, combines, and specialized equipment from verified operators in your area.",
      variant: "accent"
    },
    {
      icon: "🌡️",
      title: "Weather Integration",
      description: "Real-time weather data and forecasting to optimize your equipment scheduling and operations.",
      variant: "secondary"
    },
    {
      icon: "📱",
      title: "Mobile Tracking",
      description: "Track equipment location, usage, and performance metrics through our mobile application.",
      variant: "default"
    }
  ];

  const bookingSteps = [
    { id: 1, label: "Select Equipment", description: "Choose your machinery" },
    { id: 2, label: "Schedule Date", description: "Pick your preferred time" },
    { id: 3, label: "Confirm Details", description: "Review and confirm" },
    { id: 4, label: "Payment", description: "Secure payment processing" },
    { id: 5, label: "Complete", description: "Booking confirmed" }
  ];

  const statusExamples = [
    { status: 'available', variant: 'success' },
    { status: 'pending', variant: 'warning' },
    { status: 'approved', variant: 'success' },
    { status: 'in_progress', variant: 'info' },
    { status: 'completed', variant: 'success' },
    { status: 'cancelled', variant: 'error' },
    { status: 'verified', variant: 'primary', label: 'Operator Verified' },
    { status: 'premium', variant: 'warning', label: 'Premium Service' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Hero Section</h2>
            <HeroSection
              title="Revolutionary Agriculture Equipment Booking"
              subtitle="Connect with certified operators and book premium agricultural machinery for your farming operations"
              primaryAction={{ 
                label: "Start Booking", 
                onClick: () => alert("Primary action clicked!") 
              }}
              secondaryAction={{ 
                label: "View Equipment", 
                onClick: () => alert("Secondary action clicked!") 
              }}
              features={[
                { icon: "🚜", text: "500+ Tractors" },
                { icon: "🌾", text: "Harvest Equipment" },
                { icon: "⚡", text: "Same-Day Booking" },
                { icon: "🛡️", text: "Insured Operators" }
              ]}
              stats={[
                { value: "10K+", label: "Happy Farmers" },
                { value: "95%", label: "Satisfaction Rate" },
                { value: "24/7", label: "Support Available" }
              ]}
              className="min-h-[70vh]"
            />
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Equipment Booking Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onBook={() => alert(`Booking ${booking.title}`)}
                />
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Feature Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agricultureFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  onClick={() => alert(`Learning more about ${feature.title}`)}
                />
              ))}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Booking Progress</h2>
            
            <div className="space-y-6">
              <GlassCard variant="elevated" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Horizontal Progress</h3>
                <ProgressIndicator
                  steps={bookingSteps}
                  currentStep={bookingStep}
                  variant="glass"
                  orientation="horizontal"
                />
                <div className="flex gap-3 mt-6">
                  <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => setBookingStep(Math.max(0, bookingStep - 1))}
                    disabled={bookingStep === 0}
                  >
                    Previous
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => setBookingStep(Math.min(bookingSteps.length - 1, bookingStep + 1))}
                    disabled={bookingStep === bookingSteps.length - 1}
                  >
                    Next Step
                  </GlassButton>
                </div>
              </GlassCard>

              <GlassCard variant="elevated" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Vertical Progress</h3>
                <ProgressIndicator
                  steps={bookingSteps}
                  currentStep={bookingStep}
                  variant="default"
                  orientation="vertical"
                />
              </GlassCard>
            </div>
          </div>
        );

      case 'badges':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Status Badges</h2>
            
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Equipment Status</h3>
              <div className="flex flex-wrap gap-3">
                {statusExamples.map((example, index) => (
                  <StatusBadge
                    key={index}
                    status={example.status}
                    label={example.label}
                    variant={example.variant}
                    size="md"
                    animate={true}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Different Sizes</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status="available" variant="success" size="xs" />
                  <StatusBadge status="available" variant="success" size="sm" />
                  <StatusBadge status="available" variant="success" size="md" />
                  <StatusBadge status="available" variant="success" size="lg" />
                  <StatusBadge status="available" variant="success" size="xl" />
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Animated Badges</h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status="pending" variant="warning" pulse={true} />
                <StatusBadge status="in_progress" variant="info" pulse={true} />
                <StatusBadge status="premium" variant="warning" icon="⭐" />
                <StatusBadge status="verified" variant="success" icon="✅" />
              </div>
            </GlassCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
              Agriculture Portal
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Stunning UI/UX Components with Dark Theme & Glassmorphism
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <NavigationPills
            items={navigationItems}
            activeItem={activeTab}
            onItemChange={(item) => setActiveTab(item.id)}
            variant="glass"
            size="md"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ComponentShowcase;