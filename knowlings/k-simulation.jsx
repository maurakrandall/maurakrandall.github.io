// BurnoutBuddy simulation — condensed journey for the KNOWlings strategy doc.
// Demonstrates: Know Meter rising, AI-as-teammate moment, three contribution levels.
// Fully self-contained — no external card images, paints its own cards.

// Reuse useState/useEffect already globally declared by k-primitives.jsx.
// (Babel scripts share global scope; re-declaring const would crash.)

// Five beats that show the KNOWlings loop compressed into one Burnout Buddy session
const SIM_BEATS = [
  {
    id: 'step0', phase: 'wondering', step: 0, meter: 8,
    companionVoice: 'Before we begin —',
    copy: 'You and 7 other Knowlings are exploring burnout this week.',
    sub: 'You\u2019re not alone. Your search already counts.',
    ai: null,
    contribHint: 'Step 0 · Anonymous · you have contributed already',
    action: { label: 'Begin\u00a0\u2192', kind: 'continue' },
  },
  {
    id: 'challenge', phase: 'wondering', step: 2, meter: 15,
    companionVoice: 'A challenge to name.',
    copy: 'What\u2019s weighing on you most?',
    sub: 'Three voices are here to listen.',
    ai: null,
    contribHint: 'Receive \u2014 three expert voices, attributed',
    cards: [
      { id: 'C1', title: 'I\u2019m burned out',        voice: 'Maslach' },
      { id: 'C2', title: 'I\u2019m not recognized',    voice: 'Lynch' },
      { id: 'C3', title: 'I don\u2019t know yet',       voice: 'Graham' },
    ],
    action: { kind: 'pick-card' },
  },
  {
    id: 'ai-moment', phase: 'exploring', step: 3, meter: 38,
    companionVoice: 'A pattern Claude noticed.',
    copy: '"Your search matches a pattern 24 other Knowlings have named. They all arrived here through overwhelm \u2014 but named it differently."',
    sub: 'AI is a third participant, not a prescription.',
    ai: {
      lens: 'The Human-AI Loop',
      byline: 'Claude \u00b7 teammate, not teacher',
      insight: 'This looks less like burnout and more like identity loss. Want to sit with that reframe, or stay with your original word?',
      choices: ['Try the reframe', 'Stay with my word'],
    },
    contribHint: 'Level 1 \u00b7 The Signal \u00b7 one tap \u00b7 anonymous',
    action: { kind: 'ai-choice' },
  },
  {
    id: 'label', phase: 'learning', step: 5, meter: 62,
    companionVoice: 'A private label for yourself.',
    copy: 'Which of these lands most true?',
    sub: 'Private \u2014 only you see this. Aggregate count helps the next Knowling.',
    ai: null,
    contribHint: 'Level 2 \u00b7 The Label \u00b7 private \u00b7 earns Spark',
    labels: [
      { id: 'L1', text: 'The workload is impossible',   count: 143 },
      { id: 'L2', text: 'I\u2019ve lost my curiosity',    count: 58  },
      { id: 'L3', text: 'My values don\u2019t align',      count: 104 },
    ],
    action: { kind: 'pick-label' },
  },
  {
    id: 'knowing', phase: 'seeing', step: 7, meter: 84,
    companionVoice: 'Write a Knowing.',
    copy: 'Something a past-you would have wanted to read.',
    sub: 'Public. Attributed. Earns Flame. Helps the next Knowling shed their unknowns.',
    ai: null,
    contribHint: 'Level 3 \u00b7 The Knowing \u00b7 public \u00b7 attributed',
    prompt: 'The week I stopped blaming myself was the week',
    draft: 'the work stopped being personal. I could leave it at the door.',
    action: { kind: 'submit-knowing' },
  },
  {
    id: 'complete', phase: 'knowing', step: 6, meter: 96,
    companionVoice: 'Your meter rises.',
    copy: 'You shed one unknown. 7 others will find this tomorrow.',
    sub: 'This is how knowing grows.',
    ai: null,
    contribHint: 'Knowns\u00a0\u2197\u00a0\u00b7\u00a0Unknowns\u00a0\u2198',
    action: { kind: 'restart' },
  },
];

