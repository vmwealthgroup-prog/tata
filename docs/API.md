# API and data notes

Run the API from the repository root with:

```powershell
python -m uvicorn main:app --app-dir backend --reload --port 8000
```

All endpoints are served by the same FastAPI application at
`http://localhost:8000`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `GET` | `/api/trading-data?symbol=TATAMOTORS.NS&interval=15` | OHLCV candles |
| `GET` | `/api/signals/TATAMOTORS.NS?interval=15m&period=1mo` | Candles with EMA 5/20 and crossover signals |
| `GET` | `/api/stocks/search?q=TATA` | Search the prototype NSE symbol list |
| `GET` | `/api/scanner?limit=20&interval=15m` | Scan the prototype NSE list for EMA crossovers |

Chart intervals are `1m`, `5m`, `15m`, `30m`, `1h`, and `1d`. The legacy chart
endpoint also accepts numeric minute intervals and `D`.

Market history for chart and scanner requests comes from Yahoo Finance via
`yfinance`, using Indian exchange ticker suffixes (`.NS` and `.BO`). Provider
rate limits, missing history, and delays can affect responses. This prototype
is not suitable for trade execution.
