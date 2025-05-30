import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { seedGallery } from '@/mocks/gallerySeeder';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const DevGallerySeeder: React.FC = () => {
  const { colors } = useTheme();
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedGallery = async () => {
    try {
      setIsSeeding(true);
      setError(null);
      await seedGallery();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Gallery Seeder</ThemedText>
      <ThemedText style={styles.description}>
        This screen allows you to populate your device&apos;s gallery with sample images for testing purposes.
      </ThemedText>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSeedGallery}
        disabled={isSeeding}
      >
        <ThemedText style={styles.buttonText}>
          {isSeeding ? 'Seeding Gallery...' : 'Add 500 Sample Images'}
        </ThemedText>
      </TouchableOpacity>

      {error && (
        <ThemedText style={[styles.error, { color: colors.yeet }]}>
          {error}
        </ThemedText>
      )}

      {isSeeding && (
        <ThemedText style={styles.info}>
          Please keep the app open while images are being added...
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
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
  error: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
});

