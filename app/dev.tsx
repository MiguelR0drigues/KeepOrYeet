import { DevGallerySeeder } from '@/screens/DevGallerySeeder';
import { Stack } from 'expo-router';
import React from 'react';

export default function DevScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Development Tools',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      <DevGallerySeeder />
    </>
  );
} 