import { Avatar, Flex, Text } from '@chakra-ui/react';

export type MemeAuthorProps = {
  username: string;
  photoUrl: string;
};

export const MemeAuthor: React.FC<MemeAuthorProps> = ({ username, photoUrl }) => {
  return (
    <Flex>
      <Avatar borderWidth="1px" borderColor="gray.300" size="xs" name={username} src={photoUrl} />
      <Text ml={2}>{username}</Text>
    </Flex>
  );
};
