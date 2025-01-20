import React, { useContext } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { CounterContext } from './Counter';

const Page3 = ({ navigation }) => {
  const { count, increment, decrement } = useContext(CounterContext);

  return (
    <View className="flex-1 flex-col justify-center items-center">
      <Text className="font-bold text-lg mt-4">Page 3</Text>
      <Text className="font-normal text-lg mt-4">Count: {count}</Text>
      <TouchableOpacity className="font-bold bg-black rounded-lg mt-4 p-4" onPress={increment}>
        <Text className="text-white font-bold">Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity className="font-bold bg-gray-100 rounded-lg mt-4 p-4 shadow-md" onPress={decrement}>
        <Text className="text-black font-bold">Decrement</Text>
      </TouchableOpacity>
      <TouchableOpacity className="font-bold bg-gray mt-4 p-6 shadow-sm rounded-full"onPress={() => navigation.navigate('Page1')} >
        <Text className="text-black font-bold">Go to Page 1</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Page3;
