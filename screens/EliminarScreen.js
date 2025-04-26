// screens/EliminarScreen.js
import React, { useState, useContext } from 'react';
import { ScrollView, View, TextInput, Button, Text, Image, Alert, StyleSheet } from 'react-native';
import { ref, get, remove, update } from 'firebase/database';
import { db } from '../firebase/config';
import { AuthContext } from '../contexts/AuthContext';

export default function EliminarScreen() {
  const { user } = useContext(AuthContext);
  const [searchId, setSearchId] = useState('');
  const [product, setProduct] = useState(null);

  const handleBuscar = async () => {
    if (!searchId.trim()) return Alert.alert('Error','Ingrese un ID');
    const snap = await get(ref(db, `productos/${searchId.trim()}`));
    if (snap.exists()) setProduct(snap.val());
    else Alert.alert('No encontrado','Producto no existe');
  };

  const handleFisica = () => {
    if (product.providerId !== user.uid) return Alert.alert('Permiso denegado');
    remove(ref(db, `productos/${product.id}`))
      .then(() => { setProduct(null); Alert.alert('Eliminado','Producto eliminado físicamente'); })
      .catch(err => Alert.alert('Error',err.message));
  };

  const handleLogica = () => {
    if (product.providerId !== user.uid) return Alert.alert('Permiso denegado');
    update(ref(db, `productos/${product.id}`), { activo: false })
      .then(() => { setProduct({ ...product, activo:false }); Alert.alert('Actualizado','Producto marcado como inactivo'); })
      .catch(err => Alert.alert('Error',err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder="ID para eliminar" value={searchId} onChangeText={setSearchId} style={styles.input} />
      <View style={styles.button}><Button title="Buscar" onPress={handleBuscar} color="#03A9F4" /></View>

      {product && (
        <View style={styles.result}>
          <Text style={styles.bold}>Nombre: {product.nombre}</Text>
          <Text>Descripción: {product.descripcion}</Text>
          <Text>Fecha: {product.fecha}</Text>
          <Text>Estado: {product.activo ? 'Activo':'Inactivo'}</Text>
          {product.imagen && <Image source={{ uri: `data:image/jpeg;base64,${product.imagen}` }} style={styles.image} />}

          {product.providerId === user.uid && (
            <>
              <View style={styles.button}><Button title="Eliminar Físico" onPress={handleFisica} color="#F44336" /></View>
              <View style={styles.button}><Button title="Eliminar Lógico" onPress={handleLogica} color="#FF9800" /></View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, backgroundColor:'#FFCC80', padding:16 },
  input: { backgroundColor:'#FFF', padding:12, borderRadius:4, marginBottom:12 },
  button: { marginVertical:8 },
  result: { marginTop:16, alignItems:'center' },
  bold: { fontWeight:'bold', marginBottom:4 },
  image: { width:200, height:200, marginVertical:12 }
});
