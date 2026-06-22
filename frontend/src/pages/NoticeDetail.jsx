import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PdfNoticePreview from "../app/components/PdfNoticePreview";

function formatNoticeDate(dateValue) {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoticeDetail() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotice() {
      try {
        const res = await fetch(`http://localhost:5000/api/notices/${id}`);
        const result = await res.json();

        setNotice(result.data || result);
      } catch (error) {
        console.error("Notice detail load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 px-6 text-center font-black text-slate-500">
        Loading notice...
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen pt-36 px-6 text-center">
        <h1 className="text-3xl font-black text-slate-950 mb-4">
          Notice not found
        </h1>

        <Link to="/notices" className="font-bold text-green-700">
          Back to Notices
        </Link>
      </div>
    );
  }

  const fileUrl =
    notice.pdf_url || notice.pdfUrl || notice.file_url || notice.fileUrl || "";

  return (
    <section
      className="min-h-screen pt-32 pb-24 px-6"
      style={{
        background:
          "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <Link
          to="/notices"
          className="inline-flex mb-6 rounded-2xl px-5 py-3 text-sm font-black"
          style={{
            background: "#FFFFFF",
            color: "#0B1020",
            border: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          ← Back to Notices
        </Link>

        <div
          className="rounded-[32px] overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
          }}
        >
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
            }}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em]"
                style={{
                  background: "rgba(22,138,58,0.09)",
                  color: "#168A3A",
                  border: "1px solid rgba(22,138,58,0.18)",
                }}
              >
                {notice.category || "Notice"}
              </span>

              <span className="text-sm font-bold text-slate-400">
                {formatNoticeDate(notice.notice_date || notice.date)}
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl text-slate-950 leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.05em",
              }}
            >
              {notice.title || "School Notice"}
            </h1>

            {notice.description && (
              <p className="text-lg leading-relaxed text-slate-600 mb-7 whitespace-pre-line">
                {notice.description}
              </p>
            )}

            {fileUrl ? (
              <>
                <div className="h-[75vh] rounded-[24px] overflow-hidden">
                  <PdfNoticePreview
                    fileUrl={fileUrl}
                    title={notice.title || "Notice PDF"}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl px-5 py-3 text-sm font-black"
                    style={{
                      background: "rgba(75,46,131,0.08)",
                      color: "#4B2E83",
                      border: "1px solid rgba(75,46,131,0.18)",
                    }}
                  >
                    Open PDF
                  </a>

                  <a
                    href={fileUrl}
                    download
                    className="rounded-2xl px-5 py-3 text-sm font-black text-white"
                    style={{
                      background: "#0B1020",
                    }}
                  >
                    Download PDF
                  </a>
                </div>
              </>
            ) : (
              <div
                className="rounded-[24px] p-6"
                style={{
                  background: "rgba(15,23,42,0.035)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <p className="text-lg text-slate-600">
                  No PDF attached for this notice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}