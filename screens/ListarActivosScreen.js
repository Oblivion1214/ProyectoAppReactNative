// screens/ListarActivosScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StyleSheet
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db }           from '../firebase/config';
import { AuthContext }  from '../contexts/AuthContext';

export default function ListarActivosScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const prodRef = ref(db, 'productos');
    const unsubscribe = onValue(prodRef, snapshot => {
      const data = snapshot.val() || {};
      // Filtramos activos
      const activos = Object.values(data).filter(p => p.activo);
      setProductos(activos);
    });
    return () => unsubscribe();
  }, []);

  const showProductDialog = (item) => {
    const isOwner = item.providerId === user.uid;
    const buttons = [
      isOwner && { text: 'Editar', onPress: () => navigation.navigate('Modificar', { searchId: item.id }) },
      isOwner && { text: 'Eliminar', onPress: () => navigation.navigate('Eliminar', { searchId: item.id }) },
      { text: 'Cerrar', style: 'cancel' }
    ].filter(Boolean);

    Alert.alert(
      `ID: ${item.id}`,
      `Nombre: ${item.nombre}\nFecha: ${item.fecha}`,
      buttons
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => showProductDialog(item)}
    >
      {item.imagen ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imagen}` }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Sin Imagen</Text>
        </View>
      )}
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
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCC80',
  },
  list: {
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,           // sombra en Android
    shadowColor: '#000',    // sombra en iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
