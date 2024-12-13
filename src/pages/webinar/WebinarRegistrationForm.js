import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  Flex,
  useToast,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WebinarRegistrationForm = () => {
  const { id } = useParams(); // Webinar ID
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);
  const [sessionDates, setSessionDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
    console.log("webinar", webinar);
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const apiKey = process.env.REACT_APP_WEBINAR_KIT_API_KEY || "";

  // Fetch webinar details and available session dates
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://webinarkit.com/api/webinar/dates/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      .then((response) => {
        setWebinar(response.data.results);
        setSessionDates(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching webinar details:", error);
        setLoading(false);
      });
  }, [id, apiKey]);

  const onSubmit = (data) => {
    setSubmitting(true);

    const registrationData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumberCountryCode: data.phoneNumberCountryCode,
      phoneNumber: data.phoneNumber,
      date: data.date, // Selected session date
      fullDate: "", // Optional, can leave it blank or format it manually
    };

    axios
      .post(`https://webinarkit.com/api/webinar/registration/${id}`, registrationData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        // Success: Show toast and redirect
        toast({
          title: "Registration successful!",
          description: `You have been registered for the webinar. Please check your email for confirmation.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Redirect to the URL provided by the API response
        // navigate(response.data.url);
        reset(); // Reset form fields after successful submission
        window.location = response.data.url
        
      })
      .catch((error) => {
        // Error: Show error toast
        console.error("Error registering user:", error);
        toast({
          title: "Registration failed",
          description: "There was an error registering for the webinar. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Box margin={"auto"} maxW={"820px"} p={5}>
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Heading mb={5}>Register for Webinar</Heading>
          <Text mb={5}>
            {/* <b>Type:</b> {webinar.type} */}
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <FormControl isInvalid={errors.email} mb={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
              />
              {errors.email && <Text color="red.500">{errors.email.message}</Text>}
            </FormControl>

            {/* First Name */}
            <FormControl isInvalid={errors.firstName} mb={4}>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <Text color="red.500">{errors.firstName.message}</Text>}
            </FormControl>

            {/* Last Name */}
            <FormControl isInvalid={errors.lastName} mb={4}>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <Text color="red.500">{errors.lastName.message}</Text>}
            </FormControl>

            {/* Phone Number */}
            <FormControl isInvalid={errors.phoneNumber} mb={4}>
              <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
              <Flex gap={2}>
                <Input
                  id="phoneNumberCountryCode"
                  placeholder="+1"
                  maxLength="5"
                  {...register("phoneNumberCountryCode", { required: "Country code is required" })}
                />
                <Input
                  id="phoneNumber"
                  placeholder="123456789"
                  {...register("phoneNumber", { required: "Phone number is required" })}
                />
              </Flex>
              {errors.phoneNumber && <Text color="red.500">{errors.phoneNumber.message}</Text>}
            </FormControl>

            {/* Webinar Date Selection */}
            <FormControl isInvalid={errors.date} mb={4}>
              <FormLabel htmlFor="date">Select Webinar Date</FormLabel>
              <Select
                id="date"
                {...register("date", { required: "Please select a session date" })}
              >
                <option value="">Select Date</option>
                {sessionDates.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.label}
                  </option>
                ))}
              </Select>
              {errors.date && <Text color="red.500">{errors.date.message}</Text>}
            </FormControl>

            <Button
                    color="white"

              type="submit"
              bgColor="#e93d3d"
              isLoading={submitting}
              loadingText="Registering..."
              width="full"
            >
              Register Now
            </Button>
          </form>
        </>
      )}
    </Box>
  );
};

export default WebinarRegistrationForm;
