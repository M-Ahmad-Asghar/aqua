import { Flex, HStack, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";
import { StyledNavbar } from "../style";

const Navbar = () => {
  const { pathname } = useLocation();
  const navItems = [
    { name: "Webinars", path: "/" },
    { name: "Videos", path: "/videos", isSelected: true },
    { name: "PDF’s", path: "/pdfs" },
    { name: "Ask AI", path: "/ask-ai" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <StyledNavbar>
      <Flex width={'100%'} alignItems="center" justifyContent="space-between">
        {/* Logo Section */}
        <Text fontSize="2xl" fontWeight="bold" color="black">
          Logo
        </Text>

        {/* Nav Links */}
        <HStack pl={"80px"} spacing={4}>
          {navItems.map((item) => {
            const isSelected = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                px={3}
                py={2}
                rounded="md"
                bg={isSelected ? "#50B7F0" : "transparent"}
                fontWeight={500}
                _hover={{
                  textDecoration: "none",
                  bg: "#50B7F0",
                  color: "white",
                }}
                color={isSelected ? "white" : "black"}
              >
                {item.name}
              </Link>
            );
          })}
        </HStack>

        <Spacer />

        {/* Account Section */}
        <HStack spacing={4}>
          <Link href="#account" color="black">
            Account
          </Link>
          <Link href="#logout" color="black">
            Logout
          </Link>
        </HStack>
      </Flex>
    </StyledNavbar>
  );
};

export default Navbar;
