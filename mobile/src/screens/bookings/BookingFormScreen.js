import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const BookingFormScreen = ({ navigation, route }) => {
  const { equipmentId } = route.params;
  const { user } = useAuth();
  
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Booking details
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // +1 hour
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Date picker
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  useEffect(() => {
    fetchEquipmentDetails();
  }, [equipmentId]);
  
  useEffect(() => {
    if (equipment && startDate && endDate) {
      calculateDuration();
      calculatePrice();
    }
  }, [equipment, startDate, endDate]);
  
  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/equipment/${equipmentId}`);
      setEquipment(response.data.data);
    } catch (error) {
      console.log('Error fetching equipment details:', error);
      Alert.alert('Error', 'Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateDuration = () => {
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.max(1, Math.round(diff / (1000 * 60 * 60)));
    setDuration(hours);
  };
  
  const calculatePrice = () => {
    if (!equipment || !equipment.pricing) return;
    
    const hourlyRate = equipment.pricing.ratePerHour || 0;
    const basePrice = hourlyRate * duration;
    
    // Add delivery fee if applicable
    const deliveryFee = equipment.deliveryOptions?.isDeliveryAvailable 
      ? equipment.deliveryOptions.deliveryFee || 0 
      : 0;
    
    // Add operator fee if applicable
    const operatorFee = equipment.operatorIncluded ? 200 * duration : 0;
    
    // Calculate total
    const total = basePrice + deliveryFee + operatorFee;
    setTotalPrice(total);
  };
  
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // If end date is before new start date, adjust it
      if (endDate < selectedDate) {
        const newEndDate = new Date(selectedDate.getTime() + 3600000); // +1 hour
        setEndDate(newEndDate);
      }
    }
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Ensure end date is after start date
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        Alert.alert('Invalid Time', 'End time must be after start time');
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!equipment || !user) return;
    
    try {
      setSubmitting(true);
      
      const bookingData = {
        equipment: equipmentId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        duration: {
          hours: duration
        },
        pricing: {
          basePrice: equipment.pricing.ratePerHour * duration,
          deliveryFee: equipment.deliveryOptions?.isDeliveryAvailable 
            ? equipment.deliveryOptions.deliveryFee || 0 
            : 0,
          operatorFee: equipment.operatorIncluded ? 200 * duration : 0,
          totalAmount: totalPrice
        },
        notes: {
          user: notes
        }
      };
      
      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      
      if (response.data.success) {
        Alert.alert(
          'Booking Successful',
          'Your booking has been created successfully!',
          [
            {
              text: 'View Booking',
              onPress: () => navigation.navigate('Bookings', {
                screen: 'BookingDetail',
                params: { id: response.data.data._id }
              })
            }
          ]
        );
      }
    } catch (error) {
      console.log('Booking error:', error);
      Alert.alert('Booking Failed', 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  
  if (!equipment) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.errorText}>Equipment not found</Text>
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
        {/* Equipment Summary */}
        <View style={styles.equipmentSummary}>
          <View style={styles.equipmentImageContainer}>
            <Image
              source={{
                uri: equipment.images && equipment.images.length > 0
                  ? equipment.images[0]
                  : 'https://via.placeholder.com/100'
              }}
              style={styles.equipmentImage}
            />
          </View>
          <View style={styles.equipmentInfo}>
            <Text style={styles.equipmentName}>{equipment.name}</Text>
            <Text style={styles.equipmentCategory}>{equipment.category}</Text>
            <Text style={styles.equipmentPrice}>₹{equipment.pricing?.ratePerHour}/hour</Text>
          </View>
        </View>
        
        {/* Booking Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          {/* Start Date/Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Start Date & Time</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {startDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="datetime"
                display="default"
                minimumDate={new Date()}
                onChange={handleStartDateChange}
              />
            )}
          </View>
          
          {/* End Date/Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>End Date & Time</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {endDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="datetime"
                display="default"
                minimumDate={new Date(startDate.getTime() + 3600000)} // +1 hour from start
                onChange={handleEndDateChange}
              />
            )}
          </View>
          
          {/* Duration */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>{duration} hour(s)</Text>
            </View>
          </View>
          
          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any special requirements or instructions..."
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>
        
        {/* Price Breakdown */}
        <View style={styles.priceBreakdownContainer}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Price ({duration} hour(s))</Text>
            <Text style={styles.priceValue}>
              ₹{equipment.pricing?.ratePerHour * duration}
            </Text>
          </View>
          
          {equipment.deliveryOptions?.isDeliveryAvailable && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>
                ₹{equipment.deliveryOptions.deliveryFee || 0}
              </Text>
            </View>
          )}
          
          {equipment.operatorIncluded && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Operator Fee ({duration} hour(s))</Text>
              <Text style={styles.priceValue}>₹{200 * duration}</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
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
  equipmentSummary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  equipmentImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  equipmentInfo: {
    flex: 1,
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
  formContainer: {
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  durationContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  durationText: {
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    height: 100,
    textAlignVertical: 'top',
  },
  priceBreakdownContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    marginBottom: 80,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BookingFormScreen; 