#!/usr/bin/env node
/**
 * Google Sheets CLI - Main entry point
 */

import { config } from 'dotenv';
import { GoogleSheetsClient } from '../lib/sheets-client.js';

// Load environment variables
config();

async function getClient() {
  return await GoogleSheetsClient.create();
}

function showHelp() {
  console.log(`
sheets-cli - CLI tool for programmatic Google Sheets access

VERSION
  sheets-cli 0.3.1

USAGE
  sheets-cli <command> [options]

COMMANDS
  info                    Get spreadsheet information
  get [range]             Get data from sheet (default: Sheet1!A1:Z1000)
  update <range> <value>  Update a cell
  update-notes <row> <notes>  Update notes column for a specific row
  create <sheetName>      Create a new worksheet
  list-sheets             List all worksheets

OPTIONS
  -h, --help              Show this help message
  -v, --version           Show version number

EXAMPLES
  sheets-cli info
  sheets-cli get "Sheet1!A1:C10"
  sheets-cli update "Sheet1!A1" "Hello World"
  sheets-cli update-notes 5 "Today's notes"
  sheets-cli create "NewSheet"
  sheets-cli list-sheets
`);
}

function showVersion() {
  console.log('sheets-cli 0.3.1');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Handle no command or help flags
  if (!command || command === '-h' || command === '--help') {
    showHelp();
    process.exit(command ? 0 : 1);
  }

  if (command === '-v' || command === '--version') {
    showVersion();
    process.exit(0);
  }

  try {
    switch (command) {
      case 'info': {
        const client = await getClient();
        const info = await client.getSpreadsheetInfo();
        console.log(JSON.stringify(info, null, 2));
        break;
      }

      case 'get': {
        const range = args[1] || 'Sheet1!A1:Z1000';
        const client = await getClient();
        const data = await client.getWorksheetData(range);
        console.log(JSON.stringify(data, null, 2));
        break;
      }

      case 'update': {
        const range = args[1];
        const value = args[2];
        if (!range || value === undefined) {
          console.error('Error: update requires <range> and <value> arguments');
          console.error('Usage: sheets-cli update <range> <value>');
          process.exit(1);
        }
        const client = await getClient();
        await client.updateCell(range, value);
        console.log(`Updated ${range} to "${value}"`);
        break;
      }

      case 'update-notes': {
        const row = args[1];
        const notes = args[2];
        if (!row || !notes) {
          console.error('Error: update-notes requires <row> and <notes> arguments');
          console.error('Usage: sheets-cli update-notes <row> <notes>');
          process.exit(1);
        }
        const client = await getClient();
        const rowNum = parseInt(row, 10);
        const range = `daily!C${rowNum}`;
        await client.updateCell(range, notes);
        console.log(`Updated notes for row ${rowNum}`);
        break;
      }

      case 'create': {
        const sheetName = args[1];
        if (!sheetName) {
          console.error('Error: create requires <sheetName> argument');
          console.error('Usage: sheets-cli create <sheetName>');
          process.exit(1);
        }
        const client = await getClient();
        await client.createWorksheet(sheetName);
        console.log(`Created worksheet: ${sheetName}`);
        break;
      }

      case 'list-sheets': {
        const client = await getClient();
        const sheets = await client.listWorksheets();
        console.log('Worksheets:');
        for (const sheet of sheets) {
          console.log(`  - ${sheet.title} (ID: ${sheet.sheetId})`);
        }
        break;
      }

      default:
        console.error(`Error: Unknown command "${command}"`);
        console.error('Run "sheets-cli --help" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
