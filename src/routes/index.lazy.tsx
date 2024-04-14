import { createLazyFileRoute } from "@tanstack/react-router";

import { useGetMemesQuery } from "../hooks/data-fetchers/useGetMemesQuery";
import { Canvas } from "../modules/Canvas/Canvas";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading } = useGetMemesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2">
      <Canvas meme={data?.[1]} />
    </div>
  );
}
