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

  // Equipment categories with icons
  const categories = [
    { id: 1, name: 'Tractors', icon: '🚜', color: 'from-green-500/20 to-green-600/20' },
    { id: 2, name: 'Harvesters', icon: '🌾', color: 'from-amber-500/20 to-amber-600/20' },
    { id: 3, name: 'Seeders', icon: '🌱', color: 'from-blue-500/20 to-blue-600/20' },
    { id: 4, name: 'Sprayers', icon: '💦', color: 'from-purple-500/20 to-purple-600/20' },
    { id: 5, name: 'Plows', icon: '⚒️', color: 'from-brown-500/20 to-brown-600/20' },
    { id: 6, name: 'Irrigation', icon: '💧', color: 'from-cyan-500/20 to-cyan-600/20' },
  ];

  // Features section data
  const features = [
    {
      title: 'Find Equipment',
      description: 'Search and filter from hundreds of farming equipment near you',
      icon: '🔍',
    },
    {
      title: 'Real-Time Tracking',
      description: 'Track your equipment delivery status in real-time',
      icon: '📍',
    },
    {
      title: 'Pay Later Options',
      description: 'Flexible payment options for farmers',
      icon: '💳',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Rent farm power, <span className="text-primary-400">anytime, anywhere.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              GramiGo connects farmers with the equipment they need, when they need it.
              Book agricultural machinery with just a few taps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/equipment">
                <GlassButton variant="primary" size="lg">
                  Book Now
                </GlassButton>
              </Link>
              <Link to="/about">
                <GlassButton variant="outline" size="lg">
                  Learn More
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link to={`/equipment?category=${category.name.toLowerCase()}`} key={category.id}>
                <GlassCard className={`h-32 flex flex-col items-center justify-center bg-gradient-to-br ${category.color} hover:scale-105 transition-transform duration-300`}>
                  <span className="text-4xl mb-2">{category.icon}</span>
                  <h3 className="font-medium text-white">{category.name}</h3>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Equipment</h2>
            <Link to="/equipment" className="text-primary-400 hover:text-primary-300 flex items-center">
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEquipment.length > 0 ? (
                featuredEquipment.map((item) => (
                  <Link to={`/equipment/${item._id}`} key={item._id}>
                    <GlassCard className="h-full overflow-hidden">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                        <img
                          src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.status === 'available' && (
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Available
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                      <p className="text-slate-300 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-primary-400 font-bold">₹{item.pricing?.ratePerHour}/hr</div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white ml-1">
                            {item.ratings?.average ? item.ratings.average.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-slate-300">No featured equipment available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose GramiGo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/30 to-primary-800/30"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to transform your farming experience?
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Join thousands of farmers who are already saving time and money with GramiGo.
          </p>
          <Link to="/register">
            <GlassButton variant="primary" size="lg">
              Get Started Now
            </GlassButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 