import type { ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { Accessibility, X } from "lucide-react";
import {
  siBootstrap,
  siLucide,
  siReact,
  siTypescript,
  siVite,
} from "simple-icons";

type Props = {
  show: boolean;
  onHide: () => void;
};

type Tech = {
  name: string;
  description: string;
  logo: ReactNode;
};

const BrandLogo = ({ path, hex }: { path: string; hex: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill={`#${hex}`}
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

// Full-colour Contentful mark (the Simple Icons version is single-colour only)
const ContentfulLogo = () => (
  <svg viewBox="0 0 256 289" width="22" height="24" aria-hidden="true">
    <path
      fill="#fae501"
      d="M87.333 200.777c-15.306-14.406-24.309-34.213-24.309-56.722s9.003-42.316 23.409-56.722c12.605-12.604 12.605-32.412 0-45.017s-32.412-12.605-45.017 0C16.206 68.426 0 104.44 0 144.055s16.206 75.629 42.316 101.739c12.605 12.605 32.413 12.605 45.017 0c11.705-12.605 11.705-32.413 0-45.017"
    />
    <path
      fill="#4fb5e1"
      d="M87.333 87.333c14.406-15.306 34.213-24.309 56.722-24.309s42.316 9.003 56.722 23.409c12.604 12.605 32.412 12.605 45.017 0s12.605-32.412 0-45.017C219.684 16.206 183.67 0 144.055 0S68.426 16.206 42.316 42.316c-12.605 12.605-12.605 32.413 0 45.017c12.605 11.705 32.413 11.705 45.017 0"
    />
    <path
      fill="#f05751"
      d="M200.777 200.777c-14.406 15.305-34.213 24.309-56.722 24.309s-42.316-9.004-56.722-23.41c-12.604-12.604-32.412-12.604-45.017 0c-12.605 12.606-12.605 32.413 0 45.018c26.11 25.21 62.124 41.416 101.739 41.416s75.629-16.206 101.739-42.316c12.605-12.605 12.605-32.413 0-45.017c-12.605-11.705-32.413-11.705-45.017 0"
    />
    <circle cx="64.825" cy="64.825" r="31.512" fill="#0681b6" />
    <circle cx="64.825" cy="223.285" r="31.512" fill="#cd4739" />
  </svg>
);

const stack: Tech[] = [
  {
    name: "React",
    description: "JavaScript library for building the user interface.",
    logo: <BrandLogo {...siReact} />,
  },
  {
    name: "TypeScript",
    description: "Typed JavaScript that catches bugs before they ship.",
    logo: <BrandLogo {...siTypescript} />,
  },
  {
    name: "Vite",
    description: "Fast build tool and development server.",
    logo: <BrandLogo {...siVite} />,
  },
  {
    name: "Contentful",
    description: "Headless CMS that powers the case studies.",
    logo: <ContentfulLogo />,
  },
  {
    name: "Bootstrap",
    description: "CSS framework for layout and base components.",
    logo: <BrandLogo {...siBootstrap} />,
  },
  {
    name: "Lucide",
    description: "Open-source icon library used across the site.",
    logo: <BrandLogo {...siLucide} />,
  },
  {
    name: "axe-core",
    description: "Accessibility testing engine used while developing.",
    // No brand logo available, so use a generic accessibility icon
    logo: <Accessibility size={24} aria-hidden="true" />,
  },
];

const AboutPortfolioModal = ({ show, onHide }: Props) => (
  <Modal
    show={show}
    onHide={onHide}
    centered
    aria-labelledby="about-portfolio-title"
    contentClassName="about-modal"
    backdropClassName="about-modal-backdrop"
    animation={false}
  >
    <Modal.Header>
      <Modal.Title as="h2" id="about-portfolio-title">
        About this portfolio
      </Modal.Title>
      <button
        type="button"
        className="about-modal-close"
        onClick={onHide}
        aria-label="Close"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </Modal.Header>

    <Modal.Body>
      <p className="about-modal-intro">Built with:</p>

      <ul className="about-stack">
        {stack.map(({ name, description, logo }) => (
          <li key={name}>
            <span className="about-stack-logo">{logo}</span>
            <span className="about-stack-text">
              <span className="about-stack-name">{name}</span>
              <span className="about-stack-description">{description}</span>
            </span>
          </li>
        ))}
      </ul>
    </Modal.Body>
  </Modal>
);

export default AboutPortfolioModal;
