import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
void React; // ← silences TS6133 without config changes
import { motion } from "framer-motion";

// --- Data model -------------------------------------------------------------
const QUESTIONS: Array<{
  id: number;
  label: string;
  prevKey?: string;
  prompt: string;
  answerLabel: string;
}> = [
  {
    id: 1,
    label: "1",
    prompt: `Last Answer: 1.0
#_________1________

int x = 42;
double y = 42.25;
double ans = x%4 + (int)y/5;

What is the value of  ans?  _________`,
    answerLabel: "10.0",
  },
  {
    id: 2,
    label: "2",
    prevKey: "1",
    prompt: `Previous Answer: 1
#___________________
int a =1;
int b = 4; 
int c = 0; 
a--;
b--;
b+=4;
c=b+1*2;

What is the value of c?  _________`,
    answerLabel: "9",
  },
  {
    id: 3,
    label: "3",
    prevKey: "3.0",
    prompt: `Previous Answer: 3.0
#___________________
int a = 2; 
double b = a; 
double  x = b/3;

What is the value of x?  ________`,
    answerLabel: "0.6666666",
  },
  {
    id: 4,
    label: "4",
    prevKey: "9",
    prompt: `Previous Answer: 9
#___________________
int yes = -1; 
int no =7; 
int maybe=0;
yes-=3; 
no+=yes; 
maybe = no+yes*-4;

What is the value of maybe?  ________`,
    answerLabel: "19",
  },
  {
    id: 5,
    label: "5",
    prevKey: "19",
    prompt: `Previous Answer: 19
#___________________
int one= 5;
int two = 7; 
int three = 4; 
one--;
two%= 3;
three+=5;
two*=one+three; 

What is the value of two? ________`,
    answerLabel: "13",
  },
  {
    id: 6,
    label: "6",
    prevKey: "17.8",
    prompt: `Previous Answer: 17.8
#___________________
int a = 56;
int b = -8;
int c = a % b;
int d = b % a;

What is the value of d? ________`,
    answerLabel: "-8",
  },
  {
    id: 7,
    label: "7",
    prevKey: "10",
    prompt: `Previous Answer: 10
#___________________
int i = 34;
int j = 7;
int k = i % j;

What is the value of k?  ________`,
    answerLabel: "6",
  },
  {
    id: 8,
    label: "8",
    prevKey: "-8",
    prompt: `Previous Answer: -8
#___________________
int modIt = 107; 
modIt%= 25; 
modIt%= 10;
modIt%= 5;

What is the value of modIt? ________`,
    answerLabel: "2",
  },
  {
    id: 9,
    label: "9",
    prevKey: "13",
    prompt: `Previous Answer: 13
#___________________
int x=18; 
int y=12; 
double z= (double)(x/y);
 
What is the value of z?  ________`,
    answerLabel: "1.0",
  },
  {
    id: 10,
    label: "10",
    prevKey: "7.5",
    prompt: `Previous Answer: 7.5
#___________________
double a= 22.5;
double b = 2.4;
double c = a/ (int)b;

What is the value of c?  ________`,
    answerLabel: "11.25",
  },
  {
    id: 11,
    label: "11",
    prevKey: "10.0",
    prompt: `Previous Answer: 10.0
#___________________

double divide = 19/5;

Determine the value of divide?  ________`,
    answerLabel: "3.0",
  },
  {
    id: 12,
    label: "12",
    prevKey: "6",
    prompt: `Previous Answer: 6
#___________________  

Evaluate:

(double)(10/4)*(int)10.0/4 +(double) 10/4;

________`,
    answerLabel: "7.5",
  },
  {
    id: 13,
    label: "13",
    prevKey: "0.6666666",
    prompt: `Previous Answer: 0.6666666
#___________________  
int total = 0; 
double dollar = 10.56;
total+= (int)dollar; 

What is the value of total?  ________`,
    answerLabel: "10",
  },
  {
    id: 14,
    label: "14",
    prevKey: "11.25",
    prompt: `Previous Answer: 11.25
#___________________  

Evaluate:

 double ans = (int) 2.5*3+10-3/2+2.8

________`,
    answerLabel: "17.8",
  },
  {
    id: 15,
    label: "15",
    prevKey: "2",
    prompt: `Previous Answer: 2
#___________________  

 double a = 9/2.0; 
 int b = 10;
 double c = a*b;
 int d = (int)(a+c*2); 

 Determine the value of d?  ________`,
    answerLabel: "94",
  },
  {
    id: 16,
    label: "16",
    prevKey: "12",
    prompt: `Previous Answer: 12
#___________________  
int a = -8/5; 
int b = 11/2;
 double c = 14/4; 

 What is a+b+c?  ________`,
    answerLabel: "7.0",
  },
  {
    id: 17,
    label: "17",
    prevKey: "94",
    prompt: `Previous Answer: 94
#___________________  
int alpha = 6/3;
int beta = 8/3;
int gamma = alpha*3 + beta*3; 

What is the value of gamma?  ________`,
    answerLabel: "12",
  },
  {
    id: 18,
    label: "18",
    prevKey: "7.0",
    prompt: `Previous Answer: 7.0
#___________________  
int q = 10; 
int r = 5; 
r = q/r;
q = r/r;

Find the value of q?  ________`,
    answerLabel: "1",
  },
];

