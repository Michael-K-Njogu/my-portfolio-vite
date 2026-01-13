// src/components/ProjectNav.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

type ProjectNavProps = {
  previousPageName: string;
  links: string[]; // list of section labels (e.g. ["Overview", "Challenges"])
  // Optional: ability to supply a selector for the scroll container (defaults to window)
  scrollContainerSelector?: string;
  // Optional header offset in px (useful when header is sticky)
  headerOffset?: number;
};

const safeIdFromLabel = (label: string) =>
  label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const ProjectNav: React.FC<ProjectNavProps> = ({
  previousPageName,
  links,
  scrollContainerSelector,
  headerOffset = 180,
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Element[]>([]);

  const sectionIds = useMemo(() => {
    return (links || []).map(safeIdFromLabel);
  }, [links]);

  // IntersectionObserver callback (stable)
  const intersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    // pick the entry that is most visible (largest intersectionRatio) among intersecting ones
    const intersecting = entries.filter((e) => e.isIntersecting);
    if (intersecting.length === 0) {
      // If none intersecting, do not change activeId
      return;
    }
    const mostVisible = intersecting.reduce((prev, curr) =>
      curr.intersectionRatio > prev.intersectionRatio ? curr : prev
    );
    if (mostVisible && mostVisible.target && mostVisible.target.id) {
      setActiveId(mostVisible.target.id);
    }
  }, []);

  useEffect(() => {
    // don't run in non-browser environments
    if (typeof window === 'undefined' || !sectionIds || sectionIds.length === 0) return;

    // Clean up any previous observer/observed elements
    if (observerRef.current) {
      observedElementsRef.current.forEach((el) => observerRef.current?.unobserve(el));
      observerRef.current.disconnect();
      observerRef.current = null;
      observedElementsRef.current = [];
    }

    // If IntersectionObserver isn't available (old browsers), skip observing
    if (typeof IntersectionObserver === 'undefined') {
      // Optionally, you could fallback to listening to scroll and compute offsets
      return;
    }

    const observer = new IntersectionObserver(intersectionCallback, {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: [0, 0.01, 0.1, 0.25, 0.5],
    });

    observerRef.current = observer;

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observedElementsRef.current.push(el);
      }
    });

    // If there's already a visible section on mount, set it
    const initialVisible = observedElementsRef.current.find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    });
    if (initialVisible) setActiveId(initialVisible.id);

    return () => {
      if (observerRef.current) {
        observedElementsRef.current.forEach((el) => observerRef.current?.unobserve(el));
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      observedElementsRef.current = [];
    };
  }, [sectionIds, intersectionCallback]);

  const handleScrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      if (typeof window === 'undefined') return;

      const element = document.getElementById(id);
      const container =
        scrollContainerSelector && typeof document !== 'undefined'
          ? document.querySelector(scrollContainerSelector)
          : null;

      if (!element) return;

      // If using a custom container (e.g., a scrollable div), compute relative offset
      if (container instanceof Element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offsetTop = elementRect.top - containerRect.top;
        (container as HTMLElement).scrollTo({ top: offsetTop - headerOffset, behavior: 'smooth' });
      } else {
        const y = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }

      // Update activeId immediately for snappier UI feedback
      // NOTE: do not set `activeId` here — doing so highlights the
      // nav item before the section has actually scrolled into view.
      // Rely on the IntersectionObserver to update `activeId` when
      // the target section intersects the viewport.
    },
    [headerOffset, scrollContainerSelector]
  );

  return (
    <section className="project-nav sticky-top" aria-label="Project navigation">
      <Container className="d-flex align-items-center justify-content-between">
        <Link to="/#my-work" className="back-link" aria-label={`Back to ${previousPageName}`}>
          <span className="bootstrap-icon" aria-hidden>
            <ArrowLeft size={24} className="me-2" />
          </span>
          <span>{previousPageName}</span>
        </Link>

        <nav aria-label="Project sections">
          <ul className="d-flex gap-3 list-unstyled mb-0">
            {(links || []).map((linkLabel) => {
              const id = safeIdFromLabel(linkLabel);
              const isCurrent = activeId === id;
              return (
                <li key={id} className={isCurrent ? 'is-current' : undefined}>
                  <a
                    className="project-nav-link"
                    href={`#${id}`}
                    onClick={(e) => handleScrollTo(e, id)}
                    aria-current={isCurrent ? 'true' : undefined}
                  >
                    {linkLabel}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </section>
  );
};

export default ProjectNav;
