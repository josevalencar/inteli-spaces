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
      md={{ flexDirection: "row" }}
      alignItems="center"
      gap={32}
    >
      <Card
        borderRadius={32}
        padding={16}
        flexDirection={"column"}
        alignItems={"center"}
        gap={8}
      >
        <Image
          src="images/logo-inteli-branco.png"
          width={120}
          onClick={() => window.open("https://www.inteli.edu.br/", "_blank")}
        />
        <Text
          fontFamily="roboto"
          fontSize={20}
          onClick={() => window.open("https://www.inteli.edu.br/", "_blank")}
        >
          spaces
        </Text>
        <Container
          flexDirection="column"
          justifyContent="space-between"
          alignItems="stretch"
          gapRow={8}
        >
          {view === "main" ? (
            <Container flexDirection="row" gap={8}>
              {[
                {
                  title: "Experiência Inteli",
                  image: skyboxTextures[0], // Use first texture from store
                  onClick: handleExperienciaClick,
                },
                {
                  title: "Espaços do Inteli",
                  image: skyboxTextures[4], // Use fifth texture from store (the_adventures_of_sherlock_holmes_9.jpg)
                  onClick: () => setView("espacos"),
                },
              ].map(({ title, image, onClick }, idx) => (
                <Container key={idx} flexDirection="column" gap={4}>
                  <Card
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                    hover={{ backgroundOpacity: 0.5 }}
                    borderRadius={16}
                    flexDirection={"column"}
                    alignItems="center"
                    gap={4}
                    padding={4}
                  >
                    <Image
                      src={image}
                      width={142}
                      height={142}
                      objectFit="cover"
                      borderRadius={16}
                      keepAspectRatio={false}
                    />
                    <Text
                      fontFamily="roboto"
                      maxWidth={142}
                      fontSize={13}
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {title}
                    </Text>
                  </Card>
                </Container>
              ))}
            </Container>
          ) : (
            <Container flexDirection="row" gap={8}>
              {[
                {
                  title: "Auditorio",
                  image: skyboxTextures[2], // Use third texture from store (the_adventures_of_sherlock_holmes_10.jpg)
                },
                {
                  title: "Atelie",
                  image: skyboxTextures[4], // Use fifth texture from store (the_adventures_of_sherlock_holmes_9.jpg)
                },
                {
                  title: "Laboratorio Maker",
                  image: skyboxTextures[0], // Use first texture from store (the_adventures_of_sherlock_holmes_1.jpg)
                },
              ].map(({ title, image }, idx) => (
                <Container key={idx} flexDirection="column" gap={4}>
                  <Card
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Selected location: ${title}`);
                    }}
                    hover={{ backgroundOpacity: 0.5 }}
                    borderRadius={16}
                    flexDirection={"column"}
                    alignItems="center" 
                    gap={4}
                    padding={4}
                  >
                    <Image
                      src={image}
                      width={142}
                      height={142}
                      objectFit="cover"
                      borderRadius={16}
                      keepAspectRatio={false}
                    />
                    <Text
                      fontFamily="roboto"
                      maxWidth={142}
                      fontSize={13}
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {title}
                    </Text>
                  </Card>
                </Container>
              ))}
            </Container>
          )}
          <Container
            flexDirection="row"
            justifyContent={"space-evenly"}
            gap={8}
          >
            {mode === null ? (
              <Button
                variant="rect"
                size="sm"
                platter
                flexGrow={1}
                onClick={() => store.enterAR()}
              >
                <Text>VR/AR</Text>
              </Button>
            ) : (
              <Button
                variant="rect"
                size="sm"
                platter
                flexGrow={1}
                onClick={() => session.end()}
              >
                <Text>Exit VR</Text>
              </Button>
            )}
            {view !== "main" && view !== "experiencia" && (
              <Button
                variant="rect"
                size="sm"
                platter
                flexGrow={1}
                onClick={() => setView("main")}
              >
                <Text>Voltar</Text>
              </Button>
            )}
          </Container>
        </Container>
      </Card>
    </Container>
  );

  return (
    <Defaults>
      <Root>
        {view === "experiencia" ? renderExperienciaUI() : renderMainUI()}
      </Root>
    </Defaults>
  );
}
