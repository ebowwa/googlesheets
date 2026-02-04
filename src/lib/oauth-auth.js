"use strict";
/**
 * OAuth authentication for Google Sheets API
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOAuthConfig = loadOAuthConfig;
exports.loadStoredTokens = loadStoredTokens;
exports.createOAuthClient = createOAuthClient;
exports.getAuthUrl = getAuthUrl;
exports.exchangeCodeForTokens = exchangeCodeForTokens;
exports.getSheetId = getSheetId;
var google_auth_library_1 = require("google-auth-library");
// OAuth scopes
var SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
];
/**
 * Load OAuth credentials from environment
 */
function loadOAuthConfig() {
    var clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    var clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    var redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/callback';
    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET environment variables must be set. ' +
            'Get them from https://console.cloud.google.com/apis/credentials');
    }
    return { clientId: clientId, clientSecret: clientSecret, redirectUri: redirectUri };
}
/**
 * Load stored OAuth tokens from environment
 */
function loadStoredTokens() {
    var accessToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
    var refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    var expiryDate = process.env.GOOGLE_OAUTH_TOKEN_EXPIRY;
    if (!refreshToken) {
        return null;
    }
    var tokens = {
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
function createOAuthClient() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, clientId, clientSecret, redirectUri, oauth2Client, storedTokens, expiryDate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = loadOAuthConfig(), clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri;
                    oauth2Client = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectUri);
                    storedTokens = loadStoredTokens();
                    if (!storedTokens) return [3 /*break*/, 2];
                    oauth2Client.setCredentials(storedTokens);
                    expiryDate = storedTokens.expiry_date;
                    if (!(expiryDate && Date.now() >= expiryDate)) return [3 /*break*/, 2];
                    return [4 /*yield*/, oauth2Client.refreshAccessToken()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/, oauth2Client];
            }
        });
    });
}
/**
 * Generate authorization URL
 */
function getAuthUrl() {
    var _a = loadOAuthConfig(), clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri;
    var oauth2Client = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectUri);
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent', // Force consent to get refresh token
    });
    return authUrl;
}
/**
 * Exchange code for tokens
 */
function exchangeCodeForTokens(code) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, clientId, clientSecret, redirectUri, oauth2Client, tokens;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = loadOAuthConfig(), clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri;
                    oauth2Client = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectUri);
                    return [4 /*yield*/, oauth2Client.getToken(code)];
                case 1:
                    tokens = (_b.sent()).tokens;
                    return [2 /*return*/, tokens];
            }
        });
    });
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
