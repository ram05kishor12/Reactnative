import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <ScrollView className="bg-gray-100 flex-1">
      <View className="flex-row justify-between items-center p-5">
        <TextInput
          placeholder="Search"
          className="flex-1 bg-white rounded-lg p-4 shadow-sm border-2 border-gray-200"
        />
      </View>

      <View className="flex-row items-center px-4">
        <Text className="text-gray-500">Current location</Text>
        <Text className="ml-2 font-bold">AAAA , MMM</Text>
      </View>

      <View className="p-4">
        <View className="bg-cyan-200 rounded-xl p-6 flex-row items-center gap-28 shadow-sm">
          <View>
            <Text className="font-bold text-lg">Claim your free now!</Text>
            <TouchableOpacity className="bg-black rounded-lg px-4 py-3 mt-3 ">
              <Text className="text-white font-bold">Go now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../assests/SS.png')}
            className="w-20 h-20 ml-4"
          />
        </View>
      </View>

      <View className="px-4">
        <View className="flex-row flex-wrap justify-between">
          {[
            { name: ' AAA' },
            { name: 'BBBB' },
            { name: 'CCCC' },
            { name: 'DDDD' },
            { name: 'EEEE' },
            { name: 'FFFF' },
            { name: 'GGGG' },
            { name: 'HHHH' },
            { name: 'IIII' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white w-24 h-20 m-2 rounded-xl justify-center items-center shadow-md"
            >
              <Image source={item.icon} className="w-10 h-10 mb-2" />
              <Text className="text-sm text-center">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="p-4">
        <Text className="font-bold text-lg mb-2">Featured</Text>
        <ScrollView horizontal className="flex-row">
          {[
            { name: 'McDonald', image: require('../assests/SS.png'), rating: 4.8 },
            { name: 'Fore Coffee', image: require('../assests/SS.png'), rating: 4.8 },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-lg shadow-sm mr-4 w-auto overflow-hidden p-4"
            >
              <Image source={item.image} className="w-full h-28" />
              <View className="p-2">
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-gray-500">ksld gr ir no nrn eji oger</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;
