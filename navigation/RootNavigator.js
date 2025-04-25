// navigation/RootNavigator.js
import React, { useContext }          from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer }        from '@react-navigation/native';
import { AuthContext }                from '../contexts/AuthContext';
import LoginScreen                    from '../screens/LoginScreen';
import RegisterScreen                 from '../screens/RegisterScreen';
import AppDrawer                      from './AppDrawer';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user
          ? <Stack.Screen name="App" component={AppDrawer} />
          : (
            <>
              <Stack.Screen name="Login"    component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
