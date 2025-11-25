// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CaseStudies from "./components/AllCaseStudies";
import CaseStudyDetail from "./components/CaseStudyDetail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/libre-caslon-text";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import { ContentfulLivePreview } from "@contentful/live-preview";

/**
 * Initialize Contentful Live Preview (optional)
 * Keep this early so previewing is available for the whole app.
 */
ContentfulLivePreview.init({
  locale: "en-US",
  debugMode: true, // logs preview activity to the console (remove for production)
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <CaseStudies /> },
        { path: "case-studies/:slug", element: <CaseStudyDetail /> },
        { path: "about", element: <Profile /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
    },
  }
);

const root = document.getElementById("root") as HTMLElement | null;
if (!root) {
  throw new Error("Root element not found — make sure index.html contains <div id=\"root\"></div>");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode
      enableLiveUpdates
      debugMode
      targetOrigin="https://app.contentful.com"
    >
      <RouterProvider router={router} />
    </ContentfulLivePreviewProvider>
  </React.StrictMode>
);
