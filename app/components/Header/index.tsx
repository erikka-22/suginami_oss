import { Box, Center, Heading } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box bg="green.900" w="100%" h="44px" color="white">
      <Center h="100%">
        <Heading as="h1" size="md">
          絵画で彩るセルフィー
        </Heading>
      </Center>
    </Box>
  );
}
