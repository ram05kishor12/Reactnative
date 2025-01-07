import React from 'react';
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
  } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';



export function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          icon={(focused) => <Icon name="log-out-outline" size={20} color={focused?'black' : 'gray'}/>}
          label="Logout"
            onPress={async () => {
                try {
                await AsyncStorage.removeItem('userLoggedIn');
                props.navigation.replace('Login');
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Logged out',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                } catch (error) {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Error logging out',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                console.error('Error logging out:', error);
                }
            }}
        />
      </DrawerContentScrollView>
    );
}
