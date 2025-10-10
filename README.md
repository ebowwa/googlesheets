# Google Sheets CLI

A Python CLI tool for programmatic Google Sheets access using service accounts and Doppler for secure credential management.

## Features

- Secure Google Sheets API access via service accounts
- Doppler integration for credential management
- Git history analysis for productivity tracking
- CLI commands for reading/writing sheet data

## Setup

### Prerequisites

1. Create a Google Cloud service account
2. Enable Google Sheets API
3. Download service account JSON key
4. Share your Google Sheet with the service account email
5. Install dependencies

### Installation

```bash
# Clone and set up
git clone https://github.com/ebowwa/google-sheets-cli.git
cd google-sheets-cli
uv init
uv add gspread google-auth-oauthlib

# Add service account to Doppler
doppler secrets set GOOGLE_SERVICE_ACCOUNT_JSON "$(cat /path/to/service-account.json)" --project <project-name>
```

### Usage

```bash
# Get sheet info
doppler run --config <config> python sheets_cli.py info

# Get data
doppler run --config <config> python sheets_cli.py get "Sheet1!A1:C10"

# Update a cell
doppler run --config <config> python sheets_cli.py update "Sheet1!A1" "New value"

# Analyze git history
python git_history_analyzer.py
```

## Configuration

- **SHEET_ID**: Your Google Sheet ID from the URL
- **SERVICE_ACCOUNT_EMAIL**: Service account email with sheet access
- **SCOPES**: Google Sheets API permissions

## Security

Uses Doppler for secure credential management - no hardcoded secrets in the repository.