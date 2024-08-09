import {
  Box,
  Collapse,
  Flex,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createMemeComment } from "../api";
import { AvatarWithText } from "./avatar-with-text";

interface CommentSectionProps {
  memeId: string;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: { username: string; pictureUrl: string };
  }>;
  commentsCount: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  memeId,
  comments,
  commentsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState<string>("");

  const toggleOpen = () => setIsOpen(!isOpen);

  const { mutate } = useMutation({
    mutationFn: async (content: string) =>
      createMemeComment("", memeId, content),
  });

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (commentContent) {
      mutate(commentContent);
      setCommentContent("");
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" py={2}>
        <Flex alignItems="center">
          <Text cursor="pointer" onClick={toggleOpen}>
            {commentsCount} comments
          </Text>
          <Icon as={isOpen ? CaretUp : CaretDown} ml={2} mt={1} />
        </Flex>
        <Icon as={Chat} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box mb={6}>
          <form onSubmit={handleCommentSubmit}>
            <Flex alignItems="center">
              <AvatarWithText
                username="CurrentUser"
                pictureUrl="/path/to/avatar"
              />
              <Input
                placeholder="Type your comment here..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
            </Flex>
          </form>
        </Box>
        <VStack align="stretch" spacing={4}>
          {comments.map((comment) => (
            <Flex key={comment.id}>
              <AvatarWithText
                username={comment.author.username}
                pictureUrl={comment.author.pictureUrl}
              />
              <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>{comment.author.username}</Text>
                  <Text fontStyle="italic" color="gray.500" fontSize="small">
                    {comment.createdAt}
                  </Text>
                </Flex>
                <Text color="gray.500">{comment.content}</Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};
