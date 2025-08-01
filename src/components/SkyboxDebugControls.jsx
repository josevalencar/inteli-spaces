import React from 'react';
import { Container, Text, Root } from '@react-three/uikit';
import { Button, Defaults } from '@react-three/uikit-apfel';
import { useSkyboxStore } from '../store/useSkyboxStore';

export const SkyboxDebugControls = ({ position = [0, 0, 0] }) => {
  const {
    nextSkybox,
    currentSkyboxIndex
  } = useSkyboxStore();

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
              Current: {currentSkyboxIndex} | FBM Noise Transition
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
            

          </Container>
        </Root>
      </Defaults>
    </group>
  );
};