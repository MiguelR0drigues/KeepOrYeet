import { ActionButtons } from '@/components/ActionButtons';
import { ThemedText } from '@/components/ThemedText';
import { GALLERY_PERMISSION_KEY } from '@/constants/Permissions';
import { BlurView } from 'expo-blur';
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PhotoCard, PhotoCardHandle } from '../components/PhotoCard';
import { PhotoDetailsSheet } from '../components/PhotoDetailsSheet';

type MediaTypeValue = 'photo' | 'video' | 'audio' | 'unknown' | 'pairedVideo';

interface PhotoAsset {
  uri: string;
  width: number;
  height: number;
  filename: string;
  creationTime: number;
  modificationTime: number;
  duration: number;
  mediaType: MediaTypeValue;
  mediaSubtypes?: string[];
  albumId?: string;
}

export default function App() {
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const photoCardRef = useRef<PhotoCardHandle>(null);

  const loadPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        await SecureStore.setItemAsync(GALLERY_PERMISSION_KEY, 'true');
        
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          sortBy: ['creationTime'],
        });
        
        setPhotos(assets);
      }
      
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert(
        'Error',
        'Failed to load photos from your gallery. Please check your permissions and try again.'
      );
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedPermission = await SecureStore.getItemAsync(GALLERY_PERMISSION_KEY);
        
        if (storedPermission === 'true') {
          const { status } = await MediaLibrary.getPermissionsAsync();
          if (status === 'granted') {
            setHasPermission(true);
            const { assets } = await MediaLibrary.getAssetsAsync({
              mediaType: 'photo',
              sortBy: ['creationTime'],
            });
            setPhotos(assets);
            return;
          }
        }
        
        await loadPhotos();
      } catch (error) {
        console.error('Error initializing app:', error);
        setHasPermission(false);
      }
    };

    initializeApp();
  }, []);

  const handleSwipeLeft = async () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeUp = () => {
    setShowDetails(true);
  };

  const handleSheetClose = () => {
    setShowDetails(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.debugText}>We need access to your photos to continue 😅</ThemedText>
        <Button title="Request Permission" onPress={() => {
          MediaLibrary.requestPermissionsAsync().then(({ status }) => {
            setHasPermission(status === 'granted');
            if (status === 'granted') {
              loadPhotos();
            }
          });
        }} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.debugText}>No access to photos</ThemedText>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.debugText}>No photos found</ThemedText>
      </View>
    );
  }

  if (currentIndex >= photos.length - 1) {
    return (
      <View style={styles.container}>
        <BlurView intensity={20} style={styles.completedContainer}>
          <ThemedText style={styles.completedText}>All done! 🎉</ThemedText>
          <ThemedText style={styles.completedSubtext}>You&apos;ve gone through all your photos</ThemedText>
          <Button title="Restart" onPress={() => {
            setCurrentIndex(0);
          }} />
        </BlurView>
      </View>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.gestureArea}>
            {currentPhoto && (
              <PhotoCard
                ref={photoCardRef}
                uri={currentPhoto.uri}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
              />
            )}
          </View>
          <ActionButtons photoCardRef={photoCardRef} />
          {showDetails && (
            <PhotoDetailsSheet
              onClose={handleSheetClose}
              photo={currentPhoto}
              show={showDetails}
            />
          )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  completedContainer: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  completedText: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  completedSubtext: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  gestureArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  gestureWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 