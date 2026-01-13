// src/pages/Profile.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { motion, Variants } from 'framer-motion';
import Avatar from '../images/michael-njogu.jpg';
import AnimeAvatar from '../images/michael-anime.jpg';
import Resume from '../docs/Michael_Njogu_CV_Latest.pdf';
import { BoxArrowUpRight, ArrowUpRight, Download } from 'react-bootstrap-icons';
import Timeline from '../components/ui/Timeline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { selectClient } from '../contentfulClient';

/* ----------------------
   Types
   ---------------------- */
type Maybe<T> = T | null | undefined;

type ContentfulSys = {
  id?: string;
  [k: string]: any;
};

type ContentfulFileLike = {
  url?: string;
  [k: string]: any;
};

type ContentfulReference<T = any> = {
  sys?: ContentfulSys;
  fields?: T;
};

type ToolItem = {
  id: string;
  name: string;
  desc?: string;
  iconUrl?: string | null;
  inverted?: boolean;
};

type ExperienceItem = {
  id?: string | number | null;
  date: string;
  title: string;
  description?: string;
  type?: string;
  importance?: string;
  organizationLogo?: any;
};

type CertificationItem = {
  id?: string | number | null;
  title?: string;
  institution?: string;
  dateAttained?: string;
  credentialUrl?: string;
  inProgress?: boolean;
  iconUrl?: string | null;
  inverted?: boolean;
};

/* ----------------------
   Animation Variants
   ---------------------- */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ----------------------
   Fallback Data
   ---------------------- */
const FALLBACK_LEARNING: CertificationItem[] = [
  {
    id: 'iaap-member',
    title: 'IAAP - Professional Member',
    institution: 'International Association of Accessibility Professionals',
    credentialUrl:
      'https://www.credly.com/badges/5fec40f7-8cdf-4839-87db-8d685129632f/public_url',
    iconUrl: './images/profile/iaap-member.png',
    inverted: false,
  },
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

const FALLBACK_TOOLS: ToolItem[] = [
  {
    id: 'figma',
    name: 'Figma',
    iconUrl: './images/profile/figma.png',
    desc: 'User interface design & prototyping',
    inverted: false,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    iconUrl: './images/profile/vscode.png',
    desc: 'Code editing & development',
    inverted: false,
  },
  {
    id: 'react',
    name: 'React',
    iconUrl: './images/profile/react.png',
    desc: 'Building user interfaces',
    inverted: false,
  },
];

/* ----------------------
   Utilities
   ---------------------- */

/**
 * Normalize a Contentful file-like object or string to an absolute URL (or null)
 */
const toAssetUrl = (maybeFile?: string | ContentfulFileLike | null): string | null => {
  if (!maybeFile) return null;

  let url: unknown;
  if (typeof maybeFile === 'string') {
    url = maybeFile;
  } else if (typeof maybeFile === 'object') {
    // contentful shape variations
    url =
      (maybeFile as any).url ??
      (maybeFile as any).fields?.file?.url ??
      (maybeFile as any).fields?.file?.url ??
      null;
  } else {
    return null;
  }

  if (typeof url !== 'string') return null;
  if (url.startsWith('//')) return `https:${url}`;
  // contentful sometimes returns /https:... (rare) or absolute already
  if (url.startsWith('/')) return url;
  return url;
};

/**
 * Lightweight check whether a url is internal (starts with "/" or matches origin)
 */
const isInternalPath = (url?: Maybe<string>): boolean => {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('/')) return true;
  if (typeof window === 'undefined') return false;
  try {
    return url.startsWith(window.location.origin);
  } catch {
    return false;
  }
};

/* ----------------------
   Component
   ---------------------- */
