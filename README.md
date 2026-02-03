# @ebowwa/googlesheets

A TypeScript CLI tool for programmatic Google Sheets access with OAuth authentication and git history analysis.

## Features

- OAuth2 authentication (personal Google account)
- Fallback to service account support
- Google Sheets API access
- Google Drive API for creating spreadsheets
- Git history analysis for productivity tracking
- Doppler integration for credential management

## Installation

### npm

```bash
npm install -g @ebowwa/googlesheets
```

### bun

```bash
bun add -g @ebowwa/googlesheets
```

### From source

```bash
git clone https://github.com/ebowwa/googlesheets.git
cd googlesheets
bun install
bun run build
```

## Setup

### 1. Create OAuth 2.0 Credentials

Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
1. Create a new **OAuth 2.0 Client ID** (Web application)
2. Add redirect URI: `http://localhost:3000/callback`
3. Add your email as a test user
4. Save the Client ID and Secret

### 2. Run OAuth Setup

```bash
oauth-setup
```

Or manually:
```bash
export GOOGLE_OAUTH_CLIENT_ID="your-client-id"
export GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
oauth-setup
```

### 3. Set Environment Variables

Using Doppler:
```bash
doppler secrets set GOOGLE_OAUTH_CLIENT_ID "your-client-id" -c prd
doppler secrets set GOOGLE_OAUTH_CLIENT_SECRET "your-client-secret" -c prd
doppler secrets set GOOGLE_OAUTH_REFRESH_TOKEN "your-refresh-token" -c prd
doppler secrets set GOOGLE_SHEET_ID "your-sheet-id" -c prd
```

Or with `.env`:
```bash
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token
GOOGLE_SHEET_ID=your-sheet-id
```

## Usage

### Sheets CLI

```bash
# Get spreadsheet info
sheets-cli info

# Get data from a range
sheets-cli get "Sheet1!A1:C10"

# Update a cell
sheets-cli update "Sheet1!A1" "New value"

# Update notes column
sheets-cli update-notes 5 "Today's notes"

# Create a new worksheet
sheets-cli create "NewSheet"

# List all worksheets
sheets-cli list-sheets
```

### Git Analyzer

```bash
# Analyze git history
git-analyzer

# With custom date range
git-analyzer --start-date 2025-01-01 --end-date 2025-01-31

# Custom repos directory
git-analyzer --repos-dir ~/projects

# Discover repositories only
git-analyzer --discover
```

### Create Spreadsheets

```bash
# Create a new spreadsheet (in your Drive)
create-sheet "My New Spreadsheet"
```

### OAuth Setup

```bash
# Run OAuth flow to get tokens
oauth-setup
```

## CLI Commands

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

**create-sheet**
- `<title>` - Spreadsheet title (optional, default: "New Spreadsheet")

**oauth-setup**
- Opens browser for OAuth authorization
- Generates refresh token for CLI use

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_OAUTH_CLIENT_ID` | Yes | OAuth 2.0 Client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Yes | OAuth 2.0 Client Secret |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Yes | OAuth refresh token |
| `GOOGLE_SHEET_ID` | Yes | Target spreadsheet ID |
| `REPOS_DIR` | No | Directory containing git repositories |

## Project Structure

```
src/
├── cli/
│   ├── index.ts          # Main CLI (sheets-cli)
│   ├── git-analyzer.ts   # Git analyzer CLI
│   ├── oauth-setup.ts    # OAuth setup script
│   └── create-via-drive.ts  # Spreadsheet creator
├── lib/
│   ├── oauth-auth.ts     # OAuth authentication
│   ├── auth.ts           # Service account auth (fallback)
│   ├── sheets-client.ts  # Google Sheets API client
│   └── git-analyzer.ts   # Git history analyzer
└── types/
    └── index.ts          # TypeScript types
```

## Dependencies

- `commander` - CLI framework
- `googleapis` - Google APIs
- `google-auth-library` - Authentication
- `simple-git` - Git operations
- `dotenv` - Environment variables

## License

MIT © Ebowwa Labs
