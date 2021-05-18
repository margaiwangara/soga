import { Box } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../lib/createUrqlClient';
import SocketIOClient, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { endpoint } from '../config';
// import { useToast } from '@chakra-ui/toast';
// import Loading from '../components/Loading';
import { isServer } from '../utils/isServer';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

function Home() {
  const [{ fetching, data }] = usePostsQuery();
  const [{ data: currentUser }] = useMeQuery({
    pause: isServer(),
  });
  // const toast = useToast();

  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  useEffect(() => {
    const io = SocketIOClient(endpoint);
    setSocket(io);

    return () => {
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit('addUser', currentUser?.me?.id);
    socket?.on('getUsers', (users) => {
      console.log('users', users);
    });
  }, [currentUser?.me]);
  return (
    <>
      {/* {currentUserFetching && <Loading />} */}
      <Box h="100vh" w="100%" overflowX="hidden">
        <NavBar />
        <Wrapper variant="regular">
          {fetching && <p>Loading Posts...</p>}
          {data?.posts.map((p) => (
            <div key={p.id}>{p.title}</div>
          ))}
        </Wrapper>
      </Box>
    </>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
