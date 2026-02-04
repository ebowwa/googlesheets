"use strict";
/**
 * Authentication helpers for Google Sheets API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadServiceAccountCredentials = loadServiceAccountCredentials;
exports.createAuthenticatedClient = createAuthenticatedClient;
exports.createDriveClient = createDriveClient;
exports.getSheetId = getSheetId;
var google_auth_library_1 = require("google-auth-library");
/**
 * Load and parse service account credentials from environment variable
 */
function loadServiceAccountCredentials() {
    var credsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!credsJson) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set. ' +
            'Please set it using Doppler: doppler secrets set GOOGLE_SERVICE_ACCOUNT_JSON');
    }
    try {
        return JSON.parse(credsJson);
    }
    catch (error) {
        throw new Error("Failed to parse service account credentials: ".concat(error.message));
    }
}
/**
 * Create a JWT client authenticated with service account credentials
 */
function createAuthenticatedClient() {
    var credentials = loadServiceAccountCredentials();
    var client = new google_auth_library_1.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return client;
}
/**
 * Create a JWT client with Drive scope (for creating spreadsheets)
 */
function createDriveClient() {
    var credentials = loadServiceAccountCredentials();
    var client = new google_auth_library_1.JWT({
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
function getSheetId() {
    var sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
        throw new Error('GOOGLE_SHEET_ID environment variable is not set. ' +
            'Please set it using Doppler: doppler secrets set GOOGLE_SHEET_ID');
    }
    return sheetId;
}
