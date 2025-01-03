import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  Link,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import client from "../../config/contentfulClient";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa";
import ReactPlayer from "react-player";
import { getYouTubeThumbnailUrl } from "../../utils/thumbnailUrlExtract";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    // Fetch the current video
    client
      .getEntry(id)
      .then((entry) => setVideo(entry))
      .catch((error) => console.error("Error fetching video:", error));

    // Fetch all videos for suggestions
    client
      .getEntries({ content_type: "videoModel" })
      .then((response) => {
        const filteredVideos = response.items.filter(
          (item) => item.sys.id !== id
        );
        setSuggestedVideos(filteredVideos);
      })
      .catch((error) =>
        console.error("Error fetching suggested videos:", error)
      );
  }, [id]);

  const handlePlayPause = () => setPlaying(!playing);
  const handleMute = () => setMuted(!muted);
  const handleVolumeChange = (value) => setVolume(value);
  const handleProgress = (state) => setProgress(state.playedSeconds);
  const handleDuration = (value) => setDuration(value);
  const seekTo = (value) => playerRef.current.seekTo(value, "seconds");

  if (!video) return <Text>Loading...</Text>;

  return (
    <Box maxWidth="800px" mx="auto" p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Button as={RouterLink} to="/videos" 
                    color="white"
                    bgColor="#e93d3d">
          Back to Videos
        </Button>
      </Flex>

      <Heading size="xl" mb={3}>
        {video.fields.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={5}>
        {formatDate(video.fields.uploadedDate)}
      </Text>

      {/* Video Player */}
      <Box position="relative" bg="black" borderRadius="lg" overflow="hidden">
        <ReactPlayer
          ref={playerRef}
          url={video?.fields.youTubeVideoUrl}
          playing={playing}
          muted={muted}
          volume={volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          width="100%"
          height="400px"
        />
        {/* Custom Controls */}
        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bg="rgba(0, 0, 0, 0.7)"
          p={3}
          alignItems="center"
        >
          <IconButton
            aria-label="Play/Pause"
            icon={playing ? <FaPause /> : <FaPlay />}
            onClick={handlePlayPause}
            variant="ghost"
            color="white"
            fontSize="20px"
          />
          <Slider
            flex="1"
            mx={4}
            value={(progress / duration) * 100 || 0}
            onChange={(value) => seekTo((value / 100) * duration)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack bg="gray.600">
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <Tooltip
              label={`${Math.floor(progress)}s`}
              isOpen={showTooltip}
              placement="top"
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <IconButton
            aria-label="Mute/Unmute"
            icon={muted ? <FaVolumeMute /> : <FaVolumeUp />}
            onClick={handleMute}
            variant="ghost"
            color="white"
            fontSize="20px"
          />
          <Slider
            maxWidth="100px"
            value={volume * 100}
            onChange={(value) => handleVolumeChange(value / 100)}
            mx={2}
          >
            <SliderTrack bg="gray.600">
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <IconButton
            aria-label="Fullscreen"
            icon={<FaExpand />}
            variant="ghost"
            color="white"
            fontSize="20px"
            ml={3}
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.getInternalPlayer().requestFullscreen();
              }
            }}
          />
        </Flex>
      </Box>

      <Text fontSize="md" mt={5}>
        {video.fields.description}
      </Text>

      {/* Suggested Videos Section */}
      {suggestedVideos?.length > 0 && (
        <Box mt={10}>
          <Heading size="lg" mb={5}>
            Suggested Videos
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={5}>
            {suggestedVideos.map((suggested) => (
              <Box
                key={suggested.sys.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                _hover={{ boxShadow: "lg", cursor: "pointer" }}
              >
                <Box
                  as="video"
                  src={suggested.fields.youTubeVideoUrl}
                  poster={getYouTubeThumbnailUrl(video.fields?.youTubeVideoUrl)}
                muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    pointerEvents: "none",
                  }}
                />
                <Heading size="sm" mb={2}>
                  {suggested.fields.title}
                </Heading>
                <Link
                  as={RouterLink}
                  to={`/video/${suggested.sys.id}`}
                  color="blue.500"
                  fontWeight="bold"
                >
                  View Now
                </Link>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default VideoDetail;
