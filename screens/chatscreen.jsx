import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
  Linking
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';

// Date Formatting Utilities
const formatMessageTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatMessageDate = (date) => {
  if (!date) return '';
  const now = new Date();
  const messageDate = date;

  if (messageDate.toDateString() === now.toDateString()) return 'Today';
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  // Generate unique chat ID
  const chatId = currentUser?.uid && user?.id 
    ? [currentUser.uid, user.id].sort().join('_')
    : null;

  // Authentication and User Setup
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribeAuth;
  }, []);

  // Chat Setup and Message Listener
  useEffect(() => {
    if (!chatId) return;

    const setupChat = async () => {
      try {
        setIsLoading(true);

        // Ensure chat document exists
        const chatData = {
          users: [currentUser.uid, user.id],
          updatedAt: firestore.FieldValue.serverTimestamp(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await firestore()
          .collection('chats')
          .doc(chatId)
          .set(chatData, { merge: true });

        // Listen for messages
        const unsubscribe = firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            (querySnapshot) => {
              const messageList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
              })).reverse();

              setMessages(messageList);
              setIsLoading(false);
            },
            (error) => {
              console.error('Error listening to messages:', error);
              Alert.alert('Error', 'Failed to load messages');
              setIsLoading(false);
            }
          );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up chat:', error);
        Alert.alert('Error', 'Failed to set up chat');
        setIsLoading(false);
      }
    };

    setupChat();
  }, [chatId, currentUser?.uid, user?.id]);

  // Scroll to bottom
  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated });
      }, 100);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      const file = result[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      setIsLoading(true);
      console.log('Processing image...');

      // Convert image to base64
      const base64Content = await RNFS.readFile(file.uri, 'base64');
      console.log('Image base64:', base64Content);
      const imageData = `data:${file.type};base64,${base64Content}`;

      // Check file size (base64 string length is roughly 4/3 of original size)
      const approximateSize = (base64Content.length * 3) / 4 / (1024 * 1024); // MB
      if (approximateSize > 5) {
        Alert.alert('File Too Large', 'Please select an image under 5MB');
        setIsLoading(false);
        return;
      }

      await sendFileMessage({
        fileName: file.name,
        fileType: file.type,
        base64Data: imageData,
      });

      console.log('Image upload completed');
    } catch (err) {
      console.error('File upload error:', err);
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Upload Cancelled by User', 'No file selected');
        console.log('User cancelled file picker');
      }
      // Alert.alert('Upload Error', err.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  // Send File Message
  const sendFileMessage = async (fileInfo) => {
    if (!chatId) return;

    try {
      const messageData = {
        type: 'image',
        sender: currentUser.uid,
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        imageData: fileInfo.base64Data,
        createdAt: firestore.FieldValue.serverTimestamp()
      };

      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(messageData);

      // Update last message in chat
      await firestore()
        .collection('chats')
        .doc(chatId)
        .update({
          lastMessage: 'Image',
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

      scrollToBottom();
    } catch (error) {
      console.error('Error sending file message:', error);
      Alert.alert('Send Error', 'Could not send image');
    }
  };

  // Send Text Message
  const sendMessage = async () => {
    if (!chatId || !text.trim()) return;

    try {
      const messageData = {
        text: text.trim(),
        sender: currentUser.uid,
        type: 'text',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(messageData);

      // Update last message in chat
      await firestore()
        .collection('chats')
        .doc(chatId)
        .update({
          lastMessage: text.trim(),
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

      setText('');
      Keyboard.dismiss();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Send Error', 'Failed to send message');
    }
  };

  // Render Message Item
  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.sender === currentUser.uid;
    
    const showDateHeader =
      index === 0 ||
      !isSameDay(messages[index - 1]?.createdAt, item.createdAt);

    return (
      <View>
        {showDateHeader && (
          <View className="items-center my-2">
            <Text className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatMessageDate(item.createdAt)}
            </Text>
          </View>
        )}
        <View className={`mb-2 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <View 
            className={`
              ${isCurrentUser ? 'bg-blue-500' : 'bg-gray-200'} 
              px-4 py-2 rounded-2xl max-w-[80%]
            `}
          >
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.imageData }}
                className="w-48 h-48 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <Text className={`${isCurrentUser ? 'text-white' : 'text-black'}`}>
                {item.text}
              </Text>
            )}
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center ">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Chat Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: user.avatar }} 
          className="w-10 h-10 rounded-full mr-3" 
        />
        <Text className="text-lg font-bold">{user.name}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 10 }}
        onContentSizeChange={() => scrollToBottom(true)}
        onLayout={() => scrollToBottom(false)}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">No messages yet</Text>
            <Text className="text-gray-400 text-sm mt-2">
              Start the conversation!
            </Text>
          </View>
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleFileUpload} className="mr-3">
            <Icon name="image" size={24} color="gray" />
          </TouchableOpacity>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            multiline
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 max-h-24"
            placeholderTextColor="#666"
          />

          <TouchableOpacity 
            onPress={sendMessage} 
            disabled={!text.trim()}
            className={`
              p-2 rounded-full 
              ${text.trim() ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <Icon 
              name="send"
              size={20}
              color="white"
              style={{ transform: [{ rotate: '45deg' }] }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
          <Text className="text-white text-lg">Processing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;