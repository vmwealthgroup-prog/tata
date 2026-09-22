import io
import requests
import pandas as pd
from typing import List, Dict, Any

# NSE and BSE Official CSV URLs
NSE_ALL_STOCKS_URL = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
BSE_ALL_STOCKS_URL = "https://www.bseindia.com/corporates/List_Scrips.aspx"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_nse_stocks() -> List[Dict[str, str]]:
    """Fetches all equity symbols listed on NSE."""
    try:
        response = requests.get(NSE_ALL_STOCKS_URL, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            df = pd.read_csv(io.StringIO(response.text))
            stocks = []
            for _, row in df.iterrows():
                symbol = str(row['SYMBOL']).strip()
                name = str(row['NAME OF COMPANY']).strip()
                stocks.append({
                    "symbol": f"{symbol}.NS", # Yahoo Finance / Algo Ticker format
                    "raw_symbol": symbol,
                    "name": name,
                    "exchange": "NSE"
                })
            return stocks
    except Exception as e:
        print(f"Error fetching NSE stock list: {e}")
    return []

def fetch_bse_stocks() -> List[Dict[str, str]]:
    """Fetches key equity symbols listed on BSE."""
    try:
        url = "https://api.bseindia.com/BseIndiaAPI/api/ListofScripData/w?Group=&Scrip_code=&scrip_name=&segment=Equity&status=Active"
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            stocks = []
            for item in data:
                scrip_code = str(item.get('scrip_cd', '')).strip()
                name = str(item.get('scrip_name', '')).strip()
                if scrip_code:
                    stocks.append({
                        "symbol": f"{scrip_code}.BO", # Yahoo Finance BSE format
                        "raw_symbol": scrip_code,
                        "name": name,
                        "exchange": "BSE"
                    })
            return stocks
    except Exception as e:
        print(f"Error fetching BSE stock list: {e}")
    return []
