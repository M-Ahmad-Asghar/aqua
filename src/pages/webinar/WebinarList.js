import React, { useEffect, useState } from "react";
import { Box, Heading, Grid, Card, CardBody, Text, Spinner, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const WebinarList = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your API Key
    const apiKey = process.env.REACT_APP_WEBINAR_KIT_API_KEY || "";
    console.log("apiKey" , apiKey);
    axios
      .get("https://webinarkit.com/api/webinars", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        setWebinars(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box p={5}>
      <Heading mb={5}>Webinars</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={5}>
          {webinars.map((webinar) => (
            <Card key={webinar.id} cursor="pointer">
              <CardBody>
                <Heading size="md">{webinar.name}</Heading>
                <Text mt={2}>
                  <b>Type:</b> {webinar.type}
                </Text>
                <Button as={RouterLink}
                    color="white"
                    to={`/webinar/${webinar.id}`} bgColor="#e93d3d" mt={3}>
                  View Details
                </Button>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WebinarList;
