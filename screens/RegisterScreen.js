// screens/RegisterScreen.js
import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Registrarse como Cliente"
          color="#4CAF50"
          onPress={() => navigation.navigate('RegisterCliente')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrarse como Proveedor"
          color="#FF9800"
          onPress={() => navigation.navigate('RegisterProveedor')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 24
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16
  }
});
