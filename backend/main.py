import asyncio
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

import pandas as pd
import yfinance as yf
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
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


# --- Endpoint 2: Get Live Yahoo Finance OHLC + 5/20 EMA Signals ---
@app.get("/api/signals/{symbol}")
async def get_ema_signals(symbol: str, period: str = "1mo", interval: str = "15m"):
    """
    Fetches live historical market candles using yfinance.
    Supports symbols like 'RELIANCE.NS' (NSE) or '500325.BO' (BSE).
    """
    try:
        formatted_symbol = symbol.upper()
        ticker = yf.Ticker(formatted_symbol)
        df = ticker.history(period=period, interval=interval)

        if df.empty:
            raise HTTPException(status_code=404, detail=f"No candle data found for {formatted_symbol}")

        # Reset index to access Date/Datetime column
        df = df.reset_index()

        # Convert timestamp to Unix Epoch Seconds for Lightweight Charts
        if "Datetime" in df.columns:
            df["time"] = (df["Datetime"].astype("int64") // 10**9).astype(int)
        elif "Date" in df.columns:
            df["time"] = (df["Date"].astype("int64") // 10**9).astype(int)

        # Standardize column names
        df = df.rename(columns={
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
            "Volume": "volume"
        })

        # Round values for clean JSON output
        df["open"] = df["open"].round(2)
        df["high"] = df["high"].round(2)
        df["low"] = df["low"].round(2)
        df["close"] = df["close"].round(2)

        # Calculate 5/20 EMA and Signals
        processed_data = process_ema_crossovers(df)

        return {
            "symbol": formatted_symbol,
            "period": period,
            "interval": interval,
            "count": len(processed_data),
            "data": processed_data
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error fetching data for {symbol}: {str(e)}")
