import React from 'react';
import Home from '../screens/home';
import Screen1 from '../screens/screen1';
import Screen2 from '../screens/screen2';
import Screen3 from '../screens/screen3';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarIconStyle: { marginTop: 6 },
      })}
    >
      <Tab.Screen name="Home" component={Home}
      options={{tabBarIcon:({size , color})=> (
        <Icon name="home-outline" size={size} color={color} />
      )
      }} />
      <Tab.Screen name="Screen1" component={Screen1} 
        options={{tabBarIcon:({size , color})=> (
        <Icon name="key-outline" size={size} color={color} />
      )
      }}
      />
      <Tab.Screen name="Screen2" component={Screen2}
        options={{tabBarIcon:({size , color})=> (
        <Icon name="infinite-outline" size={size} color={color} />
      )}}
       />
      <Tab.Screen name="Screen3" component={Screen3}
         options={{tabBarIcon:({size , color})=> (
        <Icon name="id-card-outline" size={size} color={color} />
      )
      }}
       />
    </Tab.Navigator>
  );
}

export default TabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    height: 70,
    borderTopWidth: 0,
    elevation: 5,
    borderRadius: 20,
    borderColor: '#121212',
    marginHorizontal: 10,
    marginBottom: 15 ,
    shadowRadius: 4,
    shadowOffset : 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: 'black',
  },
});
