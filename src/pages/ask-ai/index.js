import {
  Avatar,
  border,
  Box,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CustomButton } from "../../components/pagination/button";

function AskAI() {
  const [input, setInput] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [loading, setLoading] = useState(false);

  function scrollToBottom() {
    const chatParent = document.getElementById("chat_parent");
    if (chatParent) {
      chatParent.scrollTop = chatParent.scrollHeight;
    }
  }

  const onSubmitHandler = () => {
    if (!loading) {
      setLoading(true);
      threadList.push({
        role: "user",
        input,
      });
      setTimeout(() => {
        scrollToBottom();
      }, 10);
      setInput("");
      setTimeout(() => {
        threadList.push({
          role: "system",
          output: "ai generated answer",
        });
        setLoading(false);
        scrollToBottom();
      }, 2000);
    }
  };

  const onKeyDownHandler = (e) => {
    switch (e.keyCode) {
      case 13:
        if (!e?.shiftKey) {
          e.preventDefault();
          onSubmitHandler();
        }
        break;
    }
  };

  return (
    <Flex
      overflow={"hidden"}
      flexDir={"column"}
      flex={1}
      p={"16px"}
      h={"calc(100vh - 144px)"}
    >
      <Heading pb={"16px"} px={"16px"}>
        Ask AI
      </Heading>
      <Flex
        overflow={"hidden"}
        flex={1}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Flex
          h={"100%"}
          overflow={"auto"}
          p={"16px"}
          gap={"16px"}
          flexDir={"column"}
          id="chat_parent"
        >
          {threadList?.map((chat) => {
            return (
              <Box>
                {chat?.role === "user" ? (
                  <Flex
                    gap={"16px"}
                    alignItems={"start"}
                    flexDir={"row-reverse"}
                    ml={"auto"}
                    width={"fit-content"}
                  >
                    <Avatar width={"32px"} height={"32px"} />
                    <Text
                      width={"fit-content"}
                      bgColor={"gray.100"}
                      p={"8px"}
                      borderRadius={"8px"}
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      {chat?.input}
                    </Text>
                  </Flex>
                ) : (
                  <Flex gap={"16px"} alignItems={"start"} width={"fit-content"}>
                    <Avatar
                      src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      width={"32px"}
                      height={"32px"}
                    />
                    <Text
                      width={"fit-content"}
                      bgColor={"gray.100"}
                      p={"8px"}
                      borderRadius={"8px"}
                    >
                      {chat?.output}
                    </Text>
                  </Flex>
                )}
              </Box>
            );
          })}
          {loading && (
            <Text
              bgColor={"#50B7F0"}
              p={"8px"}
              borderRadius={"50px"}
              px={"20px"}
              width={"fit-content"}
              color={"white"}
              fontWeight={600}
            >
              Answering...
            </Text>
          )}
        </Flex>
        <Flex gap={"16px"}>
          <Input
            value={input}
            minH={"48px"}
            mx={2}
            mb={1}
            outline={0}
            border={"1px solid #676879"}
            shadow={0}
            onKeyDown={onKeyDownHandler}
            placeholder="Ask anything from  AI"
            onChange={(e) => setInput(e.target.value)}
          />
          <CustomButton
            onClick={onSubmitHandler}
            disabled={input.length === 0 || loading}
            text="Ask"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AskAI;
