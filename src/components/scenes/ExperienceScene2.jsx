import React from 'react';
import { Float } from '@react-three/drei';
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import ProceduralSkybox from '../ProceduralSkybox';

export const ExperienceScene2 = () => {
  return (
    <>
      {/* Skybox for second experience */}
      <ProceduralSkybox />
      
      {/* Subtitle UI positioned in 3D space */}
      <group position-y={1} position-z={-4}>
        <Float rotationIntensity={0.2} speed={2} floatIntensity={0.5}>
          <Defaults>
            <Root>
              <Container
                flexDirection="column"
                alignItems="center"
                gap={16}
              >
                <Card
                  borderRadius={24}
                  padding={20}
                  flexDirection="column"
                  alignItems="center"
                  gap={12}
                  backgroundOpacity={0.8}
                  backgroundColor="#1a1a1a"
                >
                  <Text
                    fontFamily="roboto"
                    fontSize={24}
                    fontWeight="bold"
                    color="#ffffff"
                    textAlign="center"
                  >
                    Arquibancada
                  </Text>
                  <Text
                    fontFamily="roboto"
                    fontSize={16}
                    color="#cccccc"
                    textAlign="center"
                    maxWidth={400}
                  >
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Text>
                  <Container
                    flexDirection="row"
                    alignItems="center"
                    gap={8}
                    marginTop={8}
                  >
                    <Text
                      fontFamily="roboto"
                      fontSize={14}
                      color="#888888"
                      fontStyle="italic"
                    >
                      Espaço: Arquibancada Colaborativa
                    </Text>
                  </Container>
                </Card>
              </Container>
            </Root>
          </Defaults>
        </Float>
      </group>
    </>
  );
};