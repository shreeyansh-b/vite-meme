import { ElementRef, useEffect, useRef } from "react";
import { Text as KonvaText, Transformer } from "react-konva";

export type MemeText = {
  color: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  id: string;
  outline: boolean;
  x: number;
  y: number;
};

type Props = { text: MemeText; selected: boolean; onSelect: () => void; onDragEnd: (position: { x: number; y: number }) => void };

const EditableText = ({ text, selected, onSelect, onDragEnd }: Props) => {
  const transformerRef = useRef<ElementRef<typeof Transformer>>(null);
  const textRef = useRef<ElementRef<typeof KonvaText>>(null);
  useEffect(() => { if (selected && textRef.current) transformerRef.current?.nodes([textRef.current]); }, [selected]);
  if (!text.content) return null;
  return <>
    <KonvaText ref={textRef} x={text.x} y={text.y} text={text.content.toUpperCase()} draggable onClick={onSelect} onTap={onSelect} onDragEnd={(event) => onDragEnd({ x: event.target.x(), y: event.target.y() })} fontFamily={text.fontFamily} fontSize={text.fontSize} fontStyle="bold" fill={text.color} stroke={text.outline ? "#171513" : undefined} strokeWidth={text.outline ? 2 : 0} lineJoin="round" />
    {selected && <Transformer ref={transformerRef} rotateEnabled={false} borderStroke="#E8512D" anchorStroke="#E8512D" anchorFill="#fffaf2" enabledAnchors={["middle-left", "middle-right"]} />}
  </>;
};

export { EditableText };
