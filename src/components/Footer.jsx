import { useState, useEffect } from 'react';

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Show button when user is near the bottom (within 200px)
      if (scrollHeight - scrollTop - clientHeight < 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer className="ftr-footer">
        <p className="ftr-left">
          &copy; 2026{' '}
          <span className="ftr-name">Abhay Verma</span>
          . All rights reserved.
        </p>
        <p className="ftr-right">
          Made with ❤️ by Abhay...
        </p>
      </footer>

      {showScrollTop && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
}

export default Footer;
