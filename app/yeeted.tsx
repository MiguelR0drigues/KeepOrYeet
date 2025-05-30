import { Background } from '@/components/Background';
import { ThemedText } from '@/components/ThemedText';
import { TopBar } from '@/components/TopBar';
import { useTheme } from '@/hooks/useTheme';
import { usePhotosStore } from '@/store/photos';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const NUM_COLUMNS = 3;
const SPACING = 1;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_SIZE = (SCREEN_WIDTH - (NUM_COLUMNS + 1) * SPACING) / NUM_COLUMNS;

export default function YeetedScreen() {
  const { yeetedPhotos, isLoading, loadYeetedPhotos, restorePhoto, deletePhotos } = usePhotosStore();
  const [photosToKeep, setPhotosToKeep] = useState<Set<string>>(new Set());
  const { colors } = useTheme();

  useEffect(() => {
    loadYeetedPhotos();
  }, [loadYeetedPhotos]);

  const handlePhotoPress = (photoId: string) => {
    setPhotosToKeep(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleRestoreSelected = async () => {
    const promises = Array.from(photosToKeep).map(id => restorePhoto(id));
    await Promise.all(promises);
    setPhotosToKeep(new Set());
  };

  const handleDeleteUnselected = () => {
    const photosToDelete = yeetedPhotos
      .filter(photo => !photosToKeep.has(photo.id))
      .map(photo => photo.id);
    
    if (photosToDelete.length === 0) return;
    
    Alert.alert(
      'Delete Photos',
      `Are you sure you want to permanently delete ${photosToDelete.length} photo${photosToDelete.length > 1 ? 's' : ''}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePhotos(photosToDelete);
            setPhotosToKeep(new Set());
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = photosToKeep.has(item.id);

    return (
      <TouchableOpacity
        onPress={() => handlePhotoPress(item.id)}
        style={styles.photoContainer}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          contentFit="cover"
        />
        <View style={styles.selectionCircle}>
          {isSelected ? (
            <View style={[styles.selectedCircle, { backgroundColor: colors.keep }]}>
              <MaterialCommunityIcons name="check" size={16} color="white" />
            </View>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (yeetedPhotos.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>No yeeted photos</ThemedText>
        </View>
      );
    }

    const photosToDelete = yeetedPhotos.length - photosToKeep.size;

    return (
      <>
        <FlatList
          data={yeetedPhotos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[styles.bottomBar, { backgroundColor: colors.primary }]}
        >
          <View style={styles.bottomButtons}>
            {photosToKeep.size > 0 && (
              <>
                <TouchableOpacity
                  style={[styles.bottomButton, styles.restoreButton]}
                  onPress={handleRestoreSelected}
                >
                  <MaterialCommunityIcons name="restore" size={24} color="white" />
                  <ThemedText style={styles.bottomButtonText}>
                    Keep {photosToKeep.size}
                  </ThemedText>
                </TouchableOpacity>
                <View style={styles.buttonSeparator} />
              </>
            )}
            <TouchableOpacity
              style={[styles.bottomButton, styles.deleteButton]}
              onPress={handleDeleteUnselected}
            >
              <Ionicons name="trash-outline" size={24} color={colors.yeet} />
              <ThemedText style={[styles.bottomButtonText, { color: colors.yeet }]}>
                Delete {photosToDelete}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </>
    );
  };

  return (
    <Background>
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar variant="yeeted" />
      <View style={styles.container}>
        {renderContent()}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  row: {
    marginLeft: SPACING,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginTop: SPACING,
    marginRight: SPACING,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  selectionCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  restoreButton: {
    opacity: 0.9,
  },
  deleteButton: {
    opacity: 0.9,
  },
  buttonSeparator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
}); 