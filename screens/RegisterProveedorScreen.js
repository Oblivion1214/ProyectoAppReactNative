// screens/RegisterProveedorScreen.js
import React, { useState } from 'react';
import {
  ScrollView, View, TextInput,
  Button, Alert, StyleSheet, Text
} from 'react-native';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set }                              from 'firebase/database';
import { auth, db }                              from '../firebase/config';

const CODIGO_PROVEEDOR_ESPERADO = '123456';

export default function RegisterProveedorScreen({ navigation }) {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [code, setCode]               = useState('');
  const [error, setError]             = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !code) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (code !== CODIGO_PROVEEDOR_ESPERADO) {
      setError('Código de proveedor incorrecto');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        return set(ref(db, `usuarios/${user.uid}`), {
          correo: email,
          rol:    'proveedor'
        })
        .then(() => signOut(auth))
        .then(() => {
          Alert.alert(
            '¡Bienvenido!',
            'Proveedor registrado. Por favor, inicia sesión.',
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
      <Text style={styles.header}>Registro Proveedor</Text>
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
      <TextInput
        placeholder="Código de Proveedor"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      
      <Text style={styles.error}>{error}</Text>
      <Text style={styles.error}>
        El código de proveedor es: {"123456"}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleRegister} color="#FF9800" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFDE7',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF9800'
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
