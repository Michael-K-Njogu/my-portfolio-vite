import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ContentfulLivePreview } from "@contentful/live-preview";

export type CaseStudyCardItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year?: number | string;
  workInProgress?: boolean;
  comingSoon?: boolean;
  imageUrl?: string;
  imageAlt: string;
  skills: string[];
};

type Props = {
  items: CaseStudyCardItem[];
};

const livePreviewProps = (entryId: string, fieldId: string) =>
  typeof ContentfulLivePreview?.getProps === "function"
    ? ContentfulLivePreview.getProps({ entryId, fieldId })
    : {};

const CardWrapper = ({
  item,
  children,
}: {
  item: CaseStudyCardItem;
  children: ReactNode;
}) =>
  item.comingSoon ? (
    <div className="case-card case-card-disabled" aria-disabled="true">
      {children}
    </div>
  ) : (
    <Link to={`/case-studies/${item.slug}`} className="case-card">
      {children}
    </Link>
  );

const CaseStudyGrid = ({ items }: Props) => (
  <div className="case-grid">
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1],
          delay: (index % 2) * 0.1,
        }}
        viewport={{ once: true }}
      >
        <CardWrapper item={item}>
          <div className="case-card-media">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                loading={index < 2 ? "eager" : "lazy"}
              />
            ) : (
              <span className="text-muted">No image</span>
            )}
          </div>

          <div className="case-card-body">
            {(item.year || item.workInProgress || item.comingSoon) && (
              <div className="project-meta">
                {item.year && (
                  <span
                    className="project-year"
                    {...(livePreviewProps(item.id, "year") as any)}
                  >
                    {item.year}
                  </span>
                )}
                {item.comingSoon ? (
                  <span className="wip-badge coming-soon-badge">
                    Coming soon
                  </span>
                ) : (
                  item.workInProgress && (
                    <span className="wip-badge">Work in progress</span>
                  )
                )}
              </div>
            )}
            <h3 {...(livePreviewProps(item.id, "title") as any)}>
              {item.title}
            </h3>
            <p {...(livePreviewProps(item.id, "subtitle") as any)}>
              {item.subtitle}
            </p>

            {item.skills.length > 0 && (
              <ul className="categories">
                {item.skills.map((skill, i) => (
                  <li key={i}>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardWrapper>
      </motion.div>
    ))}
  </div>
);

export default CaseStudyGrid;
