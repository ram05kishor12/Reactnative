import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const storeData = async () => {
    if (username && password) {
      try {
        const existingData = await AsyncStorage.getItem('accounts');
        let accounts = existingData ? JSON.parse(existingData) : [];
        const accountExists = accounts.some((account) => account.username === username);
        if (accountExists) {
          Toast.show({
            type: 'error',
            text1: 'This username is already taken',
          });
          return;
        }
        accounts.push({ username, password });
        await AsyncStorage.setItem('accounts', JSON.stringify(accounts));
        Toast.show({
          type: 'success',
          text1: 'Account created successfully!',
        });
        navigation.navigate('Login');
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Failed to save the data to storage',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields!',
      });
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('accounts');
      if (value !== null) {
        const accounts = JSON.parse(value);
        Toast.show({
          type: 'info',
          text1: 'Accounts retrieved successfully',
          text2: JSON.stringify(accounts),
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'No accounts found',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch the data from storage',
      });
    }
  };

  return (
    <View style={styles.body}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={styles.image} source={require('../assests/SS.png')} />
        <Text style={styles.text}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={storeData}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={{ color: 'blue' }}
            onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
        <Text style={styles.footerText}>
          <Text style={{ color: 'blue' }} onPress={getData}>
            Retrieve Saved Data
          </Text>
        </Text>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: 'red',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
});
