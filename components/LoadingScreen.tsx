import { useTheme } from '@/hooks/useTheme';
import { useLoadingStore } from '@/store/loading';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

export const LoadingScreen = () => {
  const { colors } = useTheme();
  const { isVisible, message } = useLoadingStore();

  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={StyleSheet.absoluteFill}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <View style={styles.container}>
          <View style={styles.content}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            <ThemedText style={styles.message}>{message}</ThemedText>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loader: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    color: 'white',
  },
}); 