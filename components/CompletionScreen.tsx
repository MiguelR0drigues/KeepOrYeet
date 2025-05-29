import React from 'react';
import { Button } from 'react-native';
import { StateCard } from './StateCard';

interface CompletionScreenProps {
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  return (
    <StateCard
      title="All Done! 🎉"
      subtitle="You've gone through all your photos"
    >
      <Button
        title="Start Over"
        onPress={onRestart}
      />
    </StateCard>
  );
}; 