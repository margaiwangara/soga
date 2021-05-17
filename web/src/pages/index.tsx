import { Box } from '@chakra-ui/layout';
import NavBar from '../components/NavBar';

function Home() {
  return (
    <Box h="100vh" w="100%" overflowX="hidden">
      <NavBar />
    </Box>
  );
}

export default Home;
