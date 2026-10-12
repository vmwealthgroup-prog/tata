import logging
import re
from typing import Any

import yfinance as yf
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

app = FastAPI(title="TATA Prototype API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STOCK_UNIVERSE = [
    {"symbol": "RELIANCE.NS", "raw_symbol": "RELIANCE", "name": "Reliance Industries", "exchange": "NSE"},
    {"symbol": "TCS.NS", "raw_symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE"},
    {"symbol": "INFY.NS", "raw_symbol": "INFY", "name": "Infosys", "exchange": "NSE"},
    {"symbol": "HDFCBANK.NS", "raw_symbol": "HDFCBANK", "name": "HDFC Bank", "exchange": "NSE"},
    {"symbol": "ICICIBANK.NS", "raw_symbol": "ICICIBANK", "name": "ICICI Bank", "exchange": "NSE"},
    {"symbol": "BHARTIARTL.NS", "raw_symbol": "BHARTIARTL", "name": "Bharti Airtel", "exchange": "NSE"},
    {"symbol": "SBIN.NS", "raw_symbol": "SBIN", "name": "State Bank of India", "exchange": "NSE"},
    {"symbol": "LTIM.NS", "raw_symbol": "LTIM", "name": "LTIMindtree", "exchange": "NSE"},
    {"symbol": "TATAMOTORS.NS", "raw_symbol": "TATAMOTORS", "name": "Tata Motors", "exchange": "NSE"},
    {"symbol": "AXISBANK.NS", "raw_symbol": "AXISBANK", "name": "Axis Bank", "exchange": "NSE"},
    {"symbol": "ITC.NS", "raw_symbol": "ITC", "name": "ITC", "exchange": "NSE"},
    {"symbol": "KOTAKBANK.NS", "raw_symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "exchange": "NSE"},
    {"symbol": "LT.NS", "raw_symbol": "LT", "name": "Larsen & Toubro", "exchange": "NSE"},
    {"symbol": "HINDUNILVR.NS", "raw_symbol": "HINDUNILVR", "name": "Hindustan Unilever", "exchange": "NSE"},
    {"symbol": "BAJFINANCE.NS", "raw_symbol": "BAJFINANCE", "name": "Bajaj Finance", "exchange": "NSE"},
]

INTERVAL_ALIASES = {
    "1": "1m",
    "1m": "1m",
    "5": "5m",
    "5m": "5m",
    "15": "15m",
    "15m": "15m",
    "30": "30m",
    "30m": "30m",
    "60": "1h",
    "1h": "1h",
    "D": "1d",
    "1d": "1d",
}
PERIODS_BY_INTERVAL = {
    "1m": {"1d", "5d"},
    "5m": {"1d", "5d", "1mo"},
    "15m": {"1d", "5d", "1mo"},
    "30m": {"1d", "5d", "1mo"},
    "1h": {"5d", "1mo", "3mo", "6mo", "1y"},
    "1d": {"1mo", "3mo", "6mo", "1y", "2y", "5y", "max"},
}
DEFAULT_PERIODS = {
    "1m": "1d",
    "5m": "5d",
    "15m": "1mo",
    "30m": "1mo",
    "1h": "1y",
    "1d": "6mo",
}


def normalize_symbol(symbol: str) -> str:
    normalized = symbol.strip().upper()
    if not re.fullmatch(r"[A-Z0-9&_-]{1,20}(?:\.(?:NS|BO))?", normalized):
        raise HTTPException(status_code=422, detail="Use an NSE or BSE ticker symbol")
    if not normalized.endswith((".NS", ".BO")):
        normalized = f"{normalized}.NS"
    return normalized


def normalize_interval(interval: str) -> str:
    try:
        return INTERVAL_ALIASES[interval]
    except KeyError as error:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported interval: {interval}",
        ) from error


def fetch_history(symbol: str, interval: str, period: str):
    if period not in PERIODS_BY_INTERVAL[interval]:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported period {period} for {interval} candles",
        )

    try:
        history = yf.Ticker(symbol).history(period=period, interval=interval)
    except Exception as error:
        logger.exception("Market data request failed for %s", symbol)
        raise HTTPException(
            status_code=502,
            detail="Indian-market data provider request failed",
        ) from error

    if history.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No market data returned for {symbol}",
        )
    return history


