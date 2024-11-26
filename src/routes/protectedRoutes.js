import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { BasicLayout } from "../layouts";
import {
  AskAI,
  BlogsPage,
  Dashboard,
  PDFsPage,
  VideoDetailPage,
} from "../pages";
import Blogs from "../pages/blogPage";
import Blog from "../pages/blogs";
import SingleVideo from "../pages/videoDetails/SingleVideo";
import PDFList from "../pages/pdfs/PDFList";
import PDFDetail from "../pages/pdfs/PDFDetail";

export const protectedRoutes = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/videos",
        element: <VideoDetailPage />,
      },
      {
        path: "/video/:id",
        element: <SingleVideo />,
      },
      {
        path: "/pdfs",
        element: <PDFList />,
      },
      {
        path: "/pdf/:id",
        element: <PDFDetail />,
      },
      {
        path: "/ask-ai",
        element: <AskAI />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blogs/:id",
        element: <Blog />,
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <Navigate to={"/"} />,
  // },
]);
