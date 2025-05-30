import { Background } from '@/components/Background';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NoPhotosFound } from '@/components/NoPhotosFound';
import { PermissionRequest } from '@/components/PermissionRequest';
import { PhotoViewer } from '@/components/PhotoViewer';
import { TopBar } from '@/components/TopBar';
import { useLoadingStore } from '@/store/loading';
import { usePermissionsStore } from '@/store/permissions';
import { usePhotosStore } from '@/store/photos';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { photos, loadPhotos, hasLoaded } = usePhotosStore();
  const { show: showLoading } = useLoadingStore();
  const { hasMediaPermissions, hasDeletePermissions, isLoading: isLoadingPermissions, checkPermissions, requestPermissions } = usePermissionsStore();

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (hasMediaPermissions && hasDeletePermissions) {
      loadPhotos();
    }
  }, [hasMediaPermissions, hasDeletePermissions, loadPhotos]);

  useEffect(() => {
    if (!hasLoaded) {
      showLoading('Loading your photos...');
    }
  }, [hasLoaded, showLoading]);

  if (isLoadingPermissions || hasMediaPermissions === null || hasDeletePermissions === null) {
    return (
      <Background>
        <View style={styles.container}>
          <PermissionRequest loading={true} />
        </View>
      </Background>
    );
  }

  if (!hasMediaPermissions || !hasDeletePermissions) {
    return (
      <Background>
        <View style={styles.container}>
          <PermissionRequest onRequestPermission={requestPermissions} />
        </View>
      </Background>
    );
  }

  if (!hasLoaded) {
    return (
      <Background>
        <LoadingScreen />
      </Background>
    );
  }

  if (photos.length === 0) {
    return (
      <Background>
        <View style={styles.container}>
          <NoPhotosFound />
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <StatusBar style="light" />
          <Stack.Screen options={{ headerShown: false }} />
          <TopBar variant="main" />
          <View style={styles.content}>
            <PhotoViewer photos={photos} />
          </View>
        </View>
      </GestureHandlerRootView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 