import { useEffect, useState } from "react";

import { AppShell, Container } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";

import {
  Meme,
  useGetMemesQuery,
} from "../hooks/data-fetchers/useGetMemesQuery";
import { Canvas } from "../modules/Canvas/Canvas";
import { Gallery } from "../modules/Gallery/Gallery";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading } = useGetMemesQuery();

  const [selectedMeme, setSelectedMeme] = useState<Meme>(
    data?.[0] ?? ({} as Meme),
  );

  const onSelectMeme = (meme: Meme) => {
    setSelectedMeme(meme);
  };

  useEffect(() => {
    if (data) {
      setSelectedMeme(data[0]);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold text-red-500 animate-pulse">
          Loading<span className="animate-bounce">...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell padding="md" header={{ height: 69 }}>
      <AppShell.Header className="p-4 bg-slate-900">
        <h1 className="text-3xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-red-600">
          Meme Generator
        </h1>
      </AppShell.Header>
      <AppShell.Main className="bg-indigo-950">
        <Container fluid display="flex">
          <Container fluid w="30%">
            <Gallery
              images={data ?? []}
              onSelectMeme={onSelectMeme}
              selectedMeme={selectedMeme}
            />
          </Container>
          <Container fluid w="70%">
            <Canvas meme={selectedMeme} />
          </Container>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
