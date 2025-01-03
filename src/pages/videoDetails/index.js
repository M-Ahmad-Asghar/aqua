import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Heading, Flex, Text, Link } from "@chakra-ui/react";
import client from "../../config/contentfulClient";
import { Link as RouterLink } from "react-router-dom";
import { getYouTubeThumbnailUrl } from "../../utils/thumbnailUrlExtract";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [viewType, setViewType] = useState("thumbnails"); // "list" or "thumbnails"

  useEffect(() => {
    client
      .getEntries({ content_type: "videoModel" }) 
      .then((response) => setVideos(response.items))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);
  console.log("videos", videos);
  return (
    <Box maxWidth="1200px" mx="auto" p={5}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">Videos</Heading>
        <Flex gap={2}>
          <Button bgColor="#e93d3d" 
                    color="white"
                    onClick={() => setViewType("list")}>
            List
          </Button>
          <Button bgColor="#e93d3d" 
                    color="white"
                    onClick={() => setViewType("thumbnails")}>
            Thumbnails
          </Button>
        </Flex>
      </Flex>

      {/* Video Grid */}
      <Grid
        templateColumns={
          viewType === "list" ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))"
        }
        gap={5}
      >
        {videos.map((video) => (
          <Box
            key={video.sys.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            _hover={{ boxShadow: "lg", cursor: "pointer" }}
          >
            {/* Video Preview */}
            {video.fields?.youTubeVideoUrl && (
              <Box
                as="video"
                src={video.fields?.youTubeVideoUrl}
                poster={getYouTubeThumbnailUrl(video.fields?.youTubeVideoUrl)}
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  pointerEvents: "none", // Prevents play functionality
                }}
              />
            )}
            {/* Title and Metadata */}
            <Heading size="md" mb={2}>
              {video.fields.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              {new Date(video.fields.uploadedDate).toLocaleDateString()}
            </Text>
            <Link
              as={RouterLink}
              to={`/video/${video.sys.id}`}
              color="blue.500"
              fontWeight="bold"
            >
              View Now
            </Link>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Videos;
