import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { db } from '../services/firebaseConfig';  // Make sure db is imported

const Loginfirebase = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
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

      // Firebase Authentication - Sign In User
      await auth().signInWithEmailAndPassword(email.trim(), password);

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Logged in successfully',
        visibilityTime: 4000,
        autoHide: true,
      });

      const currentUser = auth().currentUser;
      console.log('Current User:', currentUser);
      if (currentUser) {
        // Fetch user details from Firestore if needed (e.g., display name)
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        // Navigate to chat screen with user data
        navigation.navigate('chatlist');
        //  {
        //   user: {
        //     id: 'Dt8yV1QiKgO9w1c7sostLGCSDNg2', // Replace 'USER_ID' with the actual ID
        //     name: 'ram', // Optional: Add other properties like name
        //   },
        // });
      }
    } catch (error) {
      console.error('Login failed:', error.message);
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
        <Image
          source={require('../assests/SS.png')}
          style={{ width: 250, height: 130, resizeMode: 'contain' }}
          className="mb-8"
        />

        <View className="w-full">
          <Text className="text-3xl font-semibold text-center text-gray-800">Welcome Back</Text>
          <Text className="text-lg text-center text-gray-600 mt-2">Log in to continue</Text>
        </View>

        <View className="w-full mt-8 space-y-4">
          <View className="flex-row items-center bg-gray-100 rounded-lg p-4 shadow-sm border border-gray-300">
            <Icon name="mail-outline" size={20} color="#6b7280" />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              className="ml-2 flex-1 text-gray-800"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="flex-row items-center bg-gray-100 mt-3 rounded-lg p-4 shadow-sm border border-gray-300">
            <Icon name="lock-closed-outline" size={20} color="#6b7280" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              className="ml-2 flex-1 text-gray-800"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity className="bg-blue-500 rounded-lg py-4 w-full mt-6" onPress={handleLogin}>
          <Text className="text-white font-bold text-center text-lg">Log In</Text>
        </TouchableOpacity>

        <Text className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Text className="text-blue-600 font-bold" onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Loginfirebase;
