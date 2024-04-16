import { ElementRef, useEffect, useRef, useState } from "react";

import { Transformer, Text as KonvaText } from "react-konva";

type EditableTextProps = {
  x: number;
  y: number;
  id: string;
  onSelect: () => void;
  selectedTextId: string | null;
  onDragEnd: ({ x, y }: { x: number; y: number }) => void;
  text: string;
};

const EditableText = ({
  x,
  y,
  id,
  onSelect,
  selectedTextId,
  onDragEnd,
  text,
}: EditableTextProps) => {
  const transformerRef = useRef<ElementRef<typeof Transformer>>(null);
  const textRef = useRef<ElementRef<typeof KonvaText>>(null);

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      // @ts-expect-error - transformerRef is not null
      transformerRef.current?.nodes([textRef?.current]);
    }
  }, [isSelected]);

  useEffect(() => {
    setIsSelected(id === selectedTextId);
  }, [id, selectedTextId]);

  return (
    <>
      <KonvaText
        x={x}
        y={y}
        id={id}
        draggable
        ref={textRef}
        text={text}
        onClick={onSelect}
        onDragEnd={(e) => onDragEnd({ x: e.target.x(), y: e.target.y() })}
      />
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
};

export { EditableText };
