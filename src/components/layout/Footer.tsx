// src/components/layout/Footer.tsx
import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import AboutPortfolioModal from "../ui/AboutPortfolioModal";

const currentYear: number = new Date().getFullYear();

const Footer: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <footer>
      <Container>
        <Row>
          <Col md={8}>
            <p>
              &copy; {currentYear} Michael Njogu. &nbsp;
              <button
                type="button"
                className="footer-link-button"
                onClick={() => setShowAbout(true)}
                aria-haspopup="dialog"
              >
                About this portfolio
              </button>
            </p>
          </Col>

          <Col md={4}>
            <ul className="social-icons">
              <li>
                <a
                  href="https://www.linkedin.com/in/michael-njogu/"
                  rel="nofollow noreferrer"
                  target="_blank"
                  title="Connect with me on LinkedIn"
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/Michael-K-Njogu"
                  rel="nofollow noreferrer"
                  target="_blank"
                  title="View my GitHub profile"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <AboutPortfolioModal
        show={showAbout}
        onHide={() => setShowAbout(false)}
      />
    </footer>
  );
};

export default Footer;
