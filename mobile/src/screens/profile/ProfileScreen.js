import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile')
    },
    {
      id: 'my_bookings',
      title: 'My Bookings',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('Bookings', { screen: 'BookingHistory' })
    },
    {
      id: 'payment_methods',
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'language-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    },
    {
      id: 'about',
      title: 'About GramiGo',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    }
  ];

  // Add provider-specific menu items if user is a provider
  if (user?.role === 'provider') {
    menuItems.splice(2, 0, {
      id: 'my_equipment',
      title: 'My Equipment',
      icon: 'car-outline',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!')
    });
  }

  const renderMenuItem = (item) => {
    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.menuItem}
        onPress={item.onPress}
      >
        <View style={styles.menuIconContainer}>
          <Ionicons name={item.icon} size={22} color="#4CAF50" />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userRole}>
          {user?.role === 'farmer' ? 'Farmer' : 
           user?.role === 'provider' ? 'Equipment Provider' : 
           user?.role === 'admin' ? 'Administrator' : 'User'}
        </Text>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoItem}>
          <Ionicons name="mail-outline" size={18} color="#666" />
          <Text style={styles.userInfoText}>{user?.email || 'Email not provided'}</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.userInfoText}>{user?.phone || 'Phone not provided'}</Text>
        </View>
        {user?.address && (
          <View style={styles.userInfoItem}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.userInfoText}>
              {[
                user.address.street,
                user.address.city,
                user.address.state,
                user.address.postalCode,
                user.address.country
              ].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color="#F44336" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  editProfileButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginVertical: 20,
  },
});

export default ProfileScreen; 