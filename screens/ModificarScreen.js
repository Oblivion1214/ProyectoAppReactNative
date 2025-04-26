// screens/ModificarScreen.js
import React, { useState, useContext } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem   from 'expo-file-system';
import { ref, get, set } from 'firebase/database';
import { AuthContext }    from '../contexts/AuthContext';
import { db }             from '../firebase/config';

export default function ModificarScreen() {
  const { user }      = useContext(AuthContext);
  const [searchId, setSearchId] = useState('');
  const [product, setProduct]   = useState(null);
  const [nombre, setNombre]     = useState('');
  const [descripcion, setDesc]  = useState('');
  const [fecha, setFecha]       = useState('');
  const [showPicker, setShow]   = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setBase64]= useState('');

  const handleBuscar = async () => {
    if (!searchId.trim()) return Alert.alert('Error', 'Ingrese ID');
    const snap = await get(ref(db, `productos/${searchId.trim()}`));
    if (snap.exists()) {
      const data = snap.val();
      setProduct(data);
      setNombre(data.nombre);
      setDesc(data.descripcion);
      setFecha(data.fecha);
      setImageUri(data.imagen ? `data:image/jpeg;base64,${data.imagen}` : null);
      setBase64(data.imagen || '');
    } else {
      Alert.alert('No encontrado', 'Producto no existe');
    }
  };

  const onChangeDate = (e, sel) => {
    setShow(false);
    if (sel) {
      const d = sel;
      setFecha(`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      const b64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      setImageBase64(b64);
    }
  };


  const handleUpdate = async () => {
    if (!product) return;
    if (product.providerId !== user.uid) {
      return Alert.alert('Permiso denegado', 'No puedes modificar este producto');
    }
    if (!nombre || !descripcion || !fecha || !imageBase64) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    const updated = { ...product, nombre, descripcion, fecha, imagen: imageBase64 };
    set(ref(db, `productos/${product.id}`), updated)
      .then(() => Alert.alert('¡Actualizado!', 'Éxito'))
      .catch(err => Alert.alert('Error', err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="ID para buscar"
        value={searchId}
        onChangeText={setSearchId}
        style={styles.input}
      />
      <View style={styles.button}>
        <Button title="Buscar" onPress={handleBuscar} color="#03A9F4" />
      </View>

      {product && (
        <>
          <TextInput
            value={product.id}
            editable={false}
            style={[styles.input, { backgroundColor: '#ddd' }]}
          />
          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDesc}
            multiline
            style={[styles.input, { height: 80 }]}
          />

          <View style={styles.button}>
            <Button
              title="Cambiar Fecha"
              onPress={() => setShow(true)}
              color="#FF9800"
            />
          </View>
          <Text style={styles.date}>Fecha: {fecha}</Text>
          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <View style={styles.photoContainer}>
            {imageUri
              ? <Image source={{ uri: imageUri }} style={styles.photo} />
              : <Text style={styles.photoPlaceholder}>Aquí irá la foto</Text>
            }
          </View>
          <View style={styles.button}>
            <Button title="Tomar Foto" onPress={pickImage} color="#03A9F4" />
          </View>

          {product.providerId === user.uid && (
            <View style={styles.button}>
              <Button
                title="Actualizar Producto"
                onPress={handleUpdate}
                color="#4CAF50"
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow:1, backgroundColor:'#FFCC80', padding:16 },
  input:        { backgroundColor:'#FFF', padding:12, borderRadius:4, marginBottom:12 },
  button:       { marginVertical:8 },
  date:         { fontSize:16, marginBottom:12 },
  photoContainer: {
    width: '100%',           // <-- ancho completo
    height: 200,
    backgroundColor:'#E0E0E0',
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:16
  },
  photo:            { width:'100%', height:'100%', borderRadius:4 },
  photoPlaceholder: { color:'#777' }
});
