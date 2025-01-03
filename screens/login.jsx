import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username && password) {
      try {
        const saved = await AsyncStorage.getItem('accounts');
        if (saved) {
          const accounts = JSON.parse(saved);
          const account = accounts.find(
            (acc) => acc.username === username && acc.password === password
          );
          if (account) {
            navigation.replace('Tabs');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Invalid Credentials',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'No accounts found. Please sign up first.',
          });
        }
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch the data from storage',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields!',
      });
    }
  };

  return (
    <View style={styles.body}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={styles.image} source={require('../assests/SS.png')} />
        <Text style={styles.text}>Login Page</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          placeholder="Username"
          value={username}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
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

export default Login;
