import { useQuery } from "@tanstack/react-query";
import { getMemes, getUserById, getMemeComments } from "../api";
import { useAuthToken } from "../contexts/authentication";

export const useMemes = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["memes"],
    queryFn: async () => {
      const memes = await getMemes(token, 1); // Récupération de la première page des memes
      const results = memes.results;

      const memesWithDetails = await Promise.all(
        results.map(async (meme) => {
          const author = await getUserById(token, meme.authorId);
          const commentsResponse = await getMemeComments(token, meme.id, 1); // Récupération de la première page des commentaires

          const commentsWithAuthor = await Promise.all(
            commentsResponse.results.map(async (comment) => {
              const commentAuthor = await getUserById(token, comment.authorId);
              return { ...comment, author: commentAuthor };
            })
          );

          const commentsCount = parseInt(meme.commentsCount, 10);

          return {
            ...meme,
            author,
            comments: commentsWithAuthor,
            commentsCount,
          };
        })
      );

      return memesWithDetails;
    },
  });
};
