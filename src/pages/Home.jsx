import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Accent } from "../components/Accent";
import { WorkPreview } from "../components/WorkPreview";
import { asset } from "../lib/asset";
import { useCms } from "../state/store";

function usePin(ref) {
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("top");

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;
    const paint = () => {
      const rect = node.getBoundingClientRect();
      const total = Math.max(1, node.offsetHeight - window.innerHeight);
      const passed = Math.min(total, Math.max(0, -rect.top));
      setProgress(passed / total);
      if (rect.top <= 1 && rect.bottom > window.innerHeight + 1) setMode("fixed");
      else if (rect.bottom <= window.innerHeight + 1) setMode("bottom");
      else setMode("top");
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return { progress, mode };
}

export function Home() {
  const cms = useCms();
  const reelRef = useRef(null);
  const depthRef = useRef(null);
  const wordRef = useRef(null);
  const reel = usePin(reelRef);
  const depth = usePin(depthRef);
  const reelProgress = reel.progress;
  const depthProgress = depth.progress;
  const [shift, setShift] = useState(0);
  const [preview, setPreview] = useState(null);
  const posts = cms.posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShift(0);
      return;
    }
    const travel = word.offsetWidth + window.innerWidth;
    setShift(window.innerWidth * 0.72 - reelProgress * travel);
  }, [reelProgress]);

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setPreview(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [preview]);

  const section = cms.sections.find((item) => item.id === preview?.sectionId);

  return (
    <>
      <section className="reel" ref={reelRef}>
        <div className={`reel-pin ${reel.mode}`}>
          <p className="kicker">Reel</p>
          <h1
            ref={wordRef}
            className="reel-word"
            style={{
              transform: `translate3d(${shift}px, 0, 0)`,
              backgroundImage: `url(${asset("zigzag/reel.gif")})`,
            }}
          >
            manifiesto
          </h1>
        </div>
      </section>

      <section className="depth" ref={depthRef} style={{ height: `${Math.max(posts.length, 1) * 70}vh` }}>
        <div className={`depth-pin ${depth.mode}`}>
          <div className="depth-head">
            <p className="kicker">Portfolio</p>
            <h2>
              Trabajos en <em>profundidad</em>
            </h2>
          </div>
          <div className="depth-scene">
            {posts.map((post, index) => {
              const offset = index - depthProgress * Math.max(posts.length - 1, 1);
              const distance = Math.abs(offset);
              return (
                <button
                  key={post.id}
                  type="button"
                  className="depth-card"
                  style={{
                    transform: `translate3d(${offset * 280}px, 0, ${-distance * 160}px) scale(${1 - Math.min(0.28, distance * 0.12)})`,
                    opacity: Math.max(0.35, 1 - distance * 0.22),
                    zIndex: 20 - Math.round(distance * 4),
                  }}
                  onClick={() => setPreview(post)}
                >
                  <img src={post.image || asset("isotipo.png")} alt="" />
                  <span>
                    <Accent text={post.title} />
                  </span>
                </button>
              );
            })}
          </div>
          <Link className="btn" to="/portfolio">
            Ver el portfolio
          </Link>
        </div>
      </section>

      <WorkPreview post={preview} section={section} onClose={() => setPreview(null)} />
    </>
  );
}
