import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';
const { width } = Dimensions.get('window');

const EquipmentDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchEquipmentDetails();
  }, [id]);

  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/equipment/${id}`);
      setEquipment(response.data.data);
    } catch (error) {
      console.log('Error fetching equipment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigation.navigate('BookingForm', { equipmentId: id });
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
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: equipment.images && equipment.images.length > 0
                ? equipment.images[selectedImage]
                : 'https://via.placeholder.com/400'
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* Image Thumbnails */}
          {equipment.images && equipment.images.length > 1 && (
            <FlatList
              data={equipment.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.thumbnail,
                    selectedImage === index && styles.selectedThumbnail
                  ]}
                  onPress={() => setSelectedImage(index)}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          )}
        </View>

        {/* Equipment Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.equipmentName}>{equipment.name}</Text>
              <Text style={styles.equipmentCategory}>{equipment.category}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFC107" />
              <Text style={styles.ratingText}>
                {equipment.ratings?.average ? equipment.ratings.average.toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.reviewCount}>
                ({equipment.ratings?.count || 0} reviews)
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>₹{equipment.pricing?.ratePerHour}/hour</Text>
            {equipment.pricing?.ratePerDay && (
              <Text style={styles.priceDay}>₹{equipment.pricing.ratePerDay}/day</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
              {equipment.description}
            </Text>
            {equipment.description && equipment.description.length > 100 && (
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Specifications */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Manufacturer</Text>
                <Text style={styles.specValue}>{equipment.manufacturer || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Model</Text>
                <Text style={styles.specValue}>{equipment.model || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Year</Text>
                <Text style={styles.specValue}>{equipment.year || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Horsepower</Text>
                <Text style={styles.specValue}>{equipment.specifications?.horsepower || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Fuel Type</Text>
                <Text style={styles.specValue}>{equipment.specifications?.fuelType || 'N/A'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Operator</Text>
                <Text style={styles.specValue}>{equipment.operatorIncluded ? 'Included' : 'Not Included'}</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#4CAF50" />
              <Text style={styles.locationText}>
                {equipment.location?.address?.street ? 
                  `${equipment.location.address.street}, ${equipment.location.address.city}, ${equipment.location.address.state}` : 
                  'Location details not available'}
              </Text>
            </View>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="map-outline" size={16} color="#4CAF50" />
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>

          {/* Owner Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Provider</Text>
            <View style={styles.ownerContainer}>
              <View style={styles.ownerImageContainer}>
                <Text style={styles.ownerImagePlaceholder}>
                  {equipment.owner?.name ? equipment.owner.name.charAt(0).toUpperCase() : 'P'}
                </Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{equipment.owner?.name || 'Provider'}</Text>
                <Text style={styles.memberSince}>Member since 2023</Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call-outline" size={16} color="#4CAF50" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reviews Summary */}
          <View style={styles.sectionContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {equipment.reviews && equipment.reviews.length > 0 ? (
              equipment.reviews.slice(0, 2).map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.user?.name || 'User'}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color="#FFC107" />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.priceActionContainer}>
          <Text style={styles.actionBarPriceLabel}>Price</Text>
          <Text style={styles.actionBarPrice}>₹{equipment.pricing?.ratePerHour}/hr</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  imageContainer: {
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  thumbnailContainer: {
    padding: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: '#4CAF50',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  equipmentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equipmentCategory: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  priceContainer: {
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceDay: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 5,
  },
  readMoreText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '600',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ownerImagePlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  memberSince: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceActionContainer: {},
  actionBarPriceLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionBarPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EquipmentDetailScreen; 