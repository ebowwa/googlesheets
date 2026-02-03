#!/usr/bin/env bun
/**
 * Google Sheets CLI - Main entry point
 */

import { Command } from 'commander';
import { config } from 'dotenv';
import { GoogleSheetsClient } from '../lib/sheets-client.js';

// Load environment variables
config();

const program = new Command();
const client = new GoogleSheetsClient();

program
  .name('sheets-cli')
  .description('CLI tool for programmatic Google Sheets access')
  .version('0.1.0');

// Info command
program
  .command('info')
  .description('Get spreadsheet information')
  .action(async () => {
    try {
      const info = await client.getSpreadsheetInfo();
      console.log(JSON.stringify(info, null, 2));
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// Get data command
program
  .command('get')
  .description('Get data from sheet')
  .argument('[range]', 'Cell range (default: Sheet1!A1:Z1000)', 'Sheet1!A1:Z1000')
  .action(async (range: string) => {
    try {
      const data = await client.getWorksheetData(range);
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// Update cell command
program
  .command('update')
  .description('Update a cell')
  .argument('<range>', 'Cell range (e.g., Sheet1!A1)')
  .argument('<value>', 'Value to set')
  .action(async (range: string, value: string) => {
    try {
      await client.updateCell(range, value);
      console.log(`Updated ${range} to "${value}"`);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// Update notes command
program
  .command('update-notes')
  .description('Update notes column for a specific row')
  .argument('<row>', 'Row number')
  .argument('<notes>', 'Notes content')
  .action(async (row: string, notes: string) => {
    try {
      const rowNum = parseInt(row, 10);
      const range = `daily!C${rowNum}`;
      await client.updateCell(range, notes);
      console.log(`Updated notes for row ${rowNum}`);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// Create worksheet command
program
  .command('create')
  .description('Create a new worksheet')
  .argument('<sheetName>', 'Name of the new sheet')
  .action(async (sheetName: string) => {
    try {
      await client.createWorksheet(sheetName);
      console.log(`Created worksheet: ${sheetName}`);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// List worksheets command
program
  .command('list-sheets')
  .description('List all worksheets')
  .action(async () => {
    try {
      const sheets = await client.listWorksheets();
      console.log('Worksheets:');
      for (const sheet of sheets) {
        console.log(`  - ${sheet.title} (ID: ${sheet.sheetId})`);
      }
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

// Parse and execute
program.parse();
