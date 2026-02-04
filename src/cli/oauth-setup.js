#!/usr/bin/env node
"use strict";
/**
 * OAuth Setup - Run the OAuth flow to get tokens
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
var dotenv_1 = require("dotenv");
var http = require("node:http");
var oauth_auth_js_1 = require("../lib/oauth-auth.js");
(0, dotenv_1.config)();
var PORT = 3000;
function runOAuthFlow() {
    return __awaiter(this, void 0, void 0, function () {
        var authUrl, server;
        var _this = this;
        return __generator(this, function (_a) {
            authUrl = (0, oauth_auth_js_1.getAuthUrl)();
            console.log('\n=== Google OAuth Setup ===\n');
            console.log('1. Open this URL in your browser:\n');
            console.log("   ".concat(authUrl, "\n"));
            console.log('2. Authorize the application');
            console.log('3. You will be redirected back\n');
            server = http.createServer(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var url, code, error, tokens, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = new URL(req.url, "http://localhost:".concat(PORT));
                            if (!(url.pathname === '/callback')) return [3 /*break*/, 5];
                            code = url.searchParams.get('code');
                            if (!code) {
                                error = url.searchParams.get('error');
                                res.writeHead(400, { 'Content-Type': 'text/html' });
                                res.end("Authorization failed: ".concat(error || 'Unknown error'));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, oauth_auth_js_1.exchangeCodeForTokens)(code)];
                        case 2:
                            tokens = _a.sent();
                            response = "\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Authorization Successful</title>\n  <style>\n    body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; }\n    h1 { color: #0f9d58; }\n    pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }\n    code { font-size: 12px; }\n    .copy-btn { margin-top: 10px; padding: 10px 20px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; }\n    .copy-btn:hover { background: #3367d6; }\n  </style>\n</head>\n<body>\n  <h1>\u2713 Authorization Successful</h1>\n  <p>Add these secrets to Doppler:</p>\n  <pre><code>GOOGLE_OAUTH_REFRESH_TOKEN=".concat(tokens.refresh_token, "\nGOOGLE_OAUTH_ACCESS_TOKEN=").concat(tokens.access_token || '').concat(tokens.expiry_date ? "\nGOOGLE_OAUTH_TOKEN_EXPIRY=".concat(tokens.expiry_date) : '', "</code></pre>\n  <p>Run these commands:</p>\n  <pre><code>doppler secrets set GOOGLE_OAUTH_REFRESH_TOKEN \"").concat(tokens.refresh_token, "\" -c prd\ndoppler secrets set GOOGLE_OAUTH_ACCESS_TOKEN \"").concat(tokens.access_token || '', "\" -c prd").concat(tokens.expiry_date ? "\ndoppler secrets set GOOGLE_OAUTH_TOKEN_EXPIRY \"".concat(tokens.expiry_date, "\" -c prd") : '', "</code></pre>\n  <button class=\"copy-btn\" onclick=\"window.close()\">Close</button>\n</body>\n</html>\n        ");
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(response);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            res.writeHead(500, { 'Content-Type': 'text/html' });
                            res.end("Error exchanging code: ".concat(error_1.message));
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Not found');
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            server.listen(PORT, function () {
                console.log("Server running on http://localhost:".concat(PORT));
                console.log('Waiting for authorization callback...\n');
            });
            return [2 /*return*/];
        });
    });
}
try {
    await runOAuthFlow();
}
catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
