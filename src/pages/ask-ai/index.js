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
import Fuse from "fuse.js"; // Added fuse.js for fuzzy matching
import { CustomButton } from "../../components/pagination/button";
import client from "../../config/contentfulClient";
import { GlobalWorkerOptions, version } from "pdfjs-dist";
import nlp from "compromise"; // Added compromise for query normalization

GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

function AskAI() {
  const [input, setInput] = useState("");
  const [threadList, setThreadList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Fetch documents from Contentful
  useEffect(() => {
    client
      .getEntries({ content_type: "documentModel" }) // Replace with your content type ID
      .then((response) => {
        setDocuments(response.items);
      })
      .catch(console.error);
  }, []);

  // Helper to scroll to the bottom of the chat
  function scrollToBottom() {
    const chatParent = document.getElementById("chat_parent");
    if (chatParent) {
      chatParent.scrollTop = chatParent.scrollHeight;
    }
  }

  // Normalize the query using compromise
  const normalizeQuery = (query) => {
    const doc = nlp(query);
    return doc.out("text"); // Normalize the text (e.g., lemmatization)
  };

  // Adjusted similarity function
  const computeSimilarity = (query, target) => {
    const queryWords = new Set(query.split(" "));
    const targetWords = new Set(target.split(" "));
    const intersection = new Set([...queryWords].filter((word) => targetWords.has(word)));
    const union = new Set([...queryWords, ...targetWords]);
    return intersection.size / union.size; // Jaccard similarity
  };

  // Relevance check function based on context
  const isRelevantAnswer = (answer, query) => {
    const screenshotKeywords = ["screenshot", "screen", "capture"];
    const cameraKeywords = ["camera", "photo", "picture"];

    // Check if the answer contains any of the screenshot-related keywords
    if (screenshotKeywords.some((word) => answer.toLowerCase().includes(word))) {
      return true; // It's relevant for taking a screenshot
    }

    // If answer contains camera-related keywords and the query is about screenshots, it's irrelevant
    if (cameraKeywords.some((word) => answer.toLowerCase().includes(word)) && !query.toLowerCase().includes("screenshot")) {
      return false; // Not relevant for a screenshot question
    }

    return true;
  };

  // Search documents function with contextual check
  const searchDocuments = async (query) => {
    const results = [];
    const queryLower = normalizeQuery(query).toLowerCase(); // Use normalized query

    for (const doc of documents) {
      const response = await fetch(doc.fields.file?.fields?.file?.url);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");

        // Normalize the text
        const normalizedText = pageText.replace(/\s+/g, " ").trim();

        // Extract Q&A pairs
        const qaRegex = /(Q: .+?)(A: .+?)(?=Q:|$)/gs;
        let match;
        while ((match = qaRegex.exec(normalizedText)) !== null) {
          const question = match[1].replace(/^Q: /, "").trim();
          let answer = match[2].replace(/^A: /, "").trim();

          // Remove trailing numbers or unexpected text
          answer = answer.replace(/\s*\d+\.$/, "").trim();

          // Compute similarity score
          const similarity = computeSimilarity(queryLower, question.toLowerCase());

          // Check relevance and similarity before adding the result
          if (similarity >= 0.5 && isRelevantAnswer(answer, queryLower)) {
            results.push({
              question,
              answer,
              similarity,
              documentTitle: doc.fields.title,
              pageNumber: i,
            });
          }
        }
      }
    }

    // Sort results by similarity in descending order
    results.sort((a, b) => b.similarity - a.similarity);

    return results.length ? [results[0]] : [];
  };

  // Handle user submission
  const onSubmitHandler = async () => {
    if (!loading && input.trim()) {
      setLoading(true);

      // Add user input to the chat
      setThreadList((prev) => [
        ...prev,
        { role: "user", input },
      ]);

      setTimeout(() => scrollToBottom(), 10);

      const results = await searchDocuments(input);

      // Extract the answer from the results or return "No answer found."
      const output = results.length ? results[0].answer : "No answer found.";

      // Add AI response to the chat
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

  // Handle Enter key for submission
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
