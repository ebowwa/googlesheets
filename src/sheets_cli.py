#!/usr/bin/env python3
"""
Google Sheets CLI - Programmatic access to Google Sheets with secure authentication

Usage: python sheets_cli.py <command> [args]
Commands:
  info                          - Get spreadsheet information
  get [range]                   - Get data from sheet (default: Sheet1!A1:Z1000)
  update <range> <value>        - Update a cell
  update-notes <row_num> <notes> - Update notes column for specific row
  create <sheet_name>           - Create new worksheet
  list-sheets                  - List all worksheets
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Add current directory to Python path for imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    import gspread
    from google.oauth2.service_account import Credentials
    from google.auth.exceptions import DefaultCredentialsError
except ImportError as e:
    print(f"Error: Required packages not installed: {e}")
    print("Install with: uv add gspread google-auth-oauthlib")
    sys.exit(1)

# Configuration
SHEET_ID = os.getenv('GOOGLE_SHEET_ID', '1OxJTCXOM1X0VP6sprPz-fXm_-RZtNSTMXJ4SNCdGYBM')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

class GoogleSheetsCLI:
    def __init__(self):
        self.gc = None
        self.spreadsheet = None

    def authenticate(self):
        """Authenticate with Google Sheets using service account"""
        try:
            # Try to get JSON from Doppler environment
            service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')

            if not service_account_json:
                print("Error: GOOGLE_SERVICE_ACCOUNT_JSON not found in environment")
                print("Make sure to run with: doppler run --config <config> python sheets_cli.py <args>")
                return False

            # Parse the JSON string
            service_account_info = json.loads(service_account_json)
            credentials = Credentials.from_service_account_info(
                service_account_info,
                scopes=SCOPES
            )

            self.gc = gspread.authorize(credentials)
            self.spreadsheet = self.gc.open_by_key(SHEET_ID)
            return True

        except json.JSONDecodeError as e:
            print(f"Error parsing service account JSON: {e}")
            return False
        except Exception as e:
            print(f"Authentication error: {e}")
            return False

    def get_spreadsheet_info(self):
        """Get spreadsheet information"""
        try:
            info = {
                'title': self.spreadsheet.title,
                'url': self.spreadsheet.url,
                'worksheets': []
            }

            for worksheet in self.spreadsheet.worksheets():
                info['worksheets'].append({
                    'title': worksheet.title,
                    'id': worksheet.id,
                    'row_count': worksheet.row_count,
                    'col_count': worksheet.col_count
                })

            return info

        except Exception as e:
            return {'error': str(e)}

    def get_worksheet_data(self, range_name='Sheet1!A1:Z1000'):
        """Get data from worksheet"""
        try:
            # Parse range to get worksheet name
            if '!' in range_name:
                worksheet_name = range_name.split('!')[0]
                worksheet = self.spreadsheet.worksheet(worksheet_name)
            else:
                worksheet = self.spreadsheet.worksheet('Sheet1')

            # Get all data as records
            data = worksheet.get_all_records()

            return {
                'range': range_name,
                'data': data,
                'row_count': len(data),
                'headers': list(data[0].keys()) if data else []
            }

        except Exception as e:
            return {'error': str(e)}

    def update_cell(self, range_name, value):
        """Update a cell in the worksheet"""
        try:
            # Parse range to get worksheet name
            if '!' in range_name:
                worksheet_name = range_name.split('!')[0]
                cell_range = range_name.split('!')[1]
                worksheet = self.spreadsheet.worksheet(worksheet_name)
            else:
                worksheet = self.spreadsheet.worksheet('Sheet1')
                cell_range = range_name

            # Update the cell with the value (wrap in list for gspread)
            worksheet.update(cell_range, [[value]])

            return {
                'success': True,
                'range': f"{worksheet.title}!{cell_range}",
                'value': value
            }

        except Exception as e:
            return {'error': str(e)}

    def create_worksheet(self, title):
        """Create a new worksheet"""
        try:
            worksheet = self.spreadsheet.add_worksheet(title=title, rows="1000", cols="26")
            return {
                'success': True,
                'title': worksheet.title,
                'id': worksheet.id
            }
        except Exception as e:
            return {'error': str(e)}

    def list_worksheets(self):
        """List all worksheets in the spreadsheet"""
        try:
            worksheets = []
            for worksheet in self.spreadsheet.worksheets():
                worksheets.append({
                    'title': worksheet.title,
                    'id': worksheet.id,
                    'row_count': worksheet.row_count,
                    'col_count': worksheet.col_count
                })
            return {'worksheets': worksheets}
        except Exception as e:
            return {'error': str(e)}

def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(description='Google Sheets CLI')
    parser.add_argument('command', help='Command to execute')
    parser.add_argument('args', nargs='*', help='Command arguments')

    args = parser.parse_args()

    cli = GoogleSheetsCLI()

    if not cli.authenticate():
        sys.exit(1)

    command = args.command.lower()

    if command == 'info':
        result = cli.get_spreadsheet_info()

    elif command == 'get':
        range_name = args.args[0] if args.args else 'Sheet1!A1:Z1000'
        result = cli.get_worksheet_data(range_name)

    elif command == 'update':
        if len(args.args) < 2:
            print("Error: update command requires range and value")
            print("Usage: python sheets_cli.py update <range> <value>")
            sys.exit(1)

        range_name = args.args[0]
        value = args.args[1]
        result = cli.update_cell(range_name, value)

    elif command == 'update-notes':
        if len(args.args) < 2:
            print("Error: update-notes command requires row number and notes")
            print("Usage: python sheets_cli.py update-notes <row_num> <notes>")
            sys.exit(1)

        row_num = args.args[0]
        notes = args.args[1]
        result = cli.update_cell(f'Sheet1!B{row_num}', notes)

    elif command == 'create':
        if not args.args:
            print("Error: create command requires worksheet title")
            print("Usage: python sheets_cli.py create <sheet_title>")
            sys.exit(1)

        title = args.args[0]
        result = cli.create_worksheet(title)

    elif command == 'list-sheets':
        result = cli.list_worksheets()

    else:
        result = {'error': f'Unknown command: {command}'}

    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()