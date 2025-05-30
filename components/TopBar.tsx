import { useTheme } from '@/hooks/useTheme';
import { usePhotosStore } from '@/store/photos';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from './Logo';
import { ThemedText } from './ThemedText';

interface TopBarProps {
  variant?: 'main' | 'yeeted';
}

export const TopBar: React.FC<TopBarProps> = ({
  variant = 'main'
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { yeetedPhotos } = usePhotosStore();
  const router = useRouter();

  const handleProfilePress = () => {
    // TODO: Implement profile screen navigation
    console.log('Profile pressed');
  };

  const handleYeetedPress = () => {
    router.push('/yeeted');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top || Constants.statusBarHeight,
    }]}>
      <View style={styles.row}>
        {variant === 'main' ? (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleProfilePress}
            >
              {/* <Ionicons name="person-circle-outline" size={32} color="white" /> */}
            </TouchableOpacity>

            <Logo />

            <TouchableOpacity
              style={styles.yeetedButton}
              onPress={handleYeetedPress}
            >
              <View style={styles.yeetedIconContainer}>
                <Ionicons name="trash-outline" size={24} color="white" />
                {yeetedPhotos.length > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.yeet }]}>
                    <ThemedText style={styles.badgeText}>{yeetedPhotos.length}</ThemedText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <ThemedText style={styles.title}>Yeeted Photos</ThemedText>

            <View style={styles.iconButton} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    height: 40,
    width: '100%',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yeetedButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yeetedIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
}); 