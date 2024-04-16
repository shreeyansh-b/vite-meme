import { Flex, Image, ScrollArea } from "@mantine/core";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";

type Props = {
  images: Meme[];
  onSelectMeme: (meme: Meme) => void;
  selectedMeme: Meme;
};

const Gallery = ({ images, onSelectMeme, selectedMeme }: Props) => {
  return (
    <ScrollArea h="calc( 100vh - 110px )" offsetScrollbars>
      <Flex wrap="wrap" gap="sm" p="sm">
        {images.map((image) => (
          <Image
            key={image.id}
            src={image.url}
            alt={image.name}
            radius="md"
            fit="contain"
            style={{
              width: 120,
              height: 120,
              boxShadow:
                image.id === selectedMeme?.id
                  ? "0 0 4px 4px rgba(59, 130, 246, 0.5)"
                  : "none",
            }}
            onClick={() => onSelectMeme(image)}
          />
        ))}
      </Flex>
    </ScrollArea>
  );
};

export { Gallery };
