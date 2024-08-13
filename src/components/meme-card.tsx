import { Box, Collapse, Flex, Icon, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react';
import { MemePicture } from './meme-picture';
import { format } from 'timeago.js';
import { MemeText } from '../models/meme-text';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { MemeAuthor } from './meme-author';
import { useState } from 'react';

export type MemeCardProps = {
  id: string;
  author?: {
    username: string;
    pictureUrl: string;
  };
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: MemeText[];
  createdAt: string;
};

export const MemeCard: React.FC<MemeCardProps> = ({ id, author, createdAt, commentsCount, description, pictureUrl, texts }) => {
  const [openedCommentSection, setOpenedCommentSection] = useState<string | null>(null);
  //   const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  //   const { mutate } = useMutation({
  //     mutationFn: async (data: { memeId: string; content: string }) => {
  //       await createMemeComment(token, data.memeId, data.content);
  //     },
  //   });

  //   const { data: user } = useQuery({
  //     queryKey: ['user'],
  //     queryFn: async () => {
  //       return await getUserById(token, jwtDecode<{ id: string }>(token).id);
  //     },
  //   });

  return (
    <VStack key={id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        {author && <MemeAuthor username={author.username} photoUrl={author.pictureUrl} />}
        <Text fontStyle="italic" color="gray.500" fontSize="small">
          {format(createdAt)}
        </Text>
      </Flex>
      <MemePicture pictureUrl={pictureUrl} texts={texts} dataTestId={`meme-picture-${id}`} />
      <Box>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:{' '}
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${id}`}>
            {description}
          </Text>
        </Box>
      </Box>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay data-testid={`meme-comments-section-${id}`} cursor="pointer" onClick={() => setOpenedCommentSection(openedCommentSection === id ? null : id)}>
              <Text data-testid={`meme-comments-count-${id}`}>{commentsCount} comments</Text>
            </LinkOverlay>
            <Icon as={openedCommentSection !== id ? CaretDown : CaretUp} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={openedCommentSection === id} animateOpacity>
        <Box mb={6}>
          {/* <form
            onSubmit={(event) => {
              event.preventDefault();
              if (commentContent[id]) {
                mutate({
                  memeId: id,
                  content: commentContent[id],
                });
              }
            }}>
            <Flex alignItems="center">
              <Avatar borderWidth="1px" borderColor="gray.300" name={user?.username} src={user?.pictureUrl} size="sm" mr={2} />
              <Input
                placeholder="Type your comment here..."
                onChange={(event) => {
                  setCommentContent({
                    ...commentContent,
                    [id]: event.target.value,
                  });
                }}
                value={commentContent[id]}
              />
            </Flex>
          </form> */}
        </Box>
        {/* <VStack align="stretch" spacing={4}>
          {meme.comments.map((comment) => (
            <Flex key={comment.id}>
              <Avatar borderWidth="1px" borderColor="gray.300" size="sm" name={comment.author.username} src={comment.author.pictureUrl} mr={2} />
              <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex>
                    <Text data-testid={`meme-comment-author-${id}-${comment.id}`}>{comment.author.username}</Text>
                  </Flex>
                  <Text fontStyle="italic" color="gray.500" fontSize="small">
                    {format(comment.createdAt)}
                  </Text>
                </Flex>
                <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${id}-${comment.id}`}>
                  {comment.content}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack> */}
      </Collapse>
    </VStack>
  );
};
