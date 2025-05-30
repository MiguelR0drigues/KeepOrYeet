import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface PermissionRequestProps {
  onRequestPermission?: () => void;
  loading?: boolean;
}

export const PermissionRequest: React.FC<PermissionRequestProps> = ({ 
  onRequestPermission,
  loading = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Photo Access Required</ThemedText>
      <ThemedText style={styles.description}>
        Keep or Yeet needs access to your photos to help you organize them.
        {!loading && ' Please grant access to continue.'}
      </ThemedText>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onRequestPermission}
        >
          <ThemedText style={styles.buttonText}>Grant Access</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 16,
  },
}); 