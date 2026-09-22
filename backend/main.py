# --- Endpoint 3: Scan Universe for Active 5/20 EMA Crossovers ---
@app.get("/api/scanner")
async def scan_ema_crossovers(
    limit: int = Query(30, ge=5, le=100, description="Number of stocks to scan"),
    interval: str = Query("15m", description="Candle timeframe: 5m, 15m, 1d")
):
    """
    Scans top liquid stocks for real-time 5/20 EMA Golden Cross (BUY) 
    or Death Cross (SELL) signals on the latest closed candle.
    """
    # Sample liquid Nifty symbols to prioritize if cache is empty or for faster scan
    default_symbols = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
        "BHARTIARTL.NS", "SBIN.NS", "LTIM.NS", "TATAMOTORS.NS", "AXISBANK.NS",
        "ITC.NS", "KOTAKBANK.NS", "LT.NS", "HINDUNILVR.NS", "BAJFINANCE.NS"
    ]

    target_symbols = [s["raw_symbol"] for s in ALL_STOCKS_CACHE[:limit]] if ALL_STOCKS_CACHE else default_symbols[:limit]

    buy_signals = []
    sell_signals = []

    for sym in target_symbols:
        try:
            ticker = yf.Ticker(sym)
            df = ticker.history(period="5d", interval=interval)
            
            if len(df) < 20:
                continue

            df = df.reset_index()
            df = df.rename(columns={"Close": "close"})

            # Calculate 5 & 20 EMA
            df["ema5"] = df["close"].ewm(span=5, adjust=False).mean().round(2)
            df["ema20"] = df["close"].ewm(span=20, adjust=False).mean().round(2)

            latest = df.iloc[-1]
            previous = df.iloc[-2]

            # Signal Logic
            buy_crossover = (previous["ema5"] <= previous["ema20"]) and (latest["ema5"] > latest["ema20"])
            sell_crossover = (previous["ema5"] >= previous["ema20"]) and (latest["ema5"] < latest["ema20"])

            result_item = {
                "symbol": sym,
                "close": round(latest["close"], 2),
                "ema5": latest["ema5"],
                "ema20": latest["ema20"],
                "timestamp": str(latest.get("Datetime", latest.get("Date", "")))
            }

            if buy_crossover:
                buy_signals.append({**result_item, "signal": "BUY"})
            elif sell_crossover:
                sell_signals.append({**result_item, "signal": "SELL"})

        except Exception:
            continue

    return {
        "scanned_count": len(target_symbols),
        "interval": interval,
        "summary": {
            "buy_count": len(buy_signals),
            "sell_count": len(sell_signals)
        },
        "buy_signals": buy_signals,
        "sell_signals": sell_signals
    }
