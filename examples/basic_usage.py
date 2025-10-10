#!/usr/bin/env python3
"""
Example: Basic Google Sheets Usage

This example demonstrates basic usage of the Google Sheets CLI.
"""

import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from sheets_cli import GoogleSheetsCLI

def basic_operations():
    """Demonstrate basic Google Sheets operations"""

    print("🚀 Google Sheets CLI - Basic Usage Example")
    print("=" * 45)

    # Initialize CLI
    cli = GoogleSheetsCLI()

    # Authenticate
    if not cli.authenticate():
        print("❌ Authentication failed")
        return

    print("✅ Authenticated successfully")

    # Get spreadsheet info
    print("\n📊 Getting spreadsheet info...")
    info = cli.get_spreadsheet_info()
    if 'error' not in info:
        print(f"Title: {info['title']}")
        print(f"URL: {info['url']}")
        print(f"Worksheets: {len(info['worksheets'])}")
        for ws in info['worksheets']:
            print(f"  - {ws['title']} ({ws['row_count']} rows, {ws['col_count']} cols)")
    else:
        print(f"Error: {info['error']}")

    # Get sample data
    print("\n📋 Getting sample data...")
    data = cli.get_worksheet_data('Sheet1!A1:C5')
    if 'error' not in data:
        print(f"Found {data['row_count']} rows")
        print(f"Headers: {data['headers']}")
        for i, row in enumerate(data['data'][:3]):
            print(f"Row {i+1}: {row}")
    else:
        print(f"Error: {data['error']}")

    # Update a cell
    print("\n✏️  Updating a cell...")
    result = cli.update_cell('Sheet1!A1', 'Test Value')
    if 'error' not in result:
        print(f"✅ Updated {result['range']} with: {result['value']}")
    else:
        print(f"Error: {result['error']}")

    # List worksheets
    print("\n📄 Listing all worksheets...")
    sheets = cli.list_worksheets()
    if 'error' not in sheets:
        for ws in sheets['worksheets']:
            print(f"  📊 {ws['title']} (ID: {ws['id']})")
    else:
        print(f"Error: {sheets['error']}")

if __name__ == '__main__':
    basic_operations()