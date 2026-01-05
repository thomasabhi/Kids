import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screen/HomeScreen';
import SettingsScreen from '../Screen/SettingScreen';
import AlphabetScreen from '../Screen/AlphabetScreen';
import MathScreen from '../Screen/MathScreen';
import ColorsScreen from '../Screen/ColorsScreen';
import ShapesScreen from '../Screen/ShapesScreen';
import AnimalScreen from '../Screen/AnimalScreen';
import FruitsScreen from '../Screen/FruitScreen';
import FlowerScreen from '../Screen/FlowerScreen';
import SplashScreen from '../Screen/SplashScreen';


export type RootStackParamList = {
  Splash: undefined; // add Signup here
  Home: undefined;
  Settings: undefined;
  Alphabet: undefined;
  Math: undefined;
  Colors: undefined;
  Shapes: undefined;
  Animal: undefined;
  Fruits: undefined;
  Flower: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Splash"  screenOptions={{ headerShown: false,animation: "fade" }}>
        {/* Signup as the first screen */}
      
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="Home" options={{animation: "fade_from_bottom"}}  component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Alphabet" component={AlphabetScreen} />
        <Stack.Screen name="Math" component={MathScreen} />
        <Stack.Screen name="Colors" component={ColorsScreen} />
        <Stack.Screen name="Shapes" component={ShapesScreen} />
        <Stack.Screen name="Animal" component={AnimalScreen} />
        <Stack.Screen name="Fruits" component={FruitsScreen} />
        <Stack.Screen name="Flower" component={FlowerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
