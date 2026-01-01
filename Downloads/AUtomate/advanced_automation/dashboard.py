import os
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, 'data')
README_PATH = os.path.join(ROOT_DIR, 'README.md')

def update_readme():
    print("Updating Dashboard...")
    
    # Read Crypto Log
    crypto_log = ""
    crypto_file = os.path.join(DATA_DIR, 'market_log.txt')
    if os.path.exists(crypto_file):
        with open(crypto_file, 'r') as f:
            lines = f.readlines()
            crypto_log = lines[-1].strip() if lines else "No data yet."
    else:
        crypto_log = "Waiting for data..."

    # Read Sentiment Log
    sentiment_summary = ""
    sentiment_file = os.path.join(DATA_DIR, 'daily_digest.md')
    if os.path.exists(sentiment_file):
        with open(sentiment_file, 'r', encoding='utf-8') as f:
            # Get last 5 lines
            lines = f.readlines()
            sentiment_summary = "".join(lines[-5:]) if len(lines) > 5 else "".join(lines)
    else:
        sentiment_summary = "No sentiment data yet."

    # Generate README Content
    content = f"""# 🤖 Advanced Engineering Automation Dashboard

**Auto-generated Report** | Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📊 Market Pulse (CryptoAnalyst)
> {crypto_log}

![BTC Analysis](data/btc_analysis.png)

## 📰 Tech Sentiment (NewsPulse)
{sentiment_summary}

---
*This repository is maintained by an autonomous Python agent performing daily data science and NLP tasks.*
"""

    with open(README_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Dashboard updated at {README_PATH}")

if __name__ == "__main__":
    update_readme()
