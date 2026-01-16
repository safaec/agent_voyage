# CLAUDE.md - Claude Code Configuration for Agent Voyage

## Project Context
**App:** Agent Voyage
**Stack:** Next.js 14 + Gemini API + Tailwind CSS + Vercel
**Stage:** MVP Development
**User Level:** Vibe-coder (AI writes all code, user guides and tests)

## Directives
1. **Master Plan:** Always read `AGENTS.md` first. It contains the current phase and tasks.
2. **Documentation:** Refer to `agent_docs/` for tech stack details, code patterns, and testing guides.
3. **Plan-First:** Propose a brief plan and wait for approval before coding.
4. **Incremental Build:** Build one small feature at a time. Test frequently.
5. **Simple Explanations:** Explain concepts simply since user is learning while building.
6. **No Linting Lectures:** Do not act as a linter. Use `npm run lint` if needed.
7. **Communication:** Be concise. Ask clarifying questions when needed.

## Commands
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run lint     # Check code style
```

## Project Structure
```
agent-voyage/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/
│   │   ├── agents/       # AI agent logic
│   │   ├── prompts/      # System prompts
│   │   └── gemini.ts     # Gemini API client
│   └── types/            # TypeScript types
├── .env.local            # GOOGLE_API_KEY (never commit)
├── AGENTS.md             # Master plan
└── agent_docs/           # Detailed documentation
```

## What NOT To Do
- Do NOT delete files without explicit confirmation
- Do NOT add features not in the current phase
- Do NOT invent prices for flights/hotels - use "Prix non disponible" if search fails
- Do NOT skip mobile testing
- Do NOT show technical jargon to users (no "SYS_02 activé...")
- Do NOT use Lorem ipsum or placeholder content
- Do NOT bypass errors - fix them immediately
- Do NOT over-engineer - keep solutions simple for MVP

## Current Phase Tasks
Check `AGENTS.md` "Current State" section for what to work on.

## Key Files to Know
- `agent_docs/tech_stack.md` - All libraries and setup commands
- `agent_docs/code_patterns.md` - How to structure code
- `agent_docs/product_requirements.md` - What to build
- `agent_docs/testing.md` - How to verify features work

## First Prompts (for user reference)
When starting a session:
```
"Read AGENTS.md and continue building from where we left off"
"What's the next task in the current phase?"
"Help me implement [specific feature from roadmap]"
```

## Environment Setup Reminder
Before coding, ensure:
1. `.env.local` exists with `GOOGLE_API_KEY=AIza...`
2. Dependencies installed: `npm install`
3. Dev server works: `npm run dev`
