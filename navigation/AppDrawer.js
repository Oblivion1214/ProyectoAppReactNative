// navigation/AppDrawer.js
import React, { useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { AuthContext } from '../contexts/AuthContext';

import HomeScreen                 from '../screens/HomeScreen';
import AltasScreen                from '../screens/AltasScreen';                // crea pantallas vacías
import BuscarScreen               from '../screens/BuscarScreen';
import ModificarScreen            from '../screens/ModificarScreen';
import EliminarScreen             from '../screens/EliminarScreen';
import ListarActivosClienteScreen from '../screens/ListarActivosClienteScreen';
import ListarActivosScreen        from '../screens/ListarActivosScreen';
import ListarInactivosScreen      from '../screens/ListarInactivosScreen';
import CreditosScreen             from '../screens/CreditosScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { role, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Inicio" onPress={() => props.navigation.navigate('Home')} />

      {role === 'cliente' && (
        <>
          <DrawerItem label="Buscar" onPress={() => props.navigation.navigate('Buscar')} />
          <DrawerItem
            label="Listar Activos Cliente"
            onPress={() => props.navigation.navigate('ListarActivosCliente')}
          />
          <DrawerItem label="Créditos" onPress={() => props.navigation.navigate('Creditos')} />
        </>
      )}

      {role === 'proveedor' && (
        <>
          <DrawerItem label="Altas" onPress={() => props.navigation.navigate('Altas')} />
          <DrawerItem label="Modificar" onPress={() => props.navigation.navigate('Modificar')} />
          <DrawerItem label="Eliminar" onPress={() => props.navigation.navigate('Eliminar')} />
          <DrawerItem
            label="Listar Activos"
            onPress={() => props.navigation.navigate('ListarActivos')}
          />
          <DrawerItem
            label="Listar Inactivos"
            onPress={() => props.navigation.navigate('ListarInactivos')}
          />
          <DrawerItem label="Créditos" onPress={() => props.navigation.navigate('Creditos')} />
        </>
      )}

      <DrawerItem
        label="Cerrar Sesión"
        onPress={() => {
          logout();
          props.navigation.replace('Login');
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Home"                 component={HomeScreen} />
      {/* el resto de pantallas (Altas, Buscar…) */}
    </Drawer.Navigator>
  );
}
