import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icons from 'react-native-vector-icons/Ionicons';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .get();

      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
      }));

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <View className="flex flex-col justify-center bg-gray-50">
      <ScrollView>
        <View className="px-4 py-2">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            User List ({users.length})
          </Text>
          <View>
            {users.map(user => (
              <View
                key={user.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4" // Added mb-4 for spacing
              >
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-indigo-100 rounded-full justify-center items-center">
                    <Icons name="person" size={24} color="#4F46E5" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Age: {user.age}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2">
                  <View className="flex-row items-center">
                    {/* <Mail size={16} color="#6B7280" /> */}
                    <Text className="ml-2 text-gray-600">
                      {user.email}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    {/* <Calendar size={16} color="#6B7280" /> */}
                    <Text className="ml-2 text-gray-500 text-sm">
                      Added: {user.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {users.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-lg">
                No users found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default UserList;
