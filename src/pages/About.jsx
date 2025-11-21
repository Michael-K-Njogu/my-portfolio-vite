import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Avatar from '../images/michael-njogu.jpg';
import AnimeAvatar from '../images/michael-anime.jpg';
import Resume from '../docs/Michael_Njogu_CV.pdf';
import { BoxArrowUpRight, ArrowUpRight, Download } from 'react-bootstrap-icons';
import Timeline from '../components/ui/Timeline';

// Constants moved outside component to avoid recreation on each render
const LEARNING_CARDS = [
  {
    id: 'american-negotiation-institute',
    title: 'Negotiation Professional Certificate',
    source: 'American Negotiation Institute',
    link: 'https://www.linkedin.com/learning/certificates/b99cae30fcd8bc407d87f5ec0aa893cc5081889ecfac1854fb3bda7176ba7575?u=2152425',
    icon: './images/profile/american-negotiation-institute.png',
    alt: 'American Negotiation Institute logo',
    inverted: true
  }, 
  {
    id: 'iaap-member',
    title: 'IAAP - Professional Member',
    source: 'International Association of Accessibility Professionals',
    link: 'https://www.credly.com/badges/5fec40f7-8cdf-4839-87db-8d685129632f/public_url',
    icon: './images/profile/iaap-member.png',
    alt: 'IAAP Member badge',
    inverted: false
  },
  {
    id: 'safe-6-agilist',
    title: 'Certified SAFe® 6 Agilist',
    source: 'Scaled Agile, Inc.',
    link: 'https://www.credly.com/badges/8d2ee9ca-8c5d-4ddc-9822-6f5d251bf2b8/linked_in_profile',
    icon: './images/profile/safe-6.png',
    alt: 'SAFe 6 badge',
    inverted: false
  },
  {
    id: 'accessibility-design',
    title: 'Accessibility: How to Design for All',
    source: 'The Interaction Design Foundation (IxDF)',
    link: 'https://www.interaction-design.org/members/michael-kunyiha-njogu/certificate/course/b776e417-27d1-4581-9ef2-ac7d131e7191',
    icon: './images/profile/IxDF-logomark.png',
    alt: 'IxDF logomark',
    inverted: true
  },
  {
    id: 'data-driven-design',
    title: 'Data-Driven Design: Quantitative Research for UX',
    source: 'The Interaction Design Foundation (IxDF)',
    link: 'https://www.interaction-design.org/michael-kunyiha-njogu/certificate/course/b4021bd6-6d6f-4d77-9dbe-b8eedfa348ea',
    icon: './images/profile/IxDF-logomark.png',
    alt: 'IxDF logomark',
    inverted: true
  },
  {
    id: 'design-21st-century',
    title: 'Design for the 21st Century with Don Norman',
    source: 'The Interaction Design Foundation (IxDF)',
    link: 'https://www.interaction-design.org/michael-kunyiha-njogu/certificate/course/613034c9-55a7-404d-9541-af4508c17538',
    icon: './images/profile/IxDF-logomark.png',
    alt: 'IxDF logomark',
    inverted: true
  },
];

const SKILLS = [
  'UI Design & Prototyping',
  'UX Strategy',
  'User Research',
  'Workshop Facilitation',
  'Accessibility & Inclusive Design',
  'Systems Thinking',
  'Training & Knowledge Sharing',
  'HTML5 & CSS3',
];

const TOOLS = [
  { id: 'figma', name: 'Figma', icon: './images/profile/figma.png', desc: 'User interface design & prototyping', inverted: false },
  { id: 'mural', name: 'Mural', icon: './images/profile/mural.svg', desc: 'Remote collaboration, brainstorming', inverted: false },
  { id: 'power-platform', name: 'Power Platform', icon: './images/profile/power-platform.png', desc: 'Low-code development & automation', inverted: false },
  { id: 'firefly', name: 'Adobe Firefly', icon: './images/profile/firefly.png', desc: 'Generative AI for images', inverted: false },
  { id: 'vscode', name: 'VS Code', icon: './images/profile/vscode.png', desc: 'Code editing & development', inverted: false },
  { id: 'github', name: 'GitHub', icon: './images/profile/github-mark.svg', desc: 'Version control & collaboration', inverted: true },
  { id: 'contentful', name: 'Contentful', icon: './images/profile/contentful.png', desc: 'Headless CMS content management', inverted: false },
  { id: 'netlify', name: 'Netlify', icon: './images/profile/netlify.png', desc: 'Prototyping & split testing', inverted: false },
  { id: 'react', name: 'React', icon: './images/profile/react.png', desc: 'Building user interfaces', inverted: false }
];

// Animation variants moved outside component
const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const About = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    document.title = "Michael Njogu - Strategic Product Designer";
  }, []);

  const handleAvatarFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  return (
    <div className="wrapper">

      {/* Hero Section */}
      <section className="hero bg-secondary">
        <Container>
          <Row className="align-items-center">
            <Col md={9}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="hero-text"
              >
                <h1 className="hero-title">About Me.</h1>
                <p className="mb-4">
                  I learn by doing, exploring possibilities, experimenting with solutions, and adapting as I discover what works.
                </p>

                <div className="hero-buttons d-flex flex-column flex-md-row gap-2 gap-md-3">
                  <motion.div>
                    <Button
                      variant="primary"
                      as={Link}
                      to="/"
                      className="d-inline-flex align-items-center ms-0"
                    >
                      View My Work
                      <span className="bootstrap-icon ms-1"><ArrowUpRight size={24} /></span>
                    </Button>
                  </motion.div>

                  <motion.div>
                    <Button
                      href={Resume}
                      variant="outline-secondary"
                      className="d-inline-flex align-items-center ms-0"
                    >
                      Download My CV
                      <span className="bootstrap-icon ms-1"><Download size={24} /></span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </Col>

          <Col md={3}>
            {/* Avatar flip effect container */}
            <div
              className="avatar-flip-container"
              onClick={handleAvatarFlip}
            >
              <motion.div
                className="avatar-flip-inner"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.img
                  src={Avatar}
                  alt="Michael Njogu"
                  className="avatar-front hero-image"
                  loading="lazy"
                  style={{ backfaceVisibility: "hidden" }}
                />
                <motion.img
                  src={AnimeAvatar}
                  alt="Anime Michael"
                  className="avatar-back hero-image"
                  loading="lazy"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0 
                  }}
                />
              </motion.div>
            </div>
          </Col>
          </Row>
        </Container>
      </section>

      {/* Skills Section */}
      <section className="content-section">
        <Container>
          <h2>Skills &amp; Tools</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="skills-container"
          >
            <motion.div variants={fadeInUp} className="skill-list mb-5">
              <h3 className="mb-4">Key Skills</h3>
              <ul>
                {SKILLS.map((skill) => (
                  <motion.li key={skill} className="skill-chip" variants={fadeInUp}>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="tool-list mt-5">
              <h3 className="mb-4">Some Tools I Like to Use</h3>
              <ul>
                {TOOLS.map((tool) => (
                  <motion.li key={tool.id} variants={fadeInUp}>
                    <div className="tool-icon">
                      <img loading="lazy" src={tool.icon} alt={`${tool.name} icon`} className={tool.inverted ? "inverted" : ""}/>
                    </div>
                    <div className="skill-info">
                      <h5>{tool.name}</h5>
                      <span>{tool.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>            
          </motion.div>

          
        </Container>
      </section>

      {/* Work Experience */}
      <motion.section
        className="content-section bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Container>
          <h2>Work Experience</h2>
          <Timeline />
        </Container>
      </motion.section>

      {/* Learning Section */}
      <motion.section
        className="content-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Container>
          <h2 className="section-title">Learning</h2>
          <div className="learning-cards">
            {LEARNING_CARDS.map(({ id, title, source, link, icon, alt, inverted }) => (
              <motion.div key={id} variants={fadeInUp}>
                <div className="learning-card">
                    <div className="learning-card-img">
                    <img src={icon} alt={alt} className={inverted ? "inverted" : ""} loading="lazy" />
                    </div>
                    <div className="learning-card-text">
                    <h5>{title}</h5>
                    <p>{source}</p>                  
                    {link ?
                    <a href={link} rel="nofollow noreferrer" target="_blank">
                        View credential
                        <span className="bootstrap-icon">
                            <BoxArrowUpRight size={16} className="ms-2" />
                        </span>
                    </a>
                    :
                    <span>In progress</span>
                    }
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

    </div>
  );
}

export default About
