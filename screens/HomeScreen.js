// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, role } = useContext(AuthContext);
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text>Bienvenido {user.email}</Text>
      <Text>Rol: {role}</Text>
    </View>
  );
}
