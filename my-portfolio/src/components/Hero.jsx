import { useEffect, useState } from "react";
import { FaFolder, FaEnvelope, FaDownload } from "react-icons/fa";

function Hero() {
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const subtitles = [
    "AI/ML Developer",
    "Data Analytics Enthusiast",
    "Web Developer",
    "B.Tech Computer Science Student",
    "DSA Enthusiast"
  ];

  useEffect(() => {
    const h1 = document.querySelector(".hero h1");
    h1?.classList.add("show");

    let currentSubtitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let animationTimeout;

    const animate = () => {
      const currentSubtitle = subtitles[currentSubtitleIndex];

      if (!isDeleting) {
        if (currentCharIndex < currentSubtitle.length) {
          setDisplayedSubtitle(currentSubtitle.slice(0, currentCharIndex + 1));
          currentCharIndex++;
          animationTimeout = setTimeout(animate, 50);
        } else {
          isDeleting = true;
          animationTimeout = setTimeout(animate, 1000);
        }
      } else {
        if (currentCharIndex > 0) {
          currentCharIndex--;
          setDisplayedSubtitle(currentSubtitle.slice(0, currentCharIndex));
          animationTimeout = setTimeout(animate, 50);
        } else {
          isDeleting = false;
          currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitles.length;
          animationTimeout = setTimeout(animate, 500);
        }
      }
    };

    animationTimeout = setTimeout(animate, 200);

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="status-badge">Available for opportunities</div>

      <h1>Hello world! I'm <span className="highlight">Abhay Verma</span></h1>

      <h2>{displayedSubtitle}<span className="cursor">|</span></h2>
      <p>Turning Data into Smart AI Solutions</p>

      <div className="hero-buttons">
        <a href="#projects" className="btn primary-btn">
          <FaFolder /> See my work
        </a>
        <a href="#contact" className="btn secondary-btn">
          <FaEnvelope /> Contact Me
        </a>
        <a href="/abhayvermacv.pdf" download className="btn tertiary-btn">
          <FaDownload /> Download Resume
        </a>
      </div>

      <a href="#about" className="scroll-down-btn" title="Scroll to About">
        ↓
      </a>
    </section>
  );
}

export default Hero;