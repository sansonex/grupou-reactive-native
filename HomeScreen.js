import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext } from './AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cos } from 'react-native-reanimated';
import react from 'react';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function ProfileScreen() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Account</Text>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}