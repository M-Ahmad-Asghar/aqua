import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FETCH_BLOGS, FETCH_WEBINAR_VIDEOS } from "../actionTypes";

export const fetchWebinarVideos = createAsyncThunk(
  FETCH_WEBINAR_VIDEOS,
  async (params, thunk) => {
    const { page, pageSize } = params;
    try {
      const results = await axios.get(
        `https://api.pexels.com/videos/popular?per_page=${pageSize || 3}&page=${
          page || 1
        }`,
        {
          headers: {
            Authorization:
              "pqw2NBGdH1CIPW8JBcOYo9stWk23HTKPJX8Xs37FHvbyn4IWl0K9LZpy",
          },
        }
      );
      if (results.status === 200) {
        return thunk.fulfillWithValue(results);
      }
    } catch (error) {
      return thunk.rejectWithValue(error);
    }
  }
);

export const fetchBlogs = createAsyncThunk(
  FETCH_BLOGS,
  async (params, thunk) => {
    const { page, pageSize } = params;
    try {
      const results = await axios.get(
        `https://api.pexels.com/v1/collections/featured?per_page=${
          pageSize || 6
        }&page=${page || 1}`,
        {
          headers: {
            Authorization:
              "pqw2NBGdH1CIPW8JBcOYo9stWk23HTKPJX8Xs37FHvbyn4IWl0K9LZpy",
          },
        }
      );
      if (results.status === 200) {
        return thunk.fulfillWithValue(results);
      }
    } catch (error) {
      return thunk.rejectWithValue(error);
    }
  }
);
