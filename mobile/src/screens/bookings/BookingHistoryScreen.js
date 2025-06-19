import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const BookingHistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'cancelled'
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data.data || []);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107'; // Amber
      case 'confirmed':
        return '#2196F3'; // Blue
      case 'in_progress':
        return '#9C27B0'; // Purple
      case 'completed':
        return '#4CAF50'; // Green
      case 'cancelled':
        return '#F44336'; // Red
      case 'rejected':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const filterBookings = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          (booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in_progress') &&
          new Date(booking.startDate) >= now
        );
      case 'past':
        return bookings.filter(booking => 
          booking.status === 'completed' || 
          (booking.status !== 'cancelled' && booking.status !== 'rejected' && new Date(booking.endDate) < now)
        );
      case 'cancelled':
        return bookings.filter(booking => 
          booking.status === 'cancelled' || booking.status === 'rejected'
        );
      default:
        return bookings;
    }
  };
  
  const renderBookingItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.bookingItem}
        onPress={() => navigation.navigate('BookingDetail', { id: item._id })}
      >
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingNumber}>#{item.bookingNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
          </View>
        </View>
        
        <View style={styles.bookingContent}>
          <Image
            source={{
              uri: item.equipment?.images && item.equipment.images.length > 0
                ? item.equipment.images[0]
                : 'https://via.placeholder.com/80'
            }}
            style={styles.equipmentImage}
          />
          
          <View style={styles.bookingDetails}>
            <Text style={styles.equipmentName}>{item.equipment?.name || 'Equipment'}</Text>
            <Text style={styles.equipmentCategory}>{item.equipment?.category || 'Category'}</Text>
            
            <View style={styles.bookingDateRow}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.bookingDate}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>
            
            <View style={styles.bookingPriceRow}>
              <Text style={styles.bookingPrice}>₹{item.pricing?.totalAmount || 0}</Text>
              <Text style={styles.paymentStatus}>
                {item.payment?.status === 'paid' ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No bookings found</Text>
        <Text style={styles.emptySubtext}>
          {activeTab === 'upcoming' 
            ? "You don't have any upcoming bookings" 
            : activeTab === 'past' 
              ? "You don't have any past bookings" 
              : "You don't have any cancelled bookings"
          }
        </Text>
        
        {activeTab === 'upcoming' && (
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Equipment', { screen: 'EquipmentList' })}
          >
            <Text style={styles.browseButtonText}>Browse Equipment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={filterBookings()}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshing={loading}
          onRefresh={fetchBookings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  bookingContent: {
    flexDirection: 'row',
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 15,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equipmentCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  bookingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  bookingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentStatus: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookingHistoryScreen; 