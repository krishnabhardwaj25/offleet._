# Offleet

An offline-first DSA practice desktop application. Practice data structures and algorithms problems with a local C++ judge — no internet required after initial setup.

## What it does

Offleet solves a simple problem: every major DSA practice platform (LeetCode, Codeforces, GFG) requires a persistent internet connection. Offleet doesn't.

Log in once with Google while online. The app downloads all problems and test cases to your machine. From that point, browse problems, write C++ solutions, compile and run them locally, and get instant verdicts (Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, Compilation Error) — completely offline. When you're back online, your submissions sync automatically to the cloud.

## Architecture

Offleet is an Electron desktop app with a strict two-process model:

- **Main process** (Node.js) — owns the file system, SQLite database, judge engine, sync service, and authentication
- **Renderer process** (React) — owns the UI only
- Communication happens exclusively through a typed IPC bridge via `contextBridge`. The renderer never has direct access to Node.js APIs.

### The judge engine

When you click Run or Submit, the app writes your C++ code to a temporary file, compiles it with `g++`, and runs it against test cases — piping input via stdin and capturing stdout. A time limit is enforced via `Promise.race()` with `SIGKILL` on timeout.

If Docker is available, execution happens inside a sandboxed container (`--network none`, memory cap, process limit, isolated filesystem). If Docker isn't available, the app falls back to direct execution — so it works on any machine, with stronger isolation when Docker is present.

### Data layer

- **Local**: SQLite (via `better-sqlite3`) stores problems, test cases, submissions, and auth tokens
- **Cloud**: PostgreSQL (hosted on Neon) is the source of truth for problems and test cases, and stores synced submissions
- **Backend**: Node.js + Express (deployed on Render) handles authentication and serves problem data

### Authentication

Google OAuth 2.0 with PKCE. A local HTTP server catches the OAuth redirect, the authorization code is exchanged for tokens via the backend (so `client_secret` never lives in the desktop app), and tokens are encrypted at rest using Electron's `safeStorage`.

### Sync

A background service polls every 60 seconds, finds local submissions that haven't been synced, and pushes them to the backend. Sync uses a local UUID per submission so retries are idempotent — the server deduplicates safely.

## Tech stack

Electron · React · Vite · Monaco Editor · better-sqlite3 · Node.js · Express · PostgreSQL (Neon) · Docker · Google OAuth 2.0 + PKCE · electron-builder

## Running locally

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Run the Vite dev server
npm run dev

# In a separate terminal, run Electron
npm start
```

The app connects to a deployed backend on Render by default. To run your own backend, set up a PostgreSQL database (schema in `server/schema.sql`), configure `server/.env` with your own Google OAuth credentials and database URL, and update the backend URLs in `main.js`.

## Building the installer

```bash
npm run dist
```

Produces a Windows installer in `release/`.

## Current problem set

10 curated problems covering arrays, hashing, sliding window, binary search, stacks, and graph traversal — chosen to build core DSA intuition rather than provide an exhaustive catalog.

## Known limitations & future scope

- **C++ only.** Multi-language support is architecturally straightforward (a language config map for compiler/runner per language) but not yet implemented.
- **Exact-match judging.** Problems with multiple valid outputs (e.g. multiple correct index pairs) require a single canonical expected output. A "special judge" / checker pattern — standard in real competitive judges — is future work.
- **Manually curated problems.** The problem set is hand-written and hand-tested. Sourcing from existing open problem datasets (Codeforces API, open-source LeetCode datasets) is a natural next step for scaling content.
- **Function-based problems** (e.g. LRU Cache, tree-based problems) aren't supported yet — these require per-problem driver code to bridge user-submitted functions with stdin/stdout judging.
- **Single shared backend.** Submissions from all users currently land in one PostgreSQL database without per-user separation.

## Status

Core functionality complete (judge, offline UI, auth, sync, Docker sandboxing, packaging). Actively maintained.
