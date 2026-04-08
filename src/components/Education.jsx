import { useEffect, useRef } from 'react';
import { FaGraduationCap, FaUniversity, FaSchool, FaExchangeAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { HiOutlineCalendar } from 'react-icons/hi';

// ── Education Data ────────────────────────────────────────────────────────────

const EDUCATION = [
  {
    id: 'btech',
    degree: 'B.Tech — Computer Science & Engineering',
    institute: 'GLA University',
    location: 'Mathura, India',
    duration: '2024 – 2028',
    Icon: FaGraduationCap,
    accentColor: '#22d3ee',
    details: [
      'Current CGPA: 8.93 / 10',
      'Specialisation in Machine Learning and Data Analytics',
    ],
  },
  {
    id: 'iit',
    degree: 'Semester Exchange Program',
    institute: 'IIT Gandhinagar',
    location: 'Gujarat, India',
    duration: 'Jan 2026 – May 2026',
    Icon: FaExchangeAlt,
    accentColor: '#a78bfa',
    details: [
      'Gained exposure to cutting-edge academic and lab environments'
    ],
  },
  {
    id: 'class12',
    degree: 'Class XII — Science (PCM)',
    institute: 'CBSE Board',
    location: 'Agra, India',
    duration: '2022 – 2024',
    Icon: FaSchool,
    accentColor: '#10b981',
    details: [
      'Subjects: Physics, Chemistry, Mathematics, English, Physical Education',
      'Percentage: 93.2%',
      'Consistent academic performance throughout the year',
    ],
  },
  {
    id: 'class10',
    degree: 'Class X — Secondary Education',
    institute: 'CBSE Board',
    location: 'Agra, India',
    duration: '2021 – 2022',
    Icon: FaSchool,
    accentColor: '#f97316',
    details: [
      'Subjects: Mathematics, Science, Social Science, English, IT',
      'Percentage: 93.2%',
      'Foundation in analytical thinking and core sciences',
    ],
  },
];

// ── TimelineItem ──────────────────────────────────────────────────────────────

function TimelineItem({ item, index }) {
  const itemRef = useRef(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('edu-item--visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="edu-item"
      ref={itemRef}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      {/* ── Node (dot on the line) ── */}
      <div className="edu-node" style={{ borderColor: item.accentColor }}>
        <div className="edu-node-core" style={{ background: item.accentColor }} />
        {/* Glow ring */}
        <div
          className="edu-node-glow"
          style={{ boxShadow: `0 0 14px 4px ${item.accentColor}55` }}
        />
      </div>

      {/* ── Card ── */}
      <article className="edu-card">
        {/* Header row */}
        <div className="edu-card-top">
          <div className="edu-card-icon" style={{ color: item.accentColor }}>
            <item.Icon />
          </div>
          <span className="edu-card-duration">
            <HiOutlineCalendar />
            {item.duration}
          </span>
        </div>

        {/* Degree & institute */}
        <h3 className="edu-card-degree">{item.degree}</h3>
        <p className="edu-card-institute">
          <FaUniversity style={{ opacity: 0.6, fontSize: '11px' }} />
          {item.institute}
          <span className="edu-card-location">
            <MdLocationOn />
            {item.location}
          </span>
        </p>

        {/* Bullet details */}
        <ul className="edu-card-details">
          {item.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>

        {/* Accent bottom border */}
        <div
          className="edu-card-accent-bar"
          style={{ background: `linear-gradient(90deg, ${item.accentColor}90, transparent)` }}
        />
      </article>
    </div>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

function Education() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);        // the growing vertical line
  const trackRef = useRef(null);        // the full-height track container

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

  // ── Subtitle + header paragraph reveal ─────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const els = section.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.2 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Growing timeline line driven by scroll ──────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    const line = lineRef.current;
    if (!track || !line) return;

    let rafId = null;

    const onScroll = () => {
      if (rafId) return;                        // throttle with rAF
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = track.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Progress = how much of the track has scrolled past the centre of the viewport
        // 0 when top of track is at bottom of screen, 1 when bottom of track is visible
        const scrolled = viewH - rect.top;
        const total = rect.height + viewH * 0.4;
        const progress = Math.min(1, Math.max(0, scrolled / total));

        line.style.height = `${progress * 100}%`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();                                 // run once on mount
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="education" className="edu-section" ref={sectionRef}>
      {/* Ambient glow top-right */}
      <div className="edu-bg-glow" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="edu-header">
        <h1 className="edu-title scroll-reveal reveal-up" ref={titleRef}>
          Edu<span className="highlight">cation</span>
        </h1>
        <p className="edu-subtitle scroll-reveal reveal-up delay-1">
          My academic journey — institutions, milestones, and the knowledge
          that shaped my thinking.
        </p>
      </div>

      {/* ── Timeline track ── */}
      <div className="edu-track" ref={trackRef}>
        {/* The growing vertical line */}
        <div className="edu-line-rail">
          <div className="edu-line" ref={lineRef} />
        </div>

        {/* Timeline items */}
        <div className="edu-items">
          {EDUCATION.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
