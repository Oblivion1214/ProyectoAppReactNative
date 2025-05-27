// navigation/AppDrawer.js
import React, { useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { AuthContext } from '../contexts/AuthContext';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import AltasScreen from '../screens/AltasScreen';
import BuscarScreen from '../screens/BuscarScreen';
import ModificarScreen from '../screens/ModificarScreen';
import EliminarScreen from '../screens/EliminarScreen';
import ListarActivosScreen from '../screens/ListarActivosScreen';
import ListarInactivosScreen from '../screens/ListarInactivosScreen';
import ListarActivosClienteScreen from '../screens/ListarActivosClienteScreen';
import CreditosScreen from '../screens/CreditosScreen';
import LocationScreen from '../screens/LocationScreen'; // ✅ Importación corregida

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { role, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Inicio"
        onPress={() => props.navigation.navigate('Home')}
      />

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
          <DrawerItem label="Buscar" onPress={() => props.navigation.navigate('Buscar')} />
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

      {/* ✅ Opción visible para ambos roles */}
      <DrawerItem
        label="Ubicación Tienda"
        onPress={() => props.navigation.navigate('Ubicacion')}
      />

      <DrawerItem
        label="Cerrar Sesión"
        onPress={() => logout()}
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
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Altas" component={AltasScreen} options={{ title: 'Altas' }} />
      <Drawer.Screen name="Buscar" component={BuscarScreen} options={{ title: 'Buscar' }} />
      <Drawer.Screen name="Modificar" component={ModificarScreen} options={{ title: 'Modificar' }} />
      <Drawer.Screen name="Eliminar" component={EliminarScreen} options={{ title: 'Eliminar' }} />
      <Drawer.Screen name="ListarActivos" component={ListarActivosScreen} options={{ title: 'Listar Activos' }} />
      <Drawer.Screen name="ListarInactivos" component={ListarInactivosScreen} options={{ title: 'Listar Inactivos' }} />
      <Drawer.Screen name="ListarActivosCliente" component={ListarActivosClienteScreen} options={{ title: 'Listar Activos Cliente' }} />
      <Drawer.Screen name="Creditos" component={CreditosScreen} options={{ title: 'Créditos' }} />

      {/* ✅ Pantalla de ubicación */}
      <Drawer.Screen name="Ubicacion" component={LocationScreen} options={{ title: 'Ubicación Tienda' }} />
    </Drawer.Navigator>
  );
}
