import {
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  StatUpArrow,
  Text,
  useUpdateEffect,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "../../components/pagination";
import { CustomButton } from "../../components/pagination/button";
import { getVideoTitleFromURL } from "../../helpers";
import { updateSelectedVideo } from "../../store/reducers/webinar";
import {
  selectData,
  selectSelectedVideo,
  selectWabinarLoading,
  selectWebinarVideos,
} from "../../store/selectors";
import { fetchWebinarVideos } from "../../store/thunks/webinar";

function VideoDetailPage() {
  const dispatch = useDispatch();
  const videos = useSelector(selectWebinarVideos);
  const loading = useSelector(selectWabinarLoading);
  const selectedVideo = useSelector(selectSelectedVideo);
  const data = useSelector(selectData);
  const [page, setPage] = useState(1);
  const videosSize = selectedVideo ? 6 : 12;

  useEffect(() => {
    dispatch(
      fetchWebinarVideos({
        page,
        pageSize: videosSize,
      })
    );
  }, []);

  useUpdateEffect(() => {
    dispatch(
      fetchWebinarVideos({
        page: selectedVideo ? Math.floor(Math.random() * (100 - 1 + 1)) + 1 : 1,
        pageSize: videosSize,
      })
    );
    setPage(1);
  }, [selectedVideo]);

  useUpdateEffect(() => {
    dispatch(
      fetchWebinarVideos({
        page,
        pageSize: videosSize,
      })
    );
  }, [page]);

  const onVideoClickHandler = (video) => {
    dispatch(updateSelectedVideo(video));
  };

  const onBack = () => {
    dispatch(updateSelectedVideo(null));
  };

  return (
    <Box minH={"calc(100vh - 144px)"}>
      {selectedVideo && (
        <Box p={"16px"}>
          <Flex
            alignItems={"center"}
            gap={"10px"}
            cursor={"pointer"}
            width={"fit-content"}
            onClick={onBack}
            py={"8px"}
          >
            <StatUpArrow transform={"rotate(-90deg)"} /> Back to videos
          </Flex>
          <Box width={{ base: "100%", lg: "800px" }}>
            <ReactPlayer
              width={"100%"}
              muted={false}
              loop
              playing
              controls
              url={selectedVideo?.["video_files"]?.[0]?.link}
            />
          </Box>
        </Box>
      )}
      <Heading p={'16px'}>Videos</Heading>

      {loading ? (
        <Flex minH={"30vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner m={"auto"} />
        </Flex>
      ) : (
        <Flex
          justifyContent={selectedVideo ? "flex-start" : "center"}
          gap={"16px"}
          p={"16px"}
          flexWrap={"wrap"}
        >
          {videos.map((vid) => {
            return (
              <Flex gap={"6px"} flexDir={"column"}>
                <Image width={"200px"} height={"200px"} src={vid?.image} />
                <Text maxW={"200px"} noOfLines={1}>
                  {getVideoTitleFromURL(vid?.url)}
                </Text>
                <CustomButton
                  text="View"
                  onClick={() => onVideoClickHandler(vid)}
                />
              </Flex>
            );
          })}
        </Flex>
      )}
      {videos && videos?.length > 0 && !loading && !selectedVideo && (
        <Box py={"16px"}>
          <Pagination
            totalPages={data?.total_results}
            onPageChange={(sp) => setPage(sp)}
            currentPage={page}
          />
        </Box>
      )}
    </Box>
  );
}

export default VideoDetailPage;
