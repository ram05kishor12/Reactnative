import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  const selectDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      setSelectedFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'No document selected.');
      } else {
        console.error('Document Picker Error: ', err);
        Alert.alert('Error', 'Unable to pick a document.');
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
        <TouchableOpacity onPress={selectDocument}>
          <View className="w-40 h-40 bg-indigo-100 rounded-full justify-center items-center mb-6">
            {selectedFile ? (
              <Image
                source={{ uri: selectedFile.uri }} // Display the selected image
                style={{ width: '100%', height: '100%', borderRadius: 50 }}
              />
            ) : (
              <Icons name="document" size={48} color="#4F46E5" />
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-700 mt-4">
          Tap to upload your profile document
        </Text>
        {/* {selectedFile && (
          <View className="mt-4 bg-white rounded-lg shadow-md p-4 border border-gray-100 w-3/4">
            <Text className="text-gray-800 font-bold text-lg mb-2">Selected File Details:</Text>
            <Text className="text-gray-600">Name: {selectedFile.name}</Text>
            <Text className="text-gray-600">Type: {selectedFile.type}</Text>
            <Text className="text-gray-600">Size: {selectedFile.size} bytes</Text>
          </View>
        )} */}

        <View className="mt-10 w-3/4 space-y-4">
          <View className="bg-white rounded-lg shadow-md p-4 border border-gray-100 mb-4">
            <Text className="text-gray-800 font-bold text-lg">Name</Text>
            <Text className="text-gray-600">Abcd</Text>
          </View>

          <View className="bg-white rounded-lg shadow-md p-4 border border-gray-100 mb-4">
            <Text className="text-gray-800 font-bold text-lg">Email</Text>
            <Text className="text-gray-600">abcd@gmail.com</Text>
          </View>

          <View className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <Text className="text-gray-800 font-bold text-lg">Age</Text>
            <Text className="text-gray-600">29</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
