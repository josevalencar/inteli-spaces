import React from 'react';
import { Container, Text, Root } from '@react-three/uikit';
import { Button, Defaults } from '@react-three/uikit-apfel';
import { useSkyboxStore } from '../store/useSkyboxStore';

export const SkyboxDebugControls = ({ position = [0, 0, 0] }) => {
  const {
    nextSkybox,
    toggleTransitionType,
    transitionType,
    currentSkyboxIndex
  } = useSkyboxStore();

  const transitionTypeNames = {
    0: 'Grid Pattern',
    1: 'FBM Noise'
  };

  return (
    <group position={position}>
      <Defaults>
        <Root>
          <Container 
            flexDirection="column" 
            gap={10}
            padding={16}
            backgroundColor="#1a1a1a"
            borderRadius={8}
            borderColor="#444"
            borderWidth={1}
          >
            <Text fontSize={14} color="white" textAlign="center">
              Skybox Controls
            </Text>
            
            <Text fontSize={12} color="#aaa" textAlign="center">
              Current: {currentSkyboxIndex} | Type: {transitionTypeNames[transitionType]}
            </Text>
            
            <Button 
              onClick={nextSkybox}
              variant="rect"
              size="sm"
            >
              <Text fontSize={12}>
                Next Skybox
              </Text>
            </Button>
            
            <Button 
              onClick={toggleTransitionType}
              variant="rect"
              size="sm"
            >
              <Text fontSize={12}>
                Toggle: {transitionTypeNames[transitionType === 0 ? 1 : 0]}
              </Text>
            </Button>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
};