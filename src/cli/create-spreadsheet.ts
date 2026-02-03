#!/usr/bin/env bun
/**
 * Create a new Google Spreadsheet
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import { createDriveClient } from '../lib/auth.js';

config();

async function createSpreadsheet(title: string) {
  const client = createDriveClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Sheet1',
          },
        },
      ],
    },
  });

  const spreadsheet = response.data;
  console.log('Created spreadsheet:');
  console.log(`  Title: ${spreadsheet.properties?.title}`);
  console.log(`  ID: ${spreadsheet.spreadsheetId}`);
  console.log(`  URL: ${spreadsheet.spreadsheetUrl}`);

  return spreadsheet;
}

// Get title from args or use default
const title = process.argv[2] || 'New Spreadsheet';

await createSpreadsheet(title);
