import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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

import AdminLogin from "../../admin/AdminLogin";
import AdminDashboard from "../../admin/AdminDashboard";
import ProtectedAdminRoute from "../../admin/ProtectedAdminRoute";

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/academics" element={<FacilitiesPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default SchoolApp;