const HUES = [
  "bg-pink-500 hover:bg-pink-600",
  "bg-emerald-500 hover:bg-emerald-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-cyan-500 hover:bg-cyan-600",
  "bg-fuchsia-500 hover:bg-fuchsia-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-lime-500 hover:bg-lime-600",
  "bg-sky-500 hover:bg-sky-600",
  "bg-teal-500 hover:bg-teal-600",
  "bg-amber-500 hover:bg-amber-600",
  "bg-violet-500 hover:bg-violet-600",
];

// -------- Random scatter with collision detection ---------------------------
const BTN_W = 160; // px
const BTN_H = 56;  // px
const GAP   = 12;  // px

type Rect = { x1: number; y1: number; x2: number; y2: number };

function rectsOverlap(a: Rect, b: Rect) {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

function generatePositions(
  count: number,
  W: number,
  H: number,
  btnW = BTN_W,
  btnH = BTN_H,
  gap = GAP,
  maxAttemptsPerItem = 1200
) {
  const placed: Rect[] = [];
  const out: Array<{ topPx: number; leftPx: number }> = [];

  if (W < btnW || H < btnH) {
    const cols = Math.max(1, Math.floor(W / (btnW + gap)));
    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      out.push({ leftPx: c * (btnW + gap), topPx: r * (btnH + gap) });
    }
    return out;
  }

  for (let i = 0; i < count; i++) {
    let placedOk = false;
    for (let tries = 0; tries < maxAttemptsPerItem; tries++) {
      const x = Math.random() * (W - btnW);
      const y = Math.random() * (H - btnH);

      const pad = gap / 2;
      const rect: Rect = { x1: x - pad, y1: y - pad, x2: x + btnW + pad, y2: y + btnH + pad };

      if (!placed.some((r) => rectsOverlap(rect, r))) {
        placed.push(rect);
        out.push({ leftPx: x, topPx: y });
        placedOk = true;
        break;
      }
    }
    if (!placedOk) {
      const cols = Math.max(1, Math.floor(W / (btnW + gap)));
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = Math.min(c * (btnW + gap), Math.max(0, W - btnW));
      const y = Math.min(r * (btnH + gap), Math.max(0, H - btnH));
      out.push({ leftPx: x, topPx: y });
    }
  }

  return out;
}

const prevIndex = QUESTIONS.reduce((acc, q) => {
  if (q.prevKey) acc[q.prevKey] = q.id;
  return acc;
}, {} as Record<string, number>);

// --- Component --------------------------------------------------------------
const MAX_LIVES = 3;

export default function ButtonOnlyTracingQuest() {
  const [currentId, setCurrentId] = useState<number>(1);
  const [shake, setShake] = useState(false);
  const [trail, setTrail] = useState<number[]>([1]);
  const [theme] = useState<"space" | "candy" | "ocean">("space");
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const [burstId, setBurstId] = useState(1);

  const [finished, setFinished] = useState(false);

  // 🔴 Lives / guess deterrent
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [showOutOfLives, setShowOutOfLives] = useState<boolean>(false);
  const [lostPulse, setLostPulse] = useState<number>(0);

  // 🧭 Intro / instructions
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Student name (locked at Start)
  const [studentName, setStudentName] = useState<string>("");
  const [nameDraft, setNameDraft] = useState<string>("");
  const [nameLocked, setNameLocked] = useState<boolean>(false);
  function lockName() {
    const v = nameDraft.trim();
    if (!v) return;
    setStudentName(v);
    setNameLocked(true);
  }

  // Positions + ref for playfield
  const [positions, setPositions] = useState<Array<{ topPct: number; leftPct: number }>>([]);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const current = useMemo(() => QUESTIONS.find((q) => q.id === currentId)!, [currentId]);
  const nextId = useMemo(() => prevIndex[current.answerLabel], [current]);

  useEffect(() => {
    setShake(true);
    const t = setTimeout(() => setShake(false), 300);
    return () => clearTimeout(t);
  }, [currentId]);

  const themeProps = {
    space: {
      bg: "from-[#0a0f2c] via-[#0b1a44] to-[#020617]",
      title: "🚀 Primitive Data Types Adventure",
      buttonRing: "focus:ring-cyan-300/60",
      accent: "text-cyan-300",
      emoji: ["✨", "🌟", "🪐", "🚀"],
      decor: <></>,
    },
    candy: {
      bg: "from-[#2c0a18] via-[#3f1027] to-[#12020a]",
      title: "🍬 Candy Carnival",
      buttonRing: "focus:ring-pink-300/60",
      accent: "text-pink-300",
      emoji: ["🍭", "🍬", "🍫", "✨"],
      decor: <></>,
    },
    ocean: {
      bg: "from-[#041c2c] via-[#06334b] to-[#011018]",
      title: "🐠 Ocean Quest",
      buttonRing: "focus:ring-teal-300/60",
      accent: "text-teal-300",
      emoji: ["🐚", "🐠", "💦", "✨"],
      decor: <></>,
    },
  } as const;

  function spawnBurst() {
    const em = themeProps[theme].emoji;
    const emoji = em[Math.floor(Math.random() * em.length)];
    const id = burstId + 1;
    setBurstId(id);
    setBursts((b) => [...b, { id, x: 15 + Math.random() * 70, y: 25 + Math.random() * 50, emoji }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1000);
  }

  function triggerOutOfLives() {
    setShowOutOfLives(true);
    setTimeout(() => {
      restart(false); // restart without reopening intro
      setShowOutOfLives(false);
    }, 1600);
  }

  function handleClick(label: string) {
    if (finished || showOutOfLives || showIntro) return;

    if (label === current.answerLabel) {
      spawnBurst();
      if (nextId) {
        setCurrentId(nextId);
        setTrail((t) => (t[t.length - 1] === nextId ? t : [...t, nextId]));
      } else {
        setFinished(true);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 200);

      setLives((prev) => {
        const next = prev - 1;
        setLostPulse((p) => p + 1);
        if (next <= 0) {
          triggerOutOfLives();
          return 0;
        }
        return next;
      });
    }
  }

  function restart(openIntro = false) {
    setCurrentId(1);
    setTrail([1]);
    setShake(false);
    setFinished(false);
    setBursts([]);
    setLives(MAX_LIVES);
    setShowOutOfLives(false);
    if (openIntro) setShowIntro(true);
    computeLayout();
  }

  const TP = themeProps[theme];

  // layout
  const computeLayout = useCallback(() => {
    const el = fieldRef.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const px = generatePositions(QUESTIONS.length, W, H, BTN_W, BTN_H, GAP);
    setPositions(
      px.map(({ topPx, leftPx }) => ({
        topPct: (topPx / H) * 100,
        leftPct: (leftPx / W) * 100,
      }))
    );
  }, []);

  useEffect(() => {
    computeLayout();
    const onResize = () => computeLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeLayout]);

  useEffect(() => {
    if (!finished) return;
    const id = setInterval(() => {
      spawnBurst();
    }, 450);
    return () => clearInterval(id);
  }, [finished]);

  // Hearts UI
  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => (i < lives ? "❤️" : "💔"));

  // Start handler (from intro)
  function startGame() {
    if (!nameDraft.trim()) return;
    setStudentName(nameDraft.trim());
    setNameLocked(true);
    setShowIntro(false);
    restart(false); // ensure clean state without reopening intro
  }

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-br ${TP.bg} text-white`}>
      <div className="pointer-events-none absolute inset-0">{TP.decor}</div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className={TP.accent}>{TP.title}</span> • Java Tracing Button Quest
        </h1>

        <div className="flex items-center gap-2 text-sm opacity-90">
          {/* ❤️ Lives */}
          <motion.div
            key={lostPulse}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.35 }}
            className="mr-1 hidden md:flex select-none items-center gap-1 rounded-full bg-white/10 px-2 py-1"
            aria-label={`Lives remaining: ${lives}`}
            title={`Lives: ${lives}/${MAX_LIVES}`}
          >
            {hearts.map((h, idx) => (
              <span key={idx} className="text-lg leading-none">
                {h}
              </span>
            ))}
          </motion.div>

          <button onClick={() => restart(true)} className="ml-2 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">
            Restart
          </button>
          <button
            onClick={() => setShowIntro(true)}
            className="ml-2 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20"
            title="Show instructions"
          >
            How to Play
          </button>
          <button
            onClick={computeLayout}
            className="ml-2 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20"
            title="Shuffle button positions"
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* Prompt card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className={`relative z-10 mx-auto mt-2 w-[92%] md:w-[820px] rounded-2xl border border-white/10 bg-white/10 p-4 md:p-6 shadow-xl backdrop-blur ${
          shake ? "animate-[wiggle_0.2s_ease-in-out_1]" : ""
        }`}
      >
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg:black/30 bg-black/30 p-4 text-sm leading-relaxed">
{current.prompt}
        </pre>
      </motion.div>

      {/* Playfield */}
      <div
        ref={fieldRef}
        className="pointer-events-none relative z-10 mx-auto mt-4 h:[68vh] w:[96%] md:h-[68vh] md:w-[1100px] h-[68vh] w-[96%] md:w-[1100px]"
        aria-label="button-playfield"
      >
        {!finished && !showIntro && positions.length === QUESTIONS.length &&
          QUESTIONS.map((q, idx) => {
            const hue = HUES[idx % HUES.length];
            const pos = positions[idx];
            return (
              <motion.button
                key={q.id}
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.02 * idx, type: "spring", stiffness: 140, damping: 12 }}
                onClick={() => handleClick(q.answerLabel)}
                className={`pointer-events-auto absolute select-none rounded-[1.25rem] px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-black/30 ${hue} ${TP.buttonRing} focus:outline-none`}
                style={{
                  top: `${pos.topPct}%`,
                  left: `${pos.leftPct}%`,
                  width: `${BTN_W}px`,
                  height: `${BTN_H}px`,
                }}
                whileHover={{ scale: 1.06, rotate: 2 }}
                whileTap={{ scale: 0.96 }}
              >
                {q.answerLabel}
              </motion.button>
            );
          })}
      </div>

      {/* Emoji bursts */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute text-3xl"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            {b.emoji}
          </motion.div>
        ))}
      </div>

      {/* Intro / Instructions overlay */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="mx-4 w-full max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-2xl"
          >
            <div className="text-2xl md:text-3xl font-extrabold mb-2 text-center">
              {themeProps[theme].title}
            </div>
            <div className="text-center text-sm opacity-90 mb-4">
              Java Tracing Button Quest — How to Play
            </div>

            <ul className="space-y-2 text-sm leading-relaxed">
              <li>• Start at question <span className="font-semibold">#1</span>. Read the prompt.</li>
              <li>• On the playfield, click the button that matches the <span className="font-semibold">correct answer</span>.</li>
              <li>• Your click reveals the <span className="font-semibold">next question</span> in a special sequence (based on the previous answer).</li>
              <li>• Guess deterrent: you have <span className="font-semibold">3 lives</span> <span aria-label="hearts">❤️❤️❤️</span>. Each wrong guess breaks a heart <span aria-label="broken heart">💔</span>. Out of lives → short warning → auto-restart.</li>
              <li>• Buttons are <span className="font-semibold">shuffled</span>; you can reshuffle anytime.</li>
              <li>• Java tips: integer division truncates (<code>19/5 == 3</code>), casting changes types, <code>%</code> is remainder, and operator precedence matters.</li>
            </ul>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 items-end">
              <div className="sm:col-span-2">
                <label htmlFor="studentNameIntro" className="block text-xs opacity-90 mb-1">
                  Enter your name to begin (locked for this run)
                </label>
                <input
                  id="studentNameIntro"
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && nameDraft.trim()) startGame(); }}
                  maxLength={50}
                  placeholder="First Last"
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
              <button
                disabled={!nameDraft.trim()}
                onClick={startGame}
                className={`rounded-xl px-4 py-3 font-semibold shadow-md ${
                  nameDraft.trim()
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-white/20 cursor-not-allowed"
                }`}
                title={nameDraft.trim() ? "Start the game" : "Enter your name to start"}
              >
                Start Game
              </button>
            </div>

            <div className="mt-4 text-xs opacity-80 text-center">
              By starting, you agree not to randomly guess. Be strategic—protect those hearts!
            </div>
          </motion.div>
        </div>
      )}

      {/* Out-of-lives overlay */}
      {showOutOfLives && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 16 }}
            className="mx-4 max-w-xl rounded-2xl border border-white/20 bg-white/15 p-6 text-center text-white shadow-2xl"
          >
            <div className="text-3xl md:text-4xl font-extrabold mb-2">💔 Out of lives!</div>
            <div className="text-sm md:text-base opacity-90">
              No random guessing — read carefully and try again. Restarting…
            </div>
          </motion.div>
        </div>
      )}

      {/* Celebration overlay */}
      {finished && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="mx-4 max-w-xl rounded-2xl border border-white/20 bg-white/15 p-6 text-center text-white shadow-2xl"
          >
            <div className="text-3xl md:text-4xl font-extrabold mb-2">
              🎉 Well done{studentName ? `, ${studentName}` : ""}! 🎉
            </div>
            <div className="text-sm md:text-base opacity-90">
              You completed the Java Tracing Button Quest.
            </div>

            <div className="mt-4 text-sm md:text-base text-center">
              <div>
                <span className="font-semibold">Path:</span> {trail.join(" → ")}
              </div>
              <div>
                <span className="font-semibold">Student:</span>{" "}
                {studentName || "Not set"}
              </div>
            </div>

            <div className="mt-4 text-xs opacity-80">
              (Emojis will keep celebrating!)
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => restart(true)}
                className="rounded-full bg-white/20 px-4 py-2 hover:bg-white/30"
                title="Play again"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom bar with Path + Student name (view-only once locked) */}
      {!showIntro && (
        <div className="fixed bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
          <span className="mr-3">Path: {trail.join(" → ")}</span>
          <span className="mx-2">•</span>
          <span title="Student name is locked for this session">
            Student: <span className="font-semibold">{studentName || "—"}</span>
          </span>
        </div>
      )}
    </div>
  );
}
