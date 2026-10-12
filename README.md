# TATA Trading Prototype

A small NSE/BSE chart and EMA-scanner prototype. It has one FastAPI backend and
one Next.js frontend; it is not intended for live trading or production use.

## Structure

```text
backend/   FastAPI app and Python dependencies
frontend/  Next.js app and UI components
docs/      API notes and prototype status
```

## Run locally (PowerShell)

From the repository root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn main:app --app-dir backend --reload --port 8000
```

In a second PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`. The frontend uses the API at
`http://localhost:8000`.

## Market data

Charts and scans use Yahoo Finance through `yfinance` for Indian exchange
symbols (`.NS` for NSE and `.BO` for BSE). No API key is required. Availability,
history, and update timing are controlled by that provider; this is not a
guaranteed real-time feed.

See [the API and prototype notes](docs/API.md).
