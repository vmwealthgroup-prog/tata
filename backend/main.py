import asyncio
import random
from datetime import datetime
from typing import List, Dict, Any

import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VM Algo Research Lab - EMA Crossover Engine")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helper Function: Calculate 5 & 20 EMA + Crossovers ---
def process_ema_crossovers(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Takes a DataFrame with columns ['time', 'open', 'high', 'low', 'close', 'volume']
    Calculates 5 EMA and 20 EMA, and detects BUY/SELL crossover signals.
    """
    if len(df) < 20:
        df["ema5"] = df["close"]
        df["ema20"] = df["close"]
        df["signal"] = None
        return df.to_dict(orient="records")

    # Calculate 5 EMA & 20 EMA
    df["ema5"] = df["close"].ewm(span=5, adjust=False).mean().round(2)
    df["ema20"] = df["close"].ewm(span=20, adjust=False).mean().round(2)

    # Shift EMAs to detect crossovers from previous bar to current bar
    prev_ema5 = df["ema5"].shift(1)
    prev_ema20 = df["ema20"].shift(1)

    # Signal Logic
    df["signal"] = None
    
    # 5 EMA crosses ABOVE 20 EMA -> BUY
    buy_mask = (prev_ema5 <= prev_ema20) & (df["ema5"] > df["ema20"])
    df.loc[buy_mask, "signal"] = "BUY"

    # 5 EMA crosses BELOW 20 EMA -> SELL
    sell_mask = (prev_ema5 >= prev_ema20) & (df["ema5"] < df["ema20"])
    df.loc[sell_mask, "signal"] = "SELL"

    return df.to_dict(orient="records")


# --- Mock Data Generator ---
def generate_mock_candles(count: int = 100) -> pd.DataFrame:
    base_time = int(datetime.utcnow().timestamp()) - (count * 60)
    price = 1000.0
    candles = []

    for i in range(count):
        change = random.uniform(-4.0, 4.2)
        price = max(100.0, round(price + change, 2))
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


# --- REST Endpoint: Get Historical Candles + Signals ---
@app.get("/api/signals/{symbol}")
async def get_ema_signals(symbol: str):
    df = generate_mock_candles(100)
    processed_data = process_ema_crossovers(df)
    return {
        "symbol": symbol,
        "count": len(processed_data),
        "data": processed_data
    }


# --- WebSocket Endpoint: Real-time Live Tick Streaming & Signal Alerts ---
@app.websocket("/ws/signals/{symbol}")
async def websocket_ema_signals(websocket: WebSocket, symbol: str):
    await websocket.accept()
    
    # Initialize a rolling buffer of candles for real-time calculations
    df = generate_mock_candles(30)
    
    try:
        while True:
            last_close = df.iloc[-1]["close"]
            price_change = round(random.uniform(-2.0, 2.1), 2)
            new_close = max(10.0, round(last_close + price_change, 2))
            
            new_candle = {
                "time": int(datetime.utcnow().timestamp()),
                "open": round(new_close - random.uniform(-1, 1), 2),
                "high": round(new_close + random.uniform(0.2, 1.5), 2),
                "low": round(new_close - random.uniform(0.2, 1.5), 2),
                "close": new_close,
                "volume": random.randint(100, 2000)
            }
            
            # Append new candle & recalculate EMAs
            df = pd.concat([df, pd.DataFrame([new_candle])], ignore_index=True)
            if len(df) > 100:
                df = df.iloc[-100:].reset_index(drop=True)
                
            processed = process_ema_crossovers(df)
            latest_bar = processed[-1]
            
            # Send live update payload
            await websocket.send_json({
                "time": latest_bar["time"],
                "open": latest_bar["open"],
                "high": latest_bar["high"],
                "low": latest_bar["low"],
                "close": latest_bar["close"],
                "ema5": latest_bar["ema5"],
                "ema20": latest_bar["ema20"],
                "signal": latest_bar["signal"]  # Outputs "BUY", "SELL", or None
            })
            
            await asyncio.sleep(1) # Broadcast every 1 second

    except WebSocketDisconnect:
        print(f"Client disconnected from live stream for {symbol}")
