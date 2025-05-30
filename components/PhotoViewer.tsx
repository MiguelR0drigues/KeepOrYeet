import { usePhotosStore } from '@/store/photos';
import { PhotoAsset } from '@/types/generic';
import { SwipeableCardHandle } from '@/types/ui';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButtons } from './ActionButtons';
import { NoPhotosFound } from './NoPhotosFound';
import { PhotoCard } from './PhotoCard';
import { PhotoDetailsSheet } from './PhotoDetailsSheet';

interface PhotoViewerProps {
  photos: PhotoAsset[];
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({ photos }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { currentIndex, yeetPhoto, incrementCurrentIndex } = usePhotosStore();
  const photoCardRef = useRef<SwipeableCardHandle>(null);

  const handleSwipeLeft = async () => {
    await yeetPhoto(photos[currentIndex].id);
  };

  const handleSwipeRight = () => {
    incrementCurrentIndex();
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