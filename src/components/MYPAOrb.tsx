import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MYPAOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

const sizeConfig = {
  sm: { container: 56, icon: 24 },
  md: { container: 80, icon: 32 },
  lg: { container: 128, icon: 48 },
  xl: { container: 192, icon: 64 },
};

export function MYPAOrb({ size = 'lg', showGlow = true }: MYPAOrbProps) {
  const config = sizeConfig[size];

  return (
    <View style={[styles.container, { width: config.container, height: config.container }]}>
      {showGlow && (
        <View
          style={[
            styles.glow,
            {
              width: config.container * 1.2,
              height: config.container * 1.2,
              borderRadius: (config.container * 1.2) / 2,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.orb,
          {
            width: config.container,
            height: config.container,
            borderRadius: config.container / 2,
          },
        ]}
      >
        <Ionicons name="sparkles" size={config.icon} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  orb: {
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
});
