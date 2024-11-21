import { Box, chakra, Flex } from "@chakra-ui/react";

export const StyledNavbar = chakra(Flex, {
  baseStyle: {
    minW:'100vw',
    borderBottom: "1px solid",
    borderColor: "borderColor",
    px: {base:"16px" , lg:'32px'},
    height: "72px",
  },
});

export const StyledFooter = chakra(Flex, {
  baseStyle: {
    justifyContent: "space-evenly",
    height: "72px",
  },
});
