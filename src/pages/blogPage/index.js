import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  useUpdateEffect,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/thunks/webinar";
import {
  selectBlogsCollections,
  selectBlogsData,
  selectBlogsLoading,
} from "../../store/selectors";
import { Pagination } from "../../components/pagination";
import { useNavigate } from "react-router-dom";

function Blogs() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const loading = useSelector(selectBlogsLoading);
  const blogs = useSelector(selectBlogsData);
  const blogsCollections = useSelector(selectBlogsCollections);
  console.log("blogs", blogs);
  
  useEffect(() => {
    dispatch(
      fetchBlogs({
        page: 1,
        pageSize: 10,
      })
    );
  }, []);

  useUpdateEffect(() => {
    dispatch(
      fetchBlogs({
        page,
        pageSize: 10,
      })
    );
  }, [page]);
  const navigate = useNavigate();

  const handleRedirect = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };
  return (
    <Box p={"16px"} minH={"calc(100vh - 144px)"}>
      <Heading p={'16px'}>Blogs</Heading>
      {loading ? (
        <Flex minH={"30vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner m={"auto"} />
        </Flex>
      ) : (
        <Flex justifyContent={"center"} flexWrap={"wrap"} gap={"16px"}>
          {blogsCollections?.map((blog) => {
            return (
              <Card onClick={()=> handleRedirect(1)} cursor={'pointer'} maxW="300px">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">{blog?.title}</Heading>
                    <Text>{blog?.description}</Text>
                  </Stack>
                </CardBody>
              </Card>
            );
          })}
        </Flex>
      )}
      {blogsCollections && blogsCollections?.length > 0 && !loading && (
        <Box py={"16px"}>
          <Pagination
            totalPages={blogs?.total_results}
            onPageChange={(sp) => setPage(sp)}
            currentPage={page}
          />
        </Box>
      )}
    </Box>
  );
}

export default Blogs;
