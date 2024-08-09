import { Box, VStack, Flex, StackDivider, Text } from "@chakra-ui/react";
import React from "react";
import { MemePicture } from "./meme-picture";
import { AvatarWithText } from "./avatar-with-text";
import { CommentSection } from "./comment-section";

interface MemeCardProps {
  meme: {
    id: string;
    pictureUrl: string;
    description: string;
    createdAt: string;
    author: { username: string; pictureUrl: string };
    texts: { content: string; x: number; y: number }[]; // Ajout de la propriété `texts`
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { username: string; pictureUrl: string };
    }>;
    commentsCount: number;
  };
}

export const MemeCard: React.FC<MemeCardProps> = ({ meme }) => (
  <VStack
    p={4}
    width="full"
    align="stretch"
    divider={<StackDivider border="gray.200" />}
  >
    <Flex justifyContent="space-between" alignItems="center">
      <AvatarWithText
        username={meme.author.username}
        pictureUrl={meme.author.pictureUrl}
      />
      <Text fontStyle="italic" color="gray.500" fontSize="small">
        {meme.createdAt}
      </Text>
    </Flex>
    <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} />{" "}
    {/* Ajout de `texts` */}
    <Box>
      <Text fontWeight="bold" fontSize="medium" mb={2}>
        Description:
      </Text>
      <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
        <Text color="gray.500" whiteSpace="pre-line">
          {meme.description}
        </Text>
      </Box>
    </Box>
    <CommentSection
      memeId={meme.id}
      comments={meme.comments}
      commentsCount={meme.commentsCount}
    />
  </VStack>
);
