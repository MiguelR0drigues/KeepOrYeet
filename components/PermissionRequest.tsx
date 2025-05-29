import React from 'react';
import { Button } from 'react-native';
import { StateCard } from './StateCard';

interface PermissionRequestProps {
  onRequestPermission: () => void;
}

export const PermissionRequest: React.FC<PermissionRequestProps> = ({ onRequestPermission }) => {
  return (
    <StateCard
      title="Photo Access Needed"
      subtitle="We need access to your photos to help you organize them"
    >
      <Button 
        title="Grant Access"
        onPress={onRequestPermission}
      />
    </StateCard>
  );
}; 