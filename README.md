# Google Sheets CLI

A TypeScript CLI tool for programmatic Google Sheets access using service accounts and Doppler for secure credential management.

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
5. Install [Bun](https://bun.sh)

### Installation

```bash
# Clone and set up
git clone https://github.com/ebowwa/google-sheets-cli.git
cd google-sheets-cli
bun install

# Add service account to Doppler
doppler secrets set GOOGLE_SERVICE_ACCOUNT_JSON "$(cat /path/to/service-account.json)" --project <project-name>
doppler secrets set GOOGLE_SHEET_ID "your-sheet-id" --project <project-name>
```

### Usage

```bash
# Get sheet info
doppler run -- bun run src/cli/index.ts info

# Get data
doppler run -- bun run src/cli/index.ts get "Sheet1!A1:C10"

# Update a cell
doppler run -- bun run src/cli/index.ts update "Sheet1!A1" "New value"

# Create worksheet
doppler run -- bun run src/cli/index.ts create "NewSheet"

# List worksheets
doppler run -- bun run src/cli/index.ts list-sheets

# Analyze git history
bun run src/cli/git-analyzer.ts

# Update productivity tracker
doppler run -- bun run examples/productivity_tracker.ts
```

### CLI Commands

**sheets-cli**
- `info` - Get spreadsheet information
- `get [range]` - Get data from sheet (default: Sheet1!A1:Z1000)
- `update <range> <value>` - Update a cell
- `update-notes <row> <notes>` - Update notes column
- `create <sheet_name>` - Create new worksheet
- `list-sheets` - List all worksheets

**git-analyzer**
- `--start-date <date>` - Start date (YYYY-MM-DD)
- `--end-date <date>` - End date (YYYY-MM-DD)
- `--repos-dir <path>` - Repositories directory
- `--output <file>` - Output file (default: git_analysis.json)
- `--discover` - Only discover repositories

## Configuration

### Environment Variables

- `GOOGLE_SERVICE_ACCOUNT_JSON` - Service account credentials (from Doppler)
- `GOOGLE_SHEET_ID` - Target spreadsheet ID (from Doppler)
- `REPOS_DIR` - Directory containing git repositories (default: /Users/ebowwa/apps)

## Project Structure

```
src/
├── cli/
│   ├── index.ts          # Main CLI entry point (sheets-cli)
│   └── git-analyzer.ts   # Git analyzer CLI
├── lib/
│   ├── auth.ts           # Authentication helpers
│   ├── sheets-client.ts  # Google Sheets API client
│   └── git-analyzer.ts   # Git history analyzer
└── types/
    └── index.ts          # TypeScript types
```

## Dependencies

- `commander` - CLI framework
- `googleapis` - Google Sheets API
- `google-auth-library` - Authentication
- `simple-git` - Git operations
- `dotenv` - Environment variables

## Security

Uses Doppler for secure credential management - no hardcoded secrets in the repository.

## License

MIT
