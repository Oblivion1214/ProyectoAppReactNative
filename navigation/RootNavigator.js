// navigation/RootNavigator.js
import React, { useContext }          from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer }        from '@react-navigation/native';
import { AuthContext }                from '../contexts/AuthContext';

import LoginScreen                    from '../screens/LoginScreen';
import RegisterScreen                 from '../screens/RegisterScreen';
import RegisterClienteScreen          from '../screens/RegisterClienteScreen';
import RegisterProveedorScreen        from '../screens/RegisterProveedorScreen';
import AppDrawer                      from './AppDrawer';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user
          ? (
            // cuando está logueado, no queremos header en el Drawer
            <Stack.Screen 
              name="App" 
              component={AppDrawer} 
              options={{ headerShown: false }} 
            />
          )
          : (
            <>
              {/* Login SIN header */}
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }} 
              />
              {/* Elección de tipo de registro SIN header */}
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen} 
                options={{ 
                  title: 'Registro',
                  // headerBackTitleVisible: false, // quita texto junto a la flecha
                }} 
              />
              {/* Registro cliente CON header y flecha atrás */}
              <Stack.Screen 
                name="RegisterCliente" 
                component={RegisterClienteScreen} 
                options={{ 
                  title: 'Registro Cliente',
                  // headerBackTitleVisible: false, // quita texto junto a la flecha
                }} 
              />
              {/* Registro proveedor CON header y flecha atrás */}
              <Stack.Screen 
                name="RegisterProveedor" 
                component={RegisterProveedorScreen} 
                options={{ 
                  title: 'Registro Proveedor',
                  // headerBackTitleVisible: false,
                }} 
              />
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
