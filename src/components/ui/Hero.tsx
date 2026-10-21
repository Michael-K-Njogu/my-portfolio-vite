import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowDown, Person } from "react-bootstrap-icons";
import Avatar from "./../../images/michael-njogu-profile.jpeg";

const Hero = () => {
  // Smooth scroll to #my-work section
  const scrollToWork = (e) => {
    e.preventDefault();
    const section = document.querySelector("#my-work");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <Container>
        <Row className="align-items-center">
          <Col md={9}>
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              className="hero-text"
            >
              <span className="hero-status">
                <span className="status-dot" aria-hidden="true"></span>
                OPEN TO PRODUCT DESIGN / UX ENGINEERING
              </span>
              <h1 className="hero-title">
                I design the experience. I build the product.
              </h1>
              <p className="mb-4">
                I’m Michael Njogu, a Product Design Engineer bridging UX, design
                systems and frontend development to turn complex problems into
                usable digital products.
              </p>

              <div className="hero-buttons">
                <Button variant="primary" onClick={scrollToWork}>
                  Explore Selected Work
                  <span className="bootstrap-icon">
                    <ArrowDown size={24} />
                  </span>
                </Button>

                <Button
                  as={Link as any}
                  to="/about"
                  variant="outline-secondary"
                >
                  More About Me
                  <span className="bootstrap-icon ms-1">
                    <Person size={24} />
                  </span>
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col md={3}>
            <div className="hero-avatar-container">
              <img
                src={Avatar}
                alt="Michael Njogu"
                className="hero-image"
                fetchPriority="high"
              />
            </div>
          </Col>
        </Row>

        <div className="divider"></div>
      </Container>
    </section>
  );
};

export default Hero;
