/**
 * OAuth authentication for Google Sheets API
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { Credentials } from 'google-auth-library';

// OAuth scopes
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

/**
 * Load OAuth credentials from environment
 */
export function loadOAuthConfig(): {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
} {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/callback';

  if (!clientId || !clientSecret) {
    throw new Error(
      'GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET environment variables must be set. ' +
        'Get them from https://console.cloud.google.com/apis/credentials'
    );
  }

  return { clientId, clientSecret, redirectUri };
}

/**
 * Load stored OAuth tokens from environment
 */
export function loadStoredTokens(): Credentials | null {
  const accessToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const expiryDate = process.env.GOOGLE_OAUTH_TOKEN_EXPIRY;

  if (!refreshToken) {
    return null;
  }

  const tokens: Credentials = {
    refresh_token: refreshToken,
  };

  if (accessToken) {
    tokens.access_token = accessToken;
  }

  if (expiryDate) {
    tokens.expiry_date = parseInt(expiryDate, 10);
  }

  return tokens;
}

/**
 * Create an authenticated OAuth2 client
 */
export async function createOAuthClient(): Promise<OAuth2Client> {
  const { clientId, clientSecret, redirectUri } = loadOAuthConfig();
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  const storedTokens = loadStoredTokens();
  if (storedTokens) {
    oauth2Client.setCredentials(storedTokens);

    // Refresh if expired
    const expiryDate = storedTokens.expiry_date;
    if (expiryDate && Date.now() >= expiryDate) {
      await oauth2Client.refreshAccessToken();
    }
  }

  return oauth2Client;
}

/**
 * Generate authorization URL
 */
export function getAuthUrl(): string {
  const { clientId, clientSecret, redirectUri } = loadOAuthConfig();
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to get refresh token
  });

  return authUrl;
}

/**
 * Exchange code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<Credentials> {
  const { clientId, clientSecret, redirectUri } = loadOAuthConfig();
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
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
