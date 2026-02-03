#!/usr/bin/env bun
/**
 * Create spreadsheet via Drive API
 */

import { google } from 'googleapis';
import { config } from 'dotenv';
import { createOAuthClient } from '../lib/oauth-auth.js';
import { createDriveClient } from '../lib/auth.js';

config();

async function createSpreadsheet(title: string) {
  // Try OAuth first, fall back to service account
  let client;
  try {
    client = await createOAuthClient();
  } catch {
    client = createDriveClient();
  }

  const drive = google.drive({ version: 'v3', auth: client });

  const file = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    },
    fields: 'id,name,webViewLink',
  });

  console.log('Created spreadsheet:');
  console.log(`  Title: ${file.data.name}`);
  console.log(`  ID: ${file.data.id}`);
  console.log(`  URL: ${file.data.webViewLink}`);
}

const title = process.argv[2] || 'New Spreadsheet';
await createSpreadsheet(title);
