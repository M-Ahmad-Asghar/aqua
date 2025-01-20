import React, { useState } from "react";
import { Avatar, Box, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { CustomButton } from "../../components/pagination/button";
import { groq } from "../../config/groq";


function AskAI() {
  const [input, setInput] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async () => {
    if (!input.trim()) return;

    setLoading(true);

    // Add user input to the chat
    setThreadList((prev) => [...prev, { role: "user", content: input }]);

    try {
      // Send user query to Groq
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama-3.3-70b-versatile",
      });

      // Extract Groq's response
      const groqReply = response.choices[0].message.content;

      // Add Groq's response to the chat
      setThreadList((prev) => [...prev, { role: "ai", content: groqReply }]);
    } catch (error) {
      console.error("Error fetching response from Groq:", error);
      setThreadList((prev) => [
        ...prev,
        { role: "ai", content: "I'm sorry, I couldn't process your request." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitHandler();
    }
  };
  // return (
  //   <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
  //   <iframe
  //     src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/20/16/20250120162820-4G7EYUA2.json"
  //     title="Botpress Webchat"
  //     style={{ width: "100%", height: "100%", border: "none" }}
  //     allow="microphone"
  //   />
  // </div>
  // )
  return (
    <Flex overflow={"hidden"} flexDir={"column"} flex={1} p={"16px"} h={"calc(100vh - 144px)"}>
      <Heading pb={"16px"} px={"16px"}>
        Ask AI
      </Heading>
      <Flex overflow={"hidden"} flex={1} flexDirection={"column"} justifyContent={"space-between"}>
        <Flex h={"100%"} overflow={"auto"} p={"16px"} gap={"16px"} flexDir={"column"} id="chat_parent">
          {threadList.map((chat, idx) => (
            <Box key={idx}>
              {chat.role === "user" ? (
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
                    {chat.content}
                  </Text>
                </Flex>
              ) : (
                <Flex gap={"16px"} alignItems={"start"} width={"fit-content"}>
                  <Avatar
                    src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg"
                    width={"32px"}
                    height={"32px"}
                  />
                  <Text
                    width={"fit-content"}
                    bgColor={"gray.100"}
                    p={"8px"}
                    borderRadius={"8px"}
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                  >
                    {chat.content}
                  </Text>
                </Flex>
              )}
            </Box>
          ))}
          {loading && (
            <Text
              bgColor={"#e93d3d"}
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
            placeholder="Ask anything from AI"
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
