import { useEffect, useRef, useCallback } from 'react';
import { FaGithub, FaCode, FaRobot, FaPlane, FaShoppingCart, FaChartBar, FaBrain } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

// ── Projects Data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    title: 'AI Chatbot',
    subtitle: 'FastAPI + Gemini API',
    description:
      'Developed a backend chatbot using FastAPI. Integrated Gemini API for dynamic AI responses. Implemented routing and CORS middleware for seamless communication.',
    tech: ['Python', 'FastAPI', 'Gemini API', 'REST'],
    github: 'https://github.com',
    live: null,
    Icon: FaRobot,
    accentColor: '#22d3ee',
  },
  {
    id: 2,
    title: 'ExploreEase',
    subtitle: 'AI Travel Planner',
    description:
      'AI-based tour planning platform that generates personalized itineraries based on user preferences, budget, and travel style. Built with cutting-edge AI tools.',
    tech: ['AI', 'Web Development', 'React', 'Python'],
    github: 'https://github.com',
    live: 'https://example.com',
    Icon: FaPlane,
    accentColor: '#a78bfa',
  },
  {
    id: 3,
    title: 'DataPulse Dashboard',
    subtitle: 'Analytics & Visualization',
    description:
      'Real-time analytics dashboard with interactive charts, filterable reports, and CSV export. Designed for business intelligence and data-driven decision making.',
    tech: ['Python', 'Power BI', 'Streamlit', 'SQL'],
    github: 'https://github.com',
    live: null,
    Icon: FaChartBar,
    accentColor: '#facc15',
  },
  {
    id: 4,
    title: 'ShopSense',
    subtitle: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce platform with product listings, cart management, user authentication, and order tracking. Optimized for mobile and desktop.',
    tech: ['React', 'Node.js', 'MongoDB', 'JWT'],
    github: 'https://github.com',
    live: 'https://example.com',
    Icon: FaShoppingCart,
    accentColor: '#10b981',
  },
  {
    id: 5,
    title: 'MindMap AI',
    subtitle: 'ML Concept Visualizer',
    description:
      'Interactive mind-mapping tool powered by machine learning. Automatically clusters concepts and suggests relationships using NLP-based semantic analysis.',
    tech: ['Python', 'ML', 'NLP', 'React'],
    github: 'https://github.com',
    live: null,
    Icon: FaBrain,
    accentColor: '#f97316',
  },
  {
    id: 6,
    title: 'CodeSpark',
    subtitle: 'Developer Toolkit',
    description:
      'A collection of developer productivity tools including a code snippet manager, regex tester, JSON formatter, and API response validator — all in one place.',
    tech: ['React', 'JavaScript', 'CSS', 'IndexedDB'],
    github: 'https://github.com',
    live: 'https://example.com',
    Icon: FaCode,
    accentColor: '#3b82f6',
  },
];

// ── ProjectCard ───────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const delayStyle = { transitionDelay: `${index * 0.08}s` };

  return (
    <article
      className="proj-card scroll-reveal reveal-up"
      style={delayStyle}
      aria-label={project.title}
    >
      {/* ── Card header ── */}
      <div className="proj-card-header">
        <div className="proj-card-icon-wrap" style={{ color: project.accentColor }}>
          <project.Icon />
        </div>
        <div className="proj-card-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-icon-btn"
              aria-label="View on GitHub"
              title="GitHub Repository"
            >
              <FaGithub />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-icon-btn proj-icon-btn--live"
              aria-label="View live project"
              title="Live Project"
            >
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>

      {/* ── Image placeholder ── */}
      <div className="proj-card-preview" style={{ borderColor: `${project.accentColor}30` }}>
        <div className="proj-card-preview-inner">
          <div className="proj-preview-icon" style={{ color: project.accentColor }}>
            <project.Icon />
          </div>
          <span className="proj-preview-label">Preview</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="proj-card-body">
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-subtitle">{project.subtitle}</p>
        <p className="proj-card-desc">{project.description}</p>
      </div>

      {/* ── Tech bubbles ── */}
      <div className="proj-card-tech">
        {project.tech.map((tag) => (
          <span key={tag} className="proj-tech-tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function Projects() {
  const sectionRef  = useRef(null);
  const carouselRef = useRef(null);
  const titleRef    = useRef(null);

  // ── Title scroll-reveal ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible'); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Card scroll-reveal (page-level) ────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // ── Arrow navigation ────────────────────────────────────────────────────────
  const scroll = useCallback((dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.proj-card')?.offsetWidth ?? 380;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' });
  }, []);

  return (
    <section id="projects" className="proj-section" ref={sectionRef}>
      {/* Ambient glow */}
      <div className="proj-bg-glow" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="proj-header">
        <h1
          className="proj-title scroll-reveal reveal-up"
          ref={titleRef}
        >
          My <span className="highlight">Creations</span>
        </h1>
        <p className="proj-subtitle scroll-reveal reveal-up delay-1">
          A selection of projects I have built — from AI-backed backends to full-stack web apps.
        </p>
      </div>

      {/* ── Carousel wrapper ── */}
      <div className="proj-carousel-wrapper">
        {/* Left arrow */}
        <button
          className="proj-arrow proj-arrow--left"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          &#8592;
        </button>

        {/* Track */}
        <div className="proj-carousel" ref={carouselRef}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          className="proj-arrow proj-arrow--right"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}

export default Projects;
