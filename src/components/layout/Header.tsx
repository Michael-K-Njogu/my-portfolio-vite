// src/components/layout/Header.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Sun, Moon, List } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "motion/react";

/* Animation variants */
const letterVariants = {
  hidden: { opacity: 0, y: "0.25em", filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: "-0.25em",
    filter: "blur(4px)",
    transition: { duration: 0.25 },
  },
};

const nameContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Memoized array of characters for animated brand
  const name = useMemo<string[]>(() => "Michael Njogu".split(""), []);

  // Initialize theme based on saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
    document.body.classList.toggle("theme-dark", isDark);

    if (!savedTheme) {
      // default to light mode if nothing saved
      localStorage.setItem("theme", "light");
      document.body.classList.remove("theme-dark");
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.classList.toggle("theme-dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <header>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Navbar
          fixed="top"
          expand="lg"
          className="navbar-blur transition-all duration-500 py-3"
        >
          <Container>
            {/* Brand Logo Animation */}
            <Navbar.Brand href="/" className="flex items-center">
              <div className="relative inline-block select-none">
                <motion.span
                  key="full"
                  layoutId="brandText"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={nameContainer}
                  className="inline-block"
                >
                  {name.map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.span>
              </div>
            </Navbar.Brand>

            {/* Right-side controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle button */}
              <motion.button
                onClick={toggleTheme}
                aria-label="Toggle light/dark mode"
                className="theme-toggle border-0 bg-transparent cursor-pointer"
                whileTap={{ scale: 0.9 }}
                type="button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDarkMode ? (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="bootstrap-icon">
                        <Moon size={24} />
                      </span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="bootstrap-icon">
                        <Sun size={24} />
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Navbar toggle for mobile */}
              <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
                <List size={28} />
              </Navbar.Toggle>
            </div>

            {/* Nav Links */}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto" as="ul">
                <Nav.Item as="li">
                  <HashLink smooth to="/#my-work" className="nav-link transition-colors duration-300 text-gray-300 hover:text-white">
                    My Work
                  </HashLink>
                </Nav.Item>

                <Nav.Item as="li">
                  <NavLink
                    to="/about"
                    className={({ isActive }: { isActive: boolean }) =>
                      `nav-link transition-colors duration-300 ${
                        isActive
                          ? "text-white border-b-2 border-white"
                          : "text-gray-300 hover:text-white"
                      }`
                    }
                  >
                    About Me
                  </NavLink>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>
    </header>
  );
};

export default Header;
