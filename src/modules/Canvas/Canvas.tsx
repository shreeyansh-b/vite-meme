import { ElementRef, useEffect, useRef, useState } from "react";

import { Stage, Layer, Image } from "react-konva";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";
import { generateRandomId } from "../../utils";
import { EditableText } from "./EditableText";

const Canvas = ({ meme }: { meme: Meme }) => {
  const stageRef = useRef<ElementRef<typeof Stage>>(null);

  const [image, setImage] = useState<HTMLImageElement>();

  const [texts, setTexts] = useState<
    { x: number; y: number; id: string }[] | undefined
  >([]);

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = meme.url;
    img.onload = () => {
      setImage(img);
    };
  }, [meme.url]);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
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
            },
          ]);
        }
        // deselect text
        if (
          e.target === e.target.getStage() ||
          (e.target.attrs.id === meme.id.toString() && selectedTextId !== null)
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
          id={meme.id.toString()}
        />
        {texts?.map((text) => (
          <EditableText
            x={text.x}
            y={text.y}
            id={text.id}
            onSelect={() => {
              setSelectedTextId(text.id);
            }}
            selectedTextId={selectedTextId}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export { Canvas };
