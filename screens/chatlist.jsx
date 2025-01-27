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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [chatData, setChatData] = useState({});

  // Set current logged-in user
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch all users and their last messages
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsersAndChats = async () => {
      try {
        // Listen for all users except current user
        const usersUnsubscribe = firestore()
          .collection('users')
          .where('userId', '!=', currentUser.uid)
          .onSnapshot(async (querySnapshot) => {
            const usersList = [];
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              usersList.push({
                id: userData.userId, // Using userId from the document
                name: userData.name,
                email: userData.email,
              });
            });
            // console.log('Fetched users:', usersList); // Debug log
            setUsers(usersList);
            setFilteredUsers(usersList);
          });

        // Listen for all chats involving current user
        const chatsUnsubscribe = firestore()
          .collection('chats')
          .where('users', 'array-contains', currentUser.uid)
          .onSnapshot(async (querySnapshot) => {
            const chatInfo = {};

            for (const doc of querySnapshot.docs) {
              const chatData = doc.data();
              const otherUserId = chatData.users.find(id => id !== currentUser.uid);

              // Get last message
              const lastMessageSnap = await firestore()
                .collection('chats')
                .doc(doc.id)
                .collection('messages')
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

              const lastMessage = lastMessageSnap.docs[0]?.data();
              
              chatInfo[otherUserId] = {
                chatId: doc.id,
                lastMessage: lastMessage?.text || 'No messages yet',
                lastMessageAt: lastMessage?.createdAt?.toDate() || null,
              };
            }
            
            // console.log('Fetched chat data:', chatInfo); // Debug log
            setChatData(chatInfo);
          });

        return () => {
          usersUnsubscribe();
          chatsUnsubscribe();
        };
      } catch (error) {
        console.error('Error fetching users and chats:', error);
        Alert.alert('Error', 'Failed to fetch users and chats.');
      }
    };

    fetchUsersAndChats();
  }, [currentUser]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const renderUserItem = ({ item }) => {
    const chatInfo = chatData[item.id] || {};
    const hasChat = !!chatInfo.chatId;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('chat', { 
          user: { 
            id: item.id, // This is the userId from Firestore
            name: item.name,
          }
        })}
        className="flex-row items-center px-4 py-3 border-b border-gray-200"
      >
        <Image
          source={require('../assests/SS.png')}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-gray-500 text-sm">
            {hasChat ? chatInfo.lastMessage : 'Start a new chat'}
          </Text>
        </View>
        {hasChat && chatInfo.lastMessageAt && (
          <View className="ml-4 items-end">
            <Text className="text-gray-400 text-xs">
              {chatInfo.lastMessageAt.toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
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
          placeholder="Search users..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center pt-10">
            <Text className="text-gray-500 text-lg">No users found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}