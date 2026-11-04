# Arithmix — Plan

Timed arithmetic quiz modeled on elementary-school "mad minute" worksheets. Mobile-first PWA.

## Decisions

| Topic               | Decision                                         |
| ------------------- | ------------------------------------------------ |
| Problems per quiz   | 50                                               |
| Modes (v1)          | Multiplication, Division, Mixed                  |
| Durations           | 30 / 60 / 90 seconds                             |
| Number range        | 0–12 (no ÷0)                                     |
| Input               | Keyboard / custom keypad, no multiple choice     |
| Score               | Number of problems answered correctly            |
| Per-problem timeout | None                                             |
| Skipping            | Allowed — skipped problem moves to back of queue |
| Identity            | Optional nickname (defaults to "Player")         |
| Backend             | v1 client-only; designed for server sync later   |

## Stack

| Concern     | Choice                                                 |
| ----------- | ------------------------------------------------------ |
| Build       | Vite + React 19 + TypeScript (strict)                  |
| Styling     | Tailwind v4                                            |
| PWA         | `vite-plugin-pwa` — full offline precache              |
| Game state  | `useReducer` state machine (pure, testable)            |
| Persistence | Dexie (IndexedDB)                                      |
| Routing     | React Router                                           |
| Tests       | Vitest (engine/reducer), Playwright (timing/input e2e) |

## Gameplay Rules

### Answer evaluation (on every keystroke)

- `input === answer` → correct, auto-advance. Works for single-digit answers (`3×2 = 6`) and is never ambiguous, since a prefix can't equal the full answer.
- `input.length === answer.length && input !== answer` → miss: red flash + haptic, clear input, stay on the same problem, increment `misses`.
- No Enter key. Only digits, backspace, and skip.

### Skip

- Moves the current problem to the back of the queue (matches paper behavior: skip and come back).
- No penalty beyond time spent; prevents fishing for easy problems since skipped ones return.

### End conditions

- Timer reaches zero, **or** all 50 answered correctly — whichever first.
- Finishing early records `finishedMs` (tiebreaker, "Clean Sweep" achievement).

## Timer Accuracy

- `startedAt = performance.now()`; remaining = `duration − (now − startedAt)`. Never decrement with `setInterval`.
- Render via `requestAnimationFrame`; game end decided by timestamp, not frame.
- Stamp inputs with `event.timeStamp` and accept any input with `t < endTime`, so a 59.98s keystroke counts even if rendering lags.
- `visibilitychange` → hidden voids the run (pausing would be an exploit).
- 3-2-1 countdown before the clock starts; problem set generated before countdown.

## Input (Mobile-First)

- Custom on-screen keypad — avoids native keyboard latency, layout shift, autocorrect.
  - Fire on `onPointerDown`, not `onClick`.
  - `touch-action: manipulation`, disable zoom and text selection, keys ≥ 56px.
  - Layout: 3×4 grid — `1–9`, bottom row `⌫ 0 Skip`.
- Desktop: global `keydown` listener — `0–9`, `Backspace`, `Space`/`Tab` = skip.
- Both paths dispatch the same action: `dispatch({ type: 'digit', d, t })`.
- Quiz screen contains only: timer bar (top), problem (large), input (below), keypad.

## Problem Engine

```ts
type Op = 'mul' | 'div' | 'add' | 'sub';
type Mode = 'mul' | 'div' | 'mixed' | 'add' | 'sub' | 'all';
type Problem = { a: number; b: number; op: Op; answer: number };

generateSet(mode: Mode, seed: number, count = 50, range = { min: 0, max: 12 }): Problem[];
```

- Multiplication: `a × b` with `a, b ∈ [0, 12]`.
- Division: generated from multiplication — pick `a × b = c`, present `c ÷ b = a`, with `b ∈ [1, 12]`. Always integer; `0 ÷ b` allowed.
- Mixed: interleaved mul/div.
- No identical problem back-to-back; deck spread across fact families.
- Seeded PRNG (mulberry32) → runs are replayable, enables Daily Challenge and future server verification.
- New ops (add/sub/all) = new generator entry only.

## Scoring & Stars

9 ranks: Bronze ★→★★★, Silver ★→★★★, Gold ★→★★★.

Thresholds are rate-based so one table covers all durations: `rate = correct / elapsed seconds`. Elapsed is the full duration, or the actual time if all 50 were answered early, so a fast finish in a 90s quiz still reaches Gold. Initial values, expressed per 60s (tune with real players):

| Rank   | ★   | ★★  | ★★★ |
| ------ | --- | --- | --- |
| Bronze | 5   | 10  | 15  |
| Silver | 20  | 25  | 30  |
| Gold   | 35  | 42  | 50  |

- Per-mode multiplier (e.g. division ≈ 0.85× multiplication).
- Accuracy gate: below 90% accuracy, rank capped at Silver ★★★ (discourages mashing).
- Below Bronze ★ → no rank.

## Data Model

