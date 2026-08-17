import { ElementRef, useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";
import { generateRandomId } from "../../utils";
import { EditableText, MemeText } from "./EditableText";

type Props = { meme: Meme; onDownload: () => void };
const initialTexts = (): MemeText[] => [
  { id: "top", content: "", x: 38, y: 32, color: "#ffffff", fontSize: 36, fontFamily: "Arial Black", outline: true },
  { id: "bottom", content: "", x: 38, y: 330, color: "#ffffff", fontSize: 36, fontFamily: "Arial Black", outline: true },
];

const Canvas = ({ meme, onDownload }: Props) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<ElementRef<typeof Stage>>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 640, height: 520 });
  const [texts, setTexts] = useState<MemeText[]>(initialTexts);
  const [selectedId, setSelectedId] = useState("top");
  const selected = texts.find((text) => text.id === selectedId) ?? texts[0];

  useEffect(() => { setTexts(initialTexts()); setSelectedId("top"); }, [meme.id]);
  useEffect(() => {
    let isCurrent = true;
    setImage(undefined);
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = meme.url;
    img.onload = () => { if (isCurrent) setImage(img); };
    return () => { isCurrent = false; };
  }, [meme.url]);
  useEffect(() => {
    const element = canvasRef.current; if (!element) return;
    const resize = () => { const width = Math.max(360, element.clientWidth - 56); const height = Math.max(360, element.clientHeight - 56); const ratio = meme.width / meme.height; const canvasWidth = Math.min(width, height * ratio); setSize({ width: canvasWidth, height: canvasWidth / ratio }); };
    resize(); const observer = new ResizeObserver(resize); observer.observe(element); return () => observer.disconnect();
  }, [meme.height, meme.width]);
  const updateSelected = (changes: Partial<MemeText>) => setTexts((current) => current.map((text) => text.id === selected.id ? { ...text, ...changes } : text));
  const addText = () => { const text = { id: generateRandomId(8), content: "New text", x: 70, y: size.height / 2, color: "#ffffff", fontSize: 32, fontFamily: "Arial Black", outline: true }; setTexts((current) => [...current, text]); setSelectedId(text.id); };
  const download = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const transformers = stage.find("Transformer");
    transformers.forEach((transformer) => transformer.visible(false));
    stage.draw();
    try {
      const uri = stage.toDataURL({ pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${meme.name.toLowerCase().replace(/ /g, "-")}-meme.png`;
      link.href = uri;
      link.click();
      onDownload();
    } finally {
      transformers.forEach((transformer) => transformer.visible(true));
      stage.draw();
    }
  };

  return <div className="editor-layout">
    <section className="canvas-section">
      <div className="canvas-toolbar"><div><span className="eyebrow">Canvas</span><strong>{meme.name}</strong></div><button type="button" onClick={addText}>+ Add text</button></div>
      <div className="canvas-surface" ref={canvasRef}>
        <div className="canvas-frame">
          <Stage ref={stageRef} width={size.width} height={size.height} onMouseDown={(event) => { if (event.target === event.target.getStage()) setSelectedId(""); }}>
            <Layer><Image image={image} width={size.width} height={size.height} />{texts.map((text) => <EditableText key={text.id} text={text} selected={text.id === selectedId} onSelect={() => setSelectedId(text.id)} onDragEnd={(position) => setTexts((current) => current.map((item) => item.id === text.id ? { ...item, ...position } : item))} />)}</Layer>
          </Stage>
        </div>
      </div>
      <p className="canvas-hint">Drag captions directly on the image to reposition them.</p>
    </section>
    <aside className="inspector">
      <div className="inspector-heading"><div><p className="eyebrow">Make it yours</p><h2>Caption editor</h2></div><button type="button" className="delete-button" onClick={() => { if (selected) setTexts((current) => current.filter((text) => text.id !== selected.id)); }} aria-label="Delete selected caption">⌫</button></div>
      <div className="caption-tabs">{texts.slice(0, 2).map((text, index) => <button key={text.id} className={selectedId === text.id ? "active" : ""} onClick={() => setSelectedId(text.id)} type="button">{index === 0 ? "Top text" : "Bottom text"}</button>)}</div>
      {selected && <div className="controls">
        <label className="control-label">Caption<textarea value={selected.content} onChange={(event) => updateSelected({ content: event.target.value })} placeholder={selected.id === "top" ? "Add top text" : "Add bottom text"} rows={3} /></label>
        <label className="control-label">Type style<select value={selected.fontFamily} onChange={(event) => updateSelected({ fontFamily: event.target.value })}><option>Arial Black</option><option>Arial</option><option>Georgia</option></select></label>
        <div className="control-row"><label className="control-label">Size<div className="range-input"><input type="range" min="18" max="64" value={selected.fontSize} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} /><span>{selected.fontSize}</span></div></label><label className="control-label">Color<input className="color-input" type="color" value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })} /></label></div>
        <label className="switch-row"><span><strong>Black outline</strong><small>Classic meme energy</small></span><input type="checkbox" checked={selected.outline} onChange={(event) => updateSelected({ outline: event.target.checked })} /></label>
      </div>}
      <button className="inspector-download" type="button" onClick={download}>Download meme <span>↗</span></button>
    </aside>
  </div>;
};

export { Canvas };
