import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Users, BookOpen, Trophy, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 3800,
    suffix: "+",
    label: "Students Enrolled",
    color: "#f97316"
  },
  {
    icon: BookOpen,
    value: 240,
    suffix: "+",
    label: "Expert Teachers",
    color: "#6b21a8"
  },
  {
    icon: Trophy,
    value: 35,
    suffix: " yrs",
    label: "Years of Excellence",
    color: "#f97316"
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "University Success Rate",
    color: "#6b21a8"
  }
];

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          const duration = 1800;
          const start = performance.now();

          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);

            setCount(Math.round(ease * target));

            if (t < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function Stats() {
  return (
    <section className="py-20 relative" style={{ background: "#fdf8f3" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group"
              >
                <div
                  className="relative p-8 rounded-3xl text-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(15,28,63,0.08)",
                    boxShadow: "0 4px 24px rgba(15,28,63,0.07)"
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{
                      background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`
                    }}
                  />

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${stat.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: stat.color }} />
                  </div>

                  <div
                    className="text-4xl md:text-5xl mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#0f1c3f"
                    }}
                  >
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>

                  <div
                    className="text-sm font-medium"
                    style={{ color: "#64748b" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { Stats };
export default Stats;