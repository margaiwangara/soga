import { Box, Flex, Text } from '@chakra-ui/layout';
import React from 'react';

const Loading: React.FC<{}> = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100%"
      overflow="hidden"
      bgColor="whiteAlpha.700"
      zIndex="modal"
      position="fixed"
    >
      <Text fontSize="x-large" color="teal">
        Loading...
      </Text>
    </Flex>
  );
};

export default Loading;
