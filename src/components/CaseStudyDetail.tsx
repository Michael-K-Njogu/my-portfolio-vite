// src/pages/CaseStudyDetail.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Person, People, Nut } from 'react-bootstrap-icons';
import { Container } from 'react-bootstrap';
import ProjectNav from './ui/ProjectNav';
import LoadingSpinner from './ui/LoadingSpinner';
import { motion, useScroll, useSpring } from 'framer-motion';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

/* Contentful */
import { selectClient } from '../contentfulClient';
import { documentToReactComponents, Options as RichTextOptions } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { ContentfulLivePreview } from '@contentful/live-preview';
import { ContentfulLivePreviewProvider, useContentfulLiveUpdates } from '@contentful/live-preview/react';
import type { Document } from '@contentful/rich-text-types';

/* ---------------------------
   Types
   --------------------------- */
type ContentfulSys = { id?: string; [k: string]: any };

type ContentfulFile = {
  url?: string;
  details?: any;
  fileName?: string;
  contentType?: string;
};

type ContentfulAssetFields = {
  title?: string;
  description?: string;
  file?: ContentfulFile;
  [k: string]: any;
};

type CaseStudyFields = {
  title?: string;
  subtitle?: string;
  slug?: string;
  hasNda?: boolean;
  organization?: string;
  overview?: Document | null;
  overviewTitle?: string;
  context?: Document | null;
  contextTitle?: string;
  designProcess?: Document | null;
  processTitle?: string;
  results?: Document | null;
  resultsTitle?: string;
  takeaways?: Document | null;
  takeawaysTitle?: string;
  role?: string[] | null;
  team?: string[] | null;
  skills?: string[] | null;
  [k: string]: any;
};

type CaseStudyEntry = {
  sys: ContentfulSys;
  fields: CaseStudyFields;
};

/* ---------------------------
   Utilities
   --------------------------- */

const safeArray = <T,>(maybe?: T[] | null): T[] => (Array.isArray(maybe) ? maybe : []);

