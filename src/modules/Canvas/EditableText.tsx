import { ElementRef, useEffect, useRef, useState } from "react";

import { Transformer, Text as KonvaText } from "react-konva";

type EditableTextProps = {
  x: number;
  y: number;
  id: string;
  onSelect: () => void;
  selectedTextId: string | null;
};

const EditableText = ({
  x,
  y,
  id,
  onSelect,
  selectedTextId,
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
        ref={textRef}
        text="Testt"
        draggable
        onClick={onSelect}
        x={x}
        y={y}
        id={id}
      />
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
};

export { EditableText };
