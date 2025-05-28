import { BOTTOM_SHEET_HEIGHT, SCREEN_HEIGHT, VERTICAL_DRAG_THRESHOLD } from '@/constants/Generic';
import { BlurView } from 'expo-blur';
import { MediaTypeValue } from 'expo-media-library';
import React, { useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ThemedText } from './ThemedText';


interface PhotoDetailsSheetProps {
  onClose: () => void;
  show: boolean;
  photo: {
    uri: string;
    width: number;
    height: number;
    filename: string;
    creationTime: number;
    modificationTime: number;
    duration: number;
    mediaType: MediaTypeValue;
  } | null;
}

export const PhotoDetailsSheet: React.FC<PhotoDetailsSheetProps> = ({
  onClose,
  show,
  photo,
}) => {
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [visible, setVisible] = React.useState(show);
  const closeTimeout = React.useRef<number | null>(null);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0; // Only respond to downward drags
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) { // Only allow dragging down
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > VERTICAL_DRAG_THRESHOLD) {
          // If dragged down far enough, close the sheet
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          closeTimeout.current = setTimeout(() => {
            setVisible(false);
            onClose();
          }, 300);
        } else {
          // Otherwise, snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (show) {
      setVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    } else if (visible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();

      // work around to make the sheet close after dragging down
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [show]);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (!photo || !visible) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDimensions = (width: number, height: number) => {
    return `${width} × ${height}`;
  };

  const formatDuration = (duration: number) => {
    if (duration === 0) return 'Photo';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={() => {
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          closeTimeout.current = setTimeout(() => {
            setVisible(false);
            onClose();
          }, 300);
        }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <BlurView intensity={30} style={styles.blurView}>
          <View style={styles.handle} />
          <View style={styles.content}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Details</ThemedText>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Type</ThemedText>
                <ThemedText style={styles.detailValue}>{photo.mediaType}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Dimensions</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDimensions(photo.width, photo.height)}</ThemedText>
              </View>
              {photo.mediaType === 'video' && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Duration</ThemedText>
                  <ThemedText style={styles.detailValue}>{formatDuration(photo.duration)}</ThemedText>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>File</ThemedText>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Name</ThemedText>
                <ThemedText style={styles.detailValue}>{photo.filename}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Created</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(photo.creationTime)}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Modified</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(photo.modificationTime)}</ThemedText>
              </View>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
}); 