/* ---------------------------
   Component
   --------------------------- */

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudyEntry | null>(null);
  // liveEntry will be null in environments where live updates are not enabled; typings are loose here
  const liveEntry = useContentfulLiveUpdates(caseStudy as any) as CaseStudyEntry | null;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{ id: string; title: string }[]>([]);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Framer Motion scroll progress hook
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  // Read theme once (safe guard for SSR)
  useEffect(() => {
    try {
      setIsDark(typeof document !== 'undefined' && document.body.classList.contains('theme-dark'));
    } catch {
      setIsDark(false);
    }
  }, []);

  // Update document title when entry changes
  useEffect(() => {
    if (caseStudy?.fields?.title) {
      document.title = `${caseStudy.fields.title} – Michael Njogu`;
    } else {
      document.title = 'Michael Njogu - Strategic Product Designer';
    }

    return () => {
      document.title = 'Michael Njogu – Strategic Product Designer';
    };
  }, [caseStudy]);

  // Reset scroll & progress when slug changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // try to nudge scrollYProgress back toward 0 safely if available
    try {
      const current = scrollYProgress.get();
      // simple linear step back over ~400ms
      const duration = 400;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        scrollYProgress.set(current * (1 - t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } catch {
      // ignore when not available
    }
  }, [slug, scrollYProgress]);

  // Fetch case study entry from Contentful
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // safe preview detection
    const usePreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    const client = selectClient(usePreview);

    (async () => {
      try {
        const res = await client.getEntries?.({
          content_type: 'caseStudy',
          'fields.slug': slug,
          include: 10,
        });

        if (!mounted) return;

        const item = res?.items?.[0] as CaseStudyEntry | undefined;

        if (!item) {
          setError('Case study not found');
          setCaseStudy(null);
        } else {
          setCaseStudy(item);
        }
      } catch (err: any) {
        console.error('Contentful fetch error:', err);
        setError(err?.message ?? 'Failed to load case study');
        setCaseStudy(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Build headings for ProjectNav after content is rendered
  useEffect(() => {
    if (!loading && caseStudy) {
      try {
        // Find all h2 within .project-section
        const sectionHeadings = Array.from(document.querySelectorAll('.project-section h2')) as HTMLHeadingElement[];
        const newHeadings = sectionHeadings.map((el) => {
          const text = el.textContent?.trim() ?? '';
          const id = el.id || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          return { id, title: text || 'Section' };
        });

        // Ensure headings have unique IDs
        sectionHeadings.forEach((el, i) => {
          if (!el.id) el.id = newHeadings[i]?.id ?? `heading-${i}`;
        });

        setHeadings(newHeadings);
      } catch {
        setHeadings([]);
      }
    }
  }, [loading, caseStudy]);

  // Loading state
  if (loading) {
    return (
      <div className="wrapper">
        <LoadingSpinner 
          messages={[
            "Summoning the design magic...", 
            "Loading the case study canvas...", 
            "Preparing an exceptional UX experience...",
            "Taming the UX unicorn...please hold.",
            "Warming up the problem-solving engine...",
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
          <p className="p-6 text-danger" role="alert">
            {error}
          </p>
        </Container>
      </div>
    );
  }

  const entry = (liveEntry || caseStudy) as CaseStudyEntry | null;
  if (!entry) {
    return (
      <div className="wrapper">
        <Container>
          <p className="p-6 text-muted">No case study data.</p>
        </Container>
      </div>
    );
  }

  const {
    title,
    subtitle,
    hasNda,
    organization,
    overview,
    overviewTitle,
    team,
    role,
    skills,
    contextTitle,
    processTitle,
    resultsTitle,
    takeawaysTitle,
    context,
    designProcess,
    results,
    takeaways,
  } = entry.fields ?? ({} as CaseStudyFields);

  // Render options for Contentful Rich Text (stable function)
  const createRenderOptions = (entryId?: string, fieldId?: string): RichTextOptions => {
    return {
      renderNode: {
        [BLOCKS.HEADING_2]: (_node, children) => (
          <h2
            className="text-2xl font-semibold mt-6 mb-4"
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entryId && fieldId
              ? ContentfulLivePreview.getProps({ entryId, fieldId })
              : {})}
          >
            {children}
          </h2>
        ),

        [BLOCKS.HEADING_3]: (_node, children) => (
          <h3
            className="mb-3"
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entryId && fieldId
              ? ContentfulLivePreview.getProps({ entryId, fieldId })
              : {})}
          >
            {children}
          </h3>
        ),

        [BLOCKS.HEADING_4]: (_node, children) => (
          <h4
            className="mb-3"
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entryId && fieldId
              ? ContentfulLivePreview.getProps({ entryId, fieldId })
              : {})}
          >
            {children}
          </h4>
        ),

        [BLOCKS.PARAGRAPH]: (_node, children) => (
          <p
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entry.sys?.id && 'overview'
              ? ContentfulLivePreview.getProps({ entryId: entry.sys.id, fieldId: 'overview' })
              : {})}
          >
            {children}
          </p>
        ),

        [BLOCKS.TABLE]: (_node, children) => (
          <div className="table-container">
            <table className="case-study-table">
              <tbody>{children}</tbody>
            </table>
          </div>
        ),
        [BLOCKS.TABLE_ROW]: (_node, children) => <tr>{children}</tr>,
        [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => <th>{children}</th>,
        [BLOCKS.TABLE_CELL]: (_node, children) => (
          <td
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entry.sys?.id
              ? ContentfulLivePreview.getProps({ entryId: entry.sys.id, fieldId: fieldId ?? '' })
              : {})}
          >
            {children}
          </td>
        ),

        [BLOCKS.UL_LIST]: (_node, children) => (
          <ul
            className="custom-unordered-list"
            {...(typeof ContentfulLivePreview?.getProps === 'function' && entry.sys?.id
              ? ContentfulLivePreview.getProps({ entryId: entry.sys.id, fieldId: fieldId ?? '' })
              : {})}
          >
            {children}
          </ul>
        ),

        [BLOCKS.LIST_ITEM]: (node, _children) => {
          // Render list item's inner content while stripping paragraph wrappers
          const inner = Array.isArray(node.content)
            ? node.content.map((childNode, i) =>
                documentToReactComponents(childNode as any, {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_n, children) => <span key={`p-${i}`}>{children}</span>,
                    [BLOCKS.UL_LIST]: (_n, children) => <ul key={`ul-${i}`} className="nested-list">{children}</ul>,
                    [BLOCKS.OL_LIST]: (_n, children) => <ol key={`ol-${i}`} className="nested-list">{children}</ol>,
                  },
                })
              )
            : null;

          return (
            <li
              {...(typeof ContentfulLivePreview?.getProps === 'function' && entry.sys?.id
                ? ContentfulLivePreview.getProps({ entryId: entry.sys.id, fieldId: fieldId ?? '' })
                : {})}
              className="custom-list-item"
            >
              {inner}
            </li>
          );
        },

        [INLINES.HYPERLINK]: (node, children) => (
          <a href={(node as any).data?.uri} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),

        [BLOCKS.QUOTE]: (_node, children) => <blockquote className="custom-blockquote">{children}</blockquote>,

        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const target = (node as any)?.data?.target;
          const fields = target?.fields || {};
          const fileField: ContentfulFile | undefined = fields?.file;
          const title = fields?.title;
          const description = fields?.description;
          const rawUrl = fileField?.url;
          const imageUrl = rawUrl ? (rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl) : null;

          if (!imageUrl) {
            return (
              <figure>
                <div className="gallery-img w-full max-h-[500px] flex items-center justify-center bg-gray-100 text-gray-500">
                  Asset processing… it will appear here once ready.
                </div>
                {(title || description) && (
                  <figcaption className="text-sm text-gray-500 mt-2 text-center">
                    {description || title}
                  </figcaption>
                )}
              </figure>
            );
          }

          return (
            <figure>
              <Zoom>
                {/* Live preview props if available */}
                <img
                  {...(typeof ContentfulLivePreview?.getProps === 'function' && entry.sys?.id
                    ? ContentfulLivePreview.getProps({ entryId: entry.sys.id, fieldId: fieldId ?? '' })
                    : {})}
                  src={imageUrl}
                  alt={description || title || ''}
                  className="gallery-img w-full max-h-[500px] object-cover"
                />
              </Zoom>
              {(title || description) && (
                <figcaption className="text-sm text-gray-500 mt-2 text-center">{description || title}</figcaption>
              )}
            </figure>
          );
        },

        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          const embedded = (node as any)?.data?.target;
          if (!embedded) return null;
          const contentType = embedded.sys?.contentType?.sys?.id;
          const fields = embedded.fields || {};

          // Image gallery block
          if (contentType === 'imageGallery') {
            const { images = [], showCaptions } = fields as any;
            return (
              <section className="mt-10">
                <div className="image-grid">
                  {Array.isArray(images) &&
                    images.map((asset: any, i: number) => {
                      const file = asset?.fields?.file;
                      const fileUrl = file?.url ? (file.url.startsWith('//') ? `https:${file.url}` : file.url) : null;
                      const title = asset?.fields?.title;
                      const description = asset?.fields?.description;
                      return (
                        <div key={i} className="rounded-xl overflow-hidden shadow-md">
                          <figure className="mb-0 mt-0">
                            <Zoom>
                              {fileUrl ? (
                                <img src={fileUrl} alt={title || `Gallery image ${i + 1}`} className="gallery-img h-64 object-cover hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="gallery-img h-64 flex items-center justify-center bg-gray-100 text-gray-500">Asset processing…</div>
                              )}
                            </Zoom>

                            {showCaptions && (title || description) && (
                              <figcaption className="text-sm text-gray-500 mt-2 text-center">
                                {description || title}
                              </figcaption>
                            )}
                          </figure>
                        </div>
                      );
                    })}
                </div>
              </section>
            );
          }

          // fallback for unknown embedded entry types
          return <div className="bg-gray-100 p-4 rounded text-sm text-gray-600">Unknown embedded entry type</div>;
        },

        [INLINES.EMBEDDED_ENTRY]: (node) => {
          const embedded = (node as any)?.data?.target;
          if (!embedded) return null;
          const contentType = embedded.sys?.contentType?.sys?.id;
          const fields = embedded.fields || {};

          if (contentType === 'imageGallery') {
            const title = fields?.title;
            const media = fields?.media ?? [];
            const urls = Array.isArray(media)
              ? media.map((m: any) => {
                  const file = m?.fields?.file;
                  return file?.url ? (file.url.startsWith('//') ? `https:${file.url}` : file.url) : null;
                }).filter(Boolean)
              : [];

            if (!urls.length) return null;

            return (
              <span className="inline-block align-middle ml-2 mr-2">
                {title && <span className="block text-xs text-gray-500 mb-1">{title}</span>}
                <div className="inline-flex gap-2">
                  {urls.map((u: string, i: number) => (
                    <img key={i} src={u} alt={title || `Gallery thumbnail ${i + 1}`} className="w-16 h-16 object-cover rounded" loading="lazy" />
                  ))}
                </div>
              </span>
            );
          }

          return null;
        },
      },
    };
  };

  // Render rich text sections using our render options
  const renderRichText = (doc?: Document | null, fieldId?: string) => {
    if (!doc) return null;
    return documentToReactComponents(doc, createRenderOptions(entry.sys?.id, fieldId));
  };

  const safeRole = safeArray(role);
  const safeTeam = safeArray(team);
  const safeSkills = safeArray(skills);

  return (
    <ContentfulLivePreviewProvider locale="en-US" enableInspectorMode enableLiveUpdates>
      <div className="wrapper">
        <motion.div
          className="scroll-progress"
          style={{ scaleX, background: isDark ? '#60a5fa' : '#1e3a8a' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        <div className="project-header">
          <Container>
            <h1 className="project-title">{title}</h1>
            <p className="project-subtitle">{subtitle}</p>
            {hasNda && (
              <div className="disclaimer">
                To comply with my Non-Disclosure Agreement (NDA) with {organization}, I have omitted certain details in this case study.
              </div>
            )}
          </Container>
        </div>

        <ProjectNav previousPageName="All Projects" links={headings.map((h) => h.title)} />

        <section className="project-section-small bg-tertiary">
          <Container>
            <div className="project-overview">
              <div className="project-overview-card">
                <h5>
                  <span className="bootstrap-icon">
                    <Person size={24} />
                  </span>{' '}
                  My Role
                </h5>
                <ul>
                  {safeRole.map((item, i) => (
                    <li key={i}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-overview-card">
                <h5>
                  <span className="bootstrap-icon">
                    <People size={24} />
                  </span>{' '}
                  Team Composition
                </h5>
                <ul>
                  {safeTeam.map((member, i) => (
                    <li key={i}>
                      <span>{member}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-overview-card">
                <h5>
                  <span className="bootstrap-icon">
                    <Nut size={24} />
                  </span>{' '}
                  Skills &amp; Tools
                </h5>
                <ul>
                  {safeSkills.map((skill, i) => (
                    <li key={i}>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {overview && (
          <section className="project-section">
            <Container>
              <h2>{overviewTitle ?? 'Overview'}</h2>
              {renderRichText(overview, 'overview')}
            </Container>
          </section>
        )}

        {context && (
          <section className="project-section bg-secondary">
            <Container>
              <h2>{contextTitle ?? 'Context'}</h2>
              {renderRichText(context, 'context')}
            </Container>
          </section>
        )}

        {designProcess && (
          <section className="project-section">
            <Container>
              <h2>{processTitle ?? 'Process'}</h2>
              {renderRichText(designProcess, 'designProcess')}
            </Container>
          </section>
        )}

        {results && (
          <section className="project-section bg-secondary">
            <Container>
              <h2>{resultsTitle ?? 'Results'}</h2>
              {renderRichText(results, 'results')}
            </Container>
          </section>
        )}

        {takeaways && (
          <section className="project-section">
            <Container>
              <h2>{takeawaysTitle ?? 'Takeaways'}</h2>
              {renderRichText(takeaways, 'takeaways')}
            </Container>
          </section>
        )}
      </div>
    </ContentfulLivePreviewProvider>
  );
};

export default CaseStudyDetail;
