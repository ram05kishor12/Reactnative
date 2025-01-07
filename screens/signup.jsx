import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const storeData = async () => {
    if (username && password) {
      try {
        const existingData = await AsyncStorage.getItem('accounts');
        let accounts = existingData ? JSON.parse(existingData) : [];
        const accountExists = accounts.some((account) => account.username === username);
        if (accountExists) {
          Toast.show({ type: 'error', text1: 'This username is already taken' });
          return;
        }
        accounts.push({ username, password });
        await AsyncStorage.setItem('accounts', JSON.stringify(accounts));
        Toast.show({ type: 'success', text1: 'Account created successfully!' });
        navigation.navigate('Login');
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Failed to save data' });
      }
    } else {
      Toast.show({ type: 'error', text1: 'Please fill in all fields!' });
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <Text className="text-3xl font-bold text-red-600 mb-6">Sigining as New</Text>
      {/* <Image source={require('../assests/SS.png')} className="w-32 h-32 mb-8" /> */}
      <View className="w-80 mb-4">
        <Text className="text-md font-medium text-zinc-700 mb-2">Username</Text>
        <TextInput
          placeholder="Enter your username"
          className="w-full h-16 bg-white border border-gray-300 rounded-lg px-4 shadow-sm"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="w-80 mb-6">
        <Text className="text-md font-medium text-zinc-700 mb-2">Password</Text>
        <TextInput
          placeholder="Enter your password"
          className="w-full h-16 bg-white border border-gray-300 rounded-lg px-4 shadow-sm"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="w-72 h-14 bg-black rounded-lg justify-center items-center shadow-md mb-4"
        onPress={storeData}
      >
        <Text className="text-white text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>

      {/* Navigation to Login */}
      <Text className="text-sm text-gray-600">
        Already have an account?{' '}
        <Text
          className="text-blue-600 font-bold"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </Text>

      <Toast />
    </View>
  );
};

export default SignUp;
