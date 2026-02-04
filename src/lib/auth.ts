/**
 * Authentication helpers for Google Sheets API
 */

import { JWT } from 'google-auth-library';
import type { ServiceAccountCredentials } from '@ebowwa/codespaces-types/compile';

/**
 * Load and parse service account credentials from environment variable
 */
export function loadServiceAccountCredentials(): ServiceAccountCredentials {
  const credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!credsJson) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set. ' +
        'Please set it using Doppler: doppler secrets set GOOGLE_SERVICE_ACCOUNT_JSON'
    );
  }

  try {
    return JSON.parse(credsJson) as ServiceAccountCredentials;
  } catch (error) {
    throw new Error(`Failed to parse service account credentials: ${(error as Error).message}`);
  }
}

/**
 * Create a JWT client authenticated with service account credentials
 */
export function createAuthenticatedClient(): JWT {
  const credentials = loadServiceAccountCredentials();

  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return client;
}

/**
 * Create a JWT client with Drive scope (for creating spreadsheets)
 */
export function createDriveClient(): JWT {
  const credentials = loadServiceAccountCredentials();

  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  return client;
}

/**
 * Get the Google Sheet ID from environment variable
 */
export function getSheetId(): string {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error(
      'GOOGLE_SHEET_ID environment variable is not set. ' +
        'Please set it using Doppler: doppler secrets set GOOGLE_SHEET_ID'
    );
  }

  return sheetId;
}
