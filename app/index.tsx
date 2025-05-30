import { NoPhotosFound } from '@/components/NoPhotosFound';
import { PermissionRequest } from '@/components/PermissionRequest';
import { PhotoViewer } from '@/components/PhotoViewer';
import { TopBar } from '@/components/TopBar';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { photos, hasPermission, requestPermission } = useMediaLibrary();
  const router = useRouter();

  const handleProfilePress = () => {
    // TODO: Implement profile screen navigation
    console.log('Profile pressed');
  };

  const handleSummaryPress = () => {
    // TODO: Implement summary screen navigation
    router.push('/_sitemap')
    console.log('Summary pressed');
  };

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
      <View style={styles.mainContainer}>
        <StatusBar style="light" />
        <TopBar
          onProfilePress={handleProfilePress}
          onSummaryPress={handleSummaryPress}
        />
        <View style={styles.content}>
          <PhotoViewer photos={photos} />
        </View>
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
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 