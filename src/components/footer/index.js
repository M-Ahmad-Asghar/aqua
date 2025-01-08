import { Box, Container, HStack, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";

function Footer() {
  return (
    <Box bg="gray.800" color="gray.200" py={6} mt="auto">
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text>&copy; 2025 All Rights Reserved.</Text>
          <HStack spacing={4}>
            <Link href="#" _hover={{ color: "white" }}>
              Privacy Policy
            </Link>
            <Link href="#" _hover={{ color: "white" }}>
              Terms of Service
            </Link>
            <Link href="#" _hover={{ color: "white" }}>
              Contact Us
            </Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
