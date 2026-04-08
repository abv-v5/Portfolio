import { useEffect, useRef, useState } from 'react';

function About() {
  const sectionRef = useRef(null);
  const [displayedLines, setDisplayedLines] = useState(['', '', '', '']);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const lines = [
    "I'm a B.Tech Computer Science student passionate about solving real-world problems through technology.",
    "I have a keen interest in AI/ML, Data Analytics, Web Development, and Data Structures & Algorithms.",
    "I believe in combining creativity with technical expertise to build innovative solutions.",
    "Whether it's developing intelligent systems, analyzing complex data, or creating beautiful web experiences, I'm always eager to learn and grow in this dynamic tech landscape."
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Observe individual reveal children for staggered entrance
    const revealEls = section.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let animationTimeout;

    const animate = () => {
      if (currentLine < lines.length) {
        const fullLine = lines[currentLine];
        
        if (currentChar < fullLine.length) {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            newLines[currentLine] = fullLine.slice(0, currentChar + 1);
            return newLines;
          });
          setCurrentLineIndex(currentLine);
          currentChar++;
          animationTimeout = setTimeout(animate, 30);
        } else {
          currentLine++;
          currentChar = 0;
          animationTimeout = setTimeout(animate, 400);
        }
      }
    };

    animationTimeout = setTimeout(animate, 500);

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <section id="about" className="about" ref={sectionRef}>
      <h1 className="about-title scroll-reveal reveal-up delay-0">About <span className="highlight">Me</span></h1>

      <div className="about-content">
        <div className="about-photo scroll-reveal reveal-left delay-1">
          <img src="/duck.jpg" alt="Profile" />
        </div>
        <div className="about-text scroll-reveal reveal-right delay-2">
          {displayedLines.map((line, index) => (
            <p key={index}>
              {line}
              {currentLineIndex === index && line.length > 0 && line.length < lines[index].length && (
                <span className="typing-cursor">|</span>
              )}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

export default About;
