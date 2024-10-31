import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Dimensions, Modal, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const scaleWidth = width / 375;
const scaleHeight = height / 667;

const FindDermatologist = () => {
  const navigation = useNavigation();
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [FindDermatologistData, setFindDermatologistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);

  const bannerImages = [
    require('./dermaBanner/derma.png'),
    require('./dermaBanner/derma1.png'),
    require('./dermaBanner/derma2.png'),
    require('./dermaBanner/derma3.png'),
  ];

  const states = [
    "AndhraPradesh",
    "ArunachalPradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "HimachalPradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "MadhyaPradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "TamilNadu",
    "Telangana",
    "Tripura",
    "UttarPradesh",
    "Uttarakhand",
    "WestBengal",
    "AndamanNicobar",
    "Chandigarh",
    "DadraNagarHaveliDamanDiu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
  ];

  useEffect(() => {
    if (selectedState) {
      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    const bannerInterval = startBannerSlideshow();
    return () => {
      clearInterval(bannerInterval);
    };
  }, []);

  const startBannerSlideshow = () => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prevIndex => (prevIndex + 1) % bannerImages.length);
    }, 4000);
    return interval;
  };

  const fetchCities = async () => {
    const requestBody = JSON.stringify({ state: selectedState });
    try {
      const response = await fetch('https://backen-skin-care-app.vercel.app/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
        setError(null); // Reset error on successful fetch
      } else {
        setError('Failed to fetch cities. Please try again.');
        console.error('Failed to fetch cities');
      }
    } catch (error) {
      setError('Error fetching cities: ' + error.message);
      console.error('Error fetching cities:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true); // Ensure loading starts at the beginning
    setError(null); // Reset error on new fetch attempt
    const requestBody = JSON.stringify({ state: selectedState, city });

    try {
      const response = await fetch('https://backen-skin-care-app.vercel.app/Doctordetails1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      if (response.ok) {
        const responseData = await response.json();
        const FindDermatologistData = responseData.true;
        setFindDermatologistData(FindDermatologistData);
        setLoading(false);
        setShowBanner(false);
      } else {
        setError('Failed to fetch dermatologist data. Please try again.');
        console.error('Failed to fetch data');
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Ensure loading is stopped in case of error
    }
  };

  const handlePhonePress = (phone) => {
    if (!phone) {
      Alert.alert("Error", "No phone number available.");
      return;
    }
  
    const formattedPhone = phone.replace(/[^+\d]/g, ''); // Removes everything except digits and +
  
    const phoneRegex = /^\+?\d{10,15}$/; // Allows + and 10-15 digits
  
    if (!phoneRegex.test(formattedPhone)) {
      Alert.alert("Invalid Phone Number", `Please provide a valid phone number: ${formattedPhone}`);
      return;
    }
  
    Alert.alert(
      "Call Dermatologist",
      `Do you want to call ${formattedPhone}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => {
            Linking.openURL(`tel:${formattedPhone}`)
              .catch(err => {
                console.error("Failed to open URL:", err);
                Alert.alert("Error", "Unable to place the call. Please try again.");
              });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {showBanner && (
        <Image
          style={styles.banner}
          source={bannerImages[currentBannerIndex]}
          resizeMode="cover"
        />
      )}

      <Text style={styles.mainHeading}>Find Your Dermatologist in One Click</Text>
      <Text style={styles.subHeading}>Choose your state and city to locate nearby specialists.</Text>

      {/* State Selection Button */}
      <TouchableOpacity style={styles.input} onPress={() => setStateModalVisible(true)}>
        <Text style={styles.inputText}>
          {selectedState ? selectedState : "Select State"}
        </Text>
      </TouchableOpacity>

      {/* City Selection Button */}
      <TouchableOpacity style={styles.input} onPress={() => setCityModalVisible(true)}>
        <Text style={styles.inputText}>
          {city ? city : "Select City"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={fetchData}
        disabled={!selectedState || !city || loading}
      >
        <Text style={styles.buttonText}>Find Nearby Dermatologist</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#94499c" style={styles.loader} />
        ) : (
          FindDermatologistData.filter(item => item.phone).map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.itemText, styles.doctorName]}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Address: {item.address}</Text>
              <Text style={styles.itemText}>City: {item.city}</Text>
              <TouchableOpacity onPress={() => handlePhonePress(item.phone)}>
                <Text style={[styles.itemText, styles.phoneLink]}>Phone: {item.phone}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Categories')}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Weather')}>
          <Ionicons name="cloud" size={24} color="white" />
          <Text style={styles.tabText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="white" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Modals for State and City Selection */}
      <Modal visible={stateModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select State</Text>
            <FlatList
              data={states}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setSelectedState(item);
                  setStateModalVisible(false);
                }}>
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setStateModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={cityModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select City</Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setCity(item);
                  setCityModalVisible(false);
                }}>
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setCityModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  banner: {
    width: '100%',
    height: height * 0.3, // Adjust height based on screen size
    borderRadius: 10,
  },
  mainHeading: {
    fontSize: 22 * scaleWidth,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    // marginVertical: 10,
  },
  subHeading: {
    fontSize: 16 * scaleWidth,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16 * scaleWidth,
  },
  button: {
    backgroundColor: '#94499c',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16 * scaleWidth,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 15 * scaleWidth,
    color: '#333', // Darker text color for contrast
  },
  doctorName: {
    fontSize: 16 * scaleWidth,
    fontWeight: 'bold', // Bold for doctor's name
    color: '#94499c', // Color for doctor's name
  },
  phoneLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#94499c',
    padding: 10,
    width: '100%',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    marginTop:50,
    marginBottom:50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default FindDermatologist;
