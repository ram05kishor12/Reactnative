import React, { useEffect, useState } from 'react';
import Home from '../screens/home';
import Screen1 from '../screens/screen1';
import Screen2 from '../screens/screen2';
import Screen3 from '../screens/screen3';
import Login from '../screens/login';
import SignUp from '../screens/signup';
import Screen4 from '../screens/screen4';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import TabNavigator from './tab';
import { CustomDrawerContent } from './drawer';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// function TabNavigator() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="TabHome" component={Home} />
//       <Tab.Screen name="TabScreen1" component={Screen1} />
//       <Tab.Screen name="TabScreen2" component={Screen2} />
//       <Tab.Screen name="TabScreen3" component={Screen3} />
//     </Tab.Navigator>
//   );
// }


//   const handleLogout = async ({ navigation }) => {
//     try {
//       await AsyncStorage.removeItem('userLoggedIn');
//       navigation.replace('Login');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Home" component={Home} />
//       <Drawer.Screen name="Tabs" component={TabNavigator} options={{headerShown:false}} />
//       <Drawer.Screen name="Screen1" component={Screen1} />
//       <Drawer.Screen name="Screen2" component={Screen2} />
//       <Drawer.Screen name="Screen3" component={Screen3} />
//       <Drawer.Screen
//         name="Logout"
//         options={{
//           drawerLabel: () => (
//             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//               <Text style={styles.logoutText}>Logout</Text>
//             </TouchableOpacity>
//           ),
//           drawerIcon: () => null,
//         }}
//         component={() => null}
//       />
//     </Drawer.Navigator>
//   );
// }
function DrawerNavigator () {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} screenOptions={{drawerActiveTintColor: 'white',drawerInactiveTintColor: 'gray',drawerActiveBackgroundColor: 'black',drawerInactiveBackgroundColor: 'white',drawerLabelStyle: {fontSize: 16, fontWeight: 'bold'}}}>
      <Drawer.Screen
      options={{
        drawerIcon: ({focused, size}) => (
          <Icon name="home-outline" size={size} color={focused ? 'white' : 'gray' }/>
        )
      }}
      name="Home" component={Home} />
      <Drawer.Screen
      options={{
        drawerIcon: ({focused, size}) => (
          <Icon name="reader-outline" size={size} color={focused ? 'white' : 'gray' }/>
        ),
        headerShown: false,
      }}
      name="Tabs" component={TabNavigator} />
      <Drawer.Screen
      options={{
        drawerIcon: ({focused, size}) => (
          <Icon name="id-card-outline" size={size} color={focused ? 'white' : 'gray' }/>
        )
      }}
      name="Screen1" component={Screen1} />
      <Drawer.Screen
      options={{
        drawerIcon: ({focused, size}) => (
          <Icon name="key-outline" size={size} color={focused ? 'white' : 'gray' }/>
        )
      }}
       name="Screen2" component={Screen2} />
      <Drawer.Screen
      options={{
        drawerIcon: ({focused, size}) => (
          <Icon name="infinite-outline" size={size} color={focused ? 'white' : 'gray' }/>
        )
      }}
       name="Screen3" component={Screen3} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        if (userLoggedIn === 'true') {
          setInitialRoute('Drawer');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Screen4" component={Screen4} />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
