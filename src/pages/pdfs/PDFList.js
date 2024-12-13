import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Grid, Link, Button, Flex, Spinner } from "@chakra-ui/react";
import client from "../../config/contentfulClient";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";

const PDFList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category"); // Get selected category

  useEffect(() => {
    setLoading(true);

    // Fetch PDFs
    client
      .getEntries({
        content_type: "pdfFile",
        select: "fields",
      })
      .then((response) => {
        setPdfs(response.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching PDFs:", error);
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

  // Filter PDFs by Category
  const filteredPDFs = selectedCategory
    ? pdfs.filter((pdf) =>
        pdf.fields.category?.some(
          (cat) => cat.sys.id === selectedCategory
        )
      )
    : pdfs;

  // Handle Category Click
  const handleCategoryClick = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  return (
    <Box maxWidth="1200px" mx="auto" p={5}>
      <Heading size="xl" mb={5}>
        PDF Files
      </Heading>

      {/* Category Filter Subheader */}
      <Flex wrap="wrap" mb={6} gap={3}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "solid" : "outline"}
            color="white"
            bgColor="#e93d3d"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
        {selectedCategory && (
          <Button variant="outline" onClick={() => setSearchParams({})}>
            Clear Filter
          </Button>
        )}
      </Flex>

      {/* PDF List */}
      {loading ? (
        <Flex minH={"30vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner m={"auto"} />
        </Flex>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={5}>
          {filteredPDFs.map((pdf) => (
            <Box
              key={pdf.sys.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              _hover={{ boxShadow: "lg" }}
            >
              {/* PDF Preview */}
              <Box
                as="iframe"
                src={pdf.fields.file?.fields?.file?.url}
                height="200px"
                width="100%"
                style={{
                  pointerEvents: "none", // Disable interaction
                  borderBottom: "1px solid #ccc",
                }}
              />
              {/* Title and Metadata */}
              <Box p={4}>
                <Heading size="md" mb={2}>
                  {pdf.fields.title}
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {formatDate(pdf.fields.uploadedDate)}
                </Text>
                <Link
                  as={RouterLink}
                  to={`/pdf/${pdf.sys.id}`}
                  color="blue.500"
                  fontWeight="bold"
                >
                  View Details
                </Link>
              </Box>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PDFList;
