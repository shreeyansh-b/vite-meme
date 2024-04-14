import { useEffect, useState } from "react";

import { Stage, Layer, Image, Text } from "react-konva";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";

const Canvas = ({ meme }: { meme: Meme }) => {
  const [image, setImage] = useState<HTMLImageElement>();

  const [texts, setTexts] = useState<
    | [
        {
          text: string;
          x: number;
          y: number;
        },
      ]
    | []
  >([]);

  useEffect(() => {
    const img = new window.Image();
    img.src = meme.url;
    img.onload = () => {
      setImage(img);
    };
  }, [meme.url]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => {
        // if clicked on image add Text
        if (e.target.attrs.id === meme.id.toString()) {
          const newId = texts.length + 1;
          setTexts([
            ...texts,
            {
              text: "Text",
              x: e.evt.offsetX,
              y: e.evt.offsetY,
              id: newId,
            },
          ]);
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
        {texts.map((text) => (
          <Text
            key={text.id}
            text={text.text}
            x={text.x}
            y={text.y}
            draggable
          />
        ))}
      </Layer>
    </Stage>
  );
};

export { Canvas };
