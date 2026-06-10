import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { About } from "./About";
import { Academics } from "./Academics";
import { Admissions } from "./Admissions";
import { Events } from "./Events";
import { Gallery } from "./Gallery";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

function SchoolApp() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <About />
        <Academics />
        <Admissions />
        <Events />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default SchoolApp;