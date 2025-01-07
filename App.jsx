import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './screens/home';
import Screen1 from './screens/screen1';
import Screen2 from './screens/screen2';
import Screen3 from './screens/screen3';
import './global.css';
// Import screens
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
