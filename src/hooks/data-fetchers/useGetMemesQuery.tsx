import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UseGetMemesQueryOptions = {
  text?: string;
};

export type Meme = {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
};

export const useGetMemesQuery = ({
  text = "get_memes",
}: UseGetMemesQueryOptions = {}) => {
  return useQuery<Meme[], Error>({
    queryKey: ["memes", text],
    queryFn: async () => {
      const response = await axios.get(`https://api.imgflip.com/${text}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch memes");
      }
      return response.data?.data?.memes ?? [];
    },
  });
};
