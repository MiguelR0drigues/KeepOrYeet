import { NoPhotosFound } from '@/components/NoPhotosFound';
import { PermissionRequest } from '@/components/PermissionRequest';
import { PhotoViewer } from '@/components/PhotoViewer';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { photos, hasPermission, requestPermission } = useMediaLibrary();

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <PermissionRequest onRequestPermission={requestPermission} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <PermissionRequest onRequestPermission={requestPermission} />
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <NoPhotosFound />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <PhotoViewer photos={photos} />
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
}); 