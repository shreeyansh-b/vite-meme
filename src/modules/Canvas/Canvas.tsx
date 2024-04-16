import { ElementRef, useEffect, useRef, useState } from "react";

import { Box, Button, Flex, ScrollArea, Textarea } from "@mantine/core";
import { Image, Layer, Stage } from "react-konva";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";
import { generateRandomId } from "../../utils";
import { EditableText } from "./EditableText";

const Canvas = ({ meme }: { meme: Meme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<ElementRef<typeof Stage>>(null);

  const [image, setImage] = useState<HTMLImageElement>();

  const [texts, setTexts] = useState<
    { x: number; y: number; id: string; content: string }[] | undefined
  >([]);

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const hasNoTexts = texts?.length === 0;

  useEffect(() => {
    const img = new window.Image();
    img.src = meme.url;
    img.onload = () => {
      setImage(img);
    };
  }, [meme.url]);

  // on meme change reset texts
  useEffect(() => {
    setTexts([]);
  }, [meme]);

  return (
    <Box display="flex" h="calc(100vh - 110px)">
      <Box ref={containerRef} w="70%">
        <Stage
          ref={stageRef}
          width={containerRef.current?.clientWidth ?? window.innerWidth}
          height={containerRef.current?.clientHeight ?? window.innerHeight}
          onMouseDown={(e) => {
            // if clicked on image add Text
            if (
              e.target.attrs.id === meme.id.toString() &&
              selectedTextId === null
            ) {
              setTexts([
                ...(texts ?? []),
                {
                  id: generateRandomId(10),
                  x: e.evt.offsetX,
                  y: e.evt.offsetY,
                  content: "Funny text",
                },
              ]);
            }
            // deselect text
            if (
              e.target === e.target.getStage() ||
              (e.target.attrs.id === meme.id.toString() &&
                selectedTextId !== null)
            ) {
              setSelectedTextId(null);
            }
          }}
          id="stage-canvas"
        >
          <Layer>
            <Image
              image={image}
              width={meme.width / 2}
              height={meme.height / 2}
              id={meme.id?.toString()}
            />
            {texts?.map((text) => (
              <EditableText
                key={text.id}
                x={text.x}
                y={text.y}
                id={text.id}
                selectedTextId={selectedTextId}
                onSelect={() => {
                  setSelectedTextId(text.id);
                }}
                onDragEnd={({ x, y }: { x: number; y: number }) => {
                  setTexts(
                    texts?.map((t) => (t.id === text.id ? { ...t, x, y } : t)),
                  );
                }}
                text={text.content}
              />
            ))}
          </Layer>
        </Stage>
      </Box>

      <Flex w="30%">
        {hasNoTexts && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-gray-600 rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-200 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 19a1 1 0 0 1-1-1v-7H2a1 1 0 1 1 0-2h7V2a1 1 0 1 1 2 0v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 0 1-1 1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-md text-gray-200">
                Click on the image to add text
              </span>
            </div>
          </div>
        )}

        {!hasNoTexts && (
          <Box
            p="md"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 10,
            }}
            w="100%"
          >
            <h2 className="text-xl font-bold text-white mb-2">Texts</h2>
            <ScrollArea h="95%" offsetScrollbars type="auto">
              {texts?.map((text) => (
                <Flex align="center">
                  <Textarea
                    key={text.id}
                    value={text.content}
                    onChange={(e) => {
                      setTexts(
                        texts?.map((t) =>
                          t.id === text.id
                            ? { ...t, content: e.currentTarget.value }
                            : t,
                        ),
                      );
                    }}
                    onClick={() => setSelectedTextId(text.id)}
                    mt={2}
                  />
                  <Button
                    variant="transparent"
                    onClick={() => {
                      setTexts(texts?.filter((t) => t.id !== text.id));
                    }}
                    color="red"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </Button>
                </Flex>
              ))}
            </ScrollArea>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export { Canvas };
