import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Linking,
  Alert,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import Slider from '@react-native-community/slider';

export default function HomeScreen() {
  // 1. Creamos el player con el asset local
  const player = useVideoPlayer(require('../assets/introduccion.mp4'), (pl) => {
    pl.loop = false;
  });

  // 2. Estado para almacenar status (position & duration en segundos)
  const [status, setStatus] = useState({ position: 0, duration: 0 });
  // 3. Escuchamos el evento statusChange
  useEventListener(player, 'statusChange', ({ status: st }) => {
    setStatus({
      position: st.currentTime,       // segundos
      duration: st.duration,          // segundos
    });
  });

  // 4. Volumen en un estado local
  const [volume, setVolume] = useState(1);

  const handlePlay = () => player.play();
  const handlePause = () => player.pause();
  const handleStop = () => {
    player.pause();
    player.currentTime = 0;
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    player.volume = value;
  };

  const handleSeek = (value) => {
    player.currentTime = value;
  };

  const { width } = Dimensions.get('window');
  const VIDEO_HEIGHT = Platform.OS === 'web' ? 300 : 200;

  const openUnityApp = async () => {
    const deepLink = 'trendy://';
    const packageName = 'com.UnityTechnologies.com.unity.template.urpblank';
    let url =
      Platform.OS === 'android'
        ? `intent://${packageName}/#Intent;scheme=android-app;package=${packageName};end;`
        : deepLink;
    try {
      await Linking.openURL(url);
    } catch {
      try {
        await Linking.openURL(deepLink);
      } catch (e) {
        Alert.alert('Error', `No se pudo abrir la aplicación: ${e.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 5. El componente VideoView */}
      <VideoView
        player={player}
        style={[styles.video, { width: width * 0.9, height: VIDEO_HEIGHT }]}
        nativeControls={false}
        resizeMode="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      {/* Controles de reproducción */}
      <View style={styles.controls}>
        <Button title="Play" onPress={handlePlay} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Stop" onPress={handleStop} />
        <Button title="Abrir Unity" onPress={openUnityApp} />
      </View>

      {/* Slider de progreso */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Progreso</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.duration}
          value={status.position}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#000"
          thumbTintColor="#FFF"
        />
        <Text style={styles.time}>
          {Math.floor(status.position)}s / {Math.floor(status.duration)}s
        </Text>
      </View>

      {/* Slider de volumen */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Volumen</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#000"
          thumbTintColor="#FFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  video: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  sliderContainer: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  label: {
    color: '#FFF',
    marginBottom: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  time: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
  },
});
