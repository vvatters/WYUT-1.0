# PROJECT_GUIDELINES.md

## Project Overview

**Would You Use This (WYUT)** is an anonymous platform where people post product/app ideas and the community votes them up or down. Think "Yik Yak for startup ideas" — simple, fast, honest feedback.

### Core Philosophy
- No comments, no profiles, no clutter
- Just ideas and votes
- Fresh ideas get a fair shot via time filtering
- Anonymity with accountability (Google sign-in keeps voting honest, but identity stays hidden)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (database + auth) |
| Auth | Google OAuth via Supabase |
| Deployment | Vercel |

---

## Current Features

- [x] Dark theme UI
- [x] Post ideas (140 char limit)
- [x] Up/down voting (one vote per user per idea, no takebacks)
- [x] Time filters (Today, This Week, This Month, All Time)
- [x] Score display with color coding
- [ ] Google OAuth (Supabase not yet connected)
- [ ] 🔥 Rising indicator for trending ideas
- [ ] AI-generated comparable apps list

---

## Project Structure

```
would-you-use-this/
├── src/
│   ├── App.jsx              # Entry point, renders WouldYouUseThis
│   ├── WouldYouUseThis.jsx  # Main component
│   ├── index.css            # Tailwind import
│   └── main.jsx             # React DOM render
├── vite.config.js           # Vite + Tailwind config
├── package.json
└── index.html
```

---

## Development Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## Database Schema (Supabase)

**ideas** table:
- `id` (uuid, primary key)
- `text` (text, max 140 chars)
- `created_at` (timestamp)

**votes** table:
- `id` (uuid, primary key)
- `idea_id` (uuid, foreign key → ideas)
- `user_id` (uuid, from auth)
- `vote_type` ('up' or 'down')
- `created_at` (timestamp)
- Unique constraint on (idea_id, user_id)

**ideas_with_votes** view:
- Aggregates upvotes/downvotes per idea

---

## Collaboration Guidelines

### When helping with this project:

1. **Read this file first** to understand context
2. **Keep it simple** — this is a minimalist app by design
3. **Dark theme only** — use zinc color palette (zinc-950 background, zinc-100 text)
4. **No feature creep** — no comments, profiles, categories, or tags
5. **Mobile-first** — max-w-xl container, touch-friendly buttons

### Code Style
- Functional React components with hooks
- Tailwind for all styling (no separate CSS files)
- Keep components in single files when possible
- Use async/await for Supabase calls

### Delivering Code Changes

**Always provide complete files as artifacts** that can be downloaded or copied directly into the project folder. Do not give line-by-line instructions to edit in VS Code.

When making changes:
- Provide the **full file contents** as a code block with the filename clearly labeled
- State whether to **add** (new file) or **replace** (existing file)
- Specify the exact path: `src/ComponentName.jsx` or root level
- Test that code compiles before sharing

Example format:
```
**Replace `src/WouldYouUseThis.jsx` with:**
[full file contents here]
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `WouldYouUseThis.jsx` | Main app component — all UI and logic |
| `vite.config.js` | Build config with Tailwind plugin |
| `src/index.css` | Just `@import "tailwindcss";` |
| `HANDOFF.md` | Setup steps and deployment guide |
| `SETUP.md` | Detailed Supabase/Google OAuth setup |

---

## Project Location

```
C:\Users\watte\OneDrive\Desktop\would-you-use-this
```

GitHub: `https://github.com/vvatters/WYUT-1.0`
