import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setemail] = useState(''); // New state for email
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://172.16.22.187:8080/api/auth/register', {
        username,
        password,
        phoneNumber,
        email, // Include email in the request
      });

      Alert.alert('Signup Successful', 'You can now log in');
      navigation.navigate('Login'); // Navigate to Login screen after successful signup
    } catch (error) {
      Alert.alert('Signup failed', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require('../screens/create.png')}
        style={styles.logo}
        animation="zoomIn"
        duration={3000}
      />
      <Text style={styles.title}>Create Account</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor="#b0b0b0"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#b0b0b0"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input} // New email input field
        placeholder="email"
        placeholderTextColor="#b0b0b0"
        value={email}
        onChangeText={setemail}
        keyboardType="email-address" // Set keyboard type for email input
      />
      <TouchableOpacity style={styles.button1} onPress={handleSignup}>
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
  button1: {
    backgroundColor: 'green',
    borderRadius: 35,
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
    width: 110,
    height: 130,
    marginBottom: 10,
    alignSelf: 'center',
  },
});
