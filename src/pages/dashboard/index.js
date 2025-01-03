import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  Spinner,
  Image,
  Center,
  Divider ,
} from "@chakra-ui/react";
import client from "../../config/contentfulClient"; // Assuming this is the Contentful client
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core styles
import "swiper/css/navigation"; // If you're using navigation
import "swiper/css/pagination"; // If you're using pagination
import { getYouTubeThumbnailUrl } from "../../utils/thumbnailUrlExtract";

function Dashboard() {
  const navigate = useNavigate();

  // States to hold the fetched data
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.REACT_APP_WEBINAR_KIT_API_KEY || "";

  // Fetch videos, PDFs, blogs, and webinars from Contentful and WebinarKit
  useEffect(() => {
    setLoading(true);
    // Fetch videos
    client
      .getEntries({
        content_type: "videoModel", // Replace with your video content type
        limit: 3, // Limit to 3 items
      })
      .then((response) => setVideos(response.items))
      .catch((error) => console.error("Error fetching videos:", error));

    // Fetch PDFs
    client
      .getEntries({
        content_type: "pdfFile", // Replace with your PDF content type
        limit: 3, // Limit to 3 items
      })
      .then((response) => setPdfs(response.items))
      .catch((error) => console.error("Error fetching PDFs:", error));

    // Fetch blogs
    client
      .getEntries({
        content_type: "blogPage", // Replace with your blog content type
        limit: 3, // Limit to 3 items
      })
      .then((response) => setBlogs(response.items))
      .catch((error) => console.error("Error fetching blogs:", error));

    // Fetch webinars from WebinarKit API
    axios
      .get("https://webinarkit.com/api/webinars", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        setWebinars(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      })
      .finally(() => setLoading(false));
  }, [apiKey]);

  const onVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const onBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const onPdfClick = (pdfId) => {
    navigate(`/pdf/${pdfId}`);
  };

  const onWebinarClick = (webinarId) => {
    navigate(`/webinar/${webinarId}`);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box bgColor="#e93d3d" color="white" flex="1" py={40} textAlign="center">
        <Container maxW="container.md">
          {/* Webinars Carousel */}
          <Heading size="2xl" mb={8}>
            Upcoming Webinars
          </Heading>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 5 }}
            loop={true}
          >
            {webinars.map((webinar) => (
              <SwiperSlide key={webinar.id}>
                <Box
                  bg="white"
                  margt
                  p={6}
                  borderRadius="lg"
                  borderWidth={1}
                  _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                  onClick={() => onWebinarClick(webinar.id)}
                  cursor="pointer"
                >
                  {/* <Image
                    src="/path/to/webinar-image.jpg" // You can customize webinar image if available in WebinarKit response
                    alt={webinar.name}
                    height="180px"
                    objectFit="cover"
                    borderRadius="8px"
                    mb={4}
                  /> */}
                  <Heading size="md" color="black" mb={2}>
                    {webinar.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Type: {webinar.type === "live" ? "Live" : "Automated"}
                  </Text>
                  <Button bgColor={"#e93d3d"} color={"white"}>
                    Register Now
                  </Button>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      {/* Latest Content Section */}
      <Container maxW="container.xl" py={8}>
        <Heading size="lg" textAlign="center" mb={8}>
          Latest Updates
        </Heading>
        {loading ? (
          <Flex justifyContent="center" alignItems="center">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {/* Latest Videos */}
            <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
              <Heading size="md" mb={4} color="black">
                Latest Videos
              </Heading>
              {videos.map((video) => (
                <Box
                borderWidth={2}
                  key={video.sys.id}
                  shadow={"xl"}
                  borderRadius="lg"
                  cursor={"pointer"}
                  p={"16px"}
                  mb={4}
                  onClick={() => onVideoClick(video.sys.id)}
                >
                  <Text textAlign={"center"}  fontWeight={"bold"} fontSize="20px" my={2}>
                    {video.fields.title}
                  </Text>
                  <video
                    width="100%"
                    poster={getYouTubeThumbnailUrl(
                      video.fields?.youTubeVideoUrl
                    )}
                    height="180px"
                    controls={false}
                    muted
                    loop
                    style={{ borderRadius: "8px" }}
                  >
                    <source
                      src={video.fields?.youTubeVideoUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              ))}
              <Center>
                <Link fontWeight={"bold"} href="/videos">
                  See All
                </Link>
              </Center>
            </Box>

            {/* Latest PDFs */}
            <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
              <Heading size="md" mb={4} color="black">
                Latest PDFs
              </Heading>
              {pdfs.map((pdf) => (
                <Box
                borderWidth={2}
                  key={pdf.sys.id}
                  shadow={"xl"}
                  borderRadius="lg"
                  cursor={"pointer"}
                  p={"16px"}
                  mb={4}
                  onClick={() => onPdfClick(pdf.sys.id)}
                >
                  <Text fontWeight={"bold"} textAlign={"center"} fontSize="20px" my={2}>
                    {pdf.fields.title}
                  </Text>
                  <iframe
                    src={pdf.fields.file?.fields?.file?.url}
                    width="100%"
                    height="180px"
                    style={{ borderRadius: "8px" }}
                    title={pdf.fields.title}
                  ></iframe>
                </Box>
              ))}
              <Center>
                <Link fontWeight={"bold"} href="/pdfs">
                  See All
                </Link>
              </Center>
            </Box>

            {/* Latest Blogs */}
            <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
              <Heading size="md" mb={4} color="black">
                Latest Blogs
              </Heading>
              <Box>
                {blogs.map((blog) => (
                  <Box
                borderWidth={2}
                key={blog.sys.id}
                    mb={4}
                    shadow={"xl"}
                    borderRadius="lg"
                    cursor={"pointer"}
                    p={"16px"}
                    onClick={() => onBlogClick(blog.sys.id)}
                  >
                       <Text fontWeight={"bold"} textAlign={"center"} fontSize="20px" my={2}>
                      {blog.fields.title}
                    </Text>
                    <Image
                      src={blog.fields.image?.fields?.file?.url}
                      alt={blog.fields.title}
                      height="180px"
                      objectFit="cover"
                      borderRadius="8px"
                    />
                 
                  </Box>
                ))}
              </Box>
              <Center>
                <Link fontWeight={"bold"} href="/blogs">
                  See All
                </Link>
              </Center>
            </Box>
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
