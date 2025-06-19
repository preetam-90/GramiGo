import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const BookingDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bookings/${id}`);
      setBooking(response.data.data);
    } catch (error) {
      console.log('Error fetching booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.put(`${API_URL}/bookings/${id}/status`, {
                status: 'cancelled',
                notes: 'Cancelled by user'
              });
              fetchBookingDetails();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.log('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.errorText}>Booking not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Bar */}
        <View style={[styles.statusBar, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
          <Text style={styles.bookingNumber}>Booking #{booking.bookingNumber}</Text>
        </View>

        {/* Equipment Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <View style={styles.equipmentContainer}>
            <Image
              source={{
                uri: booking.equipment?.images && booking.equipment.images.length > 0
                  ? booking.equipment.images[0]
                  : 'https://via.placeholder.com/100'
              }}
              style={styles.equipmentImage}
            />
            <View style={styles.equipmentInfo}>
              <Text style={styles.equipmentName}>{booking.equipment?.name || 'Equipment'}</Text>
              <Text style={styles.equipmentCategory}>{booking.equipment?.category || 'Category'}</Text>
              <Text style={styles.equipmentPrice}>₹{booking.pricing?.basePrice || 0}</Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Start Date & Time</Text>
              <Text style={styles.detailValue}>{formatDate(booking.startDate)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>End Date & Time</Text>
              <Text style={styles.detailValue}>{formatDate(booking.endDate)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{booking.duration?.hours || 0} hour(s)</Text>
            </View>
          </View>
          
          {booking.notes?.user && (
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{booking.notes.user}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Provider Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Provider</Text>
          <View style={styles.providerContainer}>
            <View style={styles.providerImageContainer}>
              <Text style={styles.providerImagePlaceholder}>
                {booking.provider?.name ? booking.provider.name.charAt(0).toUpperCase() : 'P'}
              </Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{booking.provider?.name || 'Provider'}</Text>
              <Text style={styles.providerContact}>{booking.provider?.phone || 'Contact not available'}</Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call-outline" size={16} color="#4CAF50" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment</Text>
          
          <View style={styles.paymentContainer}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Base Price</Text>
              <Text style={styles.paymentValue}>₹{booking.pricing?.basePrice || 0}</Text>
            </View>
            
            {booking.pricing?.deliveryFee > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Delivery Fee</Text>
                <Text style={styles.paymentValue}>₹{booking.pricing.deliveryFee}</Text>
              </View>
            )}
            
            {booking.pricing?.operatorFee > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Operator Fee</Text>
                <Text style={styles.paymentValue}>₹{booking.pricing.operatorFee}</Text>
              </View>
            )}
            
            {booking.pricing?.discount > 0 && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Discount</Text>
                <Text style={styles.paymentValue}>-₹{booking.pricing.discount}</Text>
              </View>
            )}
            
            <View style={styles.paymentTotal}>
              <Text style={styles.paymentTotalLabel}>Total Amount</Text>
              <Text style={styles.paymentTotalValue}>₹{booking.pricing?.totalAmount || 0}</Text>
            </View>
            
            <View style={styles.paymentStatus}>
              <Text style={styles.paymentStatusLabel}>Payment Status</Text>
              <Text style={[
                styles.paymentStatusValue,
                { color: booking.payment?.status === 'paid' ? '#4CAF50' : '#F44336' }
              ]}>
                {booking.payment?.status === 'paid' ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {booking.status === 'pending' || booking.status === 'confirmed' ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelBooking}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        ) : booking.status === 'completed' && !booking.review ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => navigation.navigate('AddReview', { bookingId: id })}
            >
              <Text style={styles.reviewButtonText}>Add Review</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  statusBar: {
    padding: 15,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  bookingNumber: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  equipmentContainer: {
    flexDirection: 'row',
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  equipmentInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equipmentCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  equipmentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  detailRow: {
    marginBottom: 15,
  },
  detailItem: {},
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  providerImagePlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  providerContact: {
    fontSize: 14,
    color: '#666',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '600',
  },
  paymentContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  paymentTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentStatusLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentStatusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 15,
    marginTop: 15,
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  reviewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookingDetailScreen; 