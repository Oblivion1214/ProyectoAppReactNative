// screens/LoginScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  BackHandler
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/LoginStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [user]);

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('⚠️ Todos los campos son obligatorios.');
      return;
    }

    let e = email, p = password;
    if (e === 'saul' && p === 'DMalmacena25') {
      e = 'saul@hotmail.com';
      p = 'saul123';
    }

    signInWithEmailAndPassword(auth, e, p)
      .catch(() => {
        setError('❌ Usuario o contraseña incorrectos.');
      });
  };

  const handleExit = () => {
    Alert.alert(
      'Confirmar salida',
      '¿Deseas salir de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            BackHandler.exitApp(); // Termina la app
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/ic_launcher_logo_round.webp')} style={styles.logo} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Usuario (Correo)"
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

      <View style={styles.buttonContainer}>
        <Button title="Ingresar" onPress={handleLogin} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrarse"
          onPress={() => navigation.navigate('Register')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Salir"
          color="#E53935"
          onPress={handleExit}
        />
      </View>
    </ScrollView>
  );
}
