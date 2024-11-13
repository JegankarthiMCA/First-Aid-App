import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDoubtsScreen = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://172.16.22.187:8080/api/admin/doubts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoubts(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch doubts');
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Doubts</Text>
      <FlatList
        data={doubts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.doubtContainer}>
            <Text style={styles.doubtText}>User: {item.name}</Text>
            <Text style={styles.doubtText}>Email: {item.email}</Text>
            <Text style={styles.doubtText}>Phone: {item.phoneNumber}</Text>
            <Text style={styles.doubtText}>Doubt: {item.doubt}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDoubtsText}>No doubts available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',  // Centers the text horizontally
    marginBottom: 20,
    color: '#ffffff',
  },
  doubtContainer: {
    padding: 15,
    backgroundColor: '#cd6155',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  doubtText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff'
  },
  noDoubtsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});

export default AdminDoubtsScreen;
