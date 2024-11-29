import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { BasicLayout } from "../layouts";
import {
  AskAI,
  Dashboard,
  VideoDetailPage
} from "../pages";
import Blogs from "../pages/blogPage";
import Blog from "../pages/blogs";
import PDFDetail from "../pages/pdfs/PDFDetail";
import PDFList from "../pages/pdfs/PDFList";
import SingleVideo from "../pages/videoDetails/SingleVideo";
import WebinarList from "../pages/webinar/WebinarList";
import WebinarDetail from "../pages/webinar/WebinarDetail";
import WebinarRegistrationForm from "../pages/webinar/WebinarRegistrationForm";

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
        path: "/webinars",
        element: <WebinarList />,
      },
      {
        path: "/webinar/:id",
        element: <WebinarRegistrationForm />,
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
