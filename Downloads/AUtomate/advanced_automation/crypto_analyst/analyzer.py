import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import os
from datetime import datetime

# Corrected path to data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def calculate_rsi(data, window=14):
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def run_analysis():
    print("Fetching BTC-USD data...")
    try:
        # Fetch data for the last 30 days, 1h interval to have granular data for "day trading" feel
        # or 6mo daily data for macro view. Let's do 60d daily for standard SMA20.
        btc = yf.download('BTC-USD', period='60d', interval='1d', progress=False)
        
        if btc.empty:
            print("No data fetched.")
            return

        # Calculate Indicators
        btc['SMA_20'] = btc['Close'].rolling(window=20).mean()
        btc['RSI'] = calculate_rsi(btc)

        # Generate Plot
        plt.figure(figsize=(10, 6))
        
        # Subplot 1: Price & SMA
        ax1 = plt.subplot(2, 1, 1)
        plt.plot(btc.index, btc['Close'], label='Price')
        plt.plot(btc.index, btc['SMA_20'], label='SMA 20', color='orange')
        plt.title(f'BTC-USD Analysis ({datetime.now().strftime("%Y-%m-%d")})')
        plt.legend()
        plt.grid(True)

        # Subplot 2: RSI
        plt.subplot(2, 1, 2, sharex=ax1)
        plt.plot(btc.index, btc['RSI'], label='RSI', color='purple')
        plt.axhline(70, linestyle='--', color='red', alpha=0.5)
        plt.axhline(30, linestyle='--', color='green', alpha=0.5)
        plt.legend()
        plt.grid(True)

        output_path = os.path.join(DATA_DIR, 'btc_analysis.png')
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        print(f"Chart saved to {output_path}")
        
        # Log entry
        # Handle yfinance potential MultiIndex or Series
        close_series = btc['Close']
        rsi_series = btc['RSI']
        
        val_close = close_series.iloc[-1]
        val_rsi = rsi_series.iloc[-1]
        
        # If it's still a series (due to MultiIndex columns), get the scalar
        if hasattr(val_close, 'item'):
            last_close = val_close.item()
        elif hasattr(val_close, 'values'):
             last_close = val_close.values[0]
        else:
            last_close = float(val_close)
            
        if hasattr(val_rsi, 'item'):
            last_rsi = val_rsi.item()
        elif hasattr(val_rsi, 'values'):
             last_rsi = val_rsi.values[0]
        else:
            last_rsi = float(val_rsi)

        log_entry = f"{datetime.now()}: BTC ${last_close:.2f} | RSI: {last_rsi:.2f}\n"
        
        with open(os.path.join(DATA_DIR, 'market_log.txt'), 'a') as f:
            f.write(log_entry)
            
    except Exception as e:
        print(f"Error running analysis: {e}")

if __name__ == "__main__":
    run_analysis()
