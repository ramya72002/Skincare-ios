import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, ScrollView, Modal, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import Field from './Field';
import { scale, verticalScale } from '../utils/scaling';

const languages = [
  { label: 'Assamese', value: 'as' },
  { label: 'Awadhi', value: 'awa' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bhojpuri', value: 'bho' },
  { label: 'Chhattisgarhi', value: 'chg' },
  { label: 'Dogri', value: 'doi' },
  { label: 'English', value: 'en' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Haryanvi', value: 'hne' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kashmiri', value: 'ks' },
  { label: 'Konkani', value: 'kok' },
  { label: 'Maithili', value: 'mai' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Manipuri', value: 'mni' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Odia', value: 'or' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Sanskrit', value: 'sa' },
  { label: 'Santali', value: 'sat' },
  { label: 'Sindhi', value: 'sd' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Urdu', value: 'ur' }
];

const Login = ({ navigation }) => {
  const route = useRoute();
  const [email, setEmail] = useState(route.params?.email || '');
  const [contactNumber, setContactNumber] = useState(route.params?.contactNumber || '');
  const [name, setName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('loginData');
        if (storedData) {
          const userData = JSON.parse(storedData);
          setEmail(userData.email);
          setContactNumber(userData.contactNumber);
          setName(userData.name);
          setPreferredLanguage(userData.preferredLanguage);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const getLanguageLabel = () => {
    const language = languages.find(lang => lang.value === preferredLanguage);
    return language ? language.label : 'Choose Language';
  };

  const handleLogin = async () => {
    if (!email || !contactNumber) {
      Alert.alert('Error', 'Email and contact number are required');
      return;
    }

    setLoading(true);
    const loginData = { email, contactNumber, preferredLanguage, name };

    try {
      const response = await fetch('https://backen-skin-care-app.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        Alert.alert('Message', responseData.error || 'Please Signup To Login');
        return;
      }

      const userData = {
        ...loginData,
        name: responseData.name,
        preferredLanguage: responseData.preferredLanguage,
      };

      await AsyncStorage.setItem('loginData', JSON.stringify(userData));
      navigation.navigate('Categories', { preferredLanguage: userData.preferredLanguage });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Please Signup To Login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={require('./1495.gif')} style={styles.loadingImage} />
      </View>
    );
  }

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.loginText}>Step into SkinSaathi</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.loginPromptText}>Unlock your personalized skin insights</Text>
          <Field
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            placeholder="Contact Number"
            keyboardType="numeric"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          <View style={styles.languageContainer}>
            <Text style={styles.languageLabel}>Preferred Language: </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.languageButton}>
              <Text style={styles.languageButtonText}>{getLanguageLabel()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <Btn
              textColor="white"
              bgColor={darkGreen}
              btnLabel="Login"
              Press={handleLogin}
            />
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLinkText}>Signup</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>Designed and Developed by NVision IT</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setPreferredLanguage(item.value);
                    setModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </Background>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  loginText: {
    color: 'white',
    fontSize: scale(30),
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 250,
    paddingTop: verticalScale(70),
    paddingHorizontal: scale(40),
    height: verticalScale(700),
    width: '120%',
    maxWidth: scale(400),
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: scale(28),
    color: darkGreen,
    fontWeight: '600',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  loginPromptText: {
    color: '#333',
    fontSize: scale(14),
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  languageContainer: {
    marginBottom: verticalScale(20),
  },
  languageLabel: {
    color: '#333',
    fontSize: scale(16),
    marginBottom: verticalScale(8),
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    alignItems: 'center',
  },
  languageButtonText: {
    color: darkGreen,
    fontSize: scale(16),
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
  },
  signupText: {
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  signupLinkText: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: scale(14),
    marginLeft: scale(5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalItemText: {
    fontSize: scale(16),
    color: '#333',
  },
});

export default Login;
