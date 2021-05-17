import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import Loading from './Loading';
import { Button } from '@chakra-ui/button';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [{ fetching, data }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  return (
    <>
      {fetching || (logoutFetching && <Loading />)}
      <Flex bg="tan" p={4}>
        <Box ml="auto">
          {data?.me?.id ? (
            <>
              <NextLink href="/">
                <Link>
                  {data.me.name} {data.me.surname}
                </Link>
              </NextLink>
              <Button variant="link" ml={2} onClick={() => logout()}>
                logout
              </Button>
            </>
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
