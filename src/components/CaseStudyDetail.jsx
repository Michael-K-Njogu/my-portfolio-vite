import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Person, People, Nut } from 'react-bootstrap-icons';
import { Container } from 'react-bootstrap';
import ProjectNav from './ui/ProjectNav';
import { motion, useScroll, useSpring } from 'framer-motion'; // <-- added
import Zoom from 'react-medium-image-zoom'
import "react-medium-image-zoom/dist/styles.css";

/* Contentful */
import { selectClient } from '../contentfulClient'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { ContentfulLivePreview } from '@contentful/live-preview';
import { ContentfulLivePreviewProvider, useContentfulLiveUpdates } from '@contentful/live-preview/react';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const liveEntry = useContentfulLiveUpdates(caseStudy);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (caseStudy?.fields?.title) {
      document.title = `${caseStudy.fields.title} – Michael Njogu`;
    } else {
      document.title = "Michael Njogu - Strategic Product Designer";
    }

    // Optional cleanup: reset when unmounting
    return () => {
      document.title = "Michael Njogu – Strategic Product Designer";
    };
  }, [caseStudy]);    

  // theme detection for loader color (reads once on mount)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    try {
      setIsDark(Boolean(document.body.classList.contains('theme-dark')));
    } catch (e) {
      setIsDark(false);
    }
  }, []);

  // Framer Motion scroll progress hook
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  // ✅ Smoothly reset scroll + progress bar when slug changes
  useEffect(() => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate the progress bar reset to 0
    const resetAnimation = async () => {
      // Immediately set spring control to its current value
      const currentValue = scrollYProgress.get();

      // Use a springy reset animation
      const duration = 0.5; // seconds
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = (time - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const eased = 1 - (1 - t) * (1 - t);
        const newValue = currentValue * (1 - eased);
        scrollYProgress.set(newValue);

        if (t < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    resetAnimation();
  }, [slug, scrollYProgress]);

  useEffect(() => {

    let mounted = true;
    setLoading(true);
    setError(null);    

    // Determine if preview mode is enabled
    const usePreview = window.location.search.includes('preview=true');
    const client = selectClient(usePreview);

    client
      .getEntries({
        content_type: 'caseStudy',
        'fields.slug': slug,
        include: 10,  
      })
      .then((response) => {
        if (!mounted) return;
        const item = response?.items?.[0];
        if (!item) {
          setError('Case study not found');
          setCaseStudy(null);
        } else {
          setCaseStudy(item);
        }
      })
      .catch((err) => {
        console.error('Contentful fetch error:', err);
        setError('Failed to load case study');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]); 

useEffect(() => {
  if (!loading && caseStudy) {
    // Find all <h2> inside .project-section
    const sectionHeadings = Array.from(document.querySelectorAll(".project-section h2"));
    const newHeadings = sectionHeadings.map((el) => ({
      id: el.id || el.textContent.toLowerCase().replace(/\s+/g, "-"),
      title: el.textContent.trim(),
    }));

    // Ensure headings have unique IDs (for anchor links)
    sectionHeadings.forEach((el, i) => {
      if (!el.id) el.id = newHeadings[i].id;
    });

    setHeadings(newHeadings);
  }
}, [loading, caseStudy]);  

  // REPLACED TEXT LOADER WITH ANIMATED LOADER (theme-aware)
  if (loading) {
    const dotColor = isDark ? '#1e3a8a' : '#3b82f6'; // light gray in dark mode, bootstrap blue in light
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[0,1,2].map(i => (
            <motion.span
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 12,
                background: dotColor,
                display: 'inline-block'
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [1, 0.6, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                delay: i * 0.12,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 12, color: isDark ? '#d1d5db' : '#374151', fontSize: 14 }}>
          <span className="loading">Loading case study…</span>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  const entry = liveEntry || caseStudy;
  if (!entry) return <p className="p-6 text-gray-500">No case study data.</p>;

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
    takeaways
  } = entry.fields;

  // Optional: customize how specific elements render
  const createRenderOptions = (entryId, fieldId) => ({
    renderNode: {      

        // Custom rendering for headings to add classes and IDs
        [BLOCKS.HEADING_2]: (node, children) => {
          return (
            <h2 
              className="text-2xl font-semibold mt-6 mb-4"
              {...ContentfulLivePreview.getProps({ entryId, fieldId })}
            >
              {children}
            </h2>
          );
        },

        // Additional heading levels
        [BLOCKS.HEADING_3]: (node, children) => {
          return (
            <h3 
              className="mb-3"
              {...ContentfulLivePreview.getProps({ entryId, fieldId })}
            >
              {children}
            </h3>
          );
        },      

        // Added H4 styling
        [BLOCKS.HEADING_4]: (node, children) => {
          return (
            <h4 
              className="mb-3"
              {...ContentfulLivePreview.getProps({ entryId, fieldId })}
            >
              {children}
            </h4>
          );
        },        
        
        // Paragraphs
        [BLOCKS.PARAGRAPH]: (node, children) => {
          return (
            <p {...ContentfulLivePreview.getProps({ entryId, fieldId })}>
              {children}
            </p>
          )
        },

        // Handle tables from Contentful Rich Text
        [BLOCKS.TABLE]: (node, children) => (
          <div className="table-container">
            <table className="case-study-table">
              <tbody>{children}</tbody>
            </table>
          </div>
        ),

        [BLOCKS.TABLE_ROW]: (node, children) => (
          <tr>
            {children}
          </tr>
        ),

        [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
          <th>
            {children}
          </th>
        ),

        [BLOCKS.TABLE_CELL]: (node, children) => (
          <td
            {...(entryId
              ? ContentfulLivePreview.getProps({ entryId })
              : {})}
          >
            {children}
          </td>
        ),        

        // Unordered Lists
        [BLOCKS.UL_LIST]: (node, children) => {
          return (
            <ul 
              {...ContentfulLivePreview.getProps({ entryId, fieldId })} 
              className="custom-unordered-list"
            >
              {children}
            </ul>
          )
        },       
        
        [BLOCKS.LIST_ITEM]: (node, children) => {
          // Safely render child nodes inside <li>
          const innerContent = node.content.map((childNode, i) =>
            documentToReactComponents(childNode, {
              renderNode: {
                // Remove <p> inside <li>
                [BLOCKS.PARAGRAPH]: (_node, children) => (
                  <span key={`p-${i}`}>{children}</span>
                ),

                // Handle nested unordered lists correctly
                [BLOCKS.UL_LIST]: (_node, children) => (
                  <ul key={`ul-${i}`} className="nested-list">
                    {children}
                  </ul>
                ),

                // Handle nested ordered lists correctly
                [BLOCKS.OL_LIST]: (_node, children) => (
                  <ol key={`ol-${i}`} className="nested-list">
                    {children}
                  </ol>
                ),
              },
            })
          );

          // Apply live preview props only to the top-level <li>
          return (
            <li
              {...ContentfulLivePreview.getProps({
                entryId,
                fieldId,
              })}
              className="custom-list-item"
            >
              {innerContent}
            </li>
          );
        },    

        // Inline hyperlinks
        [INLINES.HYPERLINK]: (node, children) => (
          <a
            href={node.data.uri}
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        // Blockquotes
        [BLOCKS.QUOTE]: (node, children) => (
          <blockquote className="custom-blockquote">
            {children}
          </blockquote>
        ),

        // Embedded Assets (images)
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const target = node?.data?.target;
        const fields = target?.fields || {};
        const fileField = fields?.file;
        const title = fields?.title;
        const description = fields?.description;

        // url can be undefined while an asset is still processing in Preview
        const rawUrl = fileField?.url;
        const imageUrl = rawUrl
          ? (rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl)
          : null;

        // Gracefully handle assets that are not fully processed yet
        if (!imageUrl) {
          return (
            <figure>
              <div
                className="gallery-img w-full max-h-[500px] flex items-center justify-center bg-gray-100 text-gray-500"
                {...ContentfulLivePreview.getProps({ entryId, fieldId })}
              >
                Asset processing… it will appear here once ready.
              </div>
              {(title || description) && (
                <figcaption
                  {...ContentfulLivePreview.getProps({ entryId, fieldId })}
                  className="text-sm text-gray-500 mt-2 text-center"
                >
                  {description || title}
                </figcaption>
              )}
            </figure>
          );
        }

        return (
          <figure>
            <Zoom>
              <img
                {...ContentfulLivePreview.getProps({ entryId, fieldId })}
                src={imageUrl}
                alt={description || title}
                className="gallery-img w-full max-h-[500px] object-cover"
              />
            </Zoom>
            {(title || description) && (
              <figcaption
                {...ContentfulLivePreview.getProps({ entryId, fieldId })}
                className="text-sm text-gray-500 mt-2 text-center"
              >
                {description || title}
              </figcaption>
            )}
          </figure>
        );
        },  

        // Embedded Entries (blocks)
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          const entry = node.data?.target;
          if (!entry) {
            console.warn("Missing entry data:", node);
            return null;
          }

          const contentType = entry.sys?.contentType?.sys?.id;
          const fields = entry.fields || {};

        // Handle Image Gallery (block)
        if (contentType === "imageGallery") {
          const { images, showCaptions } = fields; // ✅ include the new boolean field

          return (
            <section
              className="mt-10"
              {...ContentfulLivePreview.getProps({
                entryId: entry.sys.id,
                fieldId: "images",
              })}
            >
              <div className="image-grid">
                {images?.map((asset, i) => {
                  const { file, title, description } = asset.fields;
                  const imageUrl = file?.url?.startsWith("//")
                    ? `https:${file.url}`
                    : file.url;

                  return (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden shadow-md"
                      {...ContentfulLivePreview.getProps({
                        entryId: asset.sys.id,
                        fieldId: "file",
                      })}
                    >
                      <figure className="mb-0 mt-0">
                        <Zoom>
                          <img
                            src={imageUrl}
                            alt={title || `Gallery image ${i + 1}`}
                            className="gallery-img h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Zoom>

                        {/* ✅ Conditionally render captions */}
                        {showCaptions && (title || description) && (
                          <figcaption
                            className="text-sm text-gray-500 mt-2 text-center"
                            {...ContentfulLivePreview.getProps({
                              entryId: asset.sys.id,
                              fieldId: description ? "description" : "title",
                            })}
                          >
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


          // Handle fallback
          return (
            <div className="bg-gray-100 p-4 rounded text-sm text-gray-600">
              Unknown embedded entry type
            </div>
          );
        },
        
        [INLINES.EMBEDDED_ENTRY]: (node) => {
          const entry = node.data?.target;
          if (!entry) return null;

          const contentType = entry.sys?.contentType?.sys?.id;
          const fields = entry.fields || {};

          // Handle Image Gallery (inline thumbnails)
          if (contentType === "imageGallery") {
            const { title, media } = fields;
            const urls = media
              ?.map((m) => {
                const file = m?.fields?.file;
                return file?.url ? (file.url.startsWith("//") ? `https:${file.url}` : file.url) : null;
              })
              .filter(Boolean);

            if (!urls?.length) return null;

            return (
              <span className="inline-block align-middle ml-2 mr-2">
                {title && <span className="block text-xs text-gray-500 mb-1">{title}</span>}
                <div className="inline-flex gap-2">
                  {urls.map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt={title || `Gallery thumbnail ${i + 1}`}
                      className="w-16 h-16 object-cover rounded"
                      loading="lazy"
                    />
                  ))}
                </div>
              </span>
            );
          }

          return null;
        },
                
    }, // end renderNode
  }); // end options 

return (
  <ContentfulLivePreviewProvider locale="en-US" enableInspectorMode enableLiveUpdates>
    <div className="wrapper">

      {/* 🔹 Scroll progress bar */}
      <motion.div 
        className="scroll-progress" 
        style={{ scaleX, background: isDark ? '#60a5fa' : '#1e3a8a' }} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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

            <ProjectNav previousPage="/" previousPageName="All Projects" links={headings.map((h) => h.title)} />       

            <section className="project-section-small bg-tertiary">
                <Container>
                    <div className="project-overview">
                            <div className="project-overview-card">
                                <h5><span className="bootstrap-icon"><Person size={24} /></span> My Role</h5>
                                    <ul>
                                        {role.map((item, i) => (
                                            <li key={i}><span>{item}</span></li>
                                        ))}
                                    </ul>
                            </div>
                            <div className="project-overview-card">
                                    <h5><span className="bootstrap-icon"><People size={24} /></span> Team Composition</h5>
                                    <ul>
                                        {team.map((member, i) => (
                                            <li key={i}><span>{member}</span></li>
                                        ))}
                                    </ul>
                            </div>         
                            <div className="project-overview-card">
                                    <h5><span className="bootstrap-icon"><Nut size={24} /></span> Skills &amp; Tools</h5>
                                    <ul>
                                        {skills.map((skill, i) => (
                                            <li key={i}><span>{skill}</span></li>
                                        ))}
                                    </ul>
                            </div>                       
                    </div>                  
                </Container>
        </section>

        {overview && (
            <section className="project-section">
                <Container>
                    <h2>{overviewTitle ? overviewTitle : "Overview"}</h2>
                    {documentToReactComponents(overview, createRenderOptions(entry.sys.id, "overview"))}
                </Container>
            </section>
        )}        

        {context && (
            <section className="project-section bg-secondary">
                <Container>
                    <h2>{contextTitle ? contextTitle : "Context"}</h2>
                    {documentToReactComponents(context, createRenderOptions(entry.sys.id, "context"))}
                </Container>
            </section>
        )}

        {designProcess && (
            <section className="project-section">
                <Container>
                    <h2>{processTitle ? processTitle : "Process"}</h2>
                    {documentToReactComponents(designProcess, createRenderOptions(entry.sys.id, "designProcess"))}
                </Container>
            </section>
        )}

        {results && (
            <section className="project-section bg-secondary">
                <Container>
                    <h2>{resultsTitle ? resultsTitle : "Results"}</h2>
                    {documentToReactComponents(results, createRenderOptions(entry.sys.id, "results"))}
                </Container>
            </section>
        )}      

        {takeaways && (
            <section className="project-section">
                <Container>
                    <h2>{takeawaysTitle ? takeawaysTitle : "Takeaways"}</h2>
                    {documentToReactComponents(takeaways, createRenderOptions(entry.sys.id, "takeaways"))}
                </Container>
            </section>
        )}

    </div>
  </ContentfulLivePreviewProvider>
);
};

export default CaseStudyDetail;
