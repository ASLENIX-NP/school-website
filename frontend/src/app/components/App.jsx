import { Routes, Route } from "react-router-dom";

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

import Messages from "../../pages/Messages";
import Notices from "../../pages/Notices";
import Staff from "../../pages/Staff";

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
    </>
  );
}

function AboutPage() {
  return <About />;
}

function AcademicsPage() {
  return <Academics />;
}

function FacilitiesPage() {
  return <Academics />;
}

function AdmissionsPage() {
  return <Admissions />;
}

function EventsPage() {
  return <Events />;
}

function GalleryPage() {
  return <Gallery />;
}

function ContactPage() {
  return <Contact />;
}

function SchoolApp() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/staff" element={<Staff />} />

          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default SchoolApp;