import { chakra, Flex } from "@chakra-ui/react";

export const StyledBasicLayout = chakra(Flex , {
    baseStyle:{
        height:"100vh",
        overflow:"hidden",
        flexDir:'column'
    }
})