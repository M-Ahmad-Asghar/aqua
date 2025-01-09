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
import Fuse from "fuse.js"; // Using fuse.js for fuzzy matching
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
// This function extracts the Q&A pairs for both inline (Q: A:) and separate blocks
const extractQA = (text) => {
  // For inline Q&A format: e.g., "1. Q: How do I turn my smartphone on? A: Press and hold..."
  const inlineQaRegex = /(\d+)\.\s*Q:\s*(.*?)\s*A:\s*(.*?)(?=\d+\.\s*|$)/gs;
  
  // For separate block Q&A format: e.g., "41. What is an app?\nAn app is a program..."
  const blockQaRegex = /(\d+)\.\s*(What.*?\?)\n(.*?)(?=\d+\.\s*|$)/gs;
  
  const qaPairs = [];
  let match;

  // Extract inline Q&A
  while ((match = inlineQaRegex.exec(text)) !== null) {
    const question = match[2].trim();
    const answer = match[3].trim();
    qaPairs.push({ question, answer });
  }

  // Extract block Q&A (separate question and answer blocks)
  while ((match = blockQaRegex.exec(text)) !== null) {
    const question = match[2].trim();
    const answer = match[3].trim();
    qaPairs.push({ question, answer });
  }

  return qaPairs;
};

// This function normalizes the input query by handling variations in phrasing
const normalizeQuery = (query) => {
  const doc = nlp(query);
  return doc.out("text"); // Normalize text
};

// Function to compute similarity between query and extracted question
const computeSimilarity = (query, target) => {
  const queryKeywords = extractKeywords(query);
  const targetKeywords = extractKeywords(target);

  const intersection = queryKeywords.filter((word) => targetKeywords.includes(word));
  const union = new Set([...queryKeywords, ...targetKeywords]);

  return intersection.length / union.size; // Jaccard similarity
};

// Function to extract keywords from text (to improve matching accuracy)
const extractKeywords = (text) => {
  const doc = nlp(text);
  return doc.nouns().out('array');
};

// Function to search for relevant answers from documents
const searchDocuments = async (query) => {
  const results = [];
  const queryLower = normalizeQuery(query).toLowerCase();

  for (const doc of documents) {
    const response = await fetch(doc.fields.file?.fields?.file?.url);
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");

      const normalizedText = pageText.replace(/\s+/g, " ").trim();

      // Extract Q&A pairs from the page text
      const qaPairs = extractQA(normalizedText);
      qaPairs.forEach((qa) => {
        const { question, answer } = qa;
        // Check if the answer is relevant to the query using fuzzy matching
        const similarity = computeSimilarity(queryLower, question.toLowerCase());
        if (similarity > 0.2) {
          results.push({
            question,
            answer,
            documentTitle: doc.fields.title,
            pageNumber: i,
            similarity,
          });
        }
      });
    }
  }

  // Use Fuse.js for fuzzy matching
  const fuse = new Fuse(results, {
    keys: ["question", "answer"],
    threshold: 0.4, // Adjust this threshold for better fuzzy matching
  });
  const fuseResults = fuse.search(query);

  return fuseResults.length ? fuseResults : results;
};

  const onSubmitHandler = async () => {
    if (!loading && input.trim()) {
      setLoading(true);
      setThreadList((prev) => [...prev, { role: "user", input }]);
      setTimeout(() => scrollToBottom(), 10);

      const results = await searchDocuments(input);
      
      // Check if a valid answer exists in the results
      const output = results.length && results[0].item && results[0].item.answer 
        ? results[0].item.answer 
        : "No answer found.";

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
