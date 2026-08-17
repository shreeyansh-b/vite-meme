import { useEffect, useMemo, useState } from "react";

import { createLazyFileRoute } from "@tanstack/react-router";

import { Meme, useGetMemesQuery } from "../hooks/data-fetchers/useGetMemesQuery";
import { Canvas } from "../modules/Canvas/Canvas";
import { Gallery } from "../modules/Gallery/Gallery";

export const Route = createLazyFileRoute("/")({ component: Index });

function Index() {
  const { data = [], isLoading, isError } = useGetMemesQuery();
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!selectedMeme && data.length) setSelectedMeme(data[0]);
  }, [data, selectedMeme]);

  const selectedName = useMemo(
    () => selectedMeme?.name ?? "Choose a template",
    [selectedMeme],
  );

  if (isLoading) {
    return <main className="loading-screen">Loading the good stuff<span>...</span></main>;
  }

  if (isError || !data.length) {
    return <main className="loading-screen">Couldn’t load templates. Give it another go.</main>;
  }

  return (
    <main className="meme-app">
      <header className="app-header">
        <a className="wordmark" href="/" aria-label="Meme Studio home">
          <span className="wordmark-mark">M</span>
          Meme Studio
        </a>
        <div className="header-context">
          <span>Editing</span>
          <strong>{selectedName}</strong>
        </div>
      </header>

      <section className="workspace" aria-label="Meme editor">
        <aside className="template-panel">
          <Gallery images={data} onSelectMeme={setSelectedMeme} selectedMeme={selectedMeme} />
        </aside>
        <section className="editor-panel">
          {selectedMeme && <Canvas meme={selectedMeme} onDownload={() => setShowToast(true)} />}
        </section>
      </section>

      {showToast && (
        <div className="toast" role="status">
          <span className="toast-check">✓</span>
          <div><strong>Ready to post</strong><span>Your meme has been downloaded.</span></div>
          <button type="button" onClick={() => setShowToast(false)} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </main>
  );
}
