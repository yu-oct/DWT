import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/Homescreen';
import CameraScreen from './Screens/CameraScreen';
import ImageScreen from './Screens/ImageScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            height: 110,
            backgroundColor: 'white',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Adventure Tracker' }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}