function BurnoutSim() {
  const [beat, setBeat] = useState(0);
  const [pickedCard, setPickedCard] = useState(null);
  const [pickedLabel, setPickedLabel] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [knowingSent, setKnowingSent] = useState(false);
  const [running, setRunning] = useState(false);

  const B = SIM_BEATS[beat];

  const next = () => {
    if (beat < SIM_BEATS.length - 1) setBeat(b => b + 1);
    else {
      setBeat(0);
      setPickedCard(null); setPickedLabel(null);
      setAiChoice(null); setKnowingSent(false);
    }
  };

  // Auto-play toggle
  useEffect(() => {
    if (!running) return;
    const wait = B.action.kind === 'continue' ? 3000
              : B.action.kind === 'restart'  ? 4000
              : 2600;
    const t = setTimeout(() => {
      // auto-pick first option
      if (B.action.kind === 'pick-card' && !pickedCard) setPickedCard(B.cards[0].id);
      else if (B.action.kind === 'ai-choice' && !aiChoice) setAiChoice(B.ai.choices[0]);
      else if (B.action.kind === 'pick-label' && !pickedLabel) setPickedLabel(B.labels[0].id);
      else if (B.action.kind === 'submit-knowing' && !knowingSent) setKnowingSent(true);
      else next();
    }, wait);
    return () => clearTimeout(t);
  }, [beat, running, pickedCard, pickedLabel, aiChoice, knowingSent]);

  // Auto-advance after a pick
  useEffect(() => {
    if (!pickedCard) return;
    const t = setTimeout(next, 1100); return () => clearTimeout(t);
  }, [pickedCard]);
  useEffect(() => {
    if (!aiChoice) return;
    const t = setTimeout(next, 1300); return () => clearTimeout(t);
  }, [aiChoice]);
  useEffect(() => {
    if (!pickedLabel) return;
    const t = setTimeout(next, 1100); return () => clearTimeout(t);
  }, [pickedLabel]);
  useEffect(() => {
    if (!knowingSent) return;
    const t = setTimeout(next, 1500); return () => clearTimeout(t);
  }, [knowingSent]);

  // Reset intra-beat state when beat changes
  useEffect(() => {
    setPickedCard(null); setPickedLabel(null);
    setAiChoice(null); setKnowingSent(false);
  }, [beat]);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '380px 1fr',
      gap: 48, alignItems: 'start',
    }}>
      {/* Phone */}
      <div>
        <SimPhone beat={B} beatIdx={beat}
          pickedCard={pickedCard} setPickedCard={setPickedCard}
          pickedLabel={pickedLabel} setPickedLabel={setPickedLabel}
          aiChoice={aiChoice} setAiChoice={setAiChoice}
          knowingSent={knowingSent} setKnowingSent={setKnowingSent}
          onContinue={next}
        />
        <div style={{
          marginTop: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {SIM_BEATS.map((_, i) => (
              <div key={i} onClick={() => setBeat(i)} style={{
                width: i === beat ? 24 : 8, height: 4, borderRadius: 2,
                background: i === beat ? K.known : i < beat ? K.ink + '55' : K.ink + '22',
                cursor: 'pointer', transition: 'all 300ms ease',
              }}/>
            ))}
          </div>
          <button onClick={() => setRunning(r => !r)} style={{
            fontFamily: K.mono, fontSize: 10, letterSpacing: 2,
            textTransform: 'uppercase', padding: '6px 12px',
            background: running ? K.ink : 'transparent',
            color: running ? K.paper : K.ink,
            border: `1px solid ${K.ink}55`, cursor: 'pointer',
            borderRadius: 100, fontWeight: 600,
          }}>{running ? 'Pause auto' : 'Auto-play'}</button>
        </div>
      </div>

      {/* Annotation column */}
      <div style={{ paddingTop: 20 }}>
        <SimAnnotations beat={B} beatIdx={beat} />
      </div>
    </div>
  );
}

// ───────────────── PHONE FRAME + CONTENT ─────────────────
function SimPhone(props) {
  return (
    <div style={{
      width: 380, height: 780, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: K.paper,
      boxShadow: `0 40px 80px -20px ${K.ink}44, 0 0 0 1px ${K.ink}22`,
      fontFamily: K.sans,
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 118, height: 34, borderRadius: 24, background: '#000', zIndex: 50,
      }}/>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 26px 0', zIndex: 10,
        fontFamily: '-apple-system, "SF Pro", system-ui',
        fontSize: 15, fontWeight: 600, color: K.ink,
      }}>
        <span>9:41</span>
        <span style={{ fontFamily: K.mono, fontSize: 10, letterSpacing: 2, opacity: 0.6 }}>
          KNOWlings: Burnout
        </span>
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%',
        transform: 'translateX(-50%)',
        width: 130, height: 5, borderRadius: 100,
        background: `${K.ink}44`, zIndex: 60,
      }}/>

      {/* Header: mini Know Meter */}
      <div style={{
        position: 'absolute', top: 64, left: 0, right: 0, padding: '0 24px',
        zIndex: 5,
      }}>
        <SimMiniMeter value={props.beat.meter} />
      </div>

      {/* Body */}
      <div style={{
        position: 'absolute', inset: '140px 0 40px', padding: '0 24px',
        display: 'flex', flexDirection: 'column', gap: 20,
        overflow: 'auto',
      }}>
        <SimBody {...props} />
      </div>
    </div>
  );
}

