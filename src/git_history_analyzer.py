#!/usr/bin/env python3
"""
Git History Analyzer - Analyze git commits across multiple repositories for productivity tracking

Usage: python git_history_analyzer.py [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD] [--repos-dir /path/to/repos]

This script analyzes git history across specified repositories and generates productivity insights.
"""

import os
import subprocess
import json
import argparse
from pathlib import Path
from datetime import datetime, timedelta

# Default configuration
DEFAULT_START_DATE = "2025-09-30"
DEFAULT_END_DATE = "2025-10-09"
DEFAULT_REPOS_DIR = "/Users/ebowwa/apps"

# Repository patterns to analyze
REPO_PATTERNS = [
    "openhardwareai",
    "app-store-connect-wrapper",
    "CleanShot*",
    "speakd",
    "node-starter"
]

class GitHistoryAnalyzer:
    def __init__(self, repos_dir=None):
        self.repos_dir = Path(repos_dir) if repos_dir else Path(DEFAULT_REPOS_DIR)
        self.repositories = []

    def discover_repositories(self):
        """Discover git repositories based on patterns"""
        print("🔍 Discovering repositories...")

        for pattern in REPO_PATTERNS:
            for repo_path in self.repos_dir.glob(pattern):
                git_dir = repo_path / ".git"
                if git_dir.exists():
                    self.repositories.append(str(repo_path))
                    print(f"  📁 Found: {repo_path.name}")

        print(f"📊 Discovered {len(self.repositories)} repositories")
        return self.repositories

    def get_git_commits(self, repo_path, start_date, end_date):
        """Get git commits for a repository within date range"""
        try:
            # Get commits with detailed info
            cmd = [
                "git", "-C", repo_path, "log",
                f"--since={start_date} 00:00:00",
                f"--until={end_date} 23:59:59",
                "--pretty=format:%H|%ad|%s|%an",
                "--date=format:%Y-%m-%d %H:%M",
                "--no-patch"
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, check=True)

            commits = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    parts = line.split('|', 3)
                    if len(parts) >= 4:
                        commit_hash, commit_date, commit_message, author = parts[:4]
                        commits.append({
                            'hash': commit_hash,
                            'date': commit_date,
                            'message': commit_message,
                            'author': author,
                            'repo': os.path.basename(repo_path)
                        })

            return commits

        except subprocess.CalledProcessError:
            return []
        except Exception as e:
            print(f"Error analyzing {repo_path}: {e}")
            return []

    def analyze_all_repos(self, start_date, end_date):
        """Analyze git history across all repositories"""
        all_commits = []

        if not self.repositories:
            self.discover_repositories()

        for repo_path in self.repositories:
            repo_name = os.path.basename(repo_path)
            print(f"  📊 Analyzing {repo_name}")
            commits = self.get_git_commits(repo_path, start_date, end_date)
            all_commits.extend(commits)
            print(f"    Found {len(commits)} commits")

        # Sort by date
        all_commits.sort(key=lambda x: x['date'])
        return all_commits

    def generate_daily_notes(self, commits):
        """Generate daily notes based on git history"""
        daily_notes = {}

        # Group commits by date
        for commit in commits:
            date_only = commit['date'].split(' ')[0]

            if date_only not in daily_notes:
                daily_notes[date_only] = {
                    'commits': [],
                    'repos': set(),
                    'first_commit': commit['date'],
                    'last_commit': commit['date'],
                    'total_commits': 0
                }

            daily_notes[date_only]['commits'].append(commit)
            daily_notes[date_only]['repos'].add(commit['repo'])
            daily_notes[date_only]['last_commit'] = commit['date']
            daily_notes[date_only]['total_commits'] += 1

        # Generate human-readable notes for each day
        generated_notes = {}

        for date, data in sorted(daily_notes.items()):
            repos_list = sorted(list(data['repos']))
            commit_messages = [c['message'] for c in data['commits']]

            # Count significant commits (merges, features, fixes)
            significant_commits = [
                c for c in data['commits']
                if any(keyword in c['message'].lower() for keyword in ['feat', 'fix', 'merge', 'refactor', 'chore'])
            ]

            note_parts = []
            note_parts.append(f"🔧 **{data['total_commits']} commits across {len(repos_list)} repositories**")
            note_parts.append(f"📂 **Active repos**: {', '.join(repos_list)}")

            if data['first_commit'] != data['last_commit']:
                start_time = data['first_commit'].split(' ')[1]
                end_time = data['last_commit'].split(' ')[1]
                note_parts.append(f"⏰ **Working hours**: {start_time} - {end_time}")

            if significant_commits:
                note_parts.append("🎯 **Key activities**:")
                for commit in significant_commits[:5]:  # Top 5 significant commits
                    time_only = commit['date'].split(' ')[1]
                    repo_name = commit['repo']
                    message = commit['message']
                    # Truncate long messages
                    if len(message) > 60:
                        message = message[:57] + "..."
                    note_parts.append(f"   • {time_only} - {message} ({repo_name})")

            if not significant_commits:
                note_parts.append("📝 **Maintenance/organization work** - Infrastructure, documentation, or minor updates")

            generated_notes[date] = "\n".join(note_parts)

        return generated_notes

    def save_analysis(self, commits, daily_notes, output_file="git_analysis.json"):
        """Save analysis results to file"""
        analysis_data = {
            'metadata': {
                'total_commits': len(commits),
                'total_repos': len(set(c['repo'] for c in commits)),
                'active_days': len(daily_notes),
                'date_range': {
                    'start': commits[0]['date'] if commits else None,
                    'end': commits[-1]['date'] if commits else None
                }
            },
            'daily_notes': daily_notes,
            'all_commits': commits
        }

        with open(output_file, 'w') as f:
            json.dump(analysis_data, f, indent=2)

        return output_file

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Git History Analyzer')
    parser.add_argument('--start-date', default=DEFAULT_START_DATE, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end-date', default=DEFAULT_END_DATE, help='End date (YYYY-MM-DD)')
    parser.add_argument('--repos-dir', help='Directory containing repositories')
    parser.add_argument('--output', default='git_analysis.json', help='Output file for analysis results')
    parser.add_argument('--discover', action='store_true', help='Only discover repositories, no analysis')

    args = parser.parse_args()

    print("🚀 Git History Analysis for Productivity Tracking")
    print("=" * 50)
    print(f"📅 Date Range: {args.start_date} to {args.end_date}")
    print(f"📁 Repositories Directory: {args.repos_dir or DEFAULT_REPOS_DIR}")
    print("")

    analyzer = GitHistoryAnalyzer(args.repos_dir)
    analyzer.discover_repositories()

    if args.discover:
        return

    # Analyze all repositories
    print("\n🔍 Analyzing git history across repositories...")
    commits = analyzer.analyze_all_repos(args.start_date, args.end_date)

    if not commits:
        print("❌ No commits found in the specified date range")
        return

    print(f"\n✅ Total commits analyzed: {len(commits)}")

    # Generate daily notes
    daily_notes = analyzer.generate_daily_notes(commits)
    print(f"📝 Generated notes for {len(daily_notes)} days")

    # Save results
    output_file = analyzer.save_analysis(commits, daily_notes, args.output)
    print(f"\n💾 Analysis saved to: {output_file}")

    # Show summary
    print(f"\n📈 **Summary:**")
    total_repos = len(set(c['repo'] for c in commits))
    print(f"   • Total commits: {len(commits)}")
    print(f"   • Active repositories: {total_repos}")
    print(f"   • Active days: {len(daily_notes)}")

    print(f"\n🎯 **Most active days:**")
    sorted_days = sorted(daily_notes.items(), key=lambda x: x[1]['total_commits'], reverse=True)
    for date, data in sorted_days[:3]:
        print(f"   • {date}: {data['total_commits']} commits")

if __name__ == '__main__':
    main()