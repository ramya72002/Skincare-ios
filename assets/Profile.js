import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import { scale, verticalScale } from '../utils/scaling';

const { width, height } = Dimensions.get('window');
const scaleWidth = width / 375;
const scaleHeight = height / 667;

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const languages = [
    { label: "Assamese", value: "as" },
    { label: "Awadhi", value: "awa" },
    { label: "Bengali", value: "bn" },
    { label: "Bhojpuri", value: "bho" },
    { label: "Chhattisgarhi", value: "chg" },
    { label: "Dogri", value: "doi" },
    { label: "English", value: "en" },
    { label: "Gujarati", value: "gu" },
    { label: "Haryanvi", value: "hne" },
    { label: "Hindi", value: "hi" },
    { label: "Kannada", value: "kn" },
    { label: "Kashmiri", value: "ks" },
    { label: "Konkani", value: "kok" },
    { label: "Maithili", value: "mai" },
    { label: "Malayalam", value: "ml" },
    { label: "Manipuri", value: "mni" },
    { label: "Marathi", value: "mr" },
    { label: "Nepali", value: "ne" },
    { label: "Odia", value: "or" },
    { label: "Punjabi", value: "pa" },
    { label: "Sanskrit", value: "sa" },
    { label: "Santali", value: "sat" },
    { label: "Sindhi", value: "sd" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Urdu", value: "ur" },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const loginDataString = await AsyncStorage.getItem('loginData');
        if (loginDataString) {
          const loginData = JSON.parse(loginDataString);
          setProfileData(loginData);
          setPreferredLanguage(loginData.preferredLanguage || 'en');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigation]);

  const handleLanguageChange = async (itemValue) => {
    setPreferredLanguage(itemValue);
    const updatedProfileData = { ...profileData, preferredLanguage: itemValue };
    setProfileData(updatedProfileData);
    await AsyncStorage.setItem('loginData', JSON.stringify(updatedProfileData));
    navigation.navigate('Categories', { preferredLanguage: itemValue });
    setLanguageModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.headerText}>Profile</Text>
      <View style={styles.profileContainer}>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{profileData?.name}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profileData?.email}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{profileData?.contactNumber}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Language:</Text>
          <TouchableOpacity style={styles.languageButton} onPress={() => setLanguageModalVisible(true)}>
            <Text style={styles.languageButtonText}>{languages.find(lang => lang.value === preferredLanguage)?.label || "Select Language"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>Designed and Developed by NVision IT</Text>

      {/* Language Selection Modal */}
      <Modal
        transparent={true}
        visible={languageModalVisible}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Language</Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleLanguageChange(item.value)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setLanguageModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Existing styles...
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: scale(16),
    color: '#333',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
  },
  headerText: {
    fontSize: scale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
    color: '#94499c',
    textAlign: 'center',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(5),
    marginBottom: verticalScale(20),
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  label: {
    fontSize: scale(16),
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: scale(16),
    color: '#666',
    flex: 2,
  },
  pickerContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(5),
    marginLeft: scale(10),
  },
  picker: {
    height: verticalScale(40),
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#ff6961',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(5),
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    fontSize: scale(14),
    marginBottom: verticalScale(0),
    color: '#94499c',
  },

  languageButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(5),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(40),
  },
  languageButtonText: {
    fontSize: scale(16),
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalItem: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#94499c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Profile;
