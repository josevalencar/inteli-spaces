import React, { useEffect, useState } from 'react';
import { Float } from '@react-three/drei';
import { Container, Root, Text } from "@react-three/uikit";
import { Card, Defaults } from "@react-three/uikit-apfel";
import ProceduralSkybox from '../ProceduralSkybox';
import { CustomGeometryParticles } from '../Particles';
import { useSkyboxStore } from '../../store/useSkyboxStore';

// Tour configuration - focused on skyboxes
const TOUR_CONFIG = [
  {
    skyboxIndex: 1,
    duration: 15000, // 15 seconds
    title: "Entrada",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    showParticles: true,
    particleConfig: {
      count: 2000,
      rotationSpeed: 0.001,
      sizeMultiplier: 2.0,
      baseSize: 3.0
    }
  },
  {
    skyboxIndex: 2,
    duration: 12000, // 12 seconds  
    title: "Exploração",
    description: "Discover new worlds and immersive environments through our virtual reality experience.",
    showParticles: false
  },
  {
    skyboxIndex: 3,
    duration: 10000, // 10 seconds
    title: "Contemplação", 
    description: "Take a moment to reflect and enjoy the peaceful atmosphere of this digital space.",
    showParticles: false
  }
];

export const TourScene = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const setSkyboxIndex = useSkyboxStore((state) => state.setSkyboxIndex);
  
  // Particle system state (only for step 0)
  const [particleState, setParticleState] = useState({
    isActive: false,
    phase: 'inactive'
  });
  const [particleOpacity, setParticleOpacity] = useState(0);

  const currentConfig = TOUR_CONFIG[currentStep];

  // Initialize first skybox and start tour
  useEffect(() => {
    console.log('🎬 Starting skybox tour');
    setSkyboxIndex(TOUR_CONFIG[0].skyboxIndex);
    setStepStartTime(Date.now());
    
    // Start particles if needed
    if (TOUR_CONFIG[0].showParticles) {
      setParticleState({ isActive: true, phase: 'fading-in' });
      setParticleOpacity(0);
    }
  }, [setSkyboxIndex]);

  // Handle step progression
  useEffect(() => {
    if (currentStep >= TOUR_CONFIG.length) {
      // Tour complete - return to menu
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const stepDuration = currentConfig.duration;
    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      
      if (nextStep < TOUR_CONFIG.length) {
        console.log(`🎬 Tour step ${currentStep} → ${nextStep}`);
        
        // Transition to next skybox (smooth shader transition)
        setSkyboxIndex(TOUR_CONFIG[nextStep].skyboxIndex);
        setCurrentStep(nextStep);
        setStepStartTime(Date.now());
        
        // Handle particles for new step
        if (TOUR_CONFIG[nextStep].showParticles) {
          setParticleState({ isActive: true, phase: 'fading-in' });
          setParticleOpacity(0);
        } else {
          setParticleState({ isActive: false, phase: 'inactive' });
          setParticleOpacity(0);
        }
      } else {
        // Tour complete
        console.log('🎬 Tour completed');
        if (onComplete) {
          onComplete();
        }
      }
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [currentStep, currentConfig, setSkyboxIndex, onComplete]);

  // Particle lifecycle management (only for steps with particles)
  useEffect(() => {
    if (!particleState.isActive || !currentConfig.showParticles) return;

    let timeoutId;
    const particleConfig = {
      fadeInDuration: 500,
      activeDuration: currentConfig.duration - 2500, // Leave time for fade out
      fadeOutDuration: 2000
    };
    
    if (particleState.phase === 'fading-in') {
      const startTime = Date.now();
      
      const fadeIn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeInDuration, 1);
        
        setParticleOpacity(progress);
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeIn);
        } else {
          setParticleState(prev => ({ ...prev, phase: 'active' }));
        }
      };
      
      fadeIn();
      
    } else if (particleState.phase === 'active') {
      timeoutId = setTimeout(() => {
        setParticleState(prev => ({ ...prev, phase: 'fading-out' }));
      }, particleConfig.activeDuration);
      
    } else if (particleState.phase === 'fading-out') {
      const startTime = Date.now();
      const startOpacity = particleOpacity;
      
      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeOutDuration, 1);
        
        setParticleOpacity(startOpacity * (1 - progress));
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeOut);
        } else {
          setParticleState({ isActive: false, phase: 'inactive' });
          setParticleOpacity(0);
        }
      };
      
      fadeOut();
    }
    
    return () => {
      if (timeoutId) {
        if (typeof timeoutId === 'number') {
          clearTimeout(timeoutId);
        } else {
          cancelAnimationFrame(timeoutId);
        }
      }
    };
  }, [particleState.phase, particleState.isActive, currentConfig]);

  return (
    <>
      {/* Skybox - transitions smoothly between steps */}
      <ProceduralSkybox />
      
      {/* Particles - only when configured */}
      {particleState.isActive && currentConfig.showParticles && (
        <CustomGeometryParticles 
          count={currentConfig.particleConfig.count}
          rotationSpeed={currentConfig.particleConfig.rotationSpeed}
          sizeMultiplier={currentConfig.particleConfig.sizeMultiplier}
          baseSize={currentConfig.particleConfig.baseSize}
          opacity={particleOpacity}
        />
      )}

      {/* Dynamic UI content based on current step */}
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
                    {currentConfig.title}
                  </Text>
                  <Text
                    fontFamily="roboto"
                    fontSize={16}
                    color="#cccccc"
                    textAlign="center"
                    maxWidth={400}
                  >
                    {currentConfig.description}
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
                      Etapa {currentStep + 1} de {TOUR_CONFIG.length}
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