# VerdictIO

VerdictIO is an online judge platform where users can solve programming problems, run code with custom inputs, and submit solutions to be evaluated against test cases.

Live Deployment: https://verdict-io.vercel.app

## Features

- User Authentication: Registration, login, and user profile dashboards.
- Problem Directory: Directory of coding problems categorized by difficulty levels (Easy, Medium, Hard).
- Code Editor: Web-based code editor using Monaco Editor supporting syntax highlighting.
- Code Runner: Compile and run code submissions (C++, Python, and JavaScript) on the backend execution worker.
- Submission Worker: Background job processing queue (BullMQ/Redis) that compiles, runs, and matches code outputs against test cases.
- Dashboard & History: Statistics for solved problems and complete user submission histories.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Monaco Editor (via @monaco-editor/react)

### Backend
- Node.js & Express
- PostgreSQL (Database)
- Redis & BullMQ (Queue management and submission execution)
