import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Image as ImageIcon,
  Maximize2,
  X,
} from "lucide-react";
import {
  defaultBlogContent,
  formatBlogDate,
  makeBlogSlug,
  mergeBlogContent,
  resolveBlogImageUrl,
} from "./Blogs";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";

/* Small image used by related-post cards (always fills the card). */
function BlogImage({ post }) {
  const imageUrl = resolveBlogImageUrl(post?.imageUrl);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [imageUrl]);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={post.imageAlt || post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <ImageIcon className="h-10 w-10 text-slate-300" />
    </div>
  );
}

/* Hero image for the blog detail page.
   The frame wraps the image tightly, so no grey/blurred area is ever shown. */
function BlogHeroImage({ post }) {
  const imageUrl = resolveBlogImageUrl(post?.imageUrl);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!imageUrl || failed) return null;

  const alt = post.imageAlt || post.title;

  return (
    <>
      <div className="flex justify-center px-4 pb-2 md:px-8 lg:px-10">
        <div
          className="relative inline-block max-w-full overflow-hidden rounded-[24px] leading-[0]"
          style={{ boxShadow: "0 18px 44px rgba(15,23,42,0.14)" }}
        >
          <img
            src={imageUrl}
            alt={alt}
            draggable={false}
            onClick={() => setOpen(true)}
            onError={() => setFailed(true)}
            className="block h-auto w-auto max-w-full cursor-zoom-in"
            style={{ maxHeight: "clamp(220px, 46vh, 460px)" }}
          />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white backdrop-blur-md transition-transform hover:scale-105"
            aria-label="View full screen"
            title="View full screen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              src={imageUrl}
              alt={alt}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="max-h-[92vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function splitContent(content = "") {
  const text = String(content || "").trim();
  if (!text) return [];
  return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

function RelatedCard({ post }) {
  return (
    <Link to={`/blogs/${post.slug}`} className="group block rounded-[24px] bg-white overflow-hidden shadow-lg border border-slate-100 transition-all hover:-translate-y-1">
      <div className="h-40 overflow-hidden bg-slate-100">
        <BlogImage post={post} />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-black text-slate-950">{post.title}</h3>
        <p className="mt-2 text-xs font-bold" style={{ color: colors.green }}>
          {post.category} / {formatBlogDate(post.date)}
        </p>
      </div>
    </Link>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/blogs`, {
          timeout: 12000,
        });

        if (!alive) return;
        setContent(mergeBlogContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Blog detail load error:", error);
        if (alive) setContent(mergeBlogContent(defaultBlogContent));
      } finally {
        if (alive) setLoaded(true);
      }
    };

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  const posts = useMemo(
    () => (content.posts || []).filter((post) => post.visible !== false),
    [content.posts]
  );

  const currentIndex = posts.findIndex((post) => {
    const routeSlug = decodeURIComponent(slug || "");
    const postSlug = decodeURIComponent(String(post.slug || ""));
    const id = String(post.id || "");
    return postSlug === routeSlug || id === routeSlug || makeBlogSlug(post.title, id) === routeSlug;
  });
  const post = currentIndex >= 0 ? posts[currentIndex] : null;
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const relatedPosts = post
    ? posts.filter((item) => item.id !== post.id && item.category === post.category).slice(0, 4)
    : [];

  if (!loaded) {
    return <section className="min-h-screen bg-white pt-32" aria-label="Loading blog post" />;
  }

  if (!post) {
    return (
      <section className="min-h-screen pt-32 pb-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-black text-slate-950">Blog post not found</h1>
          <Link to="/blogs" className="mt-6 inline-flex rounded-full px-5 py-3 font-black" style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const paragraphs = splitContent(post.content || post.excerpt);

  return (
    <section
      className="min-h-screen pt-28 pb-24"
      style={{
        background: "#fff",
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/blogs"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-slate-700 shadow-lg border border-slate-100 transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[34px] bg-white shadow-2xl border border-slate-100"
        >
          <div className="p-6 md:p-10 lg:p-12">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-black">
              <span className="rounded-full px-4 py-1.5" style={{ background: "rgba(22,138,58,0.08)", color: colors.green }}>
                {post.category}
              </span>
              <span className="inline-flex items-center gap-2 text-slate-400">
                <CalendarDays className="h-4 w-4" /> {formatBlogDate(post.date)}
              </span>
            </div>

            <h1
              className="max-w-5xl text-4xl md:text-6xl text-slate-950"
              style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.065em", lineHeight: 0.96 }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-500">
                {post.excerpt}
              </p>
            )}
          </div>

          <BlogHeroImage post={post} />

          <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-12">
            <div className="space-y-6 text-lg leading-[1.95] text-slate-600">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.article>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-[28px] bg-white/75 p-5 shadow-xl border border-slate-100">
          {previousPost ? (
            <Link to={`/blogs/${previousPost.slug}`} className="font-black text-slate-700 hover:text-slate-950">
              ← Previous Post
            </Link>
          ) : (
            <span />
          )}

          {nextPost ? (
            <Link to={`/blogs/${nextPost.slug}`} className="inline-flex items-center gap-2 font-black text-slate-700 hover:text-slate-950">
              Next Post <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12 rounded-[30px] bg-white/80 p-6 md:p-8 shadow-xl border border-slate-100">
            <h2 className="mb-6 text-3xl font-black text-slate-950">Related Posts</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((relatedPost) => (
                <RelatedCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}