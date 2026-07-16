import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2, Search, X } from "lucide-react";

export const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

export const stepColorOptions = [
  "#D71920",
  "#168A3A",
  "#7C5CC4",
  "#38BDF8",
  "#F97316",
  "#4B2E83",
];

export const defaultAdmissionsContent = {
  badgeText: "Admissions",
  title: "Your Journey Starts Here",
  highlightedText: "Starts Here",
  subtitle:
    "Baljagriti Secondary English Boarding School welcomes students through a clear admission process for Play Group, LKG, and classes up to Class IX.",
  steps: [
    {
      id: 1,
      icon: "message",
      step: "01",
      title: "Play Group Admission",
      desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "map",
      step: "02",
      title: "LKG to Class IX",
      desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "file",
      step: "03",
      title: "Written Examination",
      desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
      color: "#7C5CC4",
      visible: true,
    },
    {
      id: 4,
      icon: "check",
      step: "04",
      title: "Enrollment",
      desc: "Selected students complete enrollment by submitting required documents to the school administration.",
      color: "#168A3A",
      visible: true,
    },
  ],
  formTitle: "Admission Inquiry",
  formDescription:
    "Fill in the form and the school administration will contact you with admission details.",
  nameLabel: "Full Name",
  namePlaceholder: "Student or parent name",
  emailLabel: "Email Address",
  emailPlaceholder: "example@email.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "+977 98XXXXXXXX",
  gradeLabel: "Applying for Grade",
  gradePlaceholder: "Select grade",
  messageLabel: "Message",
  messagePlaceholder: "Write any admission question or note here...",
  grades: [
    "Play Group",
    "LKG",
    "UKG",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
  ],
  submitButtonText: "Submit Inquiry",
  submittingText: "Submitting...",
  successTitle: "Inquiry Submitted!",
  successMessage: "We will contact you soon with admission details.",
};

export function mergeAdmissionsContent(saved = {}) {
  const hasSavedSteps = Array.isArray(saved.steps);
  const hasSavedGrades = Array.isArray(saved.grades);

  return {
    ...defaultAdmissionsContent,
    ...saved,
    steps: hasSavedSteps
      ? saved.steps.map((step, index) => ({
          ...step,
          id: step.id ?? `admission-step-${index + 1}`,
          step:
            step.step ?? String(index + 1).padStart(2, "0"),
          title: step.title ?? "",
          desc: step.desc ?? "",
          color:
            step.color ||
            stepColorOptions[index % stepColorOptions.length],
          visible: true,
        }))
      : defaultAdmissionsContent.steps,
    grades: hasSavedGrades
      ? saved.grades.map((grade) => String(grade ?? ""))
      : defaultAdmissionsContent.grades,
    messageLabel:
      saved.messageLabel ?? defaultAdmissionsContent.messageLabel,
    messagePlaceholder:
      saved.messagePlaceholder ??
      defaultAdmissionsContent.messagePlaceholder,
  };
}

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone);
  const digitsOnly = cleaned.replace(/\D/g, "");

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlightedText}</span>
      {after}
    </>
  );
}

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <p className="text-xs font-semibold mt-2" style={{ color: colors.red }}>
      {children}
    </p>
  );
}