```ts
type Run = {
  id: string
  mode: Mode
  variant: 'classic' | 'timeAttack'
  duration: 30 | 60 | 90
  seed: number
  startedAt: number // epoch ms
  events: { t: number; kind: 'digit' | 'back' | 'skip' | 'correct' | 'miss'; v?: number }[]
  correct: number
  misses: number
  skips: number
  finishedMs?: number
  rank: { tier: 'bronze' | 'silver' | 'gold'; stars: 1 | 2 | 3 } | null
  nickname?: string
}

type Achievement = { id: string; unlockedAt: number }
type Profile = { nickname?: string; createdAt: number }
```

- Leaderboard derived from stored runs (top N per mode × duration); no separate table.
- Event log + seed allow a future server to replay and verify scores.
- All persistence behind a `Storage` interface; v2 adds a sync adapter.

## Achievements (v1)

Pure functions `(run, history) => boolean`, evaluated on the Results screen.

| ID             | Name                    | Condition                                                |
| -------------- | ----------------------- | -------------------------------------------------------- |
| `first-steps`  | First Steps             | Complete any quiz                                        |
| `perfect`      | Perfect                 | 100% accuracy, ≥ 20 correct                              |
| `clean-sweep`  | Clean Sweep             | All 50 correct before time expires                       |
| `gold-rush`    | Gold Rush               | Any Gold rank                                            |
| `triple-crown` | Triple Crown            | Gold ★★★ in mul, div, and mixed                          |
| `streak-25`    | On Fire                 | 25 correct in a row                                      |
| `no-skips`     | Steady Hand             | 90s run, 0 skips, ≥ 30 correct                           |
| `daily-7`      | Daily Habit             | Play 7 consecutive days                                  |
| `table-n`      | Table Master (×0 … ×12) | Every fact in table _n_ answered correctly at least once |

## Screens

1. **Home** — mode (segmented control), duration (30/60/90), Start. Personal best for current selection. Optional nickname in settings.
2. **Countdown** — 3-2-1.
3. **Quiz** — timer bar, problem, input, keypad.
4. **Results** — score, animated star rank, accuracy, new achievements, missed problems with answers, Play Again.
5. **Leaderboard** — personal top 10 per mode × duration.
6. **Achievements** — locked/unlocked grid.

## Project Structure

```
src/
  lib/         random, problems, scoring, quiz (reducer), format, modes, routes   # pure, unit-tested
  hooks/       useQuizClock, useRemainingTime, useKeyboardInput, useVoidWhenHidden
  contexts/    quiz-context (QuizProvider + useQuizContext)
  components/
    ui/        shadcn primitives (Base UI)
    home/      QuizSetup, OptionGroup
    quiz/      QuizSession, QuizScreen, Countdown, QuizStatusBar, TimerBar, ProblemDisplay, Keypad, KeypadKey, VoidedNotice
    results/   ResultsSummary, MissedProblems, ResultsActions
    shared/    StarRank, Stat, rank-styles
  routes/      AppLayout, HomeRoute, PlayRoute, ResultsRoute
  types/       quiz
```

UI: shadcn on Base UI, lucide icons, Fredoka font. Light/dark follows the system.

## Milestones

1. **Engine** ✅ — PRNG, generators, scoring + unit tests. Achievements moved to milestone 3 (they need run history).
2. **Playable quiz** ✅ — reducer, clock, keypad + keyboard input, Results (in-memory, passed via router state).
3. **Persistence** ✅ — Dexie, personal leaderboard, achievements, optional nickname, light/dark/system theme. Results live at `/results/:runId` and load from IndexedDB. Theme choice is kept in localStorage so it applies before first paint.
4. **PWA** ✅ — manifest, icons (generated at build from `public/favicon.svg`), offline precache, install button in Settings (Share → Add to Home Screen hint on iOS), iOS standalone meta tags. Updates wait for the player to tap Update. The banner is hidden during a quiz, so a new version never reloads the page mid-run.
5. **Polish** ✅ — sound effects, music and vibration, each with its own switch in Settings. All audio is synthesized with the Web Audio API (no audio files), so it works offline. The music is an original 4-bar loop that speeds up in the last 10 seconds. Animations: problem slide-in, green flash on a correct answer, shake on a miss, score pop, timer pulse, and a results reveal (stars pop in one by one with chimes, the score counts up). `prefers-reduced-motion` turns animations off. Playwright tests (`pnpm test:e2e`) cover quiz timing, saved results and offline play in Chrome.

## Later

### More operations

- Addition, Subtraction, All (mixed across all four ops). Generator entries + per-mode star multipliers.

### Time Attack mode

- Timer always counting down; each correct answer adds time.
- Proposed defaults (tune in playtesting):
  - Start: 30s
  - Correct: +2s
  - Miss: −1s (optional; prevents mashing)
  - Skip: no change
- Endless deck (no 50-problem cap) — generator streams problems from the seed.
- Score = total correct; also record survival time.
- Separate leaderboard and star thresholds (`variant: 'timeAttack'`).
- Clock math stays timestamp-based: `endTime` is a mutable value adjusted on each correct/miss event, never a decrementing counter.

### Server / social

- Daily Challenge (shared seed per day).
- Sync adapter (Supabase or Cloudflare D1) with server-side replay verification of event logs.
- Class leaderboards via teacher-created class codes + nicknames only (COPPA: no PII for under-13 users).
