import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/common/GlassCard';
import GlassButton from '../components/common/GlassButton';
import { equipmentAPI } from '../services/api';

const Home = () => {
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEquipment = async () => {
      try {
        setLoading(true);
        const response = await equipmentAPI.getFeatured();
        setFeaturedEquipment(response.data.data || []);
      } catch (error) {
        console.error('Error fetching featured equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEquipment();
  }, []);

  // Equipment categories with enhanced styling
  const categories = [
    { 
      id: 1, 
      name: 'Tractors', 
      icon: '🚜', 
      gradient: 'from-green-500/20 via-green-600/20 to-emerald-600/20',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      count: '150+ available'
    },
    { 
      id: 2, 
      name: 'Harvesters', 
      icon: '🌾', 
      gradient: 'from-amber-500/20 via-orange-500/20 to-yellow-600/20',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      count: '80+ available'
    },
    { 
      id: 3, 
      name: 'Seeders', 
      icon: '🌱', 
      gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-600/20',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      count: '120+ available'
    },
    { 
      id: 4, 
      name: 'Sprayers', 
      icon: '💦', 
      gradient: 'from-purple-500/20 via-violet-500/20 to-indigo-600/20',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      count: '90+ available'
    },
    { 
      id: 5, 
      name: 'Plows', 
      icon: '⚒️', 
      gradient: 'from-stone-500/20 via-amber-600/20 to-orange-700/20',
      iconBg: 'bg-gradient-to-br from-stone-500 to-amber-600',
      count: '70+ available'
    },
    { 
      id: 6, 
      name: 'Irrigation', 
      icon: '💧', 
      gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-600/20',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      count: '60+ available'
    },
  ];

  // Enhanced features section
  const features = [
    {
      title: 'Smart Equipment Discovery',
      description: 'AI-powered recommendations based on your farm size, crop type, and seasonal needs',
      icon: '🔍',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    },
    {
      title: 'Real-Time GPS Tracking',
      description: 'Track your equipment delivery and work progress with live location updates',
      icon: '📍',
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Flexible Payment Options',
      description: 'Pay now, pay later, or seasonal payment plans designed for farmers',
      icon: '💳',
      gradient: 'from-purple-500/10 to-violet-500/10',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[90vh] overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-2 bg-primary-500/20 backdrop-blur-sm rounded-full text-primary-300 text-sm font-semibold mb-6 border border-primary-500/30">
                🚀 Revolutionizing Agriculture
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Rent farm power,{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                anytime, anywhere.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              GramiGo connects farmers with the equipment they need, when they need it.
              Book agricultural machinery with just a few taps and transform your farming experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/equipment">
                <GlassButton 
                  variant="primary" 
                  size="xl"
                  icon="🚀"
                  className="min-w-[200px] shadow-2xl shadow-primary-500/25"
                >
                  Start Booking
                </GlassButton>
              </Link>
              <Link to="/about">
                <GlassButton 
                  variant="outline" 
                  size="xl"
                  icon="📖"
                  className="min-w-[200px]"
                >
                  Learn More
                </GlassButton>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-slate-400">Equipment Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-slate-400">Happy Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-slate-400">Cities Covered</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Browse by Category</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Find the perfect equipment for your farming needs from our extensive collection
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link to={`/equipment?category=${category.name.toLowerCase()}`}>
                  <GlassCard 
                    className={`h-48 flex flex-col items-center justify-center bg-gradient-to-br ${category.gradient} hover:scale-105 transition-all duration-300 group cursor-pointer border-2 border-white/10 hover:border-white/30`}
                    variant="elevated"
                  >
                    <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-slate-300">{category.count}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Featured Equipment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-2">Featured Equipment</h2>
              <p className="text-slate-300">Handpicked equipment for optimal performance</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/equipment">
                <GlassButton variant="outline" icon="→">
                  View All Equipment
                </GlassButton>
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin animate-reverse"></div>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredEquipment.length > 0 ? (
                featuredEquipment.map((item, index) => (
                  <motion.div key={item._id} variants={itemVariants}>
                    <Link to={`/equipment/${item._id}`}>
                      <GlassCard className="h-full overflow-hidden group hover:scale-[1.02] transition-all duration-300" variant="elevated">
                        <div className="relative h-56 rounded-xl overflow-hidden mb-6">
                          <img
                            src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          {item.status === 'available' && (
                            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                              Available
                            </span>
                          )}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              <div className="text-white">
                                <div className="text-2xl font-bold">₹{item.pricing?.ratePerHour}</div>
                                <div className="text-sm opacity-80">per hour</div>
                              </div>
                              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white text-sm font-medium">
                                  {item.ratings?.average ? item.ratings.average.toFixed(1) : '4.5'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300">{item.name}</h3>
                          <p className="text-slate-300 text-sm line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-primary-400 text-sm font-semibold capitalize">{item.category}</span>
                            <span className="text-slate-400 text-xs">
                              {item.ratings?.count || 0} reviews
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <div className="text-6xl mb-4">🚜</div>
                  <p className="text-slate-300 text-lg">No featured equipment available at the moment.</p>
                  <p className="text-slate-400 text-sm mt-2">Check back soon for amazing deals!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose GramiGo</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the future of agricultural equipment rental with our cutting-edge platform
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className={`h-full bg-gradient-to-br ${feature.gradient} group hover:scale-105 transition-all duration-300`} variant="elevated">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-primary-500/30 to-primary-800/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to transform your{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                farming experience?
              </span>
            </h2>
            <p className="text-xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers who are already saving time and money with GramiGo.
              Start your journey towards smarter farming today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <GlassButton 
                  variant="primary" 
                  size="xl"
                  icon="🚀"
                  className="min-w-[250px] shadow-2xl shadow-primary-500/25"
                >
                  Get Started Now
                </GlassButton>
              </Link>
              <Link to="/equipment">
                <GlassButton 
                  variant="outline" 
                  size="xl"
                  icon="🔍"
                  className="min-w-[250px]"
                >
                  Browse Equipment
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;