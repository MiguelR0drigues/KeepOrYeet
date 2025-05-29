import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export const NoPhotosFound: React.FC = () => {
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>No photos found in your gallery.</ThemedText>
      <ThemedText style={styles.subtext}>
        Add some photos to your device and try again.
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 