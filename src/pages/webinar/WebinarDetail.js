import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Flex, Button } from "@chakra-ui/react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";

const WebinarDetail = () => {
  const { id } = useParams();
  const [webinar, setWebinar] = useState(null);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.REACT_APP_WEBINAR_KIT_API_KEY || "";

  useEffect(() => {
    // Replace with your API Key

    // Fetch webinar details
    axios
      .get(`https://webinarkit.com/api/webinar/dates/${id}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        setWebinar(response.data.results);
        setSessionDetails(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching webinar details:", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <Box p={5}>
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Heading mb={5}>{webinar.name}</Heading>
          <Text fontSize="xl" mb={3}>
            <b>Type:</b> {webinar.type}
          </Text>

          {/* Session Dates */}
          <Heading size="lg" mb={3}>
            Scheduled Dates
          </Heading>
          <Box>
            {sessionDetails.map((session, index) => (
              <Text key={index} mb={2}>
                <b>Session:</b> {session.label}
              </Text>
            ))}
          </Box>

          <Button as={RouterLink} 
                    color="white"
                    to="/webinars" bgColor="#e93d3d" mt={5}>
            Back to Webinars
          </Button>
        </>
      )}
    </Box>
  );
};

export default WebinarDetail;
