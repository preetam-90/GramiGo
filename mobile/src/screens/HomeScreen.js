import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nearbyEquipment, setNearbyEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Equipment categories with icons
  const equipmentCategories = [
    { id: 1, name: 'Tractors', icon: 'car-outline', color: '#4CAF50' },
    { id: 2, name: 'Harvesters', icon: 'cut-outline', color: '#FF9800' },
    { id: 3, name: 'Seeders', icon: 'leaf-outline', color: '#2196F3' },
    { id: 4, name: 'Sprayers', icon: 'water-outline', color: '#9C27B0' },
    { id: 5, name: 'Plows', icon: 'construct-outline', color: '#795548' },
    { id: 6, name: 'Irrigation', icon: 'rainy-outline', color: '#00BCD4' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured equipment
        const featuredRes = await axios.get(`${API_URL}/equipment?limit=5&featured=true`);
        setFeaturedEquipment(featuredRes.data.data || []);
        
        // Fetch nearby equipment (if location permission granted)
        const nearbyRes = await axios.get(`${API_URL}/equipment/nearby?limit=5`);
        setNearbyEquipment(nearbyRes.data.data || []);
        
        // Set categories
        setCategories(equipmentCategories);
        
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Equipment', { 
        screen: 'EquipmentList',
        params: { category: item.name.toLowerCase() }
      })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render equipment item
  const renderEquipmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.equipmentItem}
      onPress={() => navigation.navigate('Equipment', {
        screen: 'EquipmentDetail',
        params: { id: item._id }
      })}
    >
      <Image 
        source={{ uri: item.images && item.images.length > 0 
          ? item.images[0] 
          : 'https://via.placeholder.com/150' 
        }}
        style={styles.equipmentImage}
      />
      <View style={styles.equipmentInfo}>
        <Text style={styles.equipmentName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.equipmentCategory}>{item.category}</Text>
        <View style={styles.equipmentPriceRow}>
          <Text style={styles.equipmentPrice}>₹{item.pricing?.ratePerHour}/hr</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={styles.ratingText}>
              {item.ratings?.average ? item.ratings.average.toFixed(1) : '0.0'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => navigation.navigate('Equipment', { screen: 'EquipmentList' })}
        >
          <Ionicons name="map-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Find the right equipment</Text>
          <Text style={styles.bannerSubtitle}>Book agricultural equipment on demand</Text>
          <TouchableOpacity 
            style={styles.bannerButton}
            onPress={() => navigation.navigate('Equipment', { screen: 'EquipmentList' })}
          >
            <Text style={styles.bannerButtonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={require('../assets/tractor-banner.png')} 
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Equipment */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Equipment</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Equipment', { screen: 'EquipmentList' })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {featuredEquipment.length > 0 ? (
          <FlatList
            data={featuredEquipment}
            renderItem={renderEquipmentItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipmentList}
          />
        ) : (
          <Text style={styles.noDataText}>No featured equipment available</Text>
        )}
      </View>

      {/* Nearby Equipment */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Equipment</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Equipment', { 
            screen: 'EquipmentList',
            params: { nearby: true }
          })}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {nearbyEquipment.length > 0 ? (
          <FlatList
            data={nearbyEquipment}
            renderItem={renderEquipmentItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipmentList}
          />
        ) : (
          <Text style={styles.noDataText}>No nearby equipment available</Text>
        )}
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#e8f5e9',
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
  },
  bannerImage: {
    width: 100,
    height: 100,
    marginRight: -10,
  },
  sectionContainer: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  equipmentList: {
    paddingHorizontal: 15,
  },
  equipmentItem: {
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  equipmentImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  equipmentInfo: {
    padding: 10,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  equipmentCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  equipmentPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});

export default HomeScreen; 