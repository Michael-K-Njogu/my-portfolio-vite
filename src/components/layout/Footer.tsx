// src/components/layout/Footer.tsx
import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const currentYear: number = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={8}>
            <p>
              &copy; {currentYear} Michael Njogu. &nbsp;
              <a href="#" rel="nofollow noreferrer">
                About this portfolio
              </a>
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
                  href="#email"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    const codes = [
                      109, 121, 107, 101, 107, 117, 110, 121, 111, 64, 103, 109,
                      97, 105, 108, 46, 99, 111, 109,
                    ];
                    const email = String.fromCharCode(...codes);
                    window.location.href = `mailto:${email}`;
                  }}
                  title="Send me an email"
                  aria-label="Send me an email"
                >
                  Email
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
    </footer>
  );
};

export default Footer;
