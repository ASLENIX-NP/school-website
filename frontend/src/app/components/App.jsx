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
import AdminHome from "../../admin/AdminHome";
import AdminMessages from "../../admin/AdminMessages";
import AdminComingSoon from "../../admin/AdminComingSoon";
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

function ProtectedPage({ children }) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}

function SchoolApp() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          {/* Public Website Routes */}
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

          {/* Admin Auth */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedPage>
                <AdminDashboard />
              </ProtectedPage>
            }
          />

          {/* Built Admin Editors */}
          <Route
            path="/admin/home"
            element={
              <ProtectedPage>
                <AdminHome />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <ProtectedPage>
                <AdminMessages />
              </ProtectedPage>
            }
          />

          {/* Admin Editors To Build Next */}
          <Route
            path="/admin/navbar"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Navbar"
                  description="Navbar editor will control logo text, menu links, and admission button."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/about"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage About"
                  description="About editor will control school intro, story, mission, vision, and journey timeline."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/academics"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Academics"
                  description="Academics editor will control academic programs, facilities, and learning sections."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/admissions"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Admissions"
                  description="Admissions editor will control admission process, dates, requirements, and scholarships."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/notices"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Notices"
                  description="Notices editor will let admin add, edit, delete, and upload PDF notices."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/staff"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Staff"
                  description="Staff editor will control teachers, roles, departments, and profile images."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/events"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Events"
                  description="Events editor will control school events, programs, dates, and activity details."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/gallery"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Gallery"
                  description="Gallery editor will control images, categories, titles, and activity photos."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/contact"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Contact Page"
                  description="Contact editor will control address, phone numbers, email, map text, and office details."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/contact-messages"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Contact Messages"
                  description="This section will show messages submitted from the public contact form."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/footer"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Manage Footer"
                  description="Footer editor will control footer logo text, links, contact details, and social links."
                />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedPage>
                <AdminComingSoon
                  title="Website Settings"
                  description="Settings will control global school name, site defaults, and common information."
                />
              </ProtectedPage>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              isAdminRoute ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <HomePage />
              )
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default SchoolApp;