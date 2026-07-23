# VerdictIO

VerdictIO is an online judge platform where users can solve programming problems, run code with custom inputs, and submit solutions to be evaluated against test cases.

Live Deployment: https://verdict-io.vercel.app

## Features

- User Authentication: Secure registration, login, and user profile dashboards.
- Problem Directory: Directory of coding problems categorized by difficulty levels (Easy, Medium, Hard).
- Code Editor: Web-based code editor using Monaco Editor with syntax highlighting.
- Code Runner: Compile and run code submissions (C++, Python, and JavaScript) on the backend.
- Submission Worker: Background job processing queue that compiles, runs, and matches code outputs against test cases.
- Dashboard & History: Solved problems tracking and complete user submission histories.

## Tech Stack

### Frontend
- **React**: Component-based user interface structure.
- **Vite**: Frontend build tool and development server.
- **Tailwind CSS**: Utility-first styling for layouts and responsive panels.
- **Monaco Editor (React)**: Powers the browser-based code editor with support for syntax highlighting and layout customization.
- **React Router DOM**: Client-side routing for navigating between dashboards, problems, and historical runs.
- **Axios**: Promised-based HTTP client used to interact with the backend API endpoints.

### Backend
- **Node.js & Express**: Core backend server handling REST API endpoints, routing, and user requests.
- **PostgreSQL**: Relational database for storing user data, problems, test cases, and execution history.
- **pg**: PostgreSQL client for Node.js used to execute SQL queries.
- **Redis & BullMQ**: Message broker and queue system used to process and manage asynchronous submission evaluation tasks.
- **JSON Web Tokens (JWT)**: Secure user session token generation and API authorization.
- **bcrypt**: Password hashing and verification.
- **Docker**: Containerization tool used to package the backend application along with its compiler and execution dependencies (GCC, Python, and JDK) into a unified, reproducible container.
