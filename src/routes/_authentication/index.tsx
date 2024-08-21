import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Flex, StackDivider, VStack } from '@chakra-ui/react';
import { getMemes, getUsers } from '../../api';
import { useAuthToken } from '../../contexts/authentication';
import { Loader } from '../../components/loader';
import { MemeCard } from '../../components/meme-card';
import { useMemo, useState, useEffect, useRef } from 'react';
import { UserEntity } from '../../models/entities/user';

interface FetchMemesParams {
  queryKey: string[];
  pageParam: number;
}

const fetchMemes = async (params: FetchMemesParams) => {
  const [, token] = params.queryKey;
  const response = await getMemes(token, params.pageParam);
  return response;
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

  // set to store already fetched author IDs
  const [fetchedAuthorIds, setFetchedAuthorIds] = useState<Set<string>>(new Set());

  // memes
  const {
    isLoading,
    data: memePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['memes', token],
    queryFn: fetchMemes,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => (lastPage.results.length > 0 ? lastPageParam + 1 : undefined),
  });

  const memes = useMemo(() => memePages?.pages?.flatMap((page) => page.results) || [], [memePages]);

  // filter out authorIds that have already been fetched
  const authorIds = useMemo(() => {
    return memes.map((meme) => meme.authorId).filter((id) => !fetchedAuthorIds.has(id));
  }, [memes, fetchedAuthorIds]);

  // update the fetchedAuthorIds set after authors are fetched
  useEffect(() => {
    if (authorIds.length > 0) {
      setFetchedAuthorIds((prev) => {
        const updatedSet = new Set(prev);
        authorIds.forEach((id) => updatedSet.add(id));
        return updatedSet;
      });
    }
  }, [authorIds]);

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

  // infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetchingNextPage) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

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
        {hasNextPage && (
          <Box ref={sentinelRef}>
            <Loader data-testid="meme-feed-loader" />
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute('/_authentication/')({
  component: MemeFeedPage,
});
