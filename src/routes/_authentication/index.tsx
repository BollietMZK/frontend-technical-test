import { createFileRoute } from "@tanstack/react-router";
import { Flex, VStack } from "@chakra-ui/react";
import React from "react";
import { useMemes } from "../../hooks/useMemes";
import { MemeCard } from "../../components/meme-card";
import { Loader } from "../../components/loader";

export const MemeFeedPage: React.FC = () => {
  const { isLoading, data: memes } = useMemes();

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack p={4} width="full" maxWidth={800}>
        {memes?.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
