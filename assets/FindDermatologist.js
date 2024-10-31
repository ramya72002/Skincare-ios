import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Dimensions, Modal, FlatList } from 'react-native';
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
  ]
  

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

      <ScrollView style={styles.scrollContainer}>
  {loading ? (
    <ActivityIndicator size="large" color="#94499c" style={styles.loader} />
  ) : (
    FindDermatologistData.filter(item => item.phone).map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={[styles.itemText, styles.doctorName]}>Name: {item.name}</Text>
        <Text style={styles.itemText}>Address: {item.address}</Text>
        <Text style={styles.itemText}>City: {item.city}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
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

      {/* Modal for City Selection */}
      <Modal
        transparent={true}
        visible={cityModalVisible}
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a City</Text>
          <FlatList
            data={cities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setCity(item);
                  setCityModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCityModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal for State Selection */}
      <Modal
        transparent={true}
        visible={stateModalVisible}
        animationType="slide"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a State</Text>
          <FlatList
            data={states}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedState(item);
                  setStateModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setStateModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  banner: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 10,
    marginBottom: 20,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 16,
  },
  button: {
    width: '90%',
    padding: 15,
    backgroundColor: '#94499c',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    width: '100%',
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#e6e6e6', // Lighter background color for item containers
    padding: 15 * scaleWidth,
    marginBottom: 10 * scaleHeight,
    marginLeft: 10 * scaleWidth,
    marginRight: 10 * scaleWidth,
    borderRadius: 10 * scaleWidth,
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
  loader: {
    marginTop: 20,
  },
});

export default FindDermatologist;
