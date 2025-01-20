import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Screen2 = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setAge('');
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !age.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: parseInt(age.trim(), 10),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection('users')
        .add(userData);

      Alert.alert(
        'Success',
        'User added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert(
        'Error',
        'Failed to add user. Please try again.'
      );
    }
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">
        Add New User
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6"
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        maxLength={3}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        color="#4F46E5"
      />
    </View>
  );
};

export default Screen2;
