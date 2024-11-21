import { createSelector } from "@reduxjs/toolkit";

const rootState = (state) => state.root;

export const rootSelector = createSelector(rootState, (state) => state);
export const webinarSelector = createSelector(
  rootState,
  (state) => state.webinar
);
export const selectWebinarVideos = createSelector(
  webinarSelector,
  (state) => state?.videos
);
export const selectData = createSelector(
  webinarSelector,
  (state) => state?.data
);
export const selectWabinarLoading = createSelector(
  webinarSelector,
  (state) => state?.loading
);
export const selectSelectedVideo = createSelector(
  webinarSelector,
  (state) => state?.selectedVideo
);
export const selectBlogsData = createSelector(
  webinarSelector,
  (state) => state?.blogs
);
export const selectBlogsLoading = createSelector(
  webinarSelector,
  (state) => state?.blogsLoading
);
export const selectBlogsCollections = createSelector(
  selectBlogsData,
  (state) => state?.collections
);
