import { Box, Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import HeadBoy from '@components/HeadBoy';

interface AuthLayoutProps {
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <>
      <HeadBoy title={title} description={description} />
      <Flex
        h="100vh"
        w="100%"
        overflowX="hidden"
        overflowY="auto"
        bg="gray.200"
        p="1.5rem"
        alignItems="center"
        justifyContent="center"
      >
        <Box boxShadow="md" rounded="md" bg="white" p="1rem" w="sm">
          <Flex justifyContent="center" alignItems="center">
            <Box rounded="md" bg="gray.100" px="0.5rem" display="inline-block">
              <Text
                fontSize="3xl"
                color="teal"
                fontWeight="bold"
                casing="uppercase"
                letterSpacing="0.5px"
              >
                soga
              </Text>
            </Box>
          </Flex>
          <Box mt="1rem" mb="1rem">
            {children}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default AuthLayout;
