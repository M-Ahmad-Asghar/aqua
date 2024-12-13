import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Flex, Spinner } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../config/contentfulClient";
import { formatDate } from "../../utils/dateFormatter";

const PDFDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the current PDF
    client
      .getEntry(id)
      .then((entry) => setPdf(entry))
      .catch((error) => console.error("Error fetching PDF:", error));

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
  }, [id]);

  if (!pdf)
    return (
      <Flex minH={"60vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner m={"auto"} />
      </Flex>
    );

  return (
    <Box p={"16px"} minH={"calc(100vh - 144px)"}>
      {/* Category Filter Subheader */}
      <Flex wrap="wrap" mb={6} gap={3}>
        {categories.map((category) => (
          <Button
          color="white"
          key={category.id}
            variant="outline"
            bgColor="#e93d3d"
            onClick={() => navigate(`/pdfs?category=${category.id}`)}
          >
            {category.name}
          </Button>
        ))}
      </Flex>

      {/* PDF Details */}
      <Heading size="xl" mb={3}>
        {pdf.fields.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={5}>
        {formatDate(pdf.fields.uploadedDate)}
      </Text>
      <Box
        as="iframe"
        src={pdf.fields.file?.fields?.file?.url}
        width="100%"
        height="600px"
        borderRadius="lg"
        border="1px solid #ccc"
        overflow="hidden"
      />
    </Box>
  );
};

export default PDFDetail;
