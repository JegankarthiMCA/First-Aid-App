import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.16.22.187:8080/api/auth/login', {
        username,
        password,
      });

      const { token, role } = response.data;

      // Store token and role in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);

      // Navigate to appropriate screen based on role
      if (role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else if (role === 'user') {
        navigation.navigate('StudentDashboard');
      }
    } catch (error) {
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  const handleSignup = () => {
    // Navigate to the SignUp screen (add the screen to your navigation stack)
    navigation.navigate('SignUp'); // This should match the name used in Stack.Screen
  };

  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require('../screens/first-aid.png')} // Local image (put your image in the assets folder)
        style={styles.logo}
        animation="zoomIn"
        duration={3000}
      />
      <Text style={styles.title}>First Aid-Box App</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#b0b0b0"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#b0b0b0"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button1} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#17202a',
  },
  title: {
    fontSize: 28,
    color: 'green',
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
  button1: {
    backgroundColor: 'green',
    borderRadius: 35,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button2: {
    backgroundColor: 'blue',
    borderRadius: 35,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 200, // Adjust the size of the image
    height: 200,
    marginBottom: 10,
    alignSelf: 'center', // Center the image horizontally
  },
});
