import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      navigation.navigate('Login');
    } catch (error) {

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Animatable.Image
          source={require('../screens/admin.png')} // Local image (put your image in the assets folder)
          style={styles.logo}
          animation="zoomIn"
          duration={3000}
        />


        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageVehicles')}>
          <Text style={styles.buttonText}>Add BodyPart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageRoutes')}>
          <Text style={styles.buttonText}>Description and solution</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageStudents')}>
          <Text style={styles.buttonText}>User Doubt Portal</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Check Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85c1e9',
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5b2c6f',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#9b59b6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 150, // Adjust the size of the image
    height: 300,
    marginBottom: 30,
    alignSelf: 'center', // Center the image horizontally
  },
});
