import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../../components";
import { StyledBasicLayout } from "../style";

function BasicLayout() {
  return (
    <StyledBasicLayout>
      <Navbar />
      <Box flex={1}  overflow={"auto"}>
        <Box minH={"81vh"}>
        <Outlet />

        </Box>
        <Footer />
      </Box>
    </StyledBasicLayout>
  );
}

export default BasicLayout;
