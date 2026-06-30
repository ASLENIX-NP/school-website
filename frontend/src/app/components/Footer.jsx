import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Facebook,
  Youtube,
  Globe,
  Mail,
  Phone,
  MapPin,
  School,
  Pencil,
  UploadCloud,
} from "lucide-react";

const palette = {
  cyan: "#38BDF8",
  gold: "#FACC15",
  green: "#22C55E",
  red: "#D71920",
  purple: "#4B2E83",
  dark: "#020617",
};

export const defaultFooterContent = {
  logoUrl: "",
  schoolName: "Baljagriti",
  schoolSubtitle: "Secondary English Boarding School",
  admissionBadgeText: "Admissions Open 2026",
  showAdmissionBadge: true,

  navLinks: [
    { id: 1, label: "About", href: "/about", visible: true },
    { id: 2, label: "Academics", href: "/academics", visible: true },
    { id: 3, label: "Facilities", href: "/facilities", visible: true },
    { id: 4, label: "Gallery", href: "/gallery", visible: true },
    { id: 5, label: "Contact", href: "/contact", visible: true },
  ],

  socials: [
    {
      id: 1,
      type: "facebook",
      href: "https://www.facebook.com/baljagritiesschool",
      label: "Facebook",
      visible: true,
    },
    {
      id: 2,
      type: "website",
      href: "https://baljagriti.edu.np/",
      label: "Website",
      visible: true,
    },
    {
      id: 3,
      type: "youtube",
      href: "https://www.youtube.com/@BaljagritiEngSecondarySchool",
      label: "YouTube",
      visible: true,
    },
  ],

  contact: {
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Baljagriti+English+Secondary+School+Hetauda",
    phones: ["057-590144", "057-590145", "057-590146"],
    email: "infobjess2046@gmail.com",
  },

  modalTitle: "Contact Baljagriti School",
  modalHint: "Click any number to copy it.",
  copiedText: "Copied",
  closeButtonText: "Close",

  copyrightText:
    "© 2026 Baljagriti Secondary English Boarding School. All rights reserved.",
};

export function mergeFooterContent(saved = {}) {
  return {
    ...defaultFooterContent,
    ...saved,
    navLinks: Array.isArray(saved.navLinks)
      ? saved.navLinks
      : defaultFooterContent.navLinks,
    socials: Array.isArray(saved.socials)
      ? saved.socials
      : defaultFooterContent.socials,
    contact: {
      ...defaultFooterContent.contact,
      ...(saved.contact || {}),
      phones: Array.isArray(saved.contact?.phones)
        ? saved.contact.phones
        : defaultFooterContent.contact.phones,
    },
  };
}

export function normalizeExternalUrl(value = "") {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return "#";
  if (cleanValue.startsWith("mailto:") || cleanValue.startsWith("tel:")) return cleanValue;
  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) return cleanValue;
  if (cleanValue.startsWith("/")) return cleanValue;
  if (cleanValue.startsWith("#")) return cleanValue;

  return `https://${cleanValue}`;
}

