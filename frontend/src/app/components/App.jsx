import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminContact from "../../admin/AdminContact";
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
import NoticeDetail from "../../pages/NoticeDetail";
import Staff from "../../pages/Staff";
import Facilities from "../../pages/Facilities";
import AdminAbout from "../../admin/AdminAbout";
import AdminLogin from "../../admin/AdminLogin";
import AdminDashboard from "../../admin/AdminDashboard";
import AdminHome from "../../admin/AdminHome";
import AdminMessages from "../../admin/AdminMessages";
import AdminNotices from "../../admin/AdminNotices";
import AdminFacilities from "../../admin/AdminFacilities";
import AdminNavbar from "../../admin/AdminNavbar";
import AdminStaff from "../../admin/AdminStaff";
import AdminComingSoon from "../../admin/AdminComingSoon";
import ProtectedAdminRoute from "../../admin/ProtectedAdminRoute";
import AdminAcademics from "../../admin/AdminAcademics";
import AdminAdmissions from "../../admin/AdminAdmissions";
import AdminFooter from "../../admin/AdminFooter";
import AdminGallery from "../../admin/AdminGallery";

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
  return <Facilities />;
}

function AcademicsPage() {
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
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
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
            path="/admin/navbar"
            element={
              <ProtectedPage>
                <AdminNavbar />
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

          <Route
            path="/admin/staff"
            element={
              <ProtectedPage>
                <AdminStaff />
              </ProtectedPage>
            }
          />
          <Route
  path="/admin/facilities"
  element={
    <ProtectedPage>
      <AdminFacilities />
    </ProtectedPage>
  }
/>

          <Route
            path="/admin/notices"
            element={
              <ProtectedPage>
                <AdminNotices />
              </ProtectedPage>
            }
          />

          <Route
            path="/admin/contact"
            element={
              <ProtectedPage>
                <AdminContact />
              </ProtectedPage>
            }
          />

          {/* Admin Editors To Build Next */}
          <Route
  path="/admin/about"
  element={
    <ProtectedPage>
      <AdminAbout />
    </ProtectedPage>
  }
/>

          <Route
  path="/admin/academics"
  element={
    <ProtectedPage>
      <AdminAcademics />
    </ProtectedPage>
  }
/>

          <Route
  path="/admin/admissions"
  element={
    <ProtectedPage>
      <AdminAdmissions />
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
      <AdminGallery />
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
      <AdminFooter />
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