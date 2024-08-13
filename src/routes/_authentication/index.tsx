import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Flex, StackDivider, VStack } from '@chakra-ui/react';
import { getMemes, getUsers } from '../../api';
import { useAuthToken } from '../../contexts/authentication';
import { Loader } from '../../components/loader';
import { MemeCard } from '../../components/meme-card';
import { useMemo } from 'react';
import { UserEntity } from '../../models/entities/user';

interface FetchMemesParams {
  queryKey: [name: string, token: string, page: number];
}

const fetchMemes = async (params: FetchMemesParams) => {
  const [, token, page] = params.queryKey;
  const response = await getMemes(token, page);
  return response.results;
};

interface FetchAuthorsParams {
  queryKey: [name: string, token: string, authorIds: string[] | undefined];
}

const fetchAuthors = async (params: FetchAuthorsParams) => {
  const [, token, authorIds] = params.queryKey;
  const uniqueAuthorIds = [...new Set(authorIds)];
  const response = await getUsers(token, uniqueAuthorIds);
  return response;
};

const mapUserById = (map: Record<string, UserEntity>, author: UserEntity): Record<string, UserEntity> => {
  map[author.id] = author;
  return map;
};

export const MemeFeedPage: React.FC = () => {
  // authentication
  const token = useAuthToken();

  // memes
  const { isLoading, data: memes } = useQuery({
    queryKey: ['memes', token, 1],
    queryFn: fetchMemes,
  });

  // authorIds memoization
  const authorIds = useMemo(() => memes?.map((meme) => meme.authorId), [memes]);

  // authors
  const { data: authors } = useQuery({
    queryKey: ['authors', token, authorIds],
    queryFn: fetchAuthors,
    enabled: !!authorIds && authorIds.length > 0,
  });

  // memoized map of authors by their id
  const authorsMap = useMemo(() => {
    const emptyValue: Record<string, UserEntity> = {};
    return authors?.reduce(mapUserById, emptyValue) || emptyValue;
  }, [authors]);

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack p={4} width="full" maxWidth={800} divider={<StackDivider border="gray.200" />}>
        {memes?.map((meme) => (
          <MemeCard
            key={meme.id}
            id={meme.id}
            author={authorsMap[meme.authorId]}
            pictureUrl={meme.pictureUrl}
            description={meme.description}
            commentsCount={meme.commentsCount}
            texts={meme.texts}
            createdAt={meme.createdAt}
          />
        ))}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute('/_authentication/')({
  component: MemeFeedPage,
});
