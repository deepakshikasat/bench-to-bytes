# Bench to Bytes

A 12-week, self-paced AI/ML course for molecular biology scientists who want to lead at the intersection — not just spectate from the bench.

## Structure

The course is a static website with progressive module unlocking. Complete each module to unlock the next.

| Module | Weeks | Focus | Projects |
|--------|-------|-------|----------|
| 1. Claude Code & AI Tools | 1-2 | Prompt engineering, agents, MCP, automation, vibe coding | Dev setup, Lab data processor |
| 2. Data Science Foundations | 3-5 | EDA, classification, regression with biological data | Gene expression explorer, Toxicity classifier, Knockdown predictor |
| 3. Bio-Specific ML | 6-8 | Embeddings, foundation models, transcriptomics, deep learning | Protein embeddings, Immune signatures, Cell image classifier |
| 4. Building Data Products | 9-10 | Streamlit apps, LLM APIs, dashboards | Drug safety dashboard, Literature mining tool |
| 5. Leadership & Portfolio | 11-12 | Data strategy, capstone, portfolio launch | ML-ready data playbook, Capstone pipeline |

## Running Locally

Open `index.html` in your browser. No build step needed.

## Deploying to GitHub Pages

1. Create a repo called `bench-to-bytes`
2. Push all files
3. Go to Settings > Pages > Source: main branch
4. Your site will be live at `https://yourusername.github.io/bench-to-bytes`

## Files

```
index.html       — Hub page with module cards and progress tracking
module1.html     — Claude Code & AI Tools Mastery
module2.html     — Data Science Foundations
module3.html     — Bio-Specific ML
module4.html     — Building Data Products
module5.html     — Leadership & Portfolio Launch
style.css        — Shared styles (dark theme)
progress.js      — LocalStorage-based progress tracking and unlock system
```

Progress is saved in your browser's localStorage. Use the "Reset all progress" button on the hub page to start over.
