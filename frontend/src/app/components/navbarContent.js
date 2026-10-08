export const defaultNavbarContent = {
  logoUrl: "",
  schoolName: "Baljagriti",
  schoolSubtitle: "Secondary English School",
  admissionButtonText: "Admission Open",
  admissionButtonLink: "/admissions",
  showAdmissionButton: true,
  links: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "academics", label: "Academics", href: "/academics", visible: true },
    { id: "notices", label: "Notices", href: "/notices", visible: true },
    { id: "calendar", label: "Calendar", href: "/calendar", visible: true },
    { id: "blogs", label: "Blog", href: "/blogs", visible: true },
    { id: "facilities", label: "Facilities", href: "/facilities", visible: true },
    { id: "staff", label: "Staff", href: "/staff", visible: true },
    { id: "gallery", label: "Gallery", href: "/gallery", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
};

function makeSafeId(value, fallback, usedIds) {
  const raw =
    String(value || fallback || "menu-item")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu-item";

  let nextId = raw;
  let counter = 2;

  while (usedIds.has(nextId)) {
    nextId = `${raw}-${counter}`;
    counter += 1;
  }

  usedIds.add(nextId);
  return nextId;
}

export function mergeNavbarContent(saved = {}) {
  const hasSavedLinks = Array.isArray(saved.links);
  const sourceLinks = hasSavedLinks
    ? saved.links
    : defaultNavbarContent.links;
  const usedIds = new Set();

  const links = sourceLinks
    .filter((link) => link && typeof link === "object")
    .map((link, index) => {
      const matchingDefault = defaultNavbarContent.links.find(
        (defaultLink) => defaultLink.id === link.id
      );

      return {
        ...(matchingDefault || {}),
        ...link,
        id: makeSafeId(
          link.id,
          matchingDefault?.id || `menu-${index + 1}`,
          usedIds
        ),
        label: String(link.label ?? matchingDefault?.label ?? "").trim(),
        href: String(link.href ?? matchingDefault?.href ?? "/").trim() || "/",
        visible: link.visible !== false,
      };
    });

  return {
    ...defaultNavbarContent,
    ...saved,
    logoUrl: String(saved.logoUrl ?? defaultNavbarContent.logoUrl).trim(),
    schoolName: String(
      saved.schoolName ?? defaultNavbarContent.schoolName
    ).trim(),
    schoolSubtitle: String(
      saved.schoolSubtitle ?? defaultNavbarContent.schoolSubtitle
    ).trim(),
    admissionButtonText: String(
      saved.admissionButtonText ?? defaultNavbarContent.admissionButtonText
    ).trim(),
    admissionButtonLink:
      String(
        saved.admissionButtonLink ??
          defaultNavbarContent.admissionButtonLink
      ).trim() || "/admissions",
    showAdmissionButton: saved.showAdmissionButton !== false,
    links,
  };
}