function SimMiniMeter({ value }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: 6,
        fontFamily: K.mono, fontSize: 8.5, letterSpacing: 1.5,
        color: K.inkMute, textTransform: 'uppercase',
      }}>
        <span style={{ color: K.known, fontWeight: 600 }}>Know Meter</span>
        <span>{Math.round(value)} %</span>
      </div>
      <div style={{
        height: 3, background: `${K.ink}15`, borderRadius: 2, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${value}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${K.phase.wondering}, ${K.phase.exploring}, ${K.phase.learning}, ${K.phase.seeing}, ${K.phase.knowing})`,
          transition: 'width 800ms cubic-bezier(.2,.7,.2,1)',
        }}/>
        {/* phase markers */}
        {PHASES.map((p, i) => (
          <div key={p.id} style={{
            position: 'absolute', left: `${(i / 4) * 100}%`, top: -2,
            width: 7, height: 7, borderRadius: '50%', transform: 'translateX(-50%)',
            background: value >= p.meter ? p.color : K.paper,
            border: `1px solid ${value >= p.meter ? p.color : K.ink + '44'}`,
          }}/>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 4,
        fontFamily: K.mono, fontSize: 7, letterSpacing: 1.4,
        color: K.inkMute, textTransform: 'uppercase',
      }}>
        {PHASES.map(p => <span key={p.id}>{p.label}</span>)}
      </div>
    </div>
  );
}

function SimBody({ beat, beatIdx, pickedCard, setPickedCard, pickedLabel, setPickedLabel, aiChoice, setAiChoice, knowingSent, setKnowingSent, onContinue }) {
  const B = beat;
  return (
    <React.Fragment key={beatIdx}>
      {/* Companion voice */}
      <div style={{
        animation: 'k-fade-in 400ms ease',
      }}>
        <Tag color={K.phase[B.phase]} opacity={1}>{B.companionVoice}</Tag>
        <div style={{
          fontFamily: K.display, fontSize: 22, lineHeight: 1.2,
          color: K.ink, marginTop: 10, letterSpacing: -0.3,
          fontWeight: 400, textWrap: 'balance',
        }}>{B.copy}</div>
        {B.sub && (
          <div style={{
            fontFamily: K.display, fontStyle: 'italic', fontSize: 13,
            color: K.inkMute, marginTop: 8, lineHeight: 1.4,
          }}>{B.sub}</div>
        )}
      </div>

      {/* Card picker (Challenge) */}
      {B.cards && (
        <div style={{ display: 'grid', gap: 10 }}>
          {B.cards.map(c => {
            const picked = pickedCard === c.id;
            const fade = pickedCard && !picked;
            return (
              <div key={c.id}
                onClick={() => !pickedCard && setPickedCard(c.id)}
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${picked ? K.known : K.ink + '22'}`,
                  borderRadius: 4,
                  background: picked ? `${K.known}10` : K.paper,
                  cursor: pickedCard ? 'default' : 'pointer',
                  opacity: fade ? 0.3 : 1,
                  transition: 'all 300ms ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <div>
                  <div style={{
                    fontFamily: K.display, fontSize: 15, color: K.ink,
                    fontWeight: 500, letterSpacing: -0.2,
                  }}>{c.title}</div>
                  <div style={{
                    fontFamily: K.mono, fontSize: 9, letterSpacing: 1.5,
                    color: K.inkMute, marginTop: 2,
                  }}>VOICE · {c.voice}</div>
                </div>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `1px solid ${picked ? K.known : K.ink + '44'}`,
                  background: picked ? K.known : 'transparent',
                }}/>
              </div>
            );
          })}
        </div>
      )}

      {/* AI moment */}
      {B.ai && (
        <div style={{
          border: `1px solid ${K.ink}`,
          padding: 16, background: K.paperDeep,
          position: 'relative',
          animation: 'k-fade-in 500ms ease',
        }}>
          <div style={{
            position: 'absolute', top: -9, left: 14,
            background: K.ink, color: K.paper,
            fontFamily: K.mono, fontSize: 9, letterSpacing: 2,
            padding: '2px 8px', textTransform: 'uppercase',
            fontWeight: 600,
          }}>{B.ai.lens}</div>
          <div style={{
            fontFamily: K.mono, fontSize: 9, letterSpacing: 1.5,
            color: K.inkMute, textTransform: 'uppercase',
            marginTop: 4, marginBottom: 10,
          }}>{B.ai.byline}</div>
          <div style={{
            fontFamily: K.display, fontStyle: 'italic', fontSize: 15,
            color: K.ink, lineHeight: 1.45, letterSpacing: -0.1,
            marginBottom: 14,
          }}>"{B.ai.insight}"</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {B.ai.choices.map(c => {
              const picked = aiChoice === c;
              const fade = aiChoice && !picked;
              return (
                <button key={c}
                  onClick={() => !aiChoice && setAiChoice(c)}
                  style={{
                    flex: 1, padding: '9px 10px',
                    fontFamily: K.sans, fontSize: 12, fontWeight: 500,
                    background: picked ? K.ink : 'transparent',
                    color: picked ? K.paper : K.ink,
                    border: `1px solid ${K.ink}55`,
                    cursor: aiChoice ? 'default' : 'pointer',
                    opacity: fade ? 0.3 : 1,
                    borderRadius: 2,
                    transition: 'all 280ms ease',
                  }}>{c}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Labels */}
      {B.labels && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {B.labels.map(l => {
            const picked = pickedLabel === l.id;
            const fade = pickedLabel && !picked;
            return (
              <div key={l.id}
                onClick={() => !pickedLabel && setPickedLabel(l.id)}
                style={{
                  padding: '11px 14px',
                  borderLeft: `3px solid ${picked ? K.known : K.ink + '22'}`,
                  background: picked ? `${K.known}12` : `${K.ink}04`,
                  cursor: pickedLabel ? 'default' : 'pointer',
                  opacity: fade ? 0.3 : 1,
                  transition: 'all 300ms ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <div style={{
                  fontFamily: K.display, fontStyle: 'italic', fontSize: 14,
                  color: K.ink, letterSpacing: -0.1,
                }}>"{l.text}"</div>
                <div style={{
                  fontFamily: K.mono, fontSize: 9, letterSpacing: 1.2,
                  color: K.inkMute,
                }}>{l.count}·tapped</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Knowing composer */}
      {B.prompt && (
        <div>
          <div style={{
            fontFamily: K.display, fontStyle: 'italic', fontSize: 14,
            color: K.ink, marginBottom: 8, letterSpacing: -0.1,
          }}>{B.prompt}…</div>
          <div style={{
            padding: 14, background: K.paperDeep,
            border: `1px solid ${K.ink}22`, borderRadius: 2, minHeight: 70,
            fontFamily: K.display, fontSize: 14, color: K.ink,
            lineHeight: 1.5, letterSpacing: -0.1,
            position: 'relative',
          }}>
            {B.draft}
            <span style={{
              display: 'inline-block', width: 1.5, height: 16,
              background: K.ink, marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'k-caret 1s steps(1) infinite',
            }}/>
          </div>
          <button onClick={() => !knowingSent && setKnowingSent(true)}
            style={{
              marginTop: 10, width: '100%', padding: '12px',
              fontFamily: K.sans, fontSize: 13, fontWeight: 500,
              background: knowingSent ? K.known : K.ink,
              color: K.paper, border: 'none', borderRadius: 2,
              cursor: knowingSent ? 'default' : 'pointer',
              letterSpacing: 0.3,
              transition: 'all 300ms ease',
            }}>
            {knowingSent ? 'Published · earning Flame' : 'Publish as a Knowing'}
          </button>
        </div>
      )}

      {/* Continue/restart button */}
      {(B.action.kind === 'continue' || B.action.kind === 'restart') && (
        <button onClick={onContinue} style={{
          marginTop: 'auto', padding: '12px', width: '100%',
          fontFamily: K.sans, fontSize: 13, fontWeight: 500,
          background: K.ink, color: K.paper, border: 'none',
          borderRadius: 2, cursor: 'pointer', letterSpacing: 0.3,
        }}>{B.action.label || (B.action.kind === 'restart' ? 'Start again' : 'Continue →')}</button>
      )}

      {/* Bottom hint */}
      <div style={{
        marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${K.ink}12`,
        fontFamily: K.mono, fontSize: 9, letterSpacing: 1.5,
        color: K.inkMute, textTransform: 'uppercase', textAlign: 'center',
      }}>{B.contribHint}</div>
    </React.Fragment>
  );
}

// ───────────────── ANNOTATIONS (right column) ─────────────────
function SimAnnotations({ beat, beatIdx }) {
  return (
    <div key={beatIdx} style={{ animation: 'k-fade-in 500ms ease' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22,
      }}>
        <Tag color={K.phase[beat.phase]} opacity={1}>Phase · {beat.phase}</Tag>
        <span style={{
          width: 40, height: 1, background: K.ink, opacity: 0.15,
        }}/>
        <Tag color={K.ink} opacity={0.7}>Step {beat.step} of the loop</Tag>
      </div>

      <Display size={38}>
        What this beat <Ital color={K.known}>demonstrates</Ital>.
      </Display>

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AnnotationRow n="01" label="Know Meter">
          {beat.meter <= 15
            ? <>Phase <Ital>Wondering</Ital>. The user hasn\u2019t done anything yet \u2014 and the meter is already non-zero. Step 0 counts.</>
            : beat.meter <= 40
            ? <>Meter now at <b>{beat.meter}%</b> \u2014 <Ital>Exploring</Ital>. The tap just happened. A signal was contributed. No account required.</>
            : beat.meter <= 65
            ? <>Meter now at <b>{beat.meter}%</b> \u2014 <Ital>Learning</Ital>. Private labels stick. The aggregate count grows for the next Knowling.</>
            : beat.meter <= 85
            ? <>Meter now at <b>{beat.meter}%</b> \u2014 <Ital>Seeing</Ital>. A public Knowing is written. Attribution is opt-in. Reputation accrues.</>
            : <>Meter at <b>{beat.meter}%</b> \u2014 <Ital>Knowing</Ital>. Never "Known." Always in motion. Helps the next Knowling\u2019s Step 0.</>
          }
        </AnnotationRow>

        <AnnotationRow n="02" label="Contribution">
          {beat.contribHint}
        </AnnotationRow>

        <AnnotationRow n="03" label="Human-AI Loop">
          {beat.ai
            ? <>The AI surfaces a <Ital>reframe</Ital>, not a prescription. The user chooses whether to try it or stay with their word. This is what <Ital>teammate, not teacher</Ital> looks like in product.</>
            : beat.id === 'step0'
            ? <>Aggregate arrives before the user has done anything. <Ital>Me hook</Ital> meets <Ital>We belonging</Ital> before any account exists.</>
            : beat.id === 'label'
            ? <>Aggregate counts are visible next to each label. The user sees they\u2019re part of something without being forced to reveal themselves.</>
            : beat.id === 'knowing'
            ? <>A prompt pre-structures the Knowing so the barrier to writing is low. AI stays invisible \u2014 it\u2019s the user\u2019s voice that gets published.</>
            : beat.id === 'complete'
            ? <>The loop closes. The last line \u2014 <Ital>"7 others will find this tomorrow"</Ital> \u2014 makes the altruistic payoff concrete.</>
            : <>AI stays silent. Burnout is an identity conversation \u2014 the human leads. AI shows up at the reframe, not the naming.</>
          }
        </AnnotationRow>
      </div>
    </div>
  );
}

function AnnotationRow({ n, label, children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 140px 1fr',
      gap: 18, alignItems: 'baseline',
      paddingBottom: 20, borderBottom: `1px solid ${K.ink}10`,
    }}>
      <Tag color={K.known} opacity={1}>{n}</Tag>
      <Tag color={K.ink} opacity={0.8}>{label}</Tag>
      <div style={{
        fontFamily: K.sans, fontSize: 15, color: K.inkSoft,
        lineHeight: 1.55, textWrap: 'pretty',
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, { BurnoutSim });
