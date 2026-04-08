import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FaPython, FaJava, FaHtml5, FaCss3Alt, FaReact, FaGithub,
  FaFlask,
} from 'react-icons/fa';
import {
  SiJavascript, SiMongodb, SiFastapi, SiStreamlit,
  SiJupyter, SiAnaconda, SiCanva,
  SiVscodium, SiGooglecolab,
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { TbFileTypeSql, TbChartColumn } from 'react-icons/tb';
import { GiBrain } from 'react-icons/gi';
import { MdOutlinePrecisionManufacturing } from 'react-icons/md';

// ── Skill Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'languages',
    label: 'Programming Languages',
    short: 'Languages',
    skills: [
      { name: 'Python',     Icon: FaPython,       color: '#3b82f6' },
      { name: 'Java',       Icon: FaJava,         color: '#ef4444' },
      { name: 'SQL',        Icon: TbFileTypeSql,  color: '#22d3ee' },
    ],
  },
  {
    id: 'web',
    label: 'Web Technologies',
    short: 'Web',
    skills: [
      { name: 'HTML5',       Icon: FaHtml5,      color: '#f97316' },
      { name: 'CSS3',        Icon: FaCss3Alt,    color: '#3b82f6' },
      { name: 'JavaScript',  Icon: SiJavascript, color: '#facc15' },
      { name: 'React JS',    Icon: FaReact,      color: '#22d3ee' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Frameworks',
    short: 'Tools',
    skills: [
      { name: 'VS Code',    Icon: VscCode,          color: '#3b82f6' },
      { name: 'GitHub',     Icon: FaGithub,         color: '#e2e8f0' },
      { name: 'Streamlit',  Icon: SiStreamlit,      color: '#ef4444' },
      { name: 'FastAPI',    Icon: SiFastapi,        color: '#10b981' },
      { name: 'Flask',      Icon: FaFlask,          color: '#e2e8f0' },
      { name: 'MongoDB',    Icon: SiMongodb,        color: '#22c55e' },
      { name: 'Colab',      Icon: SiGooglecolab,    color: '#f97316' },
      { name: 'Jupyter',    Icon: SiJupyter,        color: '#f97316' },
      { name: 'Anaconda',   Icon: SiAnaconda,       color: '#22c55e' },
      { name: 'Power BI',   Icon: TbChartColumn,    color: '#facc15' },
      { name: 'Canva',      Icon: SiCanva,          color: '#22d3ee' },
    ],
  },
  {
    id: 'domains',
    label: 'Domains',
    short: 'Domains',
    skills: [
      { name: 'Artificial Intelligence', Icon: GiBrain,                         color: '#a78bfa' },
      { name: 'Machine Learning',        Icon: MdOutlinePrecisionManufacturing, color: '#22d3ee' },
    ],
  },
];

// Helper function to add highlight to category titles
function getCategoryTitle(label) {
  if (label === 'Programming Languages') {
    return <>Programming <span className="highlight">Languages</span></>;
  } else if (label === 'Web Technologies') {
    return <>Web <span className="highlight">Technologies</span></>;
  } else if (label === 'Tools & Frameworks') {
    return <>Tools & <span className="highlight">Frameworks</span></>;
  } else if (label === 'Domains') {
    return <><span className="highlight">Domains</span></>;
  }
  return label;
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

function SkillCard({ name, Icon, color, index }) {
  const delayClass = `card-delay-${Math.min(index % 10, 9)}`;
  return (
    <div className={`skill-card scroll-reveal reveal-up ${delayClass}`}>
      <div className="skill-card-icon" style={{ color }}>
        <Icon />
      </div>
      <span className="skill-card-name">{name}</span>
    </div>
  );
}

// ── CategorySlide ─────────────────────────────────────────────────────────────
// Each category is a full-height snap slide.
// It receives `isActive` to drive the focus/dim effect.

function CategorySlide({ category, isActive }) {
  return (
    <div
      className={`skills-snap-slide ${isActive ? 'slide-active' : 'slide-inactive'}`}
      id={`cat-${category.id}`}
      data-cat={category.id}
    >
      {/* inner wrapper constrains width and centres content */}
      <div className="skills-slide-inner">
        <h3 className="skills-cat-title">{getCategoryTitle(category.label)}</h3>
        <div className="skills-grid">
          {category.skills.map((skill, i) => (
            <SkillCard key={skill.name} {...skill} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RightNav ──────────────────────────────────────────────────────────────────

function RightNav({ categories, activeId, snapContainerRef }) {
  const handleCategoryClick = useCallback((id) => {
    const container = snapContainerRef.current;
    const target = container?.querySelector(`[data-cat="${id}"]`);
    
    if (!container || !target) return;
    
    // Check if mobile
    const isMobile = window.innerWidth <= 640;
    
    if (isMobile) {
      // On mobile, scroll to the category AND highlight it
      container.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
      
      // Also update the visual state
      const allSlides = container.querySelectorAll('.skills-snap-slide');
      allSlides.forEach(slide => {
        slide.classList.remove('slide-active');
        slide.classList.add('slide-inactive');
      });
      
      target.classList.remove('slide-inactive');
      target.classList.add('slide-active');
    } else {
      // Desktop: scroll within the snap container
      container.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [snapContainerRef]);

  return (
    <nav className="skills-right-nav" aria-label="Skill categories">
      <div className="skills-right-nav-track">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`skills-nav-item ${activeId === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
            title={cat.label}
            aria-label={cat.label}
          >
            <span className="skills-nav-bar" />
            <span className="skills-nav-label">{cat.short}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── Skills (main) ─────────────────────────────────────────────────────────────

function Skills() {
  const sectionRef      = useRef(null);
  const titleRef        = useRef(null);
  const snapContainerRef = useRef(null);
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);

  // ── Scroll-reveal for section title ──────────────────────────────────────────
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

  // ── Re-animate cards whenever the active slide changes ───────────────────────
  // Strip is-visible from the incoming slide's cards, then re-add after 1 frame
  // so the CSS transition replays and the entrance feels fresh every time.
  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;
    const activeSlide = container.querySelector(`[data-cat="${activeId}"]`);
    if (!activeSlide) return;

    const cards = activeSlide.querySelectorAll('.scroll-reveal');
    // Remove is-visible to reset state
    cards.forEach((c) => c.classList.remove('is-visible'));

    // Re-add after a single paint frame so transition fires
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards.forEach((c) => c.classList.add('is-visible'));
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeId]);

  // ── Active category: IntersectionObserver inside the snap container ───────────
  // root = snap container so intersection is relative to its viewport.
  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 768;

    const obs = new IntersectionObserver(
      (entries) => {
        if (isMobile) {
          // On mobile, find the most visible category
          let maxRatio = 0;
          let mostVisibleEntry = null;

          entries.forEach((entry) => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisibleEntry = entry;
            }
          });

          if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.3) {
            setActiveId(mostVisibleEntry.target.dataset.cat);
          }
        } else {
          // Desktop behavior - unchanged
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.dataset.cat);
            }
          });
        }
      },
      {
        root: isMobile ? null : container,   // Mobile: observe viewport, Desktop: snap container
        threshold: isMobile ? [0, 0.3, 0.5, 0.7, 1] : 0.55,  // Multiple thresholds for mobile
        rootMargin: isMobile ? '-20% 0px -20% 0px' : '0px',  // Center focus on mobile
      }
    );

    const slides = container.querySelectorAll('.skills-snap-slide');
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // ── Scroll-reveal for skill cards ─────────────────────────────────────────────
  // Cards inside the snap viewport need root=container for proper detection.
  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 768;

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      }),
      {
        root: isMobile ? null : container,  // On mobile, observe relative to viewport
        threshold: 0.15,
        rootMargin: isMobile ? '0px 0px -60px 0px' : '0px 0px -20px 0px',
      }
    );

    const cards = container.querySelectorAll('.scroll-reveal');
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // ── Scroll-reveal for category slides on mobile ──────────────────────────────
  useEffect(() => {
    const container = snapContainerRef.current;
    if (!container) return;

    // Only apply on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const slides = container.querySelectorAll('.skills-snap-slide');
    
    // Initially show only the first category (Languages)
    slides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add('mobile-revealed');
        const cards = slide.querySelectorAll('.scroll-reveal');
        cards.forEach((card) => card.classList.add('is-visible'));
      } else {
        slide.classList.add('mobile-hidden');
      }
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            // Reveal the category permanently
            entry.target.classList.remove('mobile-hidden');
            entry.target.classList.add('mobile-revealed');
            
            // Trigger card animations with stagger
            const cards = entry.target.querySelectorAll('.scroll-reveal');
            cards.forEach((card, idx) => {
              setTimeout(() => {
                card.classList.add('is-visible');
              }, idx * 60);
            });
            
            // Stop observing once revealed (performance optimization)
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,  // Observe relative to viewport on mobile
        threshold: [0, 0.2, 0.5],
        rootMargin: '0px 0px -100px 0px',
      }
    );

    // Observe all slides except the first one (already visible)
    slides.forEach((slide, index) => {
      if (index > 0) {
        obs.observe(slide);
      }
    });
    
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      {/* Background accent */}
      <div className="skills-bg-glow" aria-hidden="true" />

      {/* Section heading — sits outside the snap container */}
      <div className="skills-header">
        <h1
          className="skills-title scroll-reveal reveal-up"
          ref={titleRef}
        >
          What I <span className="highlight">Do</span>
        </h1>
        <p className="skills-subtitle scroll-reveal reveal-up delay-1">
          A curated set of technologies and tools I work with across different domains.
        </p>
      </div>

      {/* Body: snap container + right nav */}
      <div className="skills-body">
        {/*
          skills-snap-container:
            - fixed height (100vh minus header + some breathing room)
            - overflow-y: scroll  + scroll-snap-type: y mandatory
            - each child .skills-snap-slide is scroll-snap-align: start
        */}
        <div className="skills-snap-container" ref={snapContainerRef}>
          {CATEGORIES.map((cat) => (
            <CategorySlide
              key={cat.id}
              category={cat}
              isActive={activeId === cat.id}
            />
          ))}
        </div>

        <RightNav
          categories={CATEGORIES}
          activeId={activeId}
          snapContainerRef={snapContainerRef}
        />
      </div>
    </section>
  );
}

export default Skills;
