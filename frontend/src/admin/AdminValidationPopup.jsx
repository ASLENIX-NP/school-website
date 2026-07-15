import { AlertCircle } from "lucide-react";

export function getFirstEmptyField(fields = []) {
  for (const [label, value] of fields) {
    if (String(value ?? "").trim() === "") {
      return `${label} cannot be empty.`;
    }
  }

  return "";
}

export default function AdminValidationPopup({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      className="fixed inset-0 z-[300000] flex items-center justify-center p-4"
      style={{
        background: "rgba(2,6,23,0.62)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[28px] bg-white p-6"
        style={{
          border: "1px solid rgba(255,255,255,0.78)",
          boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-black text-slate-950">
          Please complete this field
        </h3>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl px-5 py-3 text-sm font-black text-slate-950"
          style={{
            background: "linear-gradient(135deg, #FACC15, #38BDF8)",
            boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
