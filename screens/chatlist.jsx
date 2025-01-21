import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import React from 'react';

export default function ChatList() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex flex-row items-center justify-between py-4 bg-blue-950 shadow-md px-5">
                <Text className="text-xl font-bold text-white">Chats</Text>
                <Image
                    source={require('../assests/SS.png')}
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                />
            </View>

            <ScrollView className="flex-1 px-4 py-3">
                {Array(6).fill(0).map((_, index) => (
                    <View
                        key={index}
                        className="flex flex-row items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4"
                    >
                        <Image
                            source={require('../assests/SS.png')}
                            className="w-14 h-14 rounded-full"
                        />
                        <View className="flex-1 ml-4">
                            <Text className="text-base font-bold text-black">
                                User Name
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Last message here
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-400">12:45 PM</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
