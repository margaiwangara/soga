import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';
import Loading from './Loading';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [{ fetching, data }] = useMeQuery();

  return (
    <>
      {fetching && <Loading />}
      <Flex bg="tan" p={4}>
        <Box ml="auto">
          {data?.me?.id ? (
            <NextLink href="/">
              <Link>
                {data.me.name} {data.me.surname}
              </Link>
            </NextLink>
          ) : (
            <>
              <NextLink href="/login">
                <Link mr={2}>login</Link>
              </NextLink>
              <NextLink href="/register">
                <Link>register</Link>
              </NextLink>
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default NavBar;