function AdminEditButton({ label, icon: Icon = Pencil, onClick, tone = "purple" }) {
  const palette = {
    purple: {
      background: "rgba(75,46,131,0.95)",
      color: "#FFFFFF",
    },
    green: {
      background: "rgba(22,138,58,0.95)",
      color: "#FFFFFF",
    },
    red: {
      background: "rgba(215,25,32,0.95)",
      color: "#FFFFFF",
    },
    dark: {
      background: "rgba(11,16,32,0.95)",
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
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black shadow-2xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={palette[tone] || palette.purple}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function EditShell({ editMode, children, className = "", style = {} }) {
  if (!editMode) return children;

  return (
    <div
      className={`relative rounded-[2rem] ${className}`}
      style={{
        outline: "2px dashed rgba(56,189,248,0.75)",
        outlineOffset: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Complete country codes data - all countries
const countryCodes = [
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+1264", country: "Anguilla", flag: "🇦🇮" },
  { code: "+1268", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+297", country: "Aruba", flag: "🇦🇼" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+1242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1246", country: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+1441", country: "Bermuda", flag: "🇧🇲" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+1345", country: "Cayman Islands", flag: "🇰🇾" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+1767", country: "Dominica", flag: "🇩🇲" },
  { code: "+1849", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+1473", country: "Grenada", flag: "🇬🇩" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+1671", country: "Guam", flag: "🇬🇺" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+1876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+389", country: "Macedonia", flag: "🇲🇰" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+1664", country: "Montserrat", flag: "🇲🇸" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+1787", country: "Puerto Rico", flag: "🇵🇷" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+262", country: "Réunion", flag: "🇷🇪" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+590", country: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+1869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1758", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+590", country: "Saint Martin", flag: "🇲🇫" },
  { code: "+1784", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+690", country: "Tokelau", flag: "🇹🇰" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+1649", country: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

// Convert the Unicode flag into its ISO country code.
// The ISO value also gives every country a unique identity when calling codes repeat.
function getCountryIso(flag = "") {
  const letters = Array.from(flag)
    .map((character) => {
      const codePoint = character.codePointAt(0);

      if (codePoint >= 0x1f1e6 && codePoint <= 0x1f1ff) {
        return String.fromCharCode(codePoint - 0x1f1e6 + 65);
      }

      return "";
    })
    .join("");

  return letters.length === 2 ? letters : "";
}

const countries = countryCodes.map((country, index) => ({
  ...country,
  iso: getCountryIso(country.flag) || `COUNTRY-${index}`,
}));

const defaultPhoneCountry =
  countries.find((country) => country.country === "Nepal") || countries[0];

function CountryFlag({ country, size = "normal" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const iso = String(country?.iso || "").toLowerCase();
  const dimensions = size === "small" ? "w-6 h-[18px]" : "w-7 h-5";

  if (!country) {
    return <span className={`${dimensions} inline-block rounded bg-slate-200`} />;
  }

  if (!iso || iso.startsWith("country-") || imageFailed) {
    return (
      <span
        className={`${dimensions} inline-flex items-center justify-center rounded bg-slate-100 text-[9px] font-black text-slate-500`}
        aria-label={`${country.country} flag`}
      >
        {String(country.iso || "").slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/28x21/${iso}.png`}
      srcSet={`https://flagcdn.com/56x42/${iso}.png 2x`}
      alt=""
      className={`${dimensions} rounded-sm object-cover shadow-sm`}
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );
}

// Country select component with search
function CountrySelect({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredCountries = countries.filter(
    (country) =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
  );

  const selectedCountry =
    countries.find((country) => country.iso === value) || defaultPhoneCountry;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((open) => !open)}
        disabled={disabled}
        className="px-3 py-3.5 rounded-2xl text-sm outline-none transition-all disabled:opacity-70 focus:ring-4 focus:ring-purple-100 w-[132px] flex items-center justify-between gap-2"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.14)",
          color: colors.dark,
        }}
        aria-label="Choose country calling code"
      >
        <span className="flex min-w-0 items-center gap-2">
          <CountryFlag country={selectedCountry} />
          <span className="font-bold">{selectedCountry.code}</span>
        </span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 mt-1 w-[290px] rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country or code..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Clear country search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.iso}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-sm"
                  style={{
                    background:
                      country.iso === value
                        ? "rgba(75,46,131,0.08)"
                        : "transparent",
                  }}
                >
                  <CountryFlag country={country} size="small" />
                  <span className="font-medium min-w-0 flex-1 truncate">
                    {country.country}
                  </span>
                  <span className="text-gray-500 text-xs shrink-0">
                    {country.code}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Admissions({
  editMode = false,
  contentOverride = null,
  onEditHero = () => {},
  onEditStep = () => {},
  onAddStep = () => {},
  onDeleteStep = () => {},
  onEditForm = () => {},
} = {}) {
  const [loadedContent, setLoadedContent] = useState(
    mergeAdmissionsContent(contentOverride || defaultAdmissionsContent)
  );
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultPhoneCountry);
  const [phoneNumber, setPhoneNumber] = useState("");

  const content = contentOverride
    ? mergeAdmissionsContent(contentOverride)
    : loadedContent;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    if (contentOverride) return;

    const loadAdmissionsContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/admissions",
          {
            timeout: 12000,
          }
        );

        const savedContent = res.data?.data?.content || {};
        setLoadedContent(mergeAdmissionsContent(savedContent));
      } catch (error) {
        console.error("Admissions content load error:", error);
        setLoadedContent(defaultAdmissionsContent);
      }
    };

    loadAdmissionsContent();
  }, [contentOverride]);

  const onSubmit = async (data) => {
    if (editMode) return;

    setSubmitMessage("");
    setSubmitError("");
    setSubmitted(false);

    const cleanPhone = `${selectedCountry?.code || "+977"}${phoneNumber}`;
    const grade = data.grade || "";
    const extraMessage = String(data.message || "").trim();

    const finalMessage = extraMessage
      ? `Admission inquiry for ${grade}.\n\nMessage: ${extraMessage}`
      : `Admission inquiry for ${grade}.`;

    try {
      await axios.post(
        "https://school-website-backend-ixx2.onrender.com/api/contact",
        {
          source: "admission",
          name: data.name,
          email: data.email,
          phone: cleanPhone,
          subject: `Admission Inquiry - ${grade}`,
          message: finalMessage,
        },
        {
          timeout: 15000,
        }
      );

      setSubmitMessage(content.successMessage);
      setSubmitted(true);
      reset();
      setPhoneNumber("");
    } catch (error) {
      console.error("Admission inquiry submit error:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Inquiry could not be submitted. Please contact the school office directly."
      );
    }
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setPhoneNumber(value);
    setValue("phone", value, { shouldValidate: true });
    trigger("phone");
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setValue("phone", phoneNumber, { shouldValidate: true });
    trigger("phone");
  };

  const visibleSteps = content.steps || [];

  return (
    <section
      id="admissions"
      className="pt-32 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {editMode && (
          <div
            className="mb-10 rounded-[2rem] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{
              background:
                "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.9))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 24px 70px rgba(11,16,32,0.22)",
            }}
          >
            <div>
              <div className="text-white font-black text-lg">
                Admin Admissions Editor Active
              </div>
              <div className="text-white/60 text-sm">
                Edit real page sections directly. Save changes from the admin top bar.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminEditButton label="Edit Heading" icon={Pencil} onClick={onEditHero} />
              <AdminEditButton label="Add Step" icon={Plus} tone="green" onClick={onAddStep} />
              <AdminEditButton label="Edit Form" icon={Pencil} tone="dark" onClick={onEditForm} />
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16 relative group"
        >
          {editMode && (
            <div className="absolute right-0 top-0 z-30">
              <AdminEditButton label="Edit" icon={Pencil} onClick={onEditHero} />
            </div>
          )}

          <EditShell editMode={editMode}>
            <span
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              {content.badgeText}
            </span>

            <h1
              className="text-5xl md:text-7xl leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.055em",
              }}
            >
              <HighlightedTitle
                title={content.title}
                highlightedText={content.highlightedText}
              />
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
              {content.subtitle}
            </p>
          </EditShell>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {visibleSteps.map((step, index) => {
            const stepColor = step.color || colors.green;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                id={`admission-step-${step.id}`}
                className="relative group"
              >
                {index < visibleSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-6 h-0.5 z-10"
                    style={{
                      background: `linear-gradient(90deg, ${stepColor}80, transparent)`,
                    }}
                  />
                )}

                {editMode && (
                  <div className="absolute right-4 top-4 z-30 flex flex-wrap gap-2">
                    <AdminEditButton
                      label="Edit"
                      icon={Pencil}
                      onClick={() => onEditStep(step)}
                    />
                    <AdminEditButton
                      label="Delete"
                      icon={Trash2}
                      tone="red"
                      onClick={() => onDeleteStep(step)}
                    />
                  </div>
                )}

                <div
                  className="p-6 rounded-3xl h-full transition-all duration-300 group-hover:-translate-y-2 cursor-default relative"
                  style={{
                    background: `
                      radial-gradient(circle at 88% 8%, ${stepColor}1F 0%, transparent 34%),
                      linear-gradient(145deg, ${stepColor}18 0%, rgba(255,255,255,0.92) 48%, ${stepColor}0D 100%)
                    `,
                    border: editMode
                      ? `2px dashed ${stepColor}88`
                      : `1px solid ${stepColor}38`,
                    boxShadow: `
                      0 18px 48px rgba(11,16,32,0.075),
                      0 12px 34px ${stepColor}12,
                      inset 0 1px 0 rgba(255,255,255,0.92)
                    `,
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 28px 70px rgba(11,16,32,0.14), 0 18px 44px ${stepColor}22, 0 0 0 1px ${stepColor}2E, inset 0 1px 0 rgba(255,255,255,0.96)`;
                    e.currentTarget.style.borderColor = `${stepColor}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 18px 48px rgba(11,16,32,0.075), 0 12px 34px ${stepColor}12, inset 0 1px 0 rgba(255,255,255,0.92)`;
                    e.currentTarget.style.borderColor = editMode
                      ? `${stepColor}88`
                      : `${stepColor}38`;
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <span
                      className="text-sm font-black tracking-widest"
                      style={{ color: stepColor }}
                    >
                      {step.step || String(index + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="w-14 h-1 rounded-full transition-all duration-300 group-hover:w-24"
                      style={{ background: stepColor }}
                    />
                  </div>

                  <h3
                    className="font-black text-2xl mb-4 text-slate-950 leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl mx-auto relative"
        >
          {editMode && (
            <div className="absolute right-4 top-4 z-30">
              <AdminEditButton label="Edit Form" icon={Pencil} onClick={onEditForm} />
            </div>
          )}

          <div
            className="group p-8 md:p-10 rounded-3xl transition-all duration-300"
            style={{
              background: `
                radial-gradient(circle at 8% 6%, rgba(215,25,32,0.13) 0%, transparent 31%),
                radial-gradient(circle at 94% 94%, rgba(22,138,58,0.14) 0%, transparent 34%),
                radial-gradient(circle at 86% 10%, rgba(75,46,131,0.10) 0%, transparent 30%),
                linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 58%, rgba(241,236,255,0.72) 100%)
              `,
              border: editMode
                ? "2px dashed rgba(56,189,248,0.75)"
                : "1px solid rgba(75,46,131,0.22)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 24px 70px rgba(11,16,32,0.11), 0 16px 42px rgba(75,46,131,0.10), inset 0 1px 0 rgba(255,255,255,0.94)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 34px 90px rgba(11,16,32,0.15), 0 22px 58px rgba(22,138,58,0.12), 0 0 0 1px rgba(215,25,32,0.10), inset 0 1px 0 rgba(255,255,255,0.98)";
              e.currentTarget.style.borderColor = editMode
                ? "rgba(56,189,248,0.95)"
                : "rgba(75,46,131,0.34)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 24px 70px rgba(11,16,32,0.11), 0 16px 42px rgba(75,46,131,0.10), inset 0 1px 0 rgba(255,255,255,0.94)";
              e.currentTarget.style.borderColor = editMode
                ? "rgba(56,189,248,0.75)"
                : "rgba(75,46,131,0.22)";
            }}
          >
            <div
              className="w-20 h-1 rounded-full mb-7 transition-all duration-300 group-hover:w-36"
              style={{
                background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
              }}
            />

            <h3
              className="text-3xl mb-2 text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.035em",
              }}
            >
              {content.formTitle}
            </h3>

            <p className="text-sm mb-8 text-slate-500 leading-relaxed">
              {content.formDescription}
            </p>

            {submitted ? (
              <div
                className="py-8 text-center rounded-2xl"
                style={{
                  background: "rgba(22,138,58,0.1)",
                  border: "1px solid rgba(22,138,58,0.2)",
                  boxShadow: "0 16px 42px rgba(22,138,58,0.1)",
                }}
              >
                <div
                  className="w-16 h-1 rounded-full mx-auto mb-5"
                  style={{ background: colors.green }}
                />

                <div className="text-slate-950 font-black text-xl">
                  {content.successTitle}
                </div>

                <div className="text-sm mt-2 text-slate-500">
                  {submitMessage || content.successMessage}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitMessage("");
                    setSubmitError("");
                  }}
                  className="mt-6 px-5 py-3 rounded-xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  if (editMode) {
                    event.preventDefault();
                    return;
                  }

                  handleSubmit(onSubmit)(event);
                }}
                className="space-y-5"
              >
                {submitError && (
                  <div
                    className="p-4 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(215,25,32,0.1)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.24)",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.nameLabel}
                    </label>

                    <input
                      {...register("name", {
                        required: editMode ? false : "Name is required.",
                      })}
                      disabled={editMode}
                      placeholder={content.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.emailLabel}
                    </label>

                    <input
                      {...register("email", {
                        required: editMode ? false : "Email is required.",
                      })}
                      disabled={editMode}
                      type="email"
                      placeholder={content.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.phoneLabel}
                    </label>

                    <div className="flex gap-2">
                      <CountrySelect
                        value={selectedCountry?.iso}
                        onChange={handleCountryChange}
                        disabled={editMode}
                      />

                      <input
                        {...register("phone", {
                          required: editMode ? false : "Phone number is required.",
                          validate: (value) => {
                            if (editMode) return true;

                            const localDigits = String(value || "").replace(/\D/g, "");

                            if (localDigits.length !== 10) {
                              return "Phone number must contain exactly 10 digits.";
                            }

                            return true;
                          },
                        })}
                        disabled={editMode}
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={content.phonePlaceholder}
                        className="min-w-0 w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                        maxLength={10}
                      />
                    </div>
                    <ErrorText>{errors.phone?.message}</ErrorText>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.gradeLabel}
                    </label>

                    <select
                      {...register("grade", {
                        required: editMode ? false : "Please select grade.",
                      })}
                      disabled={editMode}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    >
                      <option value="">{content.gradePlaceholder}</option>

                      {(content.grades || []).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <ErrorText>{errors.grade?.message}</ErrorText>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {content.messageLabel}
                  </label>

                  <textarea
                    {...register("message")}
                    disabled={editMode}
                    rows={4}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 resize-none disabled:opacity-75"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || editMode}
                  className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                    boxShadow: "0 16px 38px rgba(215,25,32,0.22)",
                  }}
                >
                  {isSubmitting
                    ? content.submittingText
                    : content.submitButtonText}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { Admissions };
export default Admissions;