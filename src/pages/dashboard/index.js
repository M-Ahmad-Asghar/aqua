// src/App.js
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  rootSelector,
  selectWebinarVideos,
  webinarSelector,
} from "../../store/selectors";
import { fetchWebinarVideos } from "../../store/thunks/webinar";
import { getVideoTitleFromURL } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { updateSelectedVideo } from "../../store/reducers/webinar";

function Dashboard() {
  const dispatch = useDispatch();
  const videos = useSelector(selectWebinarVideos);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchWebinarVideos({
        page: 1,
        pageSize: 3,
      })
    );
  }, []);

  const onVideoClick = (video) => {
    dispatch(updateSelectedVideo(video));
    navigate('/videos')
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box
        bgGradient="linear(to-r, blue.500, blue.300)"
        color="white"
        flex="1"
        py={40}
        textAlign="center"
      >
        <Container maxW="container.md">
          <Heading size="2xl" mb={4}>
            Welcome Back, John Doe
          </Heading>
          <Text fontSize="lg" mb={4}>
            Your Next Webinar is:
          </Text>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Setting Up Your iPhone
          </Text>
          <Text fontSize="md">
            Thursday, November 4, 2024 | 3:00 - 4:00PM EST
          </Text>
          <Button mt={4} size="lg" colorScheme="yellow">
            Edit/Change Time
          </Button>
        </Container>
      </Box>

      {/* Latest Content Section */}
      <Container maxW="container.xl" py={8}>
        <Heading size="lg" textAlign="center" mb={8}>
          Latest Updates
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Latest Videos */}
          <Box
            bg="white"
            p={6}
            shadow="lg"
            borderRadius="lg"
            borderWidth={1}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Heading size="md" mb={4} color="blue.600">
              Latest Videos
            </Heading>
            <Flex flexDir={"column"}>
              {videos?.map((video) => (
                <Link
                  onClick={() => onVideoClick(video)}
                  maxW={"90%"}
                  noOfLines={1}
                  overflow={"hidden"}
                  width={"fit-content"}
                  key={video?.id}
                  py={1}
                >
                  {getVideoTitleFromURL(video?.url)}
                </Link>
              ))}
            </Flex>
          </Box>

          {/* Latest PDFs */}
          <Box
            bg="white"
            p={6}
            shadow="lg"
            borderRadius="lg"
            borderWidth={1}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Heading size="md" mb={4} color="blue.600">
              Latest PDFs
            </Heading>
            <Flex flexDir={"column"}>
              {["PDF Title 1", "PDF Title 2", "PDF Title 3"].map((title) => (
                <Link width={"fit-content"} key={title} py={1}>
                  {title}
                </Link>
              ))}
            </Flex>
          </Box>

          {/* Latest Blogs */}
          <Box
            bg="white"
            p={6}
            shadow="lg"
            borderRadius="lg"
            borderWidth={1}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Heading size="md" mb={4} color="blue.600">
              Latest Blogs
            </Heading>
            <Flex flexDir={"column"}>
              {["Blog Title 1", "Blog Title 2", "Blog Title 3"].map((title) => (
                <Link width={"fit-content"} key={title} py={1}>
                  {title}
                </Link>
              ))}
            </Flex>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Dashboard;
