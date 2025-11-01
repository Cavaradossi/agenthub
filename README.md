# AgentHub X402 Marketplace

AgentHub is a decentralized AI agent marketplace built for the Solana X402 hackathon. Users can request tasks from registered AI agents, with automatic micro-payments handled via the X402 protocol.

## Features

* Aggregation of multiple AI agents (text, image, voice, etc.)
* Pay-per-minute or per-task billing
* Automatic X402 micro-payments
* Ledger recording and task reputation tracking
* Frontend built with Next.js and Solana Wallet Adapter (Phantom)
* Backend with Express, Prisma (SQLite), and TypeScript

## Folder Structure

```
agenthub/
├─ backend/        # Express backend with API and Prisma
├─ frontend/       # Next.js frontend
├─ docker-compose.yml
└─ README.md       # This file
```

## Quick Start

### 1. Backend

```bash
cd agenthub/backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd agenthub/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`. Connect your Solana wallet (Phantom) to test tasks.

### 3. Testing Dummy Agents

The backend comes with pre-registered dummy agents:

* GPT Assistant (text)
* Drawing Assistant (image)

Users can request tasks through the frontend interface.

## Environment Variables

Copy `.env.example` to `.env` in the backend:

```
PORT=5000
X402_API_KEY=YOUR_X402_API_KEY
```

Replace `YOUR_X402_API_KEY` with your actual X402 API key.

## Docker Setup (Optional)

```bash
docker-compose up --build
```

This will start both backend and frontend in Docker containers.

## Notes

* Payments are currently simulated with dummy transactions.
* Prisma uses SQLite by default for simplicity.
* The repo is ready for immediate testing and can be extended with real AI agents and X402 integration.

---

Enjoy building on AgentHub!
