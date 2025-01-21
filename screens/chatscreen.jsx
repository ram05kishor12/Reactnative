import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    FlatList,
    Alert,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import Icon from 'react-native-vector-icons/Ionicons';
  import firestore from '@react-native-firebase/firestore';
  import auth from '@react-native-firebase/auth';

  export default function ChatScreen({ route, navigation }) {
    const { user } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // Listen for authentication state changes
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(user => {
        console.log('Auth State Changed:', user?.uid);
        setCurrentUser(user);
      });

      return unsubscribe;
    }, []);

    const chatId = currentUser?.uid && user?.id ?
      [currentUser.uid, user.id].sort().join('_') :
      null;

    useEffect(() => {
      if (!chatId) {
        console.log('Chat ID check:', {
          currentUserId: currentUser?.uid,
          otherUserId: user?.id,
        });
        return;
      }

      const setupChat = async () => {
        try {
          console.log('Setting up chat with ID:', chatId);

          // Create chat document
          const chatData = {
            users: [currentUser.uid, user.id],
            updatedAt: firestore.FieldValue.serverTimestamp(),
            createdAt: firestore.FieldValue.serverTimestamp(),
          };

          await firestore()
            .collection('chats')
            .doc(chatId)
            .set(chatData, { merge: true });

          console.log('Chat document created/updated successfully');

          const unsubscribe = firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
              (querySnapshot) => {
                const messageList = [];
                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  messageList.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                  });
                });
                console.log(`Loaded ${messageList.length} messages`);
                setMessages(messageList.reverse());
              },
              (error) => {
                console.error('Error listening to messages:', error);
                Alert.alert('Error', 'Failed to load messages');
              }
            );

          return () => unsubscribe();
        } catch (error) {
          console.error('Error setting up chat:', error);
          Alert.alert('Error', 'Failed to set up chat');
        }
      };

      setupChat();
    }, [chatId, currentUser?.uid, user?.id]);

    const sendMessage = async () => {
      if (!chatId || !text.trim()) {
        console.log('Send message check:', {
          chatId,
          hasText: Boolean(text.trim()),
          currentUser: currentUser?.uid,
          otherUser: user?.id,
        });
        return;
      }

      try {
        const messageData = {
          text: text.trim(),
          sender: currentUser.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add(messageData);

        await firestore()
          .collection('chats')
          .doc(chatId)
          .update({
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

        setText('');
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
      }
    };

    if (!currentUser) {
      return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-lg text-gray-600">Loading chat...</Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-gray-100 shadow-md">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Image
                source={require('../assests/SS.png')}
                className="w-10 h-10 rounded-full border border-gray-400"
              />
              <Text className="font-bold text-lg ml-3">{user?.name || 'User Name'}</Text>
              <View className="ml-auto">
                <Icon name="ellipsis-vertical" size={24} color="#000" />
              </View>
            </View>
  
            {/* Chat Messages */}
            <View className="flex-1 p-4">
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted={false}
                renderItem={({ item }) => (
                  <View
                    className={`px-4 py-2 rounded-lg my-2 ${
                      item.sender === currentUser.uid
                        ? 'bg-blue-500 self-end'
                        : 'bg-gray-200 self-start'
                    }`}
                  >
                    <Text
                      className={`${
                        item.sender === currentUser.uid ? 'text-white' : 'text-black'
                      }`}
                    >
                      {item.text}
                    </Text>
                  </View>
                )}
              />
            </View>
  
            {/* Message Input Section */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="p-4"
            >
              <View className="flex-row items-center bg-gray-100 rounded-full shadow-md px-4 py-2">
                <TextInput
                  placeholder="Type a message"
                  value={text}
                  onChangeText={setText}
                  className="flex-1 text-base text-gray-800 bg-transparent"
                />
                <TouchableOpacity
                  className="bg-black rounded-full p-3 ml-3"
                  onPress={sendMessage}
                >
                  <Icon name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }