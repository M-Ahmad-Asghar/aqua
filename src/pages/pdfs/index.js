import React from "react";
import PDFViewer from "../../components/pdf/viewer";
import { Box, Heading } from "@chakra-ui/react";

function PDFsPage() {
  const demi_pdf_url =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  return (
    <Box minH={"calc(100vh - 144px)"}>
      <Heading pl={'16px'} py={'16px'}>Pdfs</Heading>
      <PDFViewer />
    </Box>
  );
}

export default PDFsPage;
