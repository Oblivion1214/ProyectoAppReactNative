// screens/BuscarScreen.js
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { ref, get } from 'firebase/database';
import { db }       from '../firebase/config';

export default function BuscarScreen() {
  const [id, setId]           = useState('');
  const [nombre, setNombre]   = useState('');
  const [descripcion, setDesc]= useState('');
  const [fecha, setFecha]     = useState('');
  const [estado, setEstado]   = useState('');
  const [imagenUri, setUri]   = useState(null);

  const handleBuscar = async () => {
    if (!id.trim()) return Alert.alert('Error', 'Ingrese un ID para buscar');
    const snapshot = await get(ref(db, `productos/${id.trim()}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      setNombre(data.nombre || '');
      setDesc(data.descripcion || '');
      setFecha(data.fecha || '');
      setEstado(data.activo ? 'Activo' : 'Inactivo');
      if (data.imagen) {
        setUri(`data:image/jpeg;base64,${data.imagen}`);
      } else {
        setUri(null);
      }
    } else {
      Alert.alert('No encontrado', 'No se encontró producto con ese ID');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Ingrese ID a buscar"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <View style={styles.button}>
        <Button title="Buscar" onPress={handleBuscar} color="#2196F3" />
      </View>
      {!!nombre && (
        <View style={styles.result}>
          <Text style={styles.textBold}>Nombre: {nombre}</Text>
          <Text>Descripción: {descripcion}</Text>
          <Text>Fecha: {fecha}</Text>
          <Text>Estado: {estado}</Text>
          {imagenUri && <Image source={{ uri: imagenUri }} style={styles.image} />}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFCC80',
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
  },
  button: {
    marginVertical: 12,
  },
  result: {
    marginTop: 16,
    alignItems: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 12,
  },
});
