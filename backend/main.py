import asyncio
import random
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/market-data/{symbol}")
async def websocket_market_data(websocket: WebSocket, symbol: str):
    await websocket.accept()
    price = 111.40
    
    try:
        while True:
            # Simulate real-time price movement
            change = round(random.uniform(-0.50, 0.55), 2)
            price = max(10.0, round(price + change, 2))
            
            candle_update = {
                "time": int(datetime.utcnow().timestamp()),
                "open": round(price - random.uniform(0, 0.20), 2),
                "high": round(price + random.uniform(0.10, 0.40), 2),
                "low": round(price - random.uniform(0.10, 0.40), 2),
                "close": price,
                "volume": random.randint(100, 5000)
            }
            
            await websocket.send_json(candle_update)
            await asyncio.sleep(1) # Stream every second
            
    except WebSocketDisconnect:
        print(f"Client disconnected from {symbol} stream")
