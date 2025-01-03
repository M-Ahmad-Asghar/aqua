import {
  Box,
  Flex,
  Heading,
  Spinner,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
  Badge,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import client from "../../config/contentfulClient";
import { formatDate } from "../../utils/dateFormatter";
import { Link as RouterLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Blogs() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category"); // Get selected category

  const navigate = useNavigate();

  // Fetch blogs and categories
  useEffect(() => {
    setLoading(true);

    // Fetch Blogs
    client
      .getEntries({
        content_type: "blogPage",
        select: "fields",
      })
      .then((response) => {
        setAllBlogs(response.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });

    // Fetch Categories
    client
      .getEntries({ content_type: "categories" })
      .then((response) => {
        setCategories(
          response.items.map((item) => ({
            id: item.sys.id,
            name: item.fields.category,
          }))
        );
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Filter Blogs by Category
  const filteredBlogs = selectedCategory
    ? allBlogs.filter((blog) =>
        blog.fields.category?.some((cat) => cat.sys.id === selectedCategory)
      )
    : allBlogs;

  // Handle Category Click
  const handleCategoryClick = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  // Redirect to Blog Details
  const handleRedirect = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <Box maxWidth="1200px" mx="auto" p={"16px"} minH={"calc(100vh - 144px)"}>
      <Button
        position={"fixed"}
        left={"20px"}
        leftIcon={<FaArrowLeft />}
        as={RouterLink}
        to="/"
        color="white"
        bgColor="#e93d3d"
      >
        Back
      </Button>
      <Heading pb={"16px"}>Blogs</Heading>

      {/* Subheader for Categories */}
      <Flex wrap="wrap" mb={6} gap={3}>
        {categories.map((category) => (
          <Button
            color="white"
            key={category.id}
            variant={selectedCategory === category.id ? "solid" : "outline"}
            bgColor="#e93d3d"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
        {selectedCategory && (
          <Button
            color="white"
            variant="outline"
            onClick={() => setSearchParams({})}
          >
            Clear Filter
          </Button>
        )}
      </Flex>

      {/* Blogs */}
      {loading ? (
        <Flex minH={"30vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner m={"auto"} />
        </Flex>
      ) : (
        <Flex justifyContent={"center"} flexWrap={"wrap"} gap={"16px"}>
          {filteredBlogs?.map((blog) => (
            <Card
              key={blog.sys.id}
              onClick={() => handleRedirect(blog.sys.id)}
              cursor={"pointer"}
              maxW="300px"
              _hover={{ boxShadow: "lg" }}
            >
              <CardBody>
                <Image
                  width={"450px"}
                  height={"250px"}
                  objectFit={"cover"}
                  src={blog.fields.image?.fields?.file?.url}
                  alt={blog.fields.title}
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{blog.fields.title}</Heading>
                  <Text mt={"10px"} fontSize={"14px"}>
                    <b>Author: </b>
                    {blog.fields.author}
                  </Text>
                  <Text mt={"-10px"} fontSize={"14px"}>
                    <b>Published on: </b>
                    {formatDate(blog.fields.createdDate)}
                  </Text>
                  <Flex wrap="wrap" mt={"10px"} gap={2}>
                    {blog.fields.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        bgColor="#e93d3d"
                        fontSize="12px"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default Blogs;
