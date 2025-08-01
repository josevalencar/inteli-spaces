import { useState, useRef, useEffect } from "react";
import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useVideoTexture } from "@react-three/drei";
import { useSkyboxStore } from '../store/useSkyboxStore';

// Simple Video Display Component
function VideoDisplay({ src, fallbackSrc, ...props }) {
  const [showVideo, setShowVideo] = useState(false);
  
  // Check if video file exists
  useEffect(() => {
    const checkVideoExists = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        setShowVideo(response.ok);
      } catch (error) {
        setShowVideo(false);
      }
    };
    
    checkVideoExists();
  }, [src]);

  // If video exists, use a separate component that calls useVideoTexture
  if (showVideo) {
    return <ActualVideoDisplay src={src} {...props} />;
  }

  // Otherwise show fallback
  return (
    <Container
      {...props}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#1a1a1a"
      borderRadius={16}
    >
      {fallbackSrc ? (
        <Image src={fallbackSrc} {...props} />
      ) : (
        <Container
          {...props}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#2a2a2a"
        >
          <Text color="#888" fontSize={16} marginBottom={8}>
            🎬
          </Text>
          <Text color="#666" fontSize={12}>
            Video Preview
          </Text>
        </Container>
      )}
    </Container>
  );
}

// Separate component that only renders when video exists
function ActualVideoDisplay({ src, ...props }) {
  const texture = useVideoTexture(src, {
    muted: true,
    loop: true,
    start: true
  });

  return <Image {...props} src={texture} />;
}

export function UI({ onStartParticles, onStartExperience }) {
  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const [view, setView] = useState("main");
  const audioRef = useRef(null);
  const skyboxTextures = useSkyboxStore((state) => state.skyboxTextures);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio("/audio/intro.mp3");
    audioRef.current.volume = 0.7; // Set volume to 70%
  }, []);

  const handleExperienciaClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    // Start particle system
    if (onStartParticles) {
      onStartParticles();
    }
    
    // Start the scene-based experience
    if (onStartExperience) {
      onStartExperience();
    }
  };

  // Simple subtitle UI for Experiencia Inteli mode
  const renderExperienciaUI = () => (
    <Container
      flexDirection="column"
      alignItems="center"
      gap={24}
    >
      <Card
        borderRadius={32}
        padding={24}
        flexDirection={"column"}
        alignItems={"center"}
        gap={16}
        backgroundOpacity={0.8}
      >
        {/* Video Display */}
        <VideoDisplay 
          src="/videos/intro-video.mp4"
          fallbackSrc="/textures/space.png"
          width={400}
          height={225}
          borderRadius={16}
          objectFit="cover"
        />
        
        <Text
          fontFamily="roboto"
          fontSize={32}
          fontWeight="bold"
          color="#ffffff"
          textAlign="center"
        >
          Experiência Inteli
        </Text>
        <Text
          fontFamily="roboto"
          fontSize={18}
          color="#cccccc"
          textAlign="center"
          maxWidth={400}
        >
          Explore os espaços imersivos do Instituto de Tecnologia e Liderança
        </Text>
        <Button
          variant="rect"
          size="md"
          platter
          onClick={() => setView("main")}
        >
          <Text>Voltar ao Menu</Text>
        </Button>
      </Card>
    </Container>
  );

  // Main UI content
  const renderMainUI = () => (
    <Container
      flexDirection="column"
      alignItems="center"
      gap={32}
    >
      <Card
        borderRadius={32}
        padding={32}
        flexDirection={"column"}
        alignItems={"center"}
        gap={16}
        width={220}
        height={200}
      >
        <Image
          src="images/logo.png"
          width={120}
          onClick={() => window.open("https://www.inteli.edu.br/", "_blank")}
        />
        {/* <Text
          fontFamily="roboto"
          fontSize={20}
          onClick={() => window.open("https://www.inteli.edu.br/", "_blank")}
        >
          spaces
        </Text> */}
        <Container
          flexDirection="column"
          justifyContent="space-between"
          alignItems="stretch"
          gapRow={8}
        >
          <Container
            flexDirection="row"
            justifyContent="center"
          >
            <Button
              variant="rect"
              size="sm"
              platter
              onClick={handleExperienciaClick}
            >
              <Text>Começar</Text>
            </Button>
          </Container>
          <Container
            flexDirection="row"
            justifyContent="center"
            gap={8}
          >
            {mode === null ? (
              <Button
                variant="rect"
                size="sm"
                platter
                onClick={() => store.enterAR()}
              >
                <Text>VR/AR</Text>
              </Button>
            ) : (
              <Button
                variant="rect"
                size="sm"
                platter
                onClick={() => session.end()}
              >
                <Text>Exit VR</Text>
              </Button>
            )}
          </Container>
        </Container>
      </Card>
    </Container>
  );

  return (
    <Defaults>
      <Root
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        {view === "experiencia" ? renderExperienciaUI() : renderMainUI()}
      </Root>
    </Defaults>
  );
}
