import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App'
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import CaseStudies from './components/AllCaseStudies';
import CaseStudyDetail from './components/CaseStudyDetail';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource/libre-caslon-text';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import { ContentfulLivePreview } from '@contentful/live-preview';

// Initialize Contentful Live Preview globally
ContentfulLivePreview.init({
  locale: 'en-US',
  debugMode: true, // Optional – logs live preview activity to console
});

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <CaseStudies /> },
        { path: 'case-studies/:slug', element: <CaseStudyDetail /> },
        { path: 'about', element: <Profile /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,   // ✅ Opt into smoother route transitions
      v7_relativeSplatPath: true, // ✅ Use relative splat paths for nested routes
      v7_fetcherPersist: true, // ✅ Enable fetcher persistence for better performance
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
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
