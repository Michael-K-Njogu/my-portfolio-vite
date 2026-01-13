// src/pages/AllCaseStudies.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from './ui/Hero';
import LoadingSpinner from './ui/LoadingSpinner';
import { selectClient } from '../contentfulClient';
import { ContentfulLivePreview } from '@contentful/live-preview';
import { Stars } from 'react-bootstrap-icons';

/* ----------------------
   Types
   ---------------------- */
type ContentfulSys = {
  id?: string;
  [k: string]: any;
};

type ContentfulFile = {
  url?: string;
  details?: any;
  fileName?: string;
  contentType?: string;
};

type ContentfulAssetFields = {
  title?: string;
  file?: ContentfulFile;
  [k: string]: any;
};

type CaseStudyFields = {
  title?: string;
  subtitle?: string;
  slug?: string;
  isFeatured?: boolean;
  featuredImage?: { fields?: ContentfulAssetFields };
  skills?: string[] | Array<{ sys?: ContentfulSys; fields?: any }>;
  [k: string]: any;
};

type CaseStudyEntry = {
  sys: ContentfulSys;
  fields: CaseStudyFields;
};

/* ----------------------
   Utilities
   ---------------------- */

/**
 * Normalize Contentful file/asset shapes or strings to a usable URL (or null).
 */
const toAssetUrl = (maybeFile?: string | { fields?: { file?: ContentfulFile } } | ContentfulFile | null): string | null => {
  if (!maybeFile) return null;

  // If string (rare), assume it's already a url
  if (typeof maybeFile === 'string') {
    const url = maybeFile;
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  }

  // If it's an asset shape
  const file = (maybeFile as any).fields?.file ?? (maybeFile as any).file ?? (maybeFile as any);
  const url = file?.url ?? null;
  if (typeof url !== 'string') return null;
  if (url.startsWith('//')) return `https:${url}`;
  return url;
};

const safeArray = <T,>(maybe: T[] | undefined | null): T[] => (Array.isArray(maybe) ? maybe : []);

/* ----------------------
   Component
   ---------------------- */

const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'featured' | 'other'>('featured');

  // SSR-safe preview detection
  const usePreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const client = selectClient(usePreview);

    (async () => {
      try {
        const response = await client.getEntries?.({
          content_type: 'caseStudy',
          order: ['fields.order'],
        });

        if (!mounted) return;

        if (response?.items && Array.isArray(response.items)) {
          setCaseStudies(response.items as CaseStudyEntry[]);
        } else {
          setCaseStudies([]);
        }
      } catch (err: any) {
        console.error('Error fetching case studies:', err);
        if (mounted) setError(err?.message ?? 'Failed to load case studies.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [usePreview]);

  // Filtering logic (memoized)
  const filteredStudies = useMemo(() => {
    return caseStudies.filter((item) => {
      const isFeatured = !!item?.fields?.isFeatured;
      return filter === 'featured' ? isFeatured : !isFeatured;
    });
  }, [caseStudies, filter]);

  // Helper to resolve skill text (handles strings and reference shapes)
  const resolveSkills = useCallback((raw: CaseStudyFields['skills']) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((s) => {
        if (typeof s === 'string') return s;
        return s?.fields?.name ?? s?.fields?.title ?? String(s?.sys?.id ?? '');
      });
    }
    return [];
  }, []);

  // Render item safe values
  const renderImageUrl = (assetRef?: CaseStudyFields['featuredImage']) => {
    const url = toAssetUrl(assetRef?.fields?.file ?? assetRef);
    return url ?? undefined;
  };

  return (
    <div className="wrapper">
      <Hero />

      <section className="content-section pt-0" id="my-work">
        <Container>
          <div className="project-filters d-flex" role="tablist" aria-label="Project filters">
            <button
              onClick={() => setFilter('featured')}
              className={`btn btn-rounded ${filter === 'featured' ? 'filter-active' : 'filter-inactive'}`}
              aria-pressed={filter === 'featured'}
            >
              <span className="bootstrap-icon me-1" aria-hidden>
                <Stars size={24} />
              </span>
              Featured Case Studies
            </button>

            <button
              onClick={() => setFilter('other')}
              className={`btn btn-rounded ${filter === 'other' ? 'filter-active' : 'filter-inactive'}`}
              aria-pressed={filter === 'other'}
            >
              Other Initiatives
            </button>
          </div>

          <h2 className="section-title mb-3">
            {filter === 'featured' ? 'Featured Case Studies' : 'Other Initiatives'}
          </h2>

          <p className="mb-4 mb-md-5">
            A selection of projects showcasing my approach to strategic product design, user experience, and problem-solving across various contexts.
          </p>

          {loading && <LoadingSpinner messages={[
            "Loading case studies...",
            "Gathering insights and stories...",
            "Warming up the project gallery...",
            "Preparing the design showcase...",
            "Fetching design adventures..."  
          ]} />}
          {!loading && error && <p className="text-danger">Error: {error}</p>}
          {!loading && !error && caseStudies.length === 0 && <p>No projects found.</p>}

          {filteredStudies.map((item) => {
            const id = item.sys?.id ?? `case-${Math.random().toString(36).slice(2, 9)}`;
            const fields = item.fields ?? ({} as CaseStudyFields);
            const title = fields.title ?? 'Untitled project';
            const subtitle = fields.subtitle ?? '';
            const slug = fields.slug ?? (typeof title === 'string' ? title.toLowerCase().replace(/\s+/g, '-') : id);
            const imageUrl = renderImageUrl(fields.featuredImage);
            const skills = resolveSkills(fields.skills);

            // Contentful Live Preview props (safe-guarded)
            const titleProps =
              typeof ContentfulLivePreview?.getProps === 'function'
                ? ContentfulLivePreview.getProps({ entryId: item.sys.id, fieldId: 'title' })
                : {};
            const subtitleProps =
              typeof ContentfulLivePreview?.getProps === 'function'
                ? ContentfulLivePreview.getProps({ entryId: item.sys.id, fieldId: 'subtitle' })
                : {};

            return (
              <div
                key={id}
                className="project-item align-items-center mb-5 d-flex flex-column flex-md-row"
              >
                {/* Project Image */}
                <div className="project-item-img me-md-4 mb-md-0">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/case-studies/${slug}`}>
                      {imageUrl ? (
                        <img
                          fetchPriority="high"
                          src={imageUrl}
                          alt={fields.featuredImage?.fields?.title ?? 'Project thumbnail'}
                          className="img-fluid shadow-sm"
                        />
                      ) : (
                        <div
                          style={{
                            width: 320,
                            height: 180,
                            background: '#f3f3f3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          aria-hidden
                        >
                          <span className="text-muted">No image</span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                </div>

                {/* Project Info */}
                <div className="project-item-info">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 {...(titleProps as any)}>
                      <Link to={`/case-studies/${slug}`}>{title}</Link>
                    </h3>
                    <p {...(subtitleProps as any)}>{subtitle}</p>

                    {skills.length > 0 && (
                      <ul className="categories">
                        {skills.map((skill, i) => (
                          <li key={i}>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </Container>
      </section>
    </div>
  );
};

export default CaseStudies;
