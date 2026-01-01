import requests
from textblob import TextBlob
import os
from datetime import datetime
import csv

# Corrected path to data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
os.makedirs(DATA_DIR, exist_ok=True)
LOG_FILE = os.path.join(DATA_DIR, 'sentiment_log.csv')

def fetch_top_stories():
    # Hacker News API
    try:
        top_ids = requests.get('https://hacker-news.firebaseio.com/v0/topstories.json').json()[:10]
        headlines = []
        for item_id in top_ids:
            item = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{item_id}.json').json()
            if 'title' in item:
                headlines.append(item['title'])
        return headlines
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def analyze_sentiment(headlines):
    if not headlines:
        return 0, 0
    
    total_polarity = 0
    total_subjectivity = 0
    
    for h in headlines:
        analysis = TextBlob(h)
        total_polarity += analysis.sentiment.polarity
        total_subjectivity += analysis.sentiment.subjectivity
        
    avg_polarity = total_polarity / len(headlines)
    avg_subjectivity = total_subjectivity / len(headlines)
    
    return avg_polarity, avg_subjectivity

def run_news_pulse():
    print("Fetching Top Tech News...")
    headlines = fetch_top_stories()
    
    if not headlines:
        print("No headlines found.")
        return

    polarity, subjectivity = analyze_sentiment(headlines)
    
    print(f"Analyzed {len(headlines)} headlines.")
    print(f"Daily Tech Mood: Polarity={polarity:.2f}, Subjectivity={subjectivity:.2f}")
    
    # Log to CSV
    row = [datetime.now().strftime("%Y-%m-%d %H:%M:%S"), len(headlines), f"{polarity:.3f}", f"{subjectivity:.3f}"]
    
    file_exists = os.path.isfile(LOG_FILE)
    
    with open(LOG_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Timestamp', 'Headlines_Count', 'Avg_Polarity', 'Avg_Subjectivity'])
        writer.writerow(row)
    
    print(f"Logged to {LOG_FILE}")
    
    # Also append to a markdown summary for visual commits
    md_file = os.path.join(DATA_DIR, 'daily_digest.md')
    trend = "Positive 📈" if polarity > 0 else "Negative 📉" if polarity < 0 else "Neutral 😐"
    
    with open(md_file, 'a', encoding='utf-8') as f:
        f.write(f"## {datetime.now().strftime('%Y-%m-%d')}\n")
        f.write(f"- **Tech Mood**: {trend} (Score: {polarity:.2f})\n")
        try:
             f.write(f"- **Top Story**: {headlines[0]}\n")
             if len(headlines) > 1:
                f.write(f"- **Sample**: _{headlines[1]}_\n\n")
        except:
             f.write("- **No headlines available**\n\n")

if __name__ == "__main__":
    run_news_pulse()
