import { useDeviceStorage } from '@/hooks/useDeviceStorage';
import { PhotoAsset } from '@/types/generic';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButtons } from './ActionButtons';
import { NoPhotosFound } from './NoPhotosFound';
import { PhotoCard, PhotoCardHandle } from './PhotoCard';
import { PhotoDetailsSheet } from './PhotoDetailsSheet';

interface PhotoViewerProps {
  photos: PhotoAsset[];
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const { moveToYeeted } = useDeviceStorage();
  const photoCardRef = useRef<PhotoCardHandle>(null);

  const handleSwipeLeft = async () => {
    await moveToYeeted([photos[currentIndex].id]);
    if (currentIndex < photos.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < photos.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeUp = () => {
    setShowDetails(true);
  };

  const handleSheetClose = () => {
    setShowDetails(false);
  };

  if (currentIndex >= photos.length) {
    return (
      <View style={styles.container}>
        <NoPhotosFound />
      </View>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  gestureArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
}); 