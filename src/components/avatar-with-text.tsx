import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface AvatarWithTextProps {
  username: string;
  pictureUrl: string;
}

export const AvatarWithText: React.FC<AvatarWithTextProps> = ({
  username,
  pictureUrl,
}) => (
  <Flex alignItems="center">
    <Avatar
      borderWidth="1px"
      borderColor="gray.300"
      size="xs"
      name={username}
      src={pictureUrl}
    />
    <Text ml={2}>{username}</Text>
  </Flex>
);
