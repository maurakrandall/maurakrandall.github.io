// The main strategy figures — Know Meter, Loop, Verticals, Contribution spectrum.

const { useState: _u1, useEffect: _u2, useRef: _u3 } = React;

// ─────────────────────────────────────────────────────────────
// Know Meter — horizontal bar with five phase markers
// Animates from 0 to `target` when it scrolls into view.
// ─────────────────────────────────────────────────────────────
function KnowMeter({ target = 76, height = 6, showLabels = true, interactive = true }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const id = setInterval(() => {
      v += 1.6;
      setValue(Math.min(v, target));
      if (v >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {/* Top tick legend */}
      {showLabels && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: K.mono, fontSize: 10, letterSpacing: 2,
          color: K.ink, opacity: 0.55, textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          <span style={{ fontWeight: 600, color: K.known, opacity: 1 }}>The Know Meter</span>
          <span>Rises through participation + sharing</span>
        </div>
      )}

      {/* The bar itself */}
      <div style={{
        position: 'relative', height,
        background: `${K.ink}12`, borderRadius: height / 2,
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${value}%`,
          background: `linear-gradient(90deg, ${K.phase.wondering} 0%, ${K.phase.exploring} 25%, ${K.phase.learning} 50%, ${K.phase.seeing} 75%, ${K.phase.knowing} 100%)`,
          borderRadius: height / 2,
          transition: 'width 60ms linear',
          boxShadow: `0 0 14px ${K.phase.knowing}44`,
        }}/>
        {/* Five phase markers */}
        {PHASES.map((p, i) => (
          <div key={p.id}
            onMouseEnter={() => interactive && setHover(i)}
            onMouseLeave={() => interactive && setHover(null)}
            style={{
              position: 'absolute', left: `${(i / (PHASES.length - 1)) * 100}%`,
              top: '50%', transform: 'translate(-50%, -50%)',
              width: 14, height: 14, borderRadius: '50%',
              background: value >= p.meter ? p.color : K.paper,
              border: `1.5px solid ${value >= p.meter ? p.color : K.ink + '40'}`,
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 280ms ease',
              boxShadow: hover === i ? `0 0 0 6px ${p.color}22` : 'none',
              zIndex: 2,
            }}/>
        ))}
      </div>

      {showLabels && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 14,
        }}>
          {PHASES.map((p, i) => (
            <div key={p.id} style={{
              flex: 1, textAlign: 'center',
              borderLeft: i === 0 ? 'none' : `1px solid ${K.ink}0E`,
              padding: '0 4px',
            }}>
              <div style={{
                fontFamily: K.mono, fontSize: 9, letterSpacing: 2,
                color: p.color, fontWeight: 600,
              }}>{p.roman}</div>
              <div style={{
                fontFamily: K.display, fontSize: 15,
                color: K.ink, marginTop: 3, letterSpacing: -0.2,
                fontStyle: value >= p.meter ? 'normal' : 'italic',
                opacity: value >= p.meter ? 1 : 0.6,
              }}>{p.label}</div>
              {hover === i && (
                <div style={{
                  fontFamily: K.sans, fontSize: 11, color: K.inkMute,
                  marginTop: 4, lineHeight: 1.35, opacity: 0.8,
                  animation: 'k-fade-in 300ms ease',
                }}>{p.summary}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LoopDiagram — the 8-step loop rendered as a wheel
// ─────────────────────────────────────────────────────────────
function LoopDiagram() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActive(a => (a + 1) % LOOP.length), 2200);
    return () => clearInterval(id);
  }, [inView]);

  const size = 520;
  const cx = size / 2, cy = size / 2;
  const R = 210;

  return (
    <div ref={ref} style={{
      position: 'relative', width: size, height: size, margin: '0 auto',
    }}>
      {/* Outer ring */}
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke={K.ink} strokeOpacity="0.12" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R - 60} fill="none"
          stroke={K.ink} strokeOpacity="0.08" strokeWidth="1" />
        {/* arrows between points */}
        {LOOP.map((_, i) => {
          const a1 = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / LOOP.length) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(a1 + 0.1) * R;
          const y1 = cy + Math.sin(a1 + 0.1) * R;
          const x2 = cx + Math.cos(a2 - 0.1) * R;
          const y2 = cy + Math.sin(a2 - 0.1) * R;
          return (
            <path key={i}
              d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={active === i ? K.known : K.ink}
              strokeOpacity={active === i ? 0.8 : 0.18}
              strokeWidth={active === i ? 1.5 : 1}
              style={{ transition: 'all 400ms ease' }}
            />
          );
        })}
      </svg>

      {/* Step nodes */}
      {LOOP.map((s, i) => {
        const angle = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * R;
        const y = cy + Math.sin(angle) * R;
        const isActive = active === i;
        return (
          <div key={i}
            onClick={() => setActive(i)}
            style={{
              position: 'absolute', left: x, top: y,
              transform: 'translate(-50%, -50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: isActive ? K.known : K.paper,
              border: `1.5px solid ${isActive ? K.known : K.ink + '33'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: K.mono, fontSize: 12, fontWeight: 600,
              color: isActive ? K.paper : K.ink,
              cursor: 'pointer', transition: 'all 300ms ease',
              boxShadow: isActive ? `0 0 0 8px ${K.known}22` : 'none',
              zIndex: 2,
            }}>{s.n}</div>
        );
      })}

      {/* Labels beside nodes */}
      {LOOP.map((s, i) => {
        const angle = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (R + 46);
        const ly = cy + Math.sin(angle) * (R + 46);
        const align = Math.cos(angle) < -0.1 ? 'right' : Math.cos(angle) > 0.1 ? 'left' : 'center';
        return (
          <div key={i} style={{
            position: 'absolute', left: lx, top: ly,
            transform: `translate(${align === 'right' ? '-100%' : align === 'center' ? '-50%' : '0'}, -50%)`,
            width: 130, textAlign: align,
            pointerEvents: 'none',
          }}>
            <Tag color={K.ink} opacity={active === i ? 0.9 : 0.55}>
              Step&nbsp;{s.n}
            </Tag>
            <div style={{
              fontFamily: K.display, fontSize: 16,
              color: active === i ? K.ink : K.inkSoft,
              fontStyle: active === i ? 'normal' : 'italic',
              fontWeight: active === i ? 500 : 400,
              letterSpacing: -0.1, marginTop: 2,
              transition: 'all 300ms ease',
            }}>{s.title}</div>
          </div>
        );
      })}

      {/* Center content */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 220, textAlign: 'center',
      }}>
        <Tag color={K.known} opacity={1}>Step {LOOP[active].n}</Tag>
        <div style={{
          fontFamily: K.display, fontSize: 24, lineHeight: 1.15,
          color: K.ink, marginTop: 8, fontWeight: 400, letterSpacing: -0.3,
        }}>{LOOP[active].title}</div>
        <div style={{
          fontFamily: K.display, fontStyle: 'italic', fontSize: 13,
          color: K.inkMute, marginTop: 6,
        }}>{LOOP[active].sub}</div>
        <div style={{
          fontFamily: K.sans, fontSize: 12, color: K.inkSoft,
          marginTop: 12, lineHeight: 1.5, fontStyle: 'italic',
          opacity: 0.85,
        }}>"{LOOP[active].body}"</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ContributionSpectrum — four columns, one per level
