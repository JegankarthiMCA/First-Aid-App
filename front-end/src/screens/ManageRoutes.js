import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For AsyncStorage
import { Picker } from '@react-native-picker/picker'; // Import Picker
import * as Animatable from 'react-native-animatable';

export default function ManageRoutes({ navigation }) {
  const [routeName, setRouteName] = useState('');
  const [stopName, setStopName] = useState('');
  const [timing, setTiming] = useState('');
  const [stops, setStops] = useState([]);
  const [vehicleId, setVehicleId] = useState(''); // Vehicle ID for the route
  const [vehicles, setVehicles] = useState([]); // List of vehicles

  useEffect(() => {
    // Fetch vehicles for route assignment
    const fetchVehicles = async () => {
      const token = await getToken(); // Retrieve token for authorization
      try {
        const response = await axios.get('http://172.16.22.187:8080/api/admin/vehicles', {
          headers: { Authorization: `Bearer ${token}` } // Add token to request header
        });
        setVehicles(response.data);
        // Automatically set the first vehicle as the default option
        if (response.data.length > 0) {
          setVehicleId(response.data[0]._id);
        }
      } catch (error) {
        handleError(error, 'Failed to load Organs');
      }
    };

    fetchVehicles();
  }, []);

  // Function to get token from AsyncStorage (or wherever you are storing it)
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      return token;
    } catch (e) {
      console.log('Failed to get token');
    }
  };

  const handleAddStop = () => {
    setStops([...stops, { stopName, timing }]);
    setStopName('');
    setTiming('');
  };

  const handleAddRoute = async () => {
    const token = await getToken(); // Retrieve token

    try {
      const response = await axios.post('http://172.16.22.187:8080/api/admin/routes', {
        routeName,
        stops,
        vehicle: vehicleId, // Include selected vehicleId
      }, {
        headers: { Authorization: `Bearer ${token}` } // Include token in request header
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Prescription added successfully');
        navigation.navigate('AdminDashboard'); // Navigate to dashboard after success
      } else {
        Alert.alert('Error', `Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      handleError(error, 'Failed to add Prescription');
    }
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      // Server responded with a status code out of the 2xx range
      Alert.alert('Error', error.response.data.message || defaultMessage);
    } else if (error.request) {
      // The request was made but no response was received
      Alert.alert('Error', 'No response from the server');
    } else {
      // Something happened in setting up the request
      Alert.alert('Error', `Request error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription about Organs  </Text>
      <Animatable.Image
        source={require('../screens/prescription.png')} // Local image (put your image in the assets folder)
        style={styles.logo}
        animation="zoomIn"
        duration={3000}
      />

      <Text style={styles.label}>Organs: </Text>
      {/* Picker for selecting vehicle ID */}
      <Picker
        selectedValue={vehicleId}
        onValueChange={(itemValue) => setVehicleId(itemValue)}
        style={styles.picker}
      >
        {vehicles.map((vehicle) => (
          <Picker.Item key={vehicle._id} label={vehicle.vehicleNumber} value={vehicle._id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Type of pain"
        placeholderTextColor="#999999" // Placeholder text color
        value={routeName}
        onChangeText={setRouteName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prescription"
        placeholderTextColor="#999999" // Placeholder text color
        value={stopName}
        onChangeText={setStopName}
      />
      <TextInput
        style={styles.input}
        placeholder="Count"
        placeholderTextColor="#999999" // Placeholder text color
        value={timing}
        onChangeText={setTiming}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddStop}>
        <Text style={styles.buttonText}>Add Prescription</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Prescription: </Text>
      <FlatList
        data={stops}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.stopItemContainer}>
            <Text style={styles.stopItem}>{item.stopName} - {item.timing}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddRoute}>
        <Text style={styles.buttonText}>Add Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85929e', // Black background
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 20,
    color: '#ffffff', // White text
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    color: '#ffffff', // White text
    marginBottom: 10,
    alignSelf: 'flex-start', // Align label to the left
  },
  input: {
    height: 40,
    borderColor: '#ffffff', // White border
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#ffffff', // White text
    backgroundColor: '#1c1c1c', // Dark gray background for input
    borderRadius: 5,
    width: width - 40, // Ensure input width fits the screen
  },
  picker: {
    height: 50,
    width: width - 40, // Ensure picker width fits the screen
    color: '#ffffff', // White text color
    backgroundColor: '#1c1c1c', // Dark gray background
    borderColor: '#ffffff', // White border
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff', // White background for button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: width - 40, // Ensure button width fits the screen
  },
  buttonText: {
    color: '#000000', // Black text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopItemContainer: {
    backgroundColor: '#333333', // Darker background for stop items
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: width - 40, // Ensure stop item width fits the screen
  },
  stopItem: {
    color: '#ffffff', // White text for stops
    fontSize: 16,
  },
  logo: {
    width: 185, // Adjust the size of the image
    height: 120,
    marginBottom: 10,
    alignSelf: 'center', // Center the image horizontally
  },
});
