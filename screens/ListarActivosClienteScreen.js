// screens/ListarActivosClienteScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, Alert, StyleSheet
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

export default function ListarActivosClienteScreen() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const prodRef = ref(db, 'productos');
    const unsubscribe = onValue(prodRef, snapshot => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter(p => p.activo);
      setProductos(list);
    });
    return () => unsubscribe();
  }, []);

  const showDetail = (item) => {
    Alert.alert(
      `ID: ${item.id}`,
      `Nombre: ${item.nombre}\nDescripción: ${item.descripcion}\nFecha: ${item.fecha}`,
      [{ text: 'Aceptar', style: 'cancel' }]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
      <Image source={{ uri: item.imagen ? `data:image/jpeg;base64,${item.imagen}` : null }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding:8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FFCC80' },
  card: { flexDirection:'row', marginBottom:12, backgroundColor:'#FFF', borderRadius:8, overflow:'hidden' },
  image: { width:80, height:80 },
  info: { flex:1, padding:8, justifyContent:'center' },
  title: { fontWeight:'bold' }
});