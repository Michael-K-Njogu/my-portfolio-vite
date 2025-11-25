// src/pages/About.js
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Avatar from '../images/michael-njogu.jpg';
import AnimeAvatar from '../images/michael-anime.jpg';
import Resume from '../docs/Michael_Njogu_CV.pdf';
import { BoxArrowUpRight, ArrowUpRight, Download } from 'react-bootstrap-icons';
import Timeline from '../components/ui/Timeline';
import { selectClient } from '../contentfulClient';

// --- Animation variants (same as before) ---
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

// fallback static data (your previous arrays) — used only if Contentful returns nothing
const FALLBACK_LEARNING = [
  {
    id: 'iaap-member',
    title: 'IAAP - Professional Member',
    source: 'International Association of Accessibility Professionals',
    link: 'https://www.credly.com/badges/5fec40f7-8cdf-4839-87db-8d685129632f/public_url',
    icon: './images/profile/iaap-member.png',
    alt: 'IAAP Member badge',
    inverted: false
  },
  // ... you can add other fallback items if desired
];

const FALLBACK_SKILLS = [
  'UI Design & Prototyping',
  'UX Strategy',
  'User Research',
  'Workshop Facilitation',
  'Accessibility & Inclusive Design',
  'Systems Thinking',
  'Training & Knowledge Sharing',
  'HTML5 & CSS3',
];

const FALLBACK_TOOLS = [
  { id: 'figma', name: 'Figma', icon: './images/profile/figma.png', desc: 'User interface design & prototyping', inverted: false },
  { id: 'vscode', name: 'VS Code', icon: './images/profile/vscode.png', desc: 'Code editing & development', inverted: false },
  { id: 'react', name: 'React', icon: './images/profile/react.png', desc: 'Building user interfaces', inverted: false }
];

// Utility: ensure asset url is absolute with https
const toAssetUrl = (maybeFile) => {
  if (!maybeFile) return null;
  const url = typeof maybeFile === 'string'
    ? maybeFile
    : maybeFile.url ?? maybeFile.fields?.file?.url ?? null;
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return url;
  return url;
};

// Utility: detect internal path and render Link vs anchor
const isInternalPath = (url) => {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  if (typeof window === 'undefined') return false;
  try {
    return url.startsWith(window.location.origin);
  } catch {
    return false;
  }
};

const About = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Contentful data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);

  // derived fields with fallbacks
  const heroTitle = aboutData?.fields?.aboutHeroTitle ?? 'About Me.';
  const heroSubtitle = aboutData?.fields?.aboutHeroSubtitle ?? "I learn by doing, exploring possibilities, experimenting with solutions, and adapting as I discover what works.";
  const heroLink1Label = aboutData?.fields?.aboutHeroPrimaryLinkLabel ?? 'View my work';
  const heroLink1Url = aboutData?.fields?.aboutHeroPrimaryLinkUrl ?? '/';
  const heroLink2Label = aboutData?.fields?.uploadResumeTitle ?? 'Download my resume';
  const heroLink2Url = toAssetUrl(aboutData?.fields?.uploadResume) ?? Resume;

  const skills = aboutData?.fields?.coreSkills ?? FALLBACK_SKILLS;
  // tools: expect array of reference entries { fields: { name, purpose, icon } }
  const toolsArray = aboutData?.fields?.coreTools ?? [];
  const tools = Array.isArray(toolsArray) && toolsArray.length > 0
    ? toolsArray.map(t => {
        try {
          return {
            id: t.sys?.id ?? t.fields?.toolName,
            name: t.fields?.toolName,
            desc: t.fields?.toolPurpose,
            iconUrl: toAssetUrl(t.fields?.toolIcon),
            inverted: !!t.fields?.toolIconInverted
          };
        } catch (err) {
          console.error('Error mapping tool:', err, t);
          return null;
        }
      }).filter(Boolean)
    : FALLBACK_TOOLS;

  // experience list - transform to Timeline format
  const experienceArray = aboutData?.fields?.experience ?? [];
  const experience = Array.isArray(experienceArray) && experienceArray.length > 0
    ? experienceArray.map(e => {
        try {
          // Combine jobTitle and organization for the title
          const jobTitle = e.fields?.jobTitle || '';
          const organization = e.fields?.organization || '';
          const title = organization 
            ? `${jobTitle}${jobTitle ? ', ' : ''}${organization}`
            : jobTitle || 'Untitled Position';
          
          return {
            id: e.sys?.id,
            date: e.fields?.duration || 'Date not specified',
            title: title,
            description: e.fields?.jobDescription || '',
            type: 'professional',
            importance: e.fields?.importance || 'standard',
            // Keep original fields for potential future use
            organizationLogo: e.fields?.organizationLogo,
          };
        } catch (err) {
          console.error('Error mapping experience:', err, e);
          return null;
        }
      }).filter(Boolean)
    : [];
  const hasExperience = experience.length > 0;

  // certifications
  const certificationsArray = aboutData?.fields?.certifications ?? [];
  const certifications = Array.isArray(certificationsArray) && certificationsArray.length > 0
    ? certificationsArray.map(c => {
        try {
          return {
            id: c.sys?.id,
            title: c.fields?.certTitle,
            institution: c.fields?.institution,
            dateAttained: c.fields?.dateAttained,
            credentialUrl: c.fields?.credentialUrl,
            inProgress: !!c.fields?.inProgress,
            iconUrl: toAssetUrl(c.fields?.institutionLogo),
            inverted: !!c.fields?.institutionLogoInverted,
          };
        } catch (err) {
          console.error('Error mapping certification:', err, c);
          return null;
        }
      }).filter(Boolean)
    : [];

  useEffect(() => {
    document.title = "Michael Njogu - Strategic Product Designer";
  }, []);

  const handleAvatarFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Fetch About page from Contentful
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // enable preview when URL has ?preview=true
    const previewSearch = typeof window !== 'undefined' ? window.location.search : '';
    const usePreview = previewSearch.includes('preview=true');
    const client = selectClient(usePreview);

    const fetchAbout = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'aboutPage',
          include: 10,
          limit: 1
        });

        if (!mounted) return;
        if (res?.items?.length) {
          const aboutEntry = res.items[0];
          setAboutData(aboutEntry);
        } else {
          // No aboutPage entry found — keep aboutData null (fallbacks will be used)
          setAboutData(null);
        }
      } catch (err) {
        console.error('Error fetching About page from Contentful:', err);
        if (mounted) {
          const message = err?.message
            ? `Failed to load About page: ${err.message}`
            : 'Failed to load About page.';
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAbout();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="wrapper" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <Container>
          <p className="text-danger">{error}</p>
        </Container>
      </div>
    );
  }

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
                <h1 className="hero-title">{heroTitle}</h1>
                <p className="mb-4">{heroSubtitle}</p>

                <div className="hero-buttons d-flex flex-column flex-md-row gap-2 gap-md-3">
                  <motion.div>
                    {/* heroLink1: internal (Link) or external (anchor) */}
                    {isInternalPath(heroLink1Url) ? (
                      <Button
                        variant="primary"
                        as={Link}
                        to={heroLink1Url}
                        className="d-inline-flex align-items-center ms-0"
                      >
                        {heroLink1Label}
                        <span className="bootstrap-icon ms-1"><ArrowUpRight size={24} /></span>
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        href={heroLink1Url}
                        className="d-inline-flex align-items-center ms-0"
                      >
                        {heroLink1Label}
                        <span className="bootstrap-icon ms-1"><ArrowUpRight size={24} /></span>
                      </Button>
                    )}
                  </motion.div>

                  <motion.div>
                    {/* heroLink2: maybe a resume asset; fallback to static Resume file */}
                    {heroLink2Url && !heroLink2Url.includes('http') && heroLink2Url.endsWith('.pdf') ? (
                      // If it's a URL path that ends with pdf, use anchor
                      <Button
                        href={heroLink2Url}
                        variant="outline-secondary"
                        className="d-inline-flex align-items-center ms-0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {heroLink2Label}
                        <span className="bootstrap-icon ms-1"><Download size={24} /></span>
                      </Button>
                    ) : (
                      <Button
                        href={heroLink2Url || Resume}
                        variant="outline-secondary"
                        className="d-inline-flex align-items-center ms-0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {heroLink2Label}
                        <span className="bootstrap-icon ms-1"><Download size={24} /></span>
                      </Button>
                    )}
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
                      left: 0,
                      width: '100%',
                      height: '100%'
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
                {skills.map((skill, idx) => (
                  <motion.li key={`${skill}-${idx}`} className="skill-chip" variants={fadeInUp}>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="tool-list mt-5">
              <h3 className="mb-4">Some Tools I Like to Use</h3>
              <ul>
                {tools.map((tool) => (
                  <motion.li key={tool.id} variants={fadeInUp}>
                    <div className="tool-icon">
                      {tool.iconUrl ? (
                        <img loading="lazy" src={tool.iconUrl} alt={`${tool.name} icon`} className={tool.inverted ? "inverted" : ""}/>
                      ) : (
                        <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 6 }} />
                      )}
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
          {/* If we have experience from Contentful, pass it to Timeline; otherwise, show a friendly placeholder */}
          <Timeline items={hasExperience ? experience : undefined} />
          {!hasExperience && (
            <p className="text-muted mt-4">
              Experience highlights are being updated—check back soon.
            </p>
          )}
        </Container>
      </motion.section>

      {/* Learning Section / Certifications */}
      <motion.section
        className="content-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Container>
          <h2 className="section-title">Learning &amp; Certifications</h2>
          <div className="learning-cards">
            {/* prefer contentful certifications if available */}
            {(certifications && certifications.length ? certifications : FALLBACK_LEARNING).map((cert) => {
              const key = cert.id ?? cert.title;
              const title = cert.title ?? 'Certification';
              const source = cert.institution ?? cert.source ?? 'Independent study';
              const dateAttained = cert.dateAttained ?? 'Date not specified';
              const link = cert.inProgress ? null : cert.credentialUrl ?? cert.link ?? null;
              const icon = cert.iconUrl ?? cert.icon ?? null;
              const alt = cert.alt ?? `${title} badge`;
              const inverted = cert.inverted ?? false;
              const inProgress = cert.inProgress ?? false;

              return (
                <motion.div key={key} variants={fadeInUp}>
                  <div className="learning-card">
                    <div className="learning-card-img">
                      {icon ? <img src={icon} alt={alt} className={inverted ? "inverted" : ""} loading="lazy" /> : <div style={{width:64,height:64,background:'#f3f3f3'}} />}
                    </div>
                    <div className="learning-card-text">
                      <span className="card-date">{!inProgress ? dateAttained : 'Ongoing'}</span>
                      <h5>{title}</h5>
                      <p>{source}</p>
                      {link ? (
                        <a href={link} rel="nofollow noreferrer" target="_blank">
                          View credential
                          <span className="bootstrap-icon">
                            <BoxArrowUpRight size={16} className="ms-2" />
                          </span>
                        </a>
                      ) : (
                        <span className="d-inline-flex align-items-center gap-2">
                          <Spinner 
                            animation="grow" 
                            size="sm" 
                            role="status" 
                            aria-hidden="true"
                            className="in-progress-spinner"
                          />
                          <span>In progress</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </motion.section>

    </div>
  );
}

export default About;
