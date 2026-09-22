import asyncio
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from stock_master import fetch_nse_stocks, fetch_bse_stocks

app = FastAPI(title="VM Algo Research Lab - Multi-Exchange Crossover Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Stock Master Memory Cache
ALL_STOCKS_CACHE: List[Dict[str, str]] = []

@app.on_event("startup")
async def load_stock_master():
    """Loads all NSE & BSE stock symbols on backend startup."""
    global ALL_STOCKS_CACHE
    print("Fetching full NSE and BSE stock universe...")
    nse_list = fetch_nse_stocks()
    bse_list = fetch_bse_stocks()
    ALL_STOCKS_CACHE = nse_list + bse_list
    print(f"Loaded {len(ALL_STOCKS_CACHE)} total stocks ({len(nse_list)} NSE, {len(bse_list)} BSE).")


# --- Endpoint 1: Search / Autocomplete All Stocks ---
@app.get("/api/stocks/search")
async def search_stocks(q: str = Query(..., min_length=1, description="Stock ticker or company name")):
    """Filters NSE & BSE stock universe by symbol or company name."""
    query = q.upper()
    results = [
        stock for stock in ALL_STOCKS_CACHE
        if query in stock["raw_symbol"] or query in stock["name"].upper()
    ]
    return {"count": len(results), "results": results[:20]}  # Top 20 matches


# --- Helper: 5 & 20 EMA Crossover Computation ---
def process_ema_crossovers(df: pd.DataFrame) -> List[Dict[str, Any]]:
    if len(df) < 20:
        df["ema5"] = df["close"]
        df["ema20"] = df["close"]
        df["signal"] = None
        return df.to_dict(orient="records")

    df["ema5"] = df["close"].ewm(span=5, adjust=False).mean().round(2)
    df["ema20"] = df["close"].ewm(span=20, adjust=False).mean().round(2)

    prev_ema5 = df["ema5"].shift(1)
    prev_ema20 = df["ema20"].shift(1)

    df["signal"] = None
    buy_mask = (prev_ema5 <= prev_ema20) & (df["ema5"] > df["ema20"])
    sell_mask = (prev_ema5 >= prev_ema20) & (df["ema5"] < df["ema20"])

    df.loc[buy_mask, "signal"] = "BUY"
    df.loc[sell_mask, "signal"] = "SELL"

    return df.to_dict(orient="records")


def generate_mock_candles(symbol: str, count: int = 100) -> pd.DataFrame:
    base_time = int(datetime.utcnow().timestamp()) - (count * 60)
    price = 2500.0 if "TATA" in symbol else 1200.0
    candles = []

    for i in range(count):
        change = random.uniform(-5.0, 5.2)
        price = max(10.0, round(price + change, 2))
        open_p = round(price - random.uniform(-2, 2), 2)
        high_p = round(max(price, open_p) + random.uniform(0.5, 3.0), 2)
        low_p = round(min(price, open_p) - random.uniform(0.5, 3.0), 2)

        candles.append({
            "time": base_time + (i * 60),
            "open": open_p,
            "high": high_p,
            "low": low_p,
            "close": price,
            "volume": random.randint(500, 10000)
        })

    return pd.DataFrame(candles)


# --- Endpoint 2: Get OHLC + 5/20 EMA Signals for ANY Symbol ---
@app.get("/api/signals/{symbol}")
async def get_ema_signals(symbol: str):
    # Works for both 'RELIANCE.NS' (NSE) or '500325.BO' (BSE)
    df = generate_mock_candles(symbol, 100)
    processed_data = process_ema_crossovers(df)
    return {
        "symbol": symbol.upper(),
        "count": len(processed_data),
        "data": processed_data
    }
