import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Hero from './ui/Hero'
import { selectClient } from '../contentfulClient'
import { ContentfulLivePreview } from '@contentful/live-preview';
import { Stars } from 'react-bootstrap-icons'

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("featured"); // default filter

  // Filter the case studies
  const filteredStudies = caseStudies.filter((item) => {
    const isFeatured = item.fields.isFeatured; // assuming this is a boolean field in Contentful
    return filter === "featured" ? isFeatured : !isFeatured;
  });  

  // Determine if preview mode is enabled
  const usePreview = window.location.search.includes('preview=true');

  useEffect(() => {
    
    const client = selectClient(usePreview);
    const fetchEntries = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'caseStudy', // your content type ID in Contentful
          order: 'fields.order', // order by 'order' field,
        });

        if (response && response.items) {
          setCaseStudies(response.items);
        }
      } catch (err) {
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [usePreview]);
  
  return (
    <div className="wrapper">
      <Hero />

      <section className="content-section pt-0" id="my-work">
        <Container>

        <div className="project-filters d-flex">
        <button
          onClick={() => setFilter("featured")}
          className={`btn btn-rounded ${
            filter === "featured"
              ? "filter-active"
              : "filter-inactive"
          }`}
        >
          <span className="bootstrap-icon me-1"><Stars size={24} /></span>
          Featured Case Studies
        </button>

        <button
          onClick={() => setFilter("other")}
          className={`btn btn-rounded ${
            filter === "other"
              ? "filter-active"
              : "filter-inactive"
          }`}
        >
          Other Initiatives
        </button>
      </div>
      <h2 className="section-title mb-3">{filter === "featured" ? "Featured Case Studies" : "Other Initiatives"}</h2>

      <p className="mb-4 mb-md-5">
        A selection of projects showcasing my approach to strategic product design, user experience, and problem-solving across various contexts.
      </p>

          {loading && <p>Loading projects...</p>}
          {!loading && caseStudies.length === 0 && <p>No projects found.</p>}

        {filteredStudies.map((item) => {
          const { id, title, subtitle, featuredImage, slug, skills } = item.fields;

          const titleProps = ContentfulLivePreview.getProps({
            entryId: item.sys.id,
            fieldId: 'title',
          });          

          const subtitleProps = ContentfulLivePreview.getProps({
            entryId: item.sys.id,
            fieldId: 'subtitle',
          });          

          return (
              <div
                key={item.sys.id}
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
                        <img
                          loading="lazy"
                          src={featuredImage?.fields?.file?.url}
                          alt={featuredImage?.fields?.title || 'Project thumbnail'}
                          className="img-fluid shadow-sm"
                        />
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
                      <h3 {...titleProps}><Link to={`/case-studies/${slug}`}>{title}</Link></h3>
                    <p {...subtitleProps}>{subtitle}</p>

                    <ul className="categories">
                      {skills.map((skill, i) => (
                        <li key={i}><span>{skill}</span></li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            )})
          }
        </Container>
      </section>
    </div>
  )
}

export default CaseStudies
