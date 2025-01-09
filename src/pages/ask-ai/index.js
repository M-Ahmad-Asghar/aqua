import {
  Avatar,
  Box,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { getDocument } from "pdfjs-dist";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../components/pagination/button";
import client from "../../config/contentfulClient";
import { GlobalWorkerOptions } from "pdfjs-dist";
import nlp from "compromise"; // Using compromise for query normalization

GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

function AskAI() {
  const [input, setInput] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    client
      .getEntries({ content_type: "documentModel" })
      .then((response) => {
        setDocuments(response.items);
      })
      .catch(console.error);
  }, []);

  const scrollToBottom = () => {
    const chatParent = document.getElementById("chat_parent");
    if (chatParent) {
      chatParent.scrollTop = chatParent.scrollHeight;
    }
  };

  const extractQA = (text) => {
    const inlineQaRegex = /(\d+)\.\s*Q:\s*(.*?)\s*A:\s*(.*?)(?=\d+\.\s*|$)/gs;
    const blockQaRegex = /(\d+)\.\s*(What.*?\?)\n(.*?)(?=\d+\.\s*|$)/gs;
    const qaPairs = [];
    let match;

    while ((match = inlineQaRegex.exec(text)) !== null) {
      const question = match[2].trim();
      const answer = match[3].trim();
      qaPairs.push({ question, answer });
    }

    while ((match = blockQaRegex.exec(text)) !== null) {
      const question = match[2].trim();
      const answer = match[3].trim();
      qaPairs.push({ question, answer });
    }

    return qaPairs;
  };

  const normalizeQuery = (query) => {
    const doc = nlp(query);
    return doc.out("text");
  };

  const computeWordMatchScore = (query, question) => {
    const queryWords = query.toLowerCase().split(/\s+/);
    const questionWords = question.toLowerCase().split(/\s+/);

    const matchedWords = queryWords.filter((word) =>
      questionWords.includes(word)
    );
    return matchedWords.length / queryWords.length;
  };

  const searchDocuments = async (query) => {
    const results = [];
    const normalizedQuery = normalizeQuery(query);

    for (const doc of documents) {
      const response = await fetch(doc.fields.file?.fields?.file?.url);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        const qaPairs = extractQA(pageText);

        qaPairs.forEach((qa) => {
          const { question, answer } = qa;
          const matchScore = computeWordMatchScore(normalizedQuery, question);

          if (matchScore > 0) {
            results.push({ question, answer, matchScore });
          }
        });
      }
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    return results.length ? results[0] : { question: "No match found", answer: "No answer found." };
  };

  const onSubmitHandler = async () => {
    if (!loading && input.trim()) {
      setLoading(true);
      setThreadList((prev) => [...prev, { role: "user", input }]);
      setTimeout(() => scrollToBottom(), 10);

      const result = await searchDocuments(input);
      const output = result.answer;

      setThreadList((prev) => [
        ...prev,
        {
          role: "system",
          output,
        },
      ]);

      setInput("");
      setLoading(false);
      setTimeout(() => scrollToBottom(), 10);
    }
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitHandler();
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
                    {chat.input}
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
                    {chat.output}
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
