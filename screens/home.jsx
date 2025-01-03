import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const Home = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Go to Screen 4" onPress={() => navigation.navigate('Screen4')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
