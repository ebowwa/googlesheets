#!/usr/bin/env node
"use strict";
/**
 * Create spreadsheet via Drive API
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
var googleapis_1 = require("googleapis");
var dotenv_1 = require("dotenv");
var oauth_auth_js_1 = require("../lib/oauth-auth.js");
var auth_js_1 = require("../lib/auth.js");
(0, dotenv_1.config)();
function createSpreadsheet(title) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, drive, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, oauth_auth_js_1.createOAuthClient)()];
                case 1:
                    client = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    client = (0, auth_js_1.createDriveClient)();
                    return [3 /*break*/, 3];
                case 3:
                    drive = googleapis_1.google.drive({ version: 'v3', auth: client });
                    return [4 /*yield*/, drive.files.create({
                            requestBody: {
                                name: title,
                                mimeType: 'application/vnd.google-apps.spreadsheet',
                            },
                            fields: 'id,name,webViewLink',
                        })];
                case 4:
                    file = _b.sent();
                    console.log('Created spreadsheet:');
                    console.log("  Title: ".concat(file.data.name));
                    console.log("  ID: ".concat(file.data.id));
                    console.log("  URL: ".concat(file.data.webViewLink));
                    return [2 /*return*/];
            }
        });
    });
}
var title = process.argv[2] || 'New Spreadsheet';
await createSpreadsheet(title);
