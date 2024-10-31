import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import { scale, verticalScale } from '../utils/scaling';
import Header from './Header';

const states = [
  { label: "AndhraPradesh", value: "AndhraPradesh" },
  { label: "ArunachalPradesh", value: "ArunachalPradesh" },
  { label: "Assam", value: "Assam" },
  { label: "Bihar", value: "Bihar" },
  { label: "Chhattisgarh", value: "Chhattisgarh" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Haryana", value: "Haryana" },
  { label: "HimachalPradesh", value: "HimachalPradesh" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "MadhyaPradesh", value: "MadhyaPradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Manipur", value: "Manipur" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Odisha", value: "Odisha" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "TamilNadu", value: "TamilNadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Tripura", value: "Tripura" },
  { label: "UttarPradesh", value: "UttarPradesh" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "WestBengal", value: "WestBengal" },
  { label: "AndamanNicobar", value: "AndamanNicobar" },
  { label: "Chandigarh", value: "Chandigarh" },
  { label: "DadraNagarHaveliDamanDiu", value: "DadraNagarHaveliDamanDiu" },
  { label: "Lakshadweep", value: "Lakshadweep" },
  { label: "Delhi", value: "Delhi" },
  { label: "Puducherry", value: "Puducherry" }
];


const Weather = () => {
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [uvIndex, setUvIndex] = useState([]);
  const [wind, setWind] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCities, setIsFetchingCities] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    if (selectedState) {
      setCity(''); // Reset city whenever state changes
      fetchCities();
    }
  }, [selectedState]);

  const fetchCities = async () => {
    setIsFetchingCities(true);
    const requestBody = JSON.stringify({ state: selectedState });

    try {
      const response = await fetch('https://backen-skin-care-app.vercel.app/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        console.error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsFetchingCities(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const requestBody = JSON.stringify({ state: selectedState, city });

    try {
      const [weatherResponse, uvIndexResponse, windResponse] = await Promise.all([
        fetch('https://backen-skin-care-app.vercel.app/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        }),
        fetch('https://backen-skin-care-app.vercel.app/uvindex', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        }),
        fetch('https://backen-skin-care-app.vercel.app/wind', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        }),
      ]);

      const weatherData = await weatherResponse.json();
      const uvIndexData = await uvIndexResponse.json();
      const windData = await windResponse.json();

      setWeatherData(weatherData.slice(0, 2));
      setUvIndex(uvIndexData.slice(0, 2));
      setWind(windData.slice(0, 3));
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Pick Your State:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setStateModalVisible(true)}
        >
          <Text>{selectedState ? selectedState : 'Choose State'}</Text>
        </TouchableOpacity>

        <Modal visible={stateModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={states}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedState(item.label);
                      setStateModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Close" onPress={() => setStateModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <Text style={styles.pickerLabel}>Choose Your City:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCityModalVisible(true)}
          disabled={cities.length === 0}
        >
          {isFetchingCities ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text>{city ? city : 'Choose City'}</Text>
          )}
        </TouchableOpacity>

        <Modal visible={cityModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={cities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCity(item);
                      setCityModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Close" onPress={() => setCityModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <Button title="Get Weather Details" onPress={fetchData} color="#007AFF" />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image
            source={require('../assets/1495.gif')}
            style={styles.loadingImage}
          />
          <Text style={styles.loadingText}>Fetching the latest data...</Text>
        </View>
      ) : (
        dataFetched && (
          <ScrollView style={styles.dataContainer}>
            <Text style={styles.title}>Current Weather</Text>
            <View style={styles.table}>
              {weatherData.map((row, index) => (
                <View key={index} style={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <Text key={cellIndex} style={styles.cell}>{cell}</Text>
                  ))}
                </View>
              ))}
            </View>

            <Text style={styles.title}>UV Index</Text>
            <View style={styles.table}>
              {uvIndex.map((row, index) => (
                <View key={index} style={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <Text key={cellIndex} style={styles.cell}>{cell}</Text>
                  ))}
                </View>
              ))}
            </View>

            <Text style={styles.title}>Wind Direction</Text>
            <View style={styles.table}>
              {wind.map((row, index) => (
                <View key={index} style={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <Text key={cellIndex} style={styles.cell}>{cell}</Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    padding: scale(20),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: scale(10),
    margin: scale(10),
  },
  pickerLabel: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(5),
    padding: verticalScale(10),
    marginBottom: verticalScale(10),
    width: '100%',
    backgroundColor: '#fafafa',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginTop:verticalScale(50),
    marginBottom: verticalScale(30),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingImage: {
    width: scale(80),
    height: scale(80),
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: scale(16),
    color: '#555',
  },
  dataContainer: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'bold',
    marginVertical: verticalScale(10),
    textAlign: 'center',
    color: '#333',
  },
  dataContainer: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: verticalScale(10),
    backgroundColor: 'lightblue',
    padding: verticalScale(10),
    borderRadius: scale(10),
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: verticalScale(10),
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    fontWeight: 'bold',
    color: 'red',
  },
});

export default Weather;
