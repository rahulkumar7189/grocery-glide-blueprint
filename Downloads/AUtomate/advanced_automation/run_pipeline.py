import os
import subprocess
import time
import random
import argparse
from datetime import datetime, timedelta

# Sub-modules
from crypto_analyst import analyzer
from news_pulse import sentiment
import dashboard

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, 'data')

def git_operations(message, dry_run=False):
    if dry_run:
        print(f"[DRY-RUN] Would run: git add .")
        print(f"[DRY-RUN] Would run: git commit -m '{message}'")
        print(f"[DRY-RUN] Would run: git push")
        return

    try:
        # Check if index.lock exists and remove it (handle crash recovery)
        git_dir = subprocess.run(["git", "rev-parse", "--git-dir"], cwd=ROOT_DIR, capture_output=True, text=True).stdout.strip()
        if git_dir:
            lock_file = os.path.join(git_dir, "index.lock")
            if os.path.exists(lock_file):
                print(f"Removing stale git lock file: {lock_file}")
                os.remove(lock_file)

        subprocess.run(["git", "add", "."], cwd=ROOT_DIR, check=True)
        # Check if there are changes
        status = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT_DIR, capture_output=True, text=True)
        if not status.stdout.strip():
            print("No changes to commit.")
            return

        subprocess.run(["git", "commit", "-m", message], cwd=ROOT_DIR, check=True)
        print(f"Committed: {message}")
        
        # subprocess.run(["git", "push"], cwd=ROOT_DIR, check=True) 
        # print("Pushed to remote.")
        print("Note: 'git push' is commented out. Uncomment in run_pipeline.py to enable.")
        
    except subprocess.CalledProcessError as e:
        print(f"Git Error: {e}")
    except Exception as e:
        print(f"Error during git operations: {e}")

def run_cycle(dry_run=False):
    print(f"--- Starting Automation Cycle: {datetime.now()} ---")
    
    task_choice = random.choice(['crypto', 'news', 'both'])
    
    commit_msg = ""
    
    if task_choice == 'crypto' or task_choice == 'both':
        print("Running Crypto Analyst...")
        analyzer.run_analysis()
        commit_msg += "Update market analysis chart. "
        
    if task_choice == 'news' or task_choice == 'both':
        print("Running News Pulse...")
        sentiment.run_news_pulse()
        commit_msg += "Log tech sentiment stats. "

    # Update Dashboard
    dashboard.update_readme()
    commit_msg += "Refreshed Dashboard."

    # Git
    git_operations(commit_msg.strip(), dry_run=dry_run)
    
    print("--- Cycle Complete ---")

def worker(dry_run=False):
    print("Orchestrator started. Using random intervals (3-6 hours).")
    while True:
        run_cycle(dry_run=dry_run)
        
        if dry_run:
            print("[DRY-RUN] Exiting after one cycle.")
            break
            
        # heavy sleep
        sleep_hours = random.uniform(3, 6)
        minutes = int(sleep_hours * 60)
        next_run = datetime.now() + timedelta(minutes=minutes)
        print(f"Sleeping for {minutes} minutes. Next run at {next_run.strftime('%H:%M')}")
        time.sleep(minutes * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Simulate without committing")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    args = parser.parse_args()

    if args.once:
        run_cycle(dry_run=args.dry_run)
    else:
        worker(dry_run=args.dry_run)
