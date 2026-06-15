// Field-journal primitives

const { useState, useEffect, useRef } = React;

// Section — full-width band with consistent left/right gutters
function KSection({ children, id, style = {}, bg, stripe, noTop }) {
  return (
    <section id={id} style={{
      width: '100%', position: 'relative',
      background: bg || 'transparent',
      paddingTop: noTop ? 0 : 120,
      paddingBottom: 120,
      borderTop: stripe ? `1px solid ${K.ink}15` : 'none',
      ...style,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 48px',
        position: 'relative',
      }}>
        {children}
      </div>
    </section>
  );
}

// Running number — "§ 03" in the corner of a section
function SectionNumber({ n, label, color = K.ink }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 16,
      fontFamily: K.mono, fontSize: 11, letterSpacing: 3,
      textTransform: 'uppercase', color: color, opacity: 0.55,
      marginBottom: 22,
    }}>
      <span style={{ fontWeight: 600 }}>§&nbsp;{String(n).padStart(2, '0')}</span>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.35 }}/>
      <span>{label}</span>
    </div>
  );
}

// Display heading — serif, tight
function Display({ children, size = 56, color = K.ink, style = {} }) {
  return (
    <div style={{
      fontFamily: K.display, fontSize: size, lineHeight: 1.05,
      color, fontWeight: 400, letterSpacing: -1.2,
      textWrap: 'balance',
      ...style,
    }}>{children}</div>
  );
}

// Italic serif fragment (used for emphasis)
function Ital({ children, color = K.ink, style = {} }) {
  return (
    <span style={{
      fontFamily: K.display, fontStyle: 'italic', fontWeight: 400,
      color, ...style,
    }}>{children}</span>
  );
}

// Body paragraph
function Body({ children, size = 17, color = K.inkSoft, style = {} }) {
  return (
    <p style={{
      fontFamily: K.sans, fontSize: size, lineHeight: 1.55,
      color, margin: 0, textWrap: 'pretty',
      ...style,
    }}>{children}</p>
  );
}

// Hairline
function Hair({ v = false, style = {} }) {
  return (
    <div style={{
      background: K.ink, opacity: 0.15,
      width:  v ? 1 : '100%',
      height: v ? '100%' : 1,
      ...style,
    }}/>
  );
}

// Keyline frame (thin box with corner ticks)
function Frame({ children, color = K.ink, pad = 32, style = {} }) {
  const tick = (pos) => (
    <div style={{
      position: 'absolute', width: 14, height: 14,
      border: `1px solid ${color}`, borderRadius: 0,
      ...pos,
    }}/>
  );
  return (
    <div style={{
      position: 'relative', padding: pad,
      border: `1px solid ${color}30`,
      ...style,
    }}>
      {tick({ top: -1, left: -1, borderRight: 'none', borderBottom: 'none' })}
      {tick({ top: -1, right: -1, borderLeft: 'none', borderBottom: 'none' })}
      {tick({ bottom: -1, left: -1, borderRight: 'none', borderTop: 'none' })}
      {tick({ bottom: -1, right: -1, borderLeft: 'none', borderTop: 'none' })}
      {children}
    </div>
  );
}

// Small taxonomy label (monospace all-caps)
function Tag({ children, color = K.ink, opacity = 0.7, style = {} }) {
  return (
    <span style={{
      fontFamily: K.mono, fontSize: 10, letterSpacing: 2,
      textTransform: 'uppercase', color, opacity,
      fontWeight: 500, ...style,
    }}>{children}</span>
  );
}

// Marginalia — small note in gutter
function Margin({ children, color = K.inkMute, style = {} }) {
  return (
    <div style={{
      fontFamily: K.display, fontStyle: 'italic', fontSize: 14,
      color, lineHeight: 1.4, letterSpacing: 0.1, ...style,
    }}>{children}</div>
  );
}

// Intersection observer hook — trigger once when in view
function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Reveal on scroll
function Reveal({ children, delay = 0, y = 18, style = {} }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 720ms ${delay}ms cubic-bezier(.2,.7,.2,1), transform 720ms ${delay}ms cubic-bezier(.2,.7,.2,1)`,
      ...style,
    }}>{children}</div>
  );
}

// Figure label "FIG. 03 — …"
function FigLabel({ n, children, color = K.ink }) {
  return (
    <div style={{
      fontFamily: K.mono, fontSize: 10, letterSpacing: 2.4,
      textTransform: 'uppercase', color, opacity: 0.6,
      marginBottom: 10,
    }}>
      Fig.&nbsp;{String(n).padStart(2,'0')}&nbsp;·&nbsp;{children}
    </div>
  );
}

// Paper texture — overlaid subtle noise
function PaperTexture() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.10  0 0 0 0 0.15  0 0 0 0 0.25  0 0 0 0.045 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      mixBlendMode: 'multiply',
    }}/>
  );
}

Object.assign(window, {
  KSection, SectionNumber, Display, Ital, Body, Hair, Frame, Tag,
  Margin, Reveal, FigLabel, PaperTexture, useInView,
});
