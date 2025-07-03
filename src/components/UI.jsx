import { useState } from "react";
import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useFont } from "@react-three/drei";

useFont.preload("/fonts/Roboto-Regular.json");

export function UI() {
  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const [view, setView] = useState("main");

  return (
    <Defaults>
      <Root>
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
              font="/fonts/Roboto-Regular.json"
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
                      title: "Experiencia Inteli",
                      image: "images/the_adventures_of_sherlock_holmes_1.jpg",
                      onClick: () => console.log("Experiência clicked"),
                    },
                    {
                      title: "Espacos do Inteli",
                      image: "images/the_adventures_of_sherlock_holmes_9.jpg",
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
                          font="/fonts/Roboto-Regular.json"
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
                      image: "images/the_adventures_of_sherlock_holmes_10.jpg",
                    },
                    {
                      title: "Atelie",
                      image: "images/the_adventures_of_sherlock_holmes_9.jpg",
                    },
                    {
                      title: "Laboratorio Maker",
                      image: "images/the_adventures_of_sherlock_holmes_1.jpg",
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
                          font="/fonts/Roboto-Regular.json"
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
                {view !== "main" && (
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
      </Root>
    </Defaults>
  );
}
