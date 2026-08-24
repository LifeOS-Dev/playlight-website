import { useEffect, useRef, useState } from "react";
import { CORE_FOUR, type CoreFace } from "./coreFour";

type Props = {
  onActiveFace: (face: CoreFace | null, reveal: number) => void;
};

/**
 * Sticky Core Four: problem appears, then solution slides in.
 * One face at a time. Visual-first, minimal copy.
 */
export function CoreFourSequence({ onActiveFace }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const update = () => {
      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const inStage = rect.top <= 40 && rect.bottom > window.innerHeight * 0.55;
      if (!inStage) {
        if (rect.bottom <= window.innerHeight * 0.55) {
          onActiveFace(null, 0);
        }
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const t = scrolled / total;
      const segment = 1 / CORE_FOUR.length;
      const i = Math.min(CORE_FOUR.length - 1, Math.floor(t / segment));
      const local = (t - i * segment) / segment;
      const r = Math.min(1, Math.max(0, (local - 0.18) / 0.55));

      setIndex(i);
      setReveal(r);
      onActiveFace(CORE_FOUR[i], r);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onActiveFace]);

  const face = CORE_FOUR[index];

  return (
    <section
      ref={rootRef}
      id="core-four-a"
      className="relative"
      style={{ height: `${CORE_FOUR.length * 140}vh` }}
      aria-label="Four pressures Playlight holds"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 md:pt-32">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.35em] text-[#C8C0B4]/55">
          Four pressures · one light
        </p>

        <div className="relative w-full max-w-4xl">
          <p
            key={face.id}
            className="mb-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#FFA32B]/80 transition-opacity duration-500"
          >
            {face.label}
          </p>

          <div className="relative mx-auto min-h-[9.5rem] w-full md:min-h-[6.5rem]">
            <div
              className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-10"
              style={{
                transform: `translateX(${(1 - reveal) * -4}%)`,
              }}
            >
              <blockquote
                className="max-w-md text-center font-display text-[clamp(1.25rem,3.2vw,1.85rem)] font-light leading-snug tracking-tight text-[#F2EEE9] transition-opacity duration-300 md:text-right"
                style={{ opacity: 1 - reveal * 0.15 }}
              >
                “{face.problem}”
              </blockquote>

              <div
                className="hidden h-10 w-px shrink-0 bg-gradient-to-b from-transparent via-[#FFA32B]/50 to-transparent md:block"
                style={{ opacity: reveal }}
                aria-hidden
              />

              <p
                className="max-w-md text-center font-body text-[clamp(1.05rem,2.6vw,1.3rem)] leading-relaxed text-[#E8A54B] transition-[opacity,transform] duration-300 md:text-left"
                style={{
                  opacity: Math.max(0, (reveal - 0.08) / 0.92),
                  transform: `translateX(${(1 - reveal) * 28}px)`,
                }}
                aria-hidden={reveal < 0.12}
              >
                {face.solution}
              </p>
            </div>
          </div>

          <FaceMotif id={face.id} reveal={reveal} />
        </div>

        <div className="mt-12 flex items-center gap-3" aria-hidden>
          {CORE_FOUR.map((f, i) => (
            <span
              key={f.id}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 22 : 6,
                background:
                  i === index ? "#FFA32B" : "rgba(200,192,180,0.25)",
                boxShadow:
                  i === index ? "0 0 12px rgba(255,163,43,0.45)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaceMotif({
  id,
  reveal,
}: {
  id: CoreFace["id"];
  reveal: number;
}) {
  const lit = 0.25 + reveal * 0.75;

  return (
    <div
      className="mx-auto mt-10 flex h-16 w-full max-w-xs items-center justify-center"
      aria-hidden
    >
      {id === "fog" && (
        <svg viewBox="0 0 200 48" className="h-12 w-full" fill="none">
          <circle
            cx="100"
            cy="24"
            r="10"
            fill={`rgba(255,163,43,${0.15 + reveal * 0.55})`}
          />
          <path
            d="M20 24 H78 M122 24 H180"
            stroke={`rgba(200,192,180,${0.15 + (1 - reveal) * 0.35})`}
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle cx="40" cy="24" r="2" fill={`rgba(200,192,180,${0.2 * (1 - reveal)})`} />
          <circle cx="160" cy="24" r="2" fill={`rgba(200,192,180,${0.2 * (1 - reveal)})`} />
        </svg>
      )}
      {id === "invisible" && (
        <svg viewBox="0 0 200 48" className="h-12 w-full" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={36 + i * 36}
              y={12 + (3 - i) * 2}
              width="22"
              height={24 - (3 - i) * 2}
              rx="3"
              fill={`rgba(255,163,43,${0.12 + lit * (0.15 + i * 0.12)})`}
              stroke={`rgba(255,163,43,${0.2 + lit * 0.4})`}
              strokeWidth="0.8"
            />
          ))}
        </svg>
      )}
      {id === "balance" && (
        <svg viewBox="0 0 200 48" className="h-12 w-full" fill="none">
          {[
            { x: 40, h: 10 + reveal * 14, c: "rgba(140,190,160," },
            { x: 80, h: 22 - reveal * 4, c: "rgba(130,160,210," },
            { x: 120, h: 8 + reveal * 16, c: "rgba(220,180,90," },
            { x: 160, h: 18 - reveal * 2, c: "rgba(210,140,140," },
          ].map((p) => (
            <g key={p.x}>
              <line
                x1={p.x}
                y1="40"
                x2={p.x}
                y2={40 - p.h}
                stroke={`${p.c}${0.35 + lit * 0.45})`}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ))}
          <line
            x1="28"
            y1="42"
            x2="172"
            y2="42"
            stroke="rgba(200,192,180,0.25)"
            strokeWidth="1"
          />
        </svg>
      )}
      {id === "lessons" && (
        <svg viewBox="0 0 200 48" className="h-12 w-full" fill="none">
          <path
            d="M30 34 C60 34, 70 14, 100 14 C130 14, 140 34, 170 34"
            stroke={`rgba(255,163,43,${0.25 + lit * 0.5})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="100" cy="14" r="3.5" fill={`rgba(255,163,43,${0.4 + lit * 0.5})`} />
          <circle cx="52" cy="30" r="2" fill={`rgba(200,192,180,${0.35 * lit})`} />
          <circle cx="148" cy="30" r="2" fill={`rgba(200,192,180,${0.35 * lit})`} />
        </svg>
      )}
    </div>
  );
}
