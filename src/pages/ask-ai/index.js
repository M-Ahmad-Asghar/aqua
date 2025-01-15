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
import nlp from "compromise"; // For query normalization
import stringSimilarity from 'string-similarity';

GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

function AskAI() {
  const [input, setInput] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await client.getEntries({ content_type: "documentModel" });
        const pdfLinks = response.items.map((item) => item.fields.file.fields.file.url);
        console.log("pdfLinks", pdfLinks);
        const allQaPairs = [];
        for (const link of pdfLinks) {
          const pairs = await extractQaPairsFromPdf(link);
          allQaPairs.push(...pairs);
        }

        setQaPairs(allQaPairs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const extractQaPairsFromPdf = async (url) => {
    try {
      const pdf = await getDocument(url).promise;
      const maxPages = pdf.numPages;
      let fullText = "";

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }
      console.log("qaPairs", fullText);

      return parseQaPairs(fullText);
    } catch (error) {
      console.error("Error extracting Q&A from PDF:", error);
      return [];
    }
  };
  const parseQaPairs = (text) => {
    const qaPairs = [];
    
    // Regex to capture question-answer pairs in the format like: "1. What is a computer? A computer is..."
    const inlineQaRegex = /(\d+)\.\s*(.*?)\?\s*(.*?)(?=\s*\d+\.\s*|$)/gs;
    let match;
  
    while ((match = inlineQaRegex.exec(text)) !== null) {
      const question = match[2].trim() + "?";  // Append '?' back to the question
      const answer = match[3].trim();
      qaPairs.push({ question, answer });
    }
  
    return qaPairs;
  };
  
  
  
  
  

  const findBestMatch = (userQuery, qaPairs) => {
    const normalizedQuery = nlp(userQuery).normalize({ lowercase: true, punctuation: true }).out('text');
  
    let highestSimilarity = 0;
    let bestMatch = null;
  
    qaPairs.forEach((qa) => {
      const normalizedQuestion = nlp(qa.question).normalize({ lowercase: true, punctuation: true }).out('text');
      const similarity = stringSimilarity.compareTwoStrings(normalizedQuery, normalizedQuestion);
  
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = qa;
      }
    });
  
    // Threshold to avoid matching unrelated questions
    const SIMILARITY_THRESHOLD = 0.6;
    return highestSimilarity >= SIMILARITY_THRESHOLD ? bestMatch : null;
  };
  

  const onSubmitHandler = () => {
    if (!input.trim()) return;

    setLoading(true);
    const match = findBestMatch(input, qaPairs);

    setTimeout(() => {
      setThreadList((prev) => [
        ...prev,
        { role: "user", input },
        {
          role: "ai",
          output: match ? match.answer : "I'm sorry, I couldn't find an answer to that question.",
        },
      ]);
      setInput("");
      setLoading(false);
    }, 500);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitHandler();
    }
  };

  return (
    <Flex overflow={"hidden"} flexDir={"column"} flex={1} p={"16px"} h={"calc(100vh - 144px)"}>
      <Heading pb={"16px"} px={"16px"}>Ask AI</Heading>
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
