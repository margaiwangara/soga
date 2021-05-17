import { Box } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import Wrapper from '../components/Wrapper';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../lib/createUrqlClient';

function Home() {
  const [{ fetching, data }] = usePostsQuery();

  return (
    <Box h="100vh" w="100%" overflowX="hidden">
      <NavBar />
      <Wrapper variant="regular">
        {fetching && <p>Loading Posts...</p>}
        {data?.posts.map((p) => (
          <div key={p.id}>{p.title}</div>
        ))}
      </Wrapper>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
