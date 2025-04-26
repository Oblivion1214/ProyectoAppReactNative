// screens/CreditosScreen.js
import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Dimensions } from 'react-native';

export default function CreditosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/ic_launcher_logo_round.webp')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Créditos</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Aplicación creada por: Saúl Jesús De La Cruz Balbuena{"\n"}
          Versión: 1.0{"\n"}
          Universidad: TECNM{"\n"}
          Especialidad: Sistemas Computacionales{"\n"}
          Profesor: Rocio Elizabeth Pulido Alba{"\n"}
          Materia: Tecnología Móvil{"\n"}
          No. Control: 20280736
        </Text>
      </View>
      <Text style={styles.footer}>¡Gracias por usar mi app!</Text>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFCC80',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FF5722',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333333',
  },
});