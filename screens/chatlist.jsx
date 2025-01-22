import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ChatListScreen({ navigation }) {
  const [chatList, setChatList] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Set current logged-in user
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  // Fetch chats and handle "self-messages"
  useEffect(() => {
    if (!currentUser) return;

    const fetchChatList = async () => {
      try {
        const unsubscribe = firestore()
          .collection('chats')
          .where('users', 'array-contains', currentUser.uid)
          .onSnapshot(async (querySnapshot) => {
            const chats = [];
            for (const doc of querySnapshot.docs) {
              const chatData = doc.data();
              const messagesRef = firestore()
                .collection('chats')
                .doc(doc.id)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(1);

              const lastMessageSnapshot = await messagesRef.get();
              const lastMessage = lastMessageSnapshot.docs[0]?.data() || {};

              // Find the other user in the chat
              const otherUserId = chatData.users.find(
                (id) => id !== currentUser.uid
              );

              // If the chat is with self
              if (!otherUserId || otherUserId === currentUser.uid) {
                chats.push({
                  id: doc.id,
                  ...chatData,
                  lastMessage: lastMessage.text || 'No messages yet',
                  lastMessageAt: lastMessage.createdAt?.toDate() || new Date(),
                  otherUser: {
                    id: currentUser.uid,
                    name: 'You',
                  },
                });
                continue;
              }

              // Fetch the other user's data
              const otherUserDoc = await firestore()
                .collection('users')
                .doc(otherUserId)
                .get();

              const otherUserName = otherUserDoc.data()?.name || 'Unknown User';

              chats.push({
                id: doc.id,
                ...chatData,
                lastMessage: lastMessage.text || 'No messages yet',
                lastMessageAt: lastMessage.createdAt?.toDate() || new Date(),
                otherUser: {
                  id: otherUserId,
                  name: otherUserName,
                },
              });
            }

            setChatList(chats);
            setFilteredChats(chats); // Initialize filteredChats with all chats
          });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching chat list:', error);
        Alert.alert('Error', 'Failed to fetch chat list.');
      }
    };

    fetchChatList();
  }, [currentUser]);

  // Filter chats based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredChats(chatList);
    } else {
      const filtered = chatList.filter((chat) =>
        chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, chatList]);

  const renderChatItem = ({ item }) => {
    const { id, name } = item.otherUser;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('chat', { user: { id, name } })
        }
        className="flex-row items-center px-4 py-3 border-b border-gray-200"
      >
        <Image
          source={require('../assests/SS.png')} // Replace with a dynamic profile image
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-gray-500 text-sm">{item.lastMessage}</Text>
        </View>
        <View className="ml-4 items-end">
          <Text className="text-gray-400 text-xs">
            {item.lastMessageAt.toLocaleDateString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#000" className="ml-auto" />
      </TouchableOpacity>
    );
  };

  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="px-4 py-2">
        <TextInput
          placeholder="Search chats..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
      </View>

      <FlatList
        data={filteredChats} // Use filteredChats instead of chatList
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">No chats available.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
