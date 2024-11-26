import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import client from "../../config/contentfulClient";
import { Badge, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// Rich Text Rendering Customizations
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the current blog
    client
      .getEntry(id)
      .then((entry) => setBlog(entry))
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

  if (!blog)
    return (
      <Flex minH={"60vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner m={"auto"} />
      </Flex>
    );

  return (
    <div style={styles.container}>
      <Flex wrap="wrap" mb={6} gap={3}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            colorScheme="blue"
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
            colorScheme="blue"
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
