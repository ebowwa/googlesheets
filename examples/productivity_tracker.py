#!/usr/bin/env python3
"""
Example: Productivity Tracker Integration

This example shows how to use the Google Sheets CLI with git history analysis
to populate a productivity tracker with real development data.
"""

import json
import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from sheets_cli import GoogleSheetsCLI

# Configuration
SHEET_ID = "1OxJTCXOM1X0VP6sprPz-fXm_-RZtNSTMXJ4SNCdGYBM"
WORKSHEET_NAME = "daily"

# Date to row mapping (adjust based on your sheet structure)
DATE_TO_ROW = {
    "2025-09-30": 2,  # Row 2 in sheet (accounting for header)
    "2025-10-01": 3,  # Row 3 in sheet
    "2025-10-02": 4,  # Row 4 in sheet
    "2025-10-03": 5,  # Row 5 in sheet
    "2025-10-04": 6,  # Row 6 in sheet
    "2025-10-05": 7,  # Row 7 in sheet
    "2025-10-06": 8,  # Row 8 in sheet
    "2025-10-07": 9,  # Row 9 in sheet
    "2025-10-08": 10, # Row 10 in sheet
    "2025-10-09": 11, # Row 11 in sheet
}

def load_git_analysis(filename="git_analysis.json"):
    """Load git analysis results"""
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filename} not found. Run git_history_analyzer.py first.")
        return None

def update_productivity_tracker():
    """Update productivity tracker with git history data"""

    print("🚀 Updating Productivity Tracker with Git History")
    print("=" * 55)

    # Load git analysis
    analysis = load_git_analysis()
    if not analysis:
        return

    daily_notes = analysis['daily_notes']
    metadata = analysis['metadata']

    print(f"📊 Analysis Overview:")
    print(f"   • Total commits: {metadata['total_commits']}")
    print(f"   • Active repos: {metadata['total_repos']}")
    print(f"   • Active days: {metadata['active_days']}")

    # Initialize Google Sheets CLI
    cli = GoogleSheetsCLI()

    if not cli.authenticate():
        print("❌ Failed to authenticate with Google Sheets")
        return

    # Update each day
    successful_updates = 0

    for date, row_num in DATE_TO_ROW.items():
        print(f"\n📝 Updating {date} (row {row_num})...")

        if date in daily_notes:
            notes = daily_notes[date]

            # Update the Git History column (Column C)
            result = cli.update_cell(f'{WORKSHEET_NAME}!C{row_num}', notes)

            if 'error' in result:
                print(f"❌ Error updating {date}: {result['error']}")
            else:
                print(f"✅ Successfully updated {date}")
                successful_updates += 1
        else:
            print(f"⚠️  No data for {date}")

    print(f"\n🎉 Update complete!")
    print(f"📊 Successfully updated {successful_updates}/{len(DATE_TO_ROW)} days")

def analyze_and_update():
    """Run git analysis and update tracker in one command"""

    print("🔄 Running complete analysis and update workflow")
    print("=" * 50)

    # Step 1: Run git analysis
    print("Step 1: Analyzing git history...")
    import subprocess

    try:
        result = subprocess.run([
            sys.executable,
            str(Path(__file__).parent.parent / "src" / "git_history_analyzer.py")
        ], capture_output=True, text=True, check=True)

        print("✅ Git analysis completed")
        print(result.stdout)

    except subprocess.CalledProcessError as e:
        print(f"❌ Git analysis failed: {e}")
        print(e.stderr)
        return

    # Step 2: Update tracker
    print("\nStep 2: Updating productivity tracker...")
    update_productivity_tracker()

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Productivity Tracker Integration')
    parser.add_argument('--analyze-only', action='store_true', help='Only run git analysis')
    parser.add_argument('--update-only', action='store_true', help='Only update tracker (requires existing git_analysis.json)')
    parser.add_argument('--full', action='store_true', help='Run complete workflow (default)')

    args = parser.parse_args()

    if args.analyze_only:
        import subprocess
        subprocess.run([
            sys.executable,
            str(Path(__file__).parent.parent / "src" / "git_history_analyzer.py")
        ])
    elif args.update_only:
        update_productivity_tracker()
    else:
        analyze_and_update()