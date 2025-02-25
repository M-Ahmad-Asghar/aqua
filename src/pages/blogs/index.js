import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import client from "../../config/contentfulClient";
import { Badge, Button, Flex, Image, Spinner, Box, Heading, Text } from "@chakra-ui/react";
// Rich Text Rendering Customizations
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { formatDate } from "../../utils/dateFormatter";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    // Fetch the current blog
    client
      .getEntry(id)
      .then((entry) => {
        setBlog(entry);
        // Fetch related blogs based on category
        if (entry.fields.category && entry.fields.category[0]?.sys?.id) {
          fetchRelatedBlogs(entry.fields.category[0].sys.id);
        }
      })
      .catch((error) => console.error("Error fetching blog:", error));

    // Fetch all categories
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
  }, [id]);

  // Fetch related blogs based on category ID
  const fetchRelatedBlogs = (categoryId) => {
    client
      .getEntries({
        content_type: "blogPage",
        "fields.category.sys.id": categoryId, // Filter by category
        limit: 3, // Limit to 3 related blogs
        select: "fields.title,sys.id,fields.image,fields.createdDate,fields.tags",
      })
      .then((response) => setRelatedBlogs(response.items))
      .catch((error) => console.error("Error fetching related blogs:", error));
  };

  if (!blog)
    return (
      <Flex minH={"60vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner m={"auto"} />
      </Flex>
    );
    console.log("relatedBlogs", relatedBlogs);
  return (
    <div style={styles.container}>
      <Flex wrap="wrap" mb={6} gap={3}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            color="white"
            bgColor="#e93d3d"
            onClick={() => navigate(`/blogs?category=${category.id}`)}
          >
            {category.name}
          </Button>
        ))}
      </Flex>
      <h1 style={styles.title}>{blog.fields.title}</h1>
      {blog.fields.image && (
        <Image
          src={blog.fields.image.fields.file.url}
          alt={blog.fields.image.fields.title}
          style={styles.image}
        />
      )}
      <Flex wrap="wrap" gap={2} mt={2}>
        {blog?.fields?.tags?.map((tag, index) => (
          <Badge
            key={index}
            bgColor="#e93d3d"
            fontSize="14px"
            px={3}
            py={1}
            borderRadius="md"
          >
            {tag}
          </Badge>
        ))}
      </Flex>
      <div style={styles.body}>
        {documentToReactComponents(blog.fields.body, renderOptions)}
      </div>

      {/* Related Blogs Section */}
      <Box mt={8}>
        <Heading size="lg" mb={4}>
          Related Blogs
        </Heading>
        <Flex wrap="wrap" gap={5}>
          {relatedBlogs.length > 0 ? (
            relatedBlogs.map((relatedBlog) => (
              <Box
                key={relatedBlog.sys.id}
                maxW="250px"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                cursor="pointer"
                onClick={() => navigate(`/blogs/${relatedBlog.sys.id}`)} // Navigate to related blog
                _hover={{ boxShadow: "lg" }}
              >
                {/* Image */}
                <Image
                  src={relatedBlog.fields.image?.fields?.file?.url}
                  alt={relatedBlog.fields.title}
                  height="150px"
                  objectFit="cover"
                  width="300px"
                />
                <Box p={4}>
                  <Heading size="sm">{relatedBlog.fields.title}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(relatedBlog.fields.createdDate)}
                  </Text>
                </Box>
              </Box>
            ))
          ) : (
            <Text>No related blogs found.</Text>
          )}
        </Flex>
      </Box>
    </div>
  );
};

// Styling
const styles = {
  container: {
    maxWidth: "750px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    color: "#333",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "bold",
    lineHeight: "1.3",
    marginBottom: "25px",
    textAlign: "center",
  },
  image: {
    display: "block",
    margin: "30px auto",
    maxWidth: "100%",
    height: "auto",
    borderRadius: "10px",
  },
  body: {
    fontSize: "1.2rem",
    lineHeight: "1.8",
    color: "#4a4a4a",
    marginTop: "30px",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
  },
};

const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p style={{ marginBottom: "24px", lineHeight: "1.8" }}>{children}</p>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2
        style={{ fontSize: "2rem", marginBottom: "20px", fontWeight: "bold" }}
      >
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3
        style={{ fontSize: "1.6rem", marginBottom: "18px", fontWeight: "600" }}
      >
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul style={{ paddingLeft: "20px", marginBottom: "24px" }}>{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol style={{ paddingLeft: "20px", marginBottom: "24px" }}>{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li style={{ marginBottom: "8px" }}>{children}</li>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <Image
        src={node.data.target.fields.file.url}
        alt={node.data.target.fields.title || "Embedded Image"}
        style={{
          maxWidth: "100%",
          height: "auto",
          margin: "20px auto",
          display: "block",
          borderRadius: "8px",
        }}
      />
    ),
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        style={{ color: "#1a73e8", textDecoration: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default BlogDetail;
