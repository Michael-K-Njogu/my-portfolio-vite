import { Container } from "react-bootstrap";
import { motion, Variants } from "framer-motion";
import { CalendarCheck, PenTool, CodeXml, WandSparkles } from "lucide-react";

const highlights = [
  {
    value: "8+ years",
    label: "Designing digital products",
    Icon: CalendarCheck,
  },
  {
    value: "UX + UI",
    label: "Research and visual design",
    Icon: PenTool,
  },
  {
    value: "Design → Code",
    label: "Systems into interfaces",
    Icon: CodeXml,
  },
  {
    value: "AI Assisted",
    label: "More effective workflows",
    Icon: WandSparkles,
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const ExperienceHighlights = () => (
  <section className="experience-highlights" aria-labelledby="experience-title">
    <Container>
      <h2 id="experience-title" className="experience-eyebrow">
        Experience across design, technology &amp; delivery
      </h2>

      <motion.dl
        className="experience-grid"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {highlights.map(({ value, label, Icon }) => (
          <motion.div key={value} className="experience-item" variants={item}>
            <span className="experience-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <dt className="experience-value">{value}</dt>
            <dd className="experience-label">{label}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </Container>
  </section>
);

export default ExperienceHighlights;
