import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function zigzag(height) {
  const step = 96;
  const left = 18;
  const right = 58;
  let y = 0;
  let toRight = true;
  let d = `M ${left} 0`;
  while (y < height) {
    y = Math.min(height, y + step);
    d += ` L ${toRight ? right : left} ${y}`;
    toRight = !toRight;
  }
  return d;
}

export function ZigzagTrail() {
  const { pathname } = useLocation();
  const pathRef = useRef(null);
  const riderRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const rider = riderRef.current;
    if (!path || !rider) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    function paint() {
      const height = window.innerHeight;
      const svg = path.ownerSVGElement;
      svg.setAttribute("viewBox", `0 0 88 ${height}`);
      path.setAttribute("d", zigzag(height));
      const length = path.getTotalLength();
      const max = Math.max(1, document.documentElement.scrollHeight - height);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      path.style.strokeDasharray = reduce ? "none" : `${length}`;
      path.style.strokeDashoffset = reduce ? "0" : `${length * (1 - progress)}`;
      const point = path.getPointAtLength(length * progress);
      rider.setAttribute("transform", `translate(${point.x} ${point.y})`);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <svg className="zig-trail" aria-hidden="true">
      <path ref={pathRef} />
      <g ref={riderRef}>
        <rect className="zig-gold" x="-9" y="-9" width="16" height="16" />
        <rect className="zig-red" x="4" y="-5" width="18" height="10" />
      </g>
    </svg>
  );
}
