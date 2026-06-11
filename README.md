# Offleet

Offline-first DSA practice desktop application built with Electron + React + Node.js.

## Status
Under active development (Phase 10/11 complete)

## Tech Stack
Electron, React, Vite, SQLite, better-sqlite3, Node.js, Express, PostgreSQL, Google OAuth 2.0 + PKCE

## Features (so far)
- Local C++ judge engine (AC/WA/TLE/RE/CE)
- Docker sandboxed code execution (--network none, --memory cap, --pids-limit) with fallback to direct execution
- Offline problem browsing and code execution
- Local submission history
- Google OAuth 2.0 + PKCE authentication
- Problem sync from cloud PostgreSQL on first login
- Background submission sync service with idempotent conflict resolution