const About: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<ContentfulReference<any> | null>(null);

  // Derived values memoized to avoid recompute on every render
  const {
    heroTitle,
    heroSubtitle,
    heroLink1Label,
    heroLink1Url,
    heroLink2Label,
    heroLink2Url,
    skills,
    tools,
    experience,
    hasExperience,
    certifications,
  } = useMemo(() => {
    const fields = aboutData?.fields ?? ({} as any);

    const heroTitle = fields.aboutHeroTitle ?? 'About Me.';
    const heroSubtitle =
      fields.aboutHeroSubtitle ??
      "I learn by doing, exploring possibilities, experimenting with solutions, and adapting as I discover what works.";
    const heroLink1Label = fields.aboutHeroPrimaryLinkLabel ?? 'View my work';
    const heroLink1Url = fields.aboutHeroPrimaryLinkUrl ?? '/';
    const heroLink2Label = fields.uploadResumeTitle ?? 'Download my resume';
    const heroLink2Url = toAssetUrl(fields.uploadResume) ?? Resume;

    // skills
    const skillsRaw: string[] | undefined = fields.coreSkills;
    const skills = Array.isArray(skillsRaw) && skillsRaw.length > 0 ? skillsRaw : FALLBACK_SKILLS;

    // tools mapping
    const toolsRaw: any[] | undefined = fields.coreTools;
    const tools: ToolItem[] =
      Array.isArray(toolsRaw) && toolsRaw.length > 0
        ? toolsRaw
            .map((t) => {
              try {
                const id = t.sys?.id ?? t.fields?.toolName ?? JSON.stringify(t);
                const name = t.fields?.toolName ?? 'Tool';
                const desc = t.fields?.toolPurpose ?? undefined;
                const iconUrl = toAssetUrl(t.fields?.toolIcon);
                const inverted = !!t.fields?.toolIconInverted;
                return { id, name, desc, iconUrl, inverted } as ToolItem;
              } catch {
                return null;
              }
            })
            .filter(Boolean) as ToolItem[]
        : FALLBACK_TOOLS;

    // experience mapping
    const expRaw: any[] | undefined = fields.experience;
    const experience: ExperienceItem[] =
      Array.isArray(expRaw) && expRaw.length > 0
        ? expRaw
            .map((e) => {
              try {
                const jobTitle = e.fields?.jobTitle ?? '';
                const organization = e.fields?.organization ?? '';
                const title = organization ? `${jobTitle}${jobTitle ? ', ' : ''}${organization}` : jobTitle || 'Untitled Position';
                return {
                  id: e.sys?.id,
                  date: e.fields?.duration ?? 'Date not specified',
                  title,
                  description: e.fields?.jobDescription ?? '',
                  type: 'professional',
                  importance: e.fields?.importance ?? 'standard',
                  organizationLogo: e.fields?.organizationLogo,
                } as ExperienceItem;
              } catch {
                return null;
              }
            })
            .filter(Boolean) as ExperienceItem[]
        : [];

    const hasExperience = experience.length > 0;

    // certifications mapping
    const certsRaw: any[] | undefined = fields.certifications;
    const certifications: CertificationItem[] =
      Array.isArray(certsRaw) && certsRaw.length > 0
        ? certsRaw
            .map((c) => {
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
                } as CertificationItem;
              } catch {
                return null;
              }
            })
            .filter(Boolean) as CertificationItem[]
        : [];

    return {
      heroTitle,
      heroSubtitle,
      heroLink1Label,
      heroLink1Url,
      heroLink2Label,
      heroLink2Url,
      skills,
      tools,
      experience,
      hasExperience,
      certifications,
    };
  }, [aboutData]);

  useEffect(() => {
    document.title = 'Michael Njogu - Strategic Product Designer';
  }, []);

  const handleAvatarFlip = useCallback(() => {
    setIsFlipped((p) => !p);
  }, []);

  // Fetch contentful "aboutPage"
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const previewSearch = typeof window !== 'undefined' ? window.location.search : '';
    const usePreview = previewSearch.includes('preview=true');
    const client = selectClient(usePreview);

    (async () => {
      try {
        const res = await client.getEntries?.({
          content_type: 'aboutPage',
          include: 10,
          limit: 1,
        });

        if (!mounted) return;

        if (res?.items?.length) {
          setAboutData(res.items[0]);
        } else {
          setAboutData(null); // will cause fallbacks to be used
        }
      } catch (err: any) {
        console.error('Error fetching About page from Contentful:', err);
        if (mounted) {
          setError(
            err?.message ? `Failed to load About page: ${err.message}` : 'Failed to load About page.'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="wrapper">
        <LoadingSpinner 
          messages={[
            "Spinning up the UX backstory engine...",
            "Collecting design sparkles and origin stories...",
            "Unveiling the design journey...",
            "Activating designer lore...",
            "Warming up the fun facts..."
          ]} 
          minHeight="100vh"
        />
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

  const hero2IsPdfPath = typeof heroLink2Url === 'string' && heroLink2Url.endsWith('.pdf');

  return (
    <div className="wrapper">
      {/* Hero Section */}
      <section className="hero bg-secondary">
        <Container>
          <Row className="align-items-center">
            <Col md={9}>
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="hero-text">
                <h1 className="hero-title">{heroTitle}</h1>
                <p className="mb-4">{heroSubtitle}</p>

                <div className="hero-buttons d-flex flex-column flex-md-row gap-2 gap-md-3">
                  <motion.div>
                    {isInternalPath(heroLink1Url) ? (
                      <Button variant="primary" as={Link as any} to={heroLink1Url} className="d-inline-flex align-items-center ms-0">
                        {heroLink1Label}
                        <span className="bootstrap-icon ms-1">
                          <ArrowUpRight size={24} />
                        </span>
                      </Button>
                    ) : (
                      <Button variant="primary" href={heroLink1Url} className="d-inline-flex align-items-center ms-0" target="_blank" rel="noopener noreferrer">
                        {heroLink1Label}
                        <span className="bootstrap-icon ms-1">
                          <ArrowUpRight size={24} />
                        </span>
                      </Button>
                    )}
                  </motion.div>

                  <motion.div>
                    {/* Prefer absolute links to resume assets; fallback to bundled Resume */}
                    <Button
                      href={heroLink2Url ?? Resume}
                      variant="outline-secondary"
                      className="d-inline-flex align-items-center ms-0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heroLink2Label}
                      <span className="bootstrap-icon ms-1">
                        <Download size={24} />
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </Col>

            <Col md={3}>
              <div className="avatar-flip-container" onClick={handleAvatarFlip} role="button" aria-label="Flip avatar">
                <motion.div
                  className="avatar-flip-inner"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{ position: 'relative' }}
                >
                  <motion.img
                    src={Avatar}
                    alt="Michael Njogu"
                    className="avatar-front hero-image"
                    style={{ backfaceVisibility: 'hidden', width: '100%', height: 'auto', display: 'block' }}
                  />
                  <motion.img
                    src={AnimeAvatar}
                    alt="Anime Michael"
                    className="avatar-back hero-image"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
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
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="skills-container">
            <motion.div variants={fadeInUp} className="skill-list mb-5">
              <h3 className="mb-4">Key Skills</h3>
              <ul>
                {skills.map((skill, idx) => (
                  <motion.li key={`${String(skill)}-${idx}`} className="skill-chip" variants={fadeInUp}>
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
                        <img src={tool.iconUrl} alt={`${tool.name} icon`} className={tool.inverted ? 'inverted' : ''} />
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
      <motion.section className="content-section bg-secondary" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Container>
          <h2>Work Experience</h2>
          <Timeline items={hasExperience ? experience : undefined} />
          {!hasExperience && <p className="text-muted mt-4">Experience highlights are being updated—check back soon.</p>}
        </Container>
      </motion.section>

      {/* Learning & Certifications */}
      <motion.section className="content-section" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Container>
          <h2 className="section-title">Learning &amp; Certifications</h2>
          <div className="learning-cards">
            {(certifications && certifications.length ? certifications : FALLBACK_LEARNING).map((cert) => {
              const key = cert.id ?? cert.title ?? JSON.stringify(cert);
              const title = cert.title ?? 'Certification';
              const source = cert.institution ?? 'Independent study';
              const dateAttained = cert.dateAttained ?? 'Date not specified';
              const link = cert.inProgress ? null : cert.credentialUrl ?? null;
              const icon = cert.iconUrl ?? null;
              const alt = `${title} badge`;
              const inverted = cert.inverted ?? false;
              const inProgress = cert.inProgress ?? false;

              return (
                <motion.div key={key} variants={fadeInUp}>
                  <div className="learning-card">
                    <div className="learning-card-img">
                      {icon ? <img src={icon} alt={alt} className={inverted ? 'inverted' : ''} /> : <div style={{ width: 64, height: 64, background: '#f3f3f3' }} />}
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
                          <Spinner animation="grow" size="sm" role="status" aria-hidden="true" className="in-progress-spinner" />
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
};

export default About;
