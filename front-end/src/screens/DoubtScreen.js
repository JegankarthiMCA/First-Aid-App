import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function DoubtScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState(''); // State for Gmail Account
  const [phoneNumber, setPhoneNumber] = useState('');
  const [doubt, setdoubt] = useState(''); // State for doubt explanation

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage for authorization
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Send the doubt data to the backend
      const response = await axios.post(
        'http://172.16.22.187:8080/api/admin/doubt',
        {
          doubt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Doubt Submitted', 'Your doubt has been successfully submitted.');
      navigation.navigate('StudentDashboard'); // Navigate back to the StudentDashboard screen
    } catch (error) {
      Alert.alert('Submission failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require('../screens/doubt.png')}
        style={styles.logo}
        animation="zoomIn"
        duration={3000}
      />
      <Text style={styles.title}>Doubt Portal</Text>
    
      <TextInput
        style={[styles.input, { height: 100 }]} // Set multiline input box height
        placeholder="Explain about the Doubt"
        placeholderTextColor="#b0b0b0"
        value={doubt}
        onChangeText={setdoubt}
        multiline={true} // Allow multiline input
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#34495e',
  },
  title: {
    fontSize: 28,
    color: '#d5dbdb',
    marginBottom: 60,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