export function normalizeMapUrl(value = "", fallbackAddress = "") {
  const cleanValue = String(value || "").trim();
  const cleanAddress = String(fallbackAddress || "").trim();

  if (!cleanValue && cleanAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`;
  }

  if (!cleanValue) return "#";
  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) return cleanValue;

  if (
    cleanValue.startsWith("www.") ||
    cleanValue.startsWith("maps.app.goo.gl") ||
    cleanValue.startsWith("goo.gl") ||
    cleanValue.startsWith("google.com")
  ) {
    return `https://${cleanValue}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanValue)}`;
}

function getSocialIcon(type) {
  if (type === "facebook") return Facebook;
  if (type === "youtube") return Youtube;
  return Globe;
}

function stopEditNavigation(event, editMode) {
  if (!editMode) return;
  event.preventDefault();
  event.stopPropagation();
}

function AdminPillButton({ icon: Icon, label, onClick, tone = "edit" }) {
  const toneStyles = {
    edit: {
      background: `linear-gradient(135deg, ${palette.gold}, ${palette.cyan})`,
      color: palette.dark,
    },
    add: {
      background: `linear-gradient(135deg, ${palette.green}, ${palette.cyan})`,
      color: palette.dark,
    },
    delete: {
      background: "rgba(215,25,32,0.96)",
      color: "#FFFFFF",
    },
    dark: {
      background: "rgba(2,6,23,0.94)",
      color: "#FFFFFF",
    },
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-black shadow-2xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={{
        ...(toneStyles[tone] || toneStyles.edit),
        border: "1px solid rgba(255,255,255,0.35)",
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function EditToolbar({ children, position = "top-right" }) {
  const positionClass =
    position === "top-left"
      ? "left-0 top-0 -translate-y-1/2"
      : position === "bottom-right"
      ? "right-0 bottom-0 translate-y-1/2"
      : "right-0 top-0 -translate-y-1/2";

  return (
    <div
      className={`absolute ${positionClass} z-[80] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 flex flex-wrap gap-2`}
    >
      {children}
    </div>
  );
}

export function Footer({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onAddTarget = () => {},
  onDeleteTarget = () => {},
}) {
  const [content, setContent] = useState(
    mergeFooterContent(contentOverride || defaultFooterContent)
  );
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState("");

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeFooterContent(contentOverride));
      return;
    }

    const loadFooterContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/site-content/footer");
        const savedContent = res.data?.data?.content || {};
        setContent(mergeFooterContent(savedContent));
      } catch (error) {
        console.error("Footer content load error:", error);
        setContent(defaultFooterContent);
      }
    };

    loadFooterContent();
  }, [contentOverride]);

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(phone);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (error) {
      console.error("Phone copy failed:", error);
    }
  };

  const visibleLinks = content.navLinks.filter((link) => link.visible !== false);
  const visibleSocials = content.socials.filter(
    (social) => social.visible !== false
  );

  const mapHref = normalizeMapUrl(content.contact.mapUrl, content.contact.address);

  return (
    <footer
      className={`relative overflow-hidden ${editMode ? "rounded-[32px]" : ""}`}
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #07111F 55%, #0F172A 100%)",
        borderTop: editMode
          ? "2px solid rgba(56,189,248,0.48)"
          : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {editMode && (
        <div
          className="relative z-[90] mx-auto max-w-[1450px] px-6 pt-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="rounded-2xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
              border: "1px solid rgba(56,189,248,0.28)",
              boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
            }}
          >
            <div>
              <div className="text-white font-black">Admin Footer Editor Active</div>
              <div className="text-xs text-white/55 mt-1">
                Hover footer areas to open the correct editor for logo, links, socials, contact details, and copyright.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <AdminPillButton
                icon={Pencil}
                label="School Info"
                onClick={() => onEditTarget({ type: "identity" })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[300px]"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div
          className="absolute -left-24 -top-24 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
          }}
        />

        <div
          className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(250,204,21,0.14), transparent 70%)",
          }}
        />
      </div>

      <div
        className="relative z-10 max-w-[1450px] mx-auto px-6 py-8 rounded-[40px] border border-white/10 backdrop-blur-3xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(4,12,30,0.92), rgba(9,20,45,0.95))",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div
            className={`flex items-center gap-3 ${
              editMode ? "relative group rounded-3xl p-2 -m-2 ring-2 ring-cyan-300/35" : ""
            }`}
          >
            {editMode && (
              <EditToolbar position="top-left">
                <AdminPillButton
                  icon={UploadCloud}
                  label="Logo/Text"
                  onClick={() => onEditTarget({ type: "identity" })}
                />
              </EditToolbar>
            )}

            <div
              className="w-12 h-12 rounded-2xl bg-white overflow-hidden flex items-center justify-center"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(34,197,94,0.2), 0 14px 34px rgba(34,197,94,0.22)",
              }}
            >
              {content.logoUrl ? (
                <img
                  src={content.logoUrl}
                  alt={content.schoolName}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <School className="w-7 h-7 text-slate-900" />
              )}
            </div>

            <div>
              <div
                className="text-white text-lg font-bold leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {content.schoolName}
              </div>

              <div className="text-xs" style={{ color: palette.green }}>
                {content.schoolSubtitle}
              </div>

              {content.showAdmissionBadge && content.admissionBadgeText && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] text-green-400">
                    {content.admissionBadgeText}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex flex-wrap gap-3 ${
              editMode ? "relative group rounded-3xl p-2 -m-2 ring-2 ring-yellow-300/30" : ""
            }`}
          >
            {editMode && (
              <EditToolbar>
                <AdminPillButton
                  icon={Pencil}
                  label="Edit Links"
                  onClick={() => onEditTarget({ type: "navLinks" })}
                />
              </EditToolbar>
            )}

            {visibleLinks.map((link) => (
              <Link
                key={link.id}
                to={link.href || "/"}
                onClick={(event) => stopEditNavigation(event, editMode)}
                className={`group/link relative overflow-hidden text-sm px-4 py-2 rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 ${
                  editMode ? "ring-1 ring-white/15" : ""
                }`}
                style={{ color: "rgba(226,232,240,0.72)" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  }}
                />

                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div
            className={`flex gap-2 ${
              editMode ? "relative group rounded-3xl p-2 -m-2 ring-2 ring-purple-300/30" : ""
            }`}
          >
            {editMode && (
              <EditToolbar>
                <AdminPillButton
                  icon={Pencil}
                  label="Edit Social"
                  onClick={() => onEditTarget({ type: "socials" })}
                />
              </EditToolbar>
            )}

            {visibleSocials.map((social) => {
              const Icon = getSocialIcon(social.type);

              return (
                <a
                  key={social.id}
                  href={normalizeExternalUrl(social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  onClick={(event) => stopEditNavigation(event, editMode)}
                  className="group/social relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:rotate-6"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  />
                </a>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-7 pt-6 border-t grid lg:grid-cols-3 gap-4 text-sm ${
            editMode ? "relative group rounded-3xl p-4 -mx-4 ring-2 ring-green-300/25" : ""
          }`}
          style={{
            borderColor: "rgba(255,255,255,0.09)",
            color: "rgba(226,232,240,0.58)",
          }}
        >
          {editMode && (
            <EditToolbar>
              <AdminPillButton
                icon={Pencil}
                label="Contact"
                onClick={() => onEditTarget({ type: "contact" })}
              />
              <AdminPillButton
                icon={Pencil}
                label="Popup"
                tone="dark"
                onClick={() => onEditTarget({ type: "phonePopup" })}
              />
            </EditToolbar>
          )}

          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => stopEditNavigation(event, editMode)}
            className="flex items-start gap-2 transition-all duration-300 hover:text-cyan-300 hover:translate-x-1 group/address"
          >
            <MapPin
              className="w-4 h-4 mt-0.5 flex-shrink-0 transition-all duration-300 group-hover/address:scale-110"
              style={{ color: palette.cyan }}
            />

            <span>{content.contact.address}</span>
          </a>

          <div className="flex items-center gap-2 flex-wrap">
            <Phone
              className="w-4 h-4 flex-shrink-0"
              style={{ color: palette.green }}
            />

            {isMobile && !editMode ? (
              <>
                {content.contact.phones.map((phone, index) => (
                  <span key={`${phone}-${index}`} className="inline-flex items-center gap-1">
                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-green-400"
                    >
                      {phone}
                    </a>
                    {index < content.contact.phones.length - 1 && <span>,</span>}
                  </span>
                ))}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="hover:text-green-400 transition-colors text-left"
              >
                {content.contact.phones.join(", ")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Mail
              className="w-4 h-4 flex-shrink-0"
              style={{ color: palette.gold }}
            />

            <a
              href={`mailto:${content.contact.email}`}
              onClick={(event) => stopEditNavigation(event, editMode)}
              className="break-all hover:text-yellow-300 transition-colors"
            >
              {content.contact.email}
            </a>
          </div>
        </div>

        <div
          className={`mt-6 text-xs text-center ${
            editMode ? "relative group rounded-2xl px-4 py-3 ring-2 ring-cyan-300/20" : ""
          }`}
          style={{ color: "rgba(226,232,240,0.38)" }}
        >
          {editMode && (
            <EditToolbar>
              <AdminPillButton
                icon={Pencil}
                label="Copyright"
                onClick={() => onEditTarget({ type: "copyright" })}
              />
            </EditToolbar>
          )}
          {content.copyrightText}
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(8,15,35,0.95), rgba(12,25,55,0.92))",
            }}
          >
            <div
              className="absolute -top-20 -right-20 w-52 h-52 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            <div
              className="absolute -bottom-24 -left-20 w-52 h-52 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
                filter: "blur(60px)",
              }}
            />

            {copied && (
              <div
                className="absolute top-5 right-5 z-50 px-4 py-2 rounded-xl text-white font-bold animate-bounce"
                style={{
                  background: "linear-gradient(135deg,#22C55E,#38BDF8)",
                  boxShadow: "0 15px 40px rgba(34,197,94,0.4)",
                }}
              >
                ✓ {content.copiedText}
              </div>
            )}

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 pb-4">
                <Phone className="w-5 h-5 text-green-400" />

                <h3 className="text-xl font-bold text-white">
                  {content.modalTitle}
                </h3>
              </div>

              <div className="space-y-3">
                {content.contact.phones.map((phone, index) => (
                  <button
                    key={`${phone}-${index}`}
                    type="button"
                    onClick={() => copyPhone(phone)}
                    className="group relative overflow-hidden w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:scale-[1.03] hover:bg-white/10"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                      }}
                    />

                    <span className="relative z-10 text-white text-lg">
                      📞 {phone}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-4">{content.modalHint}</p>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="mt-6 w-full py-4 rounded-2xl text-white font-bold transition-all duration-500 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg,#22C55E,#38BDF8)",
                  boxShadow: "0 20px 40px rgba(34,197,94,0.35)",
                }}
              >
                {content.closeButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
