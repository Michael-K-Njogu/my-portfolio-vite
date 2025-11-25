// src/pages/NotFound.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ExclamationDiamond } from 'react-bootstrap-icons';

const NotFound: React.FC = () => {
  useEffect(() => {
    try {
      document.title = 'Error 404 - Page Not Found';
    } catch {
      // noop for SSR or environments without document
    }
  }, []);

  return (
    <div className="wrapper">
      <section className="hero" aria-labelledby="notfound-title">
        <Container>
          <div className="icon-wrapper mb-4" aria-hidden>
            <ExclamationDiamond size={64} />
          </div>

          <h1 id="notfound-title" className="mb-4">
            Page Not Found
          </h1>

          <p>
            It seems like the page or case study you are looking for does not exist on this site, or may
            have been permanently deleted.
          </p>

          <Link
            className="styled-link styled-link-full"
            to="/"
            title="Go back to the homepage"
            aria-label="Go back to the homepage"
          >
            Take me back home
          </Link>
        </Container>
      </section>
    </div>
  );
};

export default NotFound;
