import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
// import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from '@react-native-firebase/firestore';

const Signupfirebase = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Email and password are required',
          visibilityTime: 4000,
          autoHide: true,
        });
        return;
      }

      // Firebase Authentication - Create User
      const usercreds = await auth().createUserWithEmailAndPassword(email.trim(), password);
      const user = usercreds.user;

      // Add user to Firestore
      await db.collection('users').doc(user.uid).set({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        userId: user.uid,
      });

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Account created successfully',
        visibilityTime: 4000,
        autoHide: true,
      });

      // Navigate to Tabs screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup failed:', error.message);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Section */}
        <Image 
          source={require('../assests/SS.png')} 
          style={{ width: 250, height: 130, resizeMode: 'contain' }} 
          className="mb-8"
        />

        {/* Title Section */}
        <View className="w-full">
          <Text className="text-3xl font-semibold text-center text-gray-800">
            New here
          </Text>
          <Text className="text-lg text-center text-gray-600 mt-2">
            Create your account to get started
          </Text>
        </View>

        {/* Input Fields */}
        <View className="w-full mt-8 space-y-4">
          {/* Name Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg p-4 shadow-sm border border-gray-300">
            <Icon name="person-outline" size={20} color="#6b7280" />
            <TextInput 
              placeholder="Name" 
              className="ml-2 flex-1 text-gray-800"
              placeholderTextColor="#6b7280"
              value={name}
              onChangeText={setName} // Corrected onChangeText
            />
          </View>

          {/* Email Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg mt-3 p-4 shadow-sm border border-gray-300">
            <Icon name="mail-outline" size={20} color="#6b7280" />
            <TextInput
              placeholder="Email" 
              keyboardType="email-address" 
              className="ml-2 flex-1 text-gray-800"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail} // Corrected onChangeText
            />
          </View>

          {/* Password Input */}
          <View className="flex-row items-center bg-gray-100 mt-3 rounded-lg p-4 shadow-sm border border-gray-300">
            <Icon name="lock-closed-outline" size={20} color="#6b7280" />
            <TextInput 
              placeholder="Password" 
              secureTextEntry 
              className="ml-2 flex-1 text-gray-800"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword} // Corrected onChangeText
            />
          </View>
        </View>

        {/* Sign-Up Button */}
        <TouchableOpacity className="bg-blue-500 rounded-lg py-4 w-full mt-6" onPress={handleSignup}>
          <Text className="text-white font-bold text-center text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Log In Section */}
        <Text className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Text className="text-blue-600 font-bold">
            Log In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Signupfirebase;
