import { MAX_HORIZONTAL_DRAG_DISTANCE, MAX_ROTATION, SCREEN_WIDTH, SWIPE_THRESHOLD, VERTICAL_SWIPE_THRESHOLD } from '@/constants/Generic';
import { Image } from 'expo-image';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

export interface PhotoCardHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
}

interface PhotoCardProps {
  uri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
}

type ContextType = {
  startX: number;
  startY: number;
};

export const PhotoCard = forwardRef<PhotoCardHandle, PhotoCardProps>(
  ({ uri, onSwipeLeft, onSwipeRight, onSwipeUp }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
      translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      rotation.value = withSpring(0);
      scale.value = withSpring(1);
    }, [uri]);

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      ContextType
    >({
      onStart: (_, context) => {
        context.startX = translateX.value;
        context.startY = translateY.value;
      },
      onActive: (event, context) => {
        const newX = context.startX + event.translationX;
        const newY = context.startY + event.translationY;
        
        // Handle horizontal movement
        translateX.value = Math.max(Math.min(newX, MAX_HORIZONTAL_DRAG_DISTANCE), -MAX_HORIZONTAL_DRAG_DISTANCE);
        
        // Handle vertical movement - only allow upward movement
        translateY.value = Math.min(newY, 0);
        
        rotation.value = interpolate(
          translateX.value,
          [-MAX_HORIZONTAL_DRAG_DISTANCE, 0, MAX_HORIZONTAL_DRAG_DISTANCE],
          [-MAX_ROTATION, 0, MAX_ROTATION],
          Extrapolation.CLAMP
        );
        
        scale.value = interpolate(
          Math.abs(translateX.value),
          [0, MAX_HORIZONTAL_DRAG_DISTANCE],
          [1, 0.95],
          Extrapolation.CLAMP
        );
      },
      onEnd: (event) => {
        // Check for vertical swipe first
        if (event.translationY < VERTICAL_SWIPE_THRESHOLD && onSwipeUp) {
          runOnJS(onSwipeUp)();
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 80
          });
          translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 80
          });
          rotation.value = withSpring(0);
          scale.value = withSpring(1);
          return;
        }

        // Handle horizontal swipe
        if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
          translateX.value = withSpring(
            Math.sign(translateX.value) * SCREEN_WIDTH * 1.5,
            { 
              velocity: event.velocityX,
              damping: 20,
              stiffness: 80
            }
          );
          translateY.value = withSpring(0, { 
            velocity: event.velocityY,
            damping: 20,
            stiffness: 80
          });
          scale.value = withSpring(0.8);
          
          if (translateX.value > 0) {
            runOnJS(onSwipeRight)();
          } else {
            runOnJS(onSwipeLeft)();
          }
        } else {
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 80
          });
          translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 80
          });
          rotation.value = withSpring(0);
          scale.value = withSpring(1);
        }
      },
    });

    const cardStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotation.value}deg` },
          { scale: scale.value },
        ],
      };
    });

    const keepStyle = useAnimatedStyle(() => {
      const overlayOpacity = interpolate(
        translateX.value,
        [0, SCREEN_WIDTH / 4],
        [0, 1],
        Extrapolation.CLAMP
      );
      return { 
        opacity: overlayOpacity,
        transform: [
          { scale: interpolate(translateX.value, [0, SCREEN_WIDTH / 4], [0.8, 1], Extrapolation.CLAMP) }
        ]
      };
    });

    const yeetStyle = useAnimatedStyle(() => {
      const overlayOpacity = interpolate(
        translateX.value,
        [-SCREEN_WIDTH / 4, 0],
        [1, 0],
        Extrapolation.CLAMP
      );
      return { 
        opacity: overlayOpacity,
        transform: [
          { scale: interpolate(translateX.value, [-SCREEN_WIDTH / 4, 0], [1, 0.8], Extrapolation.CLAMP) }
        ]
      };
    });

    // Imperative swipe methods
    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {
          damping: 20,
          stiffness: 80,
        });
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 80,
        });
        scale.value = withSpring(0.8);
        setTimeout(() => {
          if (onSwipeLeft) onSwipeLeft();
          translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
          translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
          rotation.value = withSpring(0);
          scale.value = withSpring(1);
        }, 250);
      },
      swipeRight: () => {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {
          damping: 20,
          stiffness: 80,
        });
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 80,
        });
        scale.value = withSpring(0.8);
        setTimeout(() => {
          if (onSwipeRight) onSwipeRight();
          translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
          translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
          rotation.value = withSpring(0);
          scale.value = withSpring(1);
        }, 250);
      },
      swipeUp: () => {
        translateY.value = withSpring(-SCREEN_WIDTH, {
          damping: 20,
          stiffness: 80,
        });
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 80,
        });
        setTimeout(() => {
          if (onSwipeUp) onSwipeUp();
          translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
          translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
          rotation.value = withSpring(0);
          scale.value = withSpring(1);
        }, 250);
      },
    }));

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
            transition={100}
          />
          <Animated.View style={[styles.overlay, styles.keepOverlay, keepStyle]}>
            <Animated.Text style={[styles.text, styles.keepText]}>KEEP</Animated.Text>
          </Animated.View>
          <Animated.View style={[styles.overlay, styles.yeetOverlay, yeetStyle]}>
            <Animated.Text style={[styles.text, styles.yeetText]}>YEET</Animated.Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

PhotoCard.displayName = 'PhotoCard';

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 30,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'transparent',
    borderColor: 'rgb(54, 0, 108)',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    padding: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  keepOverlay: {
    top: '10%',
    left: 10,
    transform: [{ translateY: -30 }],
  },
  yeetOverlay: {
    top: '10%',
    right: 10,
    transform: [{ translateY: -30 }],
  },
  text: {
    fontSize: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    textShadowRadius: 3,
    borderWidth: 3,
    borderRadius: 20,
    padding: 10,
  },
  keepText: {
    color: '#4CAF50',
    borderColor: '#4CAF50',
  },
  yeetText: {
    color: '#F44336',
    borderColor: '#F44336',
  },
}); 