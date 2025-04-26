import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function HomeScreen() {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [volume, setVolume] = useState(1); // Volumen inicial al máximo

  const handlePlay = async () => {
    if (video.current) {
      await video.current.playAsync();
    }
  };

  const handlePause = async () => {
    if (video.current) {
      await video.current.pauseAsync();
    }
  };

  const handleStop = async () => {
    if (video.current) {
      await video.current.pauseAsync();
      await video.current.setPositionAsync(0); // Reinicia el video al inicio
    }
  };

  const handleVolumeChange = async (value) => {
    setVolume(value);
    if (video.current) {
      await video.current.setVolumeAsync(value);
    }
  };

  const handleSeek = async (value) => {
    if (video.current) {
      await video.current.setPositionAsync(value);
    }
  };

  const { width } = Dimensions.get('window');
  const VIDEO_HEIGHT = Platform.OS === 'web' ? 300 : 200;

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={require('../assets/introduccion.mp4')}
        style={[styles.video, { width: width * 0.9, height: VIDEO_HEIGHT }]}
        resizeMode="contain"
        useNativeControls={false}
        isLooping={false}
        shouldPlay={false}
        onPlaybackStatusUpdate={(status) => setStatus(status)}
      />

      <View style={styles.controls}>
        <Button title="Play" onPress={handlePlay} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Stop" onPress={handleStop} />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Progreso</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.durationMillis || 0}
          value={status.positionMillis || 0}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#FFFFFF"
        />
        <Text style={styles.time}>
          {Math.floor((status.positionMillis || 0) / 1000)}s / {Math.floor((status.durationMillis || 0) / 1000)}s
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Volumen</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#FFFFFF"
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