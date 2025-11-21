import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ProjectNav = ({ previousPageName, links }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!links || links.length === 0) return;

    const sectionIds = links.map(link =>
      link.toLowerCase().replace(/\s+/g, '-')
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -70% 0px', // adjust for your sticky header height
        threshold: 0.1,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [links]);

    const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 180; // adjust for your header + project-nav height
        const y =
        element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
    };

  return (
    <section className="project-nav sticky-top">
      <Container className="d-flex align-items-center justify-content-between">
        <Link to="/#my-work" className="back-link">
          <span className="bootstrap-icon">
            <ArrowLeft size={24} className="me-2" />
          </span>
          {previousPageName}
        </Link>

        <ul>
          {links.map((link) => {
            const id = link.toLowerCase().replace(/\s+/g, '-');
            return (
              <li key={id} className={activeId === id ? 'is-current' : ''}>
                <a
                  className="project-nav-link"
                  href={`#${id}`}
                  onClick={(e) => handleScroll(e, id)}
                >
                  {link}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default ProjectNav;