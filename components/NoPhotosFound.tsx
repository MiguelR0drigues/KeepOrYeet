import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from './ThemedText';

export const NoPhotosFound: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>No photos found in your gallery.</ThemedText>
      <ThemedText style={styles.subtext}>
        Add some photos to your device and try again.
      </ThemedText>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/dev')}
      >
        <ThemedText style={styles.buttonText}>
          Open Development Tools
        </ThemedText>
      </TouchableOpacity>
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
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
}); 