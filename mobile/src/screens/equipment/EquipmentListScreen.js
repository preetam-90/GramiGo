import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const EquipmentListScreen = ({ navigation, route }) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: route.params?.category || '',
    nearby: route.params?.nearby || false,
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  
  // Categories for filter
  const categories = [
    'all',
    'tractor',
    'harvester',
    'seeder',
    'sprayer',
    'plow',
    'irrigation',
    'drone'
  ];

  useEffect(() => {
    fetchEquipment();
  }, [filters.category, filters.nearby]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      
      let url = `${API_URL}/equipment?`;
      
      // Add category filter if selected
      if (filters.category && filters.category !== 'all') {
        url += `category=${filters.category}&`;
      }
      
      // Add nearby filter if selected
      if (filters.nearby) {
        url += 'nearby=true&';
      }
      
      // Add price range if specified
      if (filters.minPrice) {
        url += `minPrice=${filters.minPrice}&`;
      }
      
      if (filters.maxPrice) {
        url += `maxPrice=${filters.maxPrice}&`;
      }
      
      // Add sorting
      url += `sort=${filters.sort}`;
      
      const response = await axios.get(url);
      setEquipment(response.data.data || []);
      
    } catch (error) {
      console.log('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEquipment();
  };

  const handleCategorySelect = (category) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'all' ? '' : category
    }));
  };

  const renderCategoryFilter = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryFilterItem,
              filters.category === category || (category === 'all' && !filters.category)
                ? styles.categoryFilterItemActive
                : null
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryFilterText,
                filters.category === category || (category === 'all' && !filters.category)
                  ? styles.categoryFilterTextActive
                  : null
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderEquipmentItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.equipmentItem}
        onPress={() => navigation.navigate('EquipmentDetail', { id: item._id })}
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
          <View style={styles.equipmentDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>₹{item.pricing?.ratePerHour}/hr</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <View style={styles.ratingValue}>
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {item.ratings?.average ? item.ratings.average.toFixed(1) : '0.0'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location?.address?.city || 'Location not available'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {renderCategoryFilter()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : equipment.length > 0 ? (
        <FlatList
          data={equipment}
          renderItem={renderEquipmentItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No equipment found</Text>
          <Text style={styles.emptySubtext}>Try changing your filters or search query</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryFilterContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  categoryFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryFilterItemActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
  },
  categoryFilterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  equipmentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
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
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  equipmentInfo: {
    flex: 1,
    padding: 10,
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
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  equipmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 12,
    color: '#999',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {},
  ratingLabel: {
    fontSize: 12,
    color: '#999',
  },
  ratingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
});

export default EquipmentListScreen; 