import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
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
            await AsyncStorage.setItem('userLoggedIn', 'true');
            navigation.navigate('Drawer');
          } else {
            Toast.show({ type: 'error', text1: 'Invalid Credentials' });
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
          text1: 'Failed to fetch data from storage',
        });
      }
    } else {
      Toast.show({ type: 'error', text1: 'Please fill all fields!' });
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">

      <Text className="text-3xl font-bold text-red-600 mb-6">Welcome Back</Text>
      {/* <Image source={require('../assests/SS.png')} className="w-32 h-32 mb-8" /> */}

      <View className="w-80 mb-4">
        <Text className="text-md font-medium text-zinc-700 mb-2">Username</Text>
        <TextInput
          placeholder="Enter your username"
          className="w-full h-14 bg-white border border-gray-300 rounded-lg px-4 shadow-sm"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View className="w-80 mb-6">
        <Text className="text-md font-medium text-zinc-700 mb-2">Password</Text>
        <TextInput
          placeholder="Enter your password"
          className="w-full h-14 bg-white border border-gray-300 rounded-lg px-4 shadow-sm"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        className="w-72 h-14 bg-black rounded-lg justify-center items-center shadow-md mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold">Login</Text>
      </TouchableOpacity>

      <Text className="text-sm text-gray-600">
        Don't have an account?{' '}
        <Text
          className="text-blue-600 font-bold"
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
        </Text>
      </Text>

      <Toast />
    </View>
  );
};

export default Login;
