import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/NavbarTemp';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';


function App() {
  

  return (
    <ThemeProvider>
      <div>
        <Cursor />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;