def candle_time(timestamp: Any, interval: str) -> int | str:
    if interval == "1d":
        return timestamp.date().isoformat()
    return int(timestamp.timestamp())


def format_candles(history: Any, interval: str) -> list[dict[str, Any]]:
    closes = history["Close"]
    ema5 = closes.ewm(span=5, adjust=False).mean()
    ema20 = closes.ewm(span=20, adjust=False).mean()
    candles = []

    for index, (timestamp, row) in enumerate(history.iterrows()):
        signal = None
        if index:
            previous_ema5 = float(ema5.iloc[index - 1])
            previous_ema20 = float(ema20.iloc[index - 1])
            current_ema5 = float(ema5.iloc[index])
            current_ema20 = float(ema20.iloc[index])
            if previous_ema5 <= previous_ema20 and current_ema5 > current_ema20:
                signal = "BUY"
            elif previous_ema5 >= previous_ema20 and current_ema5 < current_ema20:
                signal = "SELL"

        volume = row.get("Volume", 0)
        candles.append(
            {
                "time": candle_time(timestamp, interval),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(volume) if volume == volume else 0,
                "ema5": round(float(ema5.iloc[index]), 2),
                "ema20": round(float(ema20.iloc[index]), 2),
                "signal": signal,
            }
        )
    return candles


@app.get("/")
def home():
    return {"message": "TATA prototype API is running"}


@app.get("/api/health")
def health():
    return {"status": "TATA prototype API is running"}


@app.get("/api/trading-data")
def trading_data(
    symbol: str = Query(..., min_length=1, max_length=24),
    interval: str = Query("60"),
):
    ticker = normalize_symbol(symbol)
    candle_interval = normalize_interval(interval)
    history = fetch_history(
        ticker,
        candle_interval,
        DEFAULT_PERIODS[candle_interval],
    )
    return format_candles(history, candle_interval)


@app.get("/api/signals/{symbol}")
def signals(
    symbol: str,
    interval: str = Query("15m"),
    period: str = Query("1mo"),
):
    ticker = normalize_symbol(symbol)
    candle_interval = normalize_interval(interval)
    history = fetch_history(ticker, candle_interval, period)
    return {
        "symbol": ticker,
        "interval": candle_interval,
        "period": period,
        "data": format_candles(history, candle_interval),
    }


@app.get("/api/stocks/search")
def search_stocks(q: str = Query(..., min_length=1, max_length=40)):
    query = q.strip().casefold()
    results = [
        stock
        for stock in STOCK_UNIVERSE
        if query in stock["raw_symbol"].casefold()
        or query in stock["name"].casefold()
    ]
    return {"results": results}


@app.get("/api/scanner")
def scan_ema_crossovers(
    limit: int = Query(30, ge=5, le=100),
    interval: str = Query("15m"),
):
    candle_interval = normalize_interval(interval)
    if candle_interval not in {"5m", "15m", "1d"}:
        raise HTTPException(
            status_code=422,
            detail="Scanner interval must be 5m, 15m, or 1d",
        )

    period = {"5m": "5d", "15m": "1mo", "1d": "6mo"}[candle_interval]
    buy_signals = []
    sell_signals = []
    stocks = STOCK_UNIVERSE[:limit]

    for stock in stocks:
        ticker = stock["symbol"]
        try:
            history = fetch_history(ticker, candle_interval, period)
        except HTTPException as error:
            logger.warning("Skipping %s during scan: %s", ticker, error.detail)
            continue

        candles = format_candles(history, candle_interval)
        if len(candles) < 2:
            continue

        latest = candles[-1]
        if latest["signal"] == "BUY":
            buy_signals.append(
                {
                    "symbol": ticker,
                    "close": latest["close"],
                    "ema5": latest["ema5"],
                    "ema20": latest["ema20"],
                    "timestamp": str(latest["time"]),
                    "signal": "BUY",
                }
            )
        elif latest["signal"] == "SELL":
            sell_signals.append(
                {
                    "symbol": ticker,
                    "close": latest["close"],
                    "ema5": latest["ema5"],
                    "ema20": latest["ema20"],
                    "timestamp": str(latest["time"]),
                    "signal": "SELL",
                }
            )

    return {
        "scanned_count": len(stocks),
        "interval": candle_interval,
        "summary": {
            "buy_count": len(buy_signals),
            "sell_count": len(sell_signals),
        },
        "buy_signals": buy_signals,
        "sell_signals": sell_signals,
    }
