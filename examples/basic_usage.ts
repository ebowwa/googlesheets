/**
 * Basic Usage Example - Demonstrates Google Sheets CLI operations
 */

import { GoogleSheetsClient } from '../src/lib/sheets-client.js';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  const client = new GoogleSheetsClient();

  try {
    // 1. Get spreadsheet info
    console.log('--- Spreadsheet Info ---');
    const info = await client.getSpreadsheetInfo();
    console.log(`Title: ${info.title}`);
    console.log(`URL: ${info.url}`);
    console.log(`Sheets: ${info.sheets.map((s) => s.title).join(', ')}`);

    // 2. Get sample data
    console.log('\n--- Sample Data ---');
    const data = await client.getWorksheetData('Sheet1!A1:C10');
    console.log(JSON.stringify(data, null, 2));

    // 3. Update a cell
    console.log('\n--- Update Cell ---');
    await client.updateCell('Sheet1!A1', 'Updated via TypeScript');
    console.log('Updated Sheet1!A1');

    // 4. List worksheets
    console.log('\n--- Worksheets ---');
    const sheets = await client.listWorksheets();
    for (const sheet of sheets) {
      console.log(`- ${sheet.title}`);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
