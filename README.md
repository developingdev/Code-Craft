# codecraft.com

A full-stack development workspace for modern web applications, with:

- A Next.js frontend
- An Express + TypeScript backend
- Shared TypeScript contracts
- PostgreSQL via Docker Compose
- Optional AI agent integration
- Deployment templates for Vercel and Railway/Render

## Quick start

1. Copy .env.example to .env and adjust values.
2. Install dependencies: npm install
3. Start infrastructure: docker compose up -d postgres
4. Start the stack: npm run dev

## Services

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Database: localhost:5432

## Optional AI agents

The workspace includes an optional agent service in apps/agents. Set OPENAI_API_KEY in your environment to enable it.
