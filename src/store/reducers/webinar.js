import { createSlice } from "@reduxjs/toolkit";
import { FULLFILLED, PENDING, REJECTED } from "../../constants";
import { FETCH_BLOGS, FETCH_WEBINAR_VIDEOS } from "../actionTypes";

export const appEntitySlice = createSlice({
  name: "webinar",
  initialState: {
    videos: [],
    data: {},
    loading: false,
    selectedVideo: null,
    blogs:{},
    blogsLoading:false
  },
  reducers: {
    updateSelectedVideo: (state, { payload }) => {
      state.selectedVideo = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(`${FETCH_WEBINAR_VIDEOS}${PENDING}`, (state) => {
      state.loading = true;
    });
    builder.addCase(
      `${FETCH_WEBINAR_VIDEOS}${FULLFILLED}`,
      (state, { payload }) => {
        if (payload?.data?.videos) {
          state.videos = payload?.data?.videos;
          state.data = payload?.data;
        }
        state.loading = false;
      }
    );
    builder.addCase(`${FETCH_WEBINAR_VIDEOS}${REJECTED}`, (state) => {
      state.loading = false;
    });
    builder.addCase(`${FETCH_BLOGS}${PENDING}`, (state) => {
      state.blogsLoading = true;
    });
    builder.addCase(
      `${FETCH_BLOGS}${FULLFILLED}`,
      (state, { payload }) => {
        if (payload?.data?.collections) {
          state.blogs = payload?.data
        }
        state.blogsLoading = false;
      }
    );
    builder.addCase(`${FETCH_BLOGS}${REJECTED}`, (state) => {
      state.blogsLoading = false;
    });
  },
});

export const { updateSelectedVideo } = appEntitySlice.actions;

export const webinarReducer = appEntitySlice.reducer;