// ─────────────────────────────────────────────────────────────
function ContributionSpectrum() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0, borderTop: `1px solid ${K.ink}25`,
      borderBottom: `1px solid ${K.ink}25`,
    }}>
      {CONTRIB.map((c, i) => (
        <Reveal key={c.level} delay={i * 80}>
          <div style={{
            padding: '32px 28px',
            borderRight: i < CONTRIB.length - 1 ? `1px solid ${K.ink}15` : 'none',
            position: 'relative', height: '100%',
          }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14,
            }}>
              <div style={{
                fontFamily: K.display, fontSize: 42, color: K.known,
                fontWeight: 400, letterSpacing: -2, lineHeight: 1,
              }}>0{c.level}</div>
              <Tag color={K.ink}>Level {c.level}</Tag>
            </div>
            <div style={{
              fontFamily: K.display, fontSize: 22, color: K.ink,
              fontWeight: 400, letterSpacing: -0.3,
              marginBottom: 18,
            }}>{c.label}</div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              fontFamily: K.sans, fontSize: 12, color: K.inkSoft,
            }}>
              <SpecRow label="Cost"    value={c.cost} />
              <SpecRow label="Account" value={c.account} />
              <SpecRow label="Sharing" value={c.sharing} />
              <SpecRow label="Earns"   value={c.earns} accent />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function SpecRow({ label, value, accent = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <Tag opacity={0.55}>{label}</Tag>
      <span style={{
        fontFamily: K.sans, fontSize: 12,
        color: accent ? K.known : K.inkSoft,
        fontWeight: accent ? 600 : 400,
        textAlign: 'right',
      }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VerticalsGrid — catalog of verticals with per-vertical meter
// ─────────────────────────────────────────────────────────────
function VerticalsGrid() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0, borderTop: `1px solid ${K.ink}20`,
    }}>
      {VERTICALS.map((v, i) => (
        <div key={v.id} style={{
          padding: '32px 30px',
          borderRight: i % 3 !== 2 ? `1px solid ${K.ink}15` : 'none',
          borderBottom: i < VERTICALS.length - 3 ? `1px solid ${K.ink}15` : 'none',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 2,
              background: v.color, opacity: 0.9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: K.display, fontSize: 16, color: K.paper,
              fontWeight: 500, letterSpacing: -0.3,
            }}>{v.label[0]}</div>
            <Tag color={K.inkMute} opacity={0.7}>{v.status}</Tag>
          </div>

          <div>
            <div style={{
              fontFamily: K.display, fontSize: 28, color: K.ink,
              letterSpacing: -0.5, fontWeight: 400,
            }}>KNOWlings: <span style={{ fontStyle: 'italic' }}>{v.label}</span></div>
          </div>

          {/* Per-vertical meter */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 6,
              fontFamily: K.mono, fontSize: 9, letterSpacing: 1.5, color: K.inkMute,
            }}>
              <span>Vertical Know Meter</span>
              <span>{v.knowlings} Knowlings</span>
            </div>
            <div style={{
              height: 3, background: `${K.ink}12`, position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                width: `${v.meter}%`,
                background: v.color, opacity: 0.85,
              }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SharingSpectrum — horizontal gradient bar showing Anon → Attributed
// ─────────────────────────────────────────────────────────────
function SharingSpectrum() {
  const stops = [
    { label: 'Anonymous',  sub: 'no account', color: K.phase.wondering },
    { label: 'Private',    sub: 'aggregate only', color: K.phase.exploring },
    { label: 'Selective',  sub: 'contacts', color: K.phase.learning },
    { label: 'Public',     sub: 'opt-in', color: K.phase.seeing },
    { label: 'Attributed', sub: 'full Knowing', color: K.phase.knowing },
  ];
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: K.mono, fontSize: 10, letterSpacing: 2,
        color: K.ink, opacity: 0.55, textTransform: 'uppercase',
        marginBottom: 14,
      }}>
        <span style={{ fontWeight: 600, opacity: 1 }}>Sharing — horizontal to every phase</span>
        <span>Optional · always rewarded · never required</span>
      </div>
      <div style={{
        height: 10, borderRadius: 5, position: 'relative',
        background: `linear-gradient(90deg, ${K.phase.wondering}40 0%, ${K.phase.exploring}60 25%, ${K.phase.learning}70 50%, ${K.phase.seeing}80 75%, ${K.phase.knowing} 100%)`,
      }}>
        {stops.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i / (stops.length - 1)) * 100}%`,
            top: -4, width: 1, height: 18,
            background: K.ink, opacity: 0.3,
            transform: 'translateX(-0.5px)',
          }}/>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 14,
      }}>
        {stops.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontFamily: K.display, fontSize: 16, color: K.ink,
              fontWeight: 500, letterSpacing: -0.2,
            }}>{s.label}</div>
            <div style={{
              fontFamily: K.sans, fontSize: 11, color: K.inkMute,
              marginTop: 2,
            }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  KnowMeter, LoopDiagram, ContributionSpectrum,
  VerticalsGrid, SharingSpectrum,
});
