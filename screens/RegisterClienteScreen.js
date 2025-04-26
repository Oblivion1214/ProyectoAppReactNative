// screens/RegisterClienteScreen.js
import React, { useState } from 'react';
import {
  ScrollView, View, TextInput,
  Button, Alert, StyleSheet, Text
} from 'react-native';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set }                              from 'firebase/database';
import { auth, db }                              from '../firebase/config';

export default function RegisterClienteScreen({ navigation }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [error, setError]               = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        // Guardar datos en Realtime DB
        return set(ref(db, `usuarios/${user.uid}`), {
          correo: email,
          rol:    'cliente'
        })
        .then(() => {
          // Cerrar sesión para volver al login
          return signOut(auth);
        })
        .then(() => {
          Alert.alert(
            '¡Listo!',
            'Cliente registrado. Por favor, inicia sesión.',
            [{ text: 'OK', onPress: () => navigation.reset({
                 index: 0,
                 routes: [{ name: 'Login' }]
            }) }]
          );
        });
      })
      .catch(err => setError(err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro Cliente</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleRegister} color="#4CAF50" />
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50'
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8
  },
  error: {
    color: 'red',
    marginBottom: 12
  }
});
