// screens/AltasScreen.js
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
import { auth, db }      from '../firebase/config';
import { AuthContext }   from '../contexts/AuthContext';

export default function AltasScreen() {
  const { user } = useContext(AuthContext);
  const [id, setId]               = useState('');
  const [nombre, setNombre]       = useState('');
  const [descripcion, setDesc]    = useState('');
  const [fecha, setFecha]         = useState('No seleccionada');
  const [showPicker, setShow]     = useState(false);
  const [imageUri, setImageUri]   = useState(null);
  const [imageBase64, setBase64]  = useState('');

  const onChangeDate = (e, selected) => {
    setShow(false);
    if (selected) {
      const d = selected;
      setFecha(`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permiso de cámara denegado');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: false,
      quality: 0.5,
    });

    // Nuevo API: chequeamos result.canceled y assets[0].uri
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // convertir a base64
      const b64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      setBase64(b64);
    }
  };


  const handleSave = async () => {
    if (!id || !nombre || !descripcion || fecha==='No seleccionada' || !imageBase64) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    const prodRef = ref(db, `productos/${id}`);
    if ((await get(prodRef)).exists()) {
      Alert.alert('Error', 'Ya existe un producto con este ID');
      return;
    }
    const producto = { id, nombre, descripcion, fecha, imagen: imageBase64, activo: true, providerId: user.uid };
    set(prodRef, producto)
      .then(() => Alert.alert('¡Listo!', 'Producto guardado correctamente'))
      .catch(err => Alert.alert('Error', err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Agregar Producto</Text>

      <TextInput placeholder="ID" value={id} onChangeText={setId} style={styles.input}/>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input}/>
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDesc}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <View style={styles.buttonContainer}>
        <Button title="Seleccionar Fecha" onPress={() => setShow(true)} color="#FF9800"/>
      </View>
      <Text style={styles.dateText}>Fecha: {fecha}</Text>
      {showPicker && (
        <DateTimePicker value={new Date()} mode="date" display="default" onChange={onChangeDate}/>
      )}

      <View style={styles.photoContainer}>
        {imageUri
          ? <Image source={{ uri: imageUri }} style={styles.photo} />
          : <Text style={styles.photoPlaceholder}>Aquí se mostrará la foto</Text>
        }
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Tomar Foto" onPress={takePhoto} color="#03A9F4"/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={handleSave} color="#4CAF50"/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#FFCC80', padding: 16
  },
  header: {
    fontSize: 24, color: '#FF5722', fontWeight: 'bold', textAlign: 'center', marginBottom: 16
  },
  input: {
    backgroundColor: '#FFF', padding: 12, borderRadius: 4, marginBottom: 12
  },
  buttonContainer: {
    marginVertical: 8
  },
  dateText: {
    fontSize: 16, marginBottom: 12
  },
  photoContainer: {
    width: '100%',             // <-- ahora ocupa todo el ancho
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 4
  },
  photoPlaceholder: {
    color: '#777'
  }
});
