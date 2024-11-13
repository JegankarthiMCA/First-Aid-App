
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function StudentDashboard() {
  const [vehicles, setVehicles] = useState([]); // State to store all vehicles
  const [routes, setRoutes] = useState([]); // State to store routes for a selected vehicle
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Selected vehicle
  const [selectedRoute, setSelectedRoute] = useState(null); // State for the selected route
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const navigation = useNavigation(); // Using navigation hook

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('http://172.16.22.187:8080/api/admin/vehicles', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVehicles(response.data);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message || 'Failed to load data');
        } else if (error.request) {
          setError('No response from the server');
        } else {
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Function to fetch routes for the selected vehicle
  const handleVehiclePress = async (vehicleId) => {
    setSelectedVehicle(vehicleId); // Set the selected vehicle
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://172.16.22.187:8080/api/admin/routes/vehicle/${vehicleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoutes(response.data); // Update state with routes for the selected vehicle
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to load prescription');
      } else if (error.request) {
        setError('No response from the server');
      } else {
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to show the route details in a popup
  const showRouteDetails = (route) => {
    setSelectedRoute(route); // Set the selected route
    setModalVisible(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false); // Close the modal
    setSelectedRoute(null); // Clear the selected route
  };

  const handleViewProfile = () => {
    navigation.navigate('ProfileScreen'); // Navigate to the Profile screen
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleDoubt = () => {
    navigation.navigate('DoubtScreen'); // Navigate to the Doubt screen
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Animatable.Image
        source={require('../screens/user.png')}
        style={styles.logo}
        animation="zoomIn"
        duration={3000}
      />

      <Text style={styles.subtitle}>Select a Organs to View Prescription</Text>

      {/* List of vehicles */}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vehicleButton}
            onPress={() => handleVehiclePress(item._id)}
          >
            <Text style={styles.vehicleButtonText}>
              {item.vehicleNumber} - {item.model}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noVehiclesText}>No Prescription available</Text>}
        contentContainerStyle={styles.vehicleList}
      />

      {/* List of routes for the selected vehicle */}
      {selectedVehicle && (


        <FlatList
          data={routes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.routeItemContainer}
              onPress={() => showRouteDetails(item)}
            >
              <Text style={styles.routeItem}>{item.routeName}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noRoutesText}>No Prescription available for this Organs</Text>}
          contentContainerStyle={styles.routeList}
        />

      )}

      {/* Modal for displaying route details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRoute && (
              <>
                <Text style={styles.modalHeader}>Organs Details</Text>
                <ScrollView>
                  <Text style={styles.modalText}>Pain Type: {selectedRoute.routeName}</Text>
                  <Text style={styles.modalText}>Body Part: {selectedRoute.vehicle.vehicleNumber}</Text>
                  {/* <Text style={styles.modalText}>Prescription Id: {selectedRoute.vehicle.capacity}</Text> */}

                  {/* List of stops */}
                  <Text style={styles.modalSubheader}>Prescription:</Text>
                  {selectedRoute.stops.map((stop, index) => (
                    <View key={index} style={styles.modalStopContainer}>
                      <Text style={styles.modalStopText}>Instruction: {stop.stopName}</Text>
                      <Text style={styles.modalStopText}>Tablet needed: {stop.timing}</Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* View Profile Button */}
      <TouchableOpacity style={styles.profileButton} onPress={handleViewProfile}>
        <Text style={styles.profileButtonText}>Profile</Text>
      </TouchableOpacity>

      {/* Doubt Button */}
      <TouchableOpacity style={styles.doubtButton} onPress={handleDoubt}>
        <Text style={styles.doubtButtonText}>Doubt Portal</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#34495e',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
    marginVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vehicleList: {
    paddingVertical: 5,
  },
  vehicleButton: {
    backgroundColor: '#1abc9c',
    borderRadius: 35,
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  vehicleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeList: {
    paddingVertical: 25,
  },
  routeItemContainer: {
    backgroundColor: '#85c1e9',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  routeItem: {
    color: '#ffffff',
    fontSize: 10,
  },
  noVehiclesText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  noRoutesText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  profileButton: {
    backgroundColor: '#27ae60',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  profileButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doubtButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  doubtButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#ecf0f1',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#85c1e9',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalSubheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  modalStopContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: 30,
    marginBottom: 5,
  },
  modalStopText: {
    fontSize: 14,
  },
  modalCloseButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
