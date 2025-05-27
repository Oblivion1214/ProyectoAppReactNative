import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Button,
  Alert,
  Linking,
  useColorScheme,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import haversine from 'haversine';

export default function LocationScreen() {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [distance, setDistance] = useState(null);

  const colorScheme = useColorScheme();
  const mapRef = useRef(null);

  // Coordenadas ficticias de la tienda
  const store = {
    latitude: 19.432608,
    longitude: -99.133209,
    title: 'Tienda Demo',
    description: 'Ubicación de la tienda',
  };

  const loadLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación para mostrar el mapa.');
      setPermissionDenied(true);
      setLoading(false);
      return;
    }

    try {
      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const current = { latitude, longitude };
      setUserLocation(current);

      setRegion({
        latitude: (latitude + store.latitude) / 2,
        longitude: (longitude + store.longitude) / 2,
        latitudeDelta: Math.abs(latitude - store.latitude) * 1.5 + 0.02,
        longitudeDelta: Math.abs(longitude - store.longitude) * 1.5 + 0.02,
      });

      const km = haversine(current, store, { unit: 'km' }).toFixed(2);
      setDistance(km);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLocation();
  }, []);

  const openMaps = () => {
    if (!userLocation) return;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const dest = `${store.latitude},${store.longitude}`;
    const url = Platform.select({
      ios: `maps://app?daddr=${dest}&saddr=${origin}`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`,
    });
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas.')
    );
  };

  const recenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const darkMapStyle = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#242f3e' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#746855' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#242f3e' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];

  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text>Cargando ubicación...</Text>
        {permissionDenied && (
          <Button title="Reintentar" onPress={loadLocation} color="#4CAF50" />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
      >
        {/* Marcador tienda */}
        <Marker
          coordinate={{ latitude: store.latitude, longitude: store.longitude }}
          title={store.title}
          description={store.description}
          pinColor="#FF5722"
        />
        {/* Marcador usuario */}
        <Marker.Animated
          coordinate={userLocation}
          title="Tú estás aquí"
          pinColor="#2196F3"
        />
        {/* Línea entre usuario y tienda */}
        <Polyline
          coordinates={[userLocation, { latitude: store.latitude, longitude: store.longitude }]}
          strokeColor="#4CAF50"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.distanceText}>Distancia aprox.: {distance} km</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cómo llegar" onPress={openMaps} color="#4CAF50" />
      </View>

      <View style={styles.floatingButton}>
        <Button title="Centrar en mí" onPress={recenterMap} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  infoBox: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
