// screens/ListarInactivosScreen.js
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
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../firebase/config';
import { AuthContext } from '../contexts/AuthContext';

export default function ListarInactivosScreen() {
  const { user } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (!user || !user.uid) {
      console.error('Usuario no autenticado o UID no disponible.');
      return;
    }

    const prodRef = ref(db, 'productos');
    const unsubscribe = onValue(
      prodRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const inactivos = Object.values(data).filter(
          (p) => p.activo === false && p.providerId === user.uid
        );
        setProductos(inactivos);
      },
      (error) => {
        console.error('Error al obtener productos inactivos:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const showProductDialog = (item) => {
    const buttons = [
      {
        text: 'Activar',
        onPress: () => update(ref(db, `productos/${item.id}`), { activo: true })
      },
      {
        text: 'Eliminar físico',
        onPress: () => remove(ref(db, `productos/${item.id}`))
      },
      { text: 'Cancelar', style: 'cancel' }
    ];

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
        keyExtractor={(item) => item.id}
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
    elevation: 2,
    shadowColor: '#000',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});