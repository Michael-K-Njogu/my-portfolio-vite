// src/pages/NotFound.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { OctagonAlert } from "lucide-react";

const NotFound: React.FC = () => {
  useEffect(() => {
    try {
      document.title = "Error 404 - Page Not Found";
    } catch {
      // noop for SSR or environments without document
    }
  }, []);

  return (
    <div className="wrapper">
      <section className="hero" aria-labelledby="notfound-title">
        <Container>
          <div className="icon-wrapper mb-4" aria-hidden>
            <OctagonAlert size={64} />
          </div>

          <h1 id="notfound-title" className="mb-4">
            Resource Not Found
          </h1>

          <p>
            Sorry, the page or case study you're looking for doesn't exist. It
            may have been moved, unpublished, or deleted.
          </p>

          <Link className="styled-link styled-link-full" to="/">
            Take me back home
          </Link>
        </Container>
      </section>
    </div>
  );
};

export default NotFound;
