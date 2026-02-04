#!/usr/bin/env node
"use strict";
/**
 * Google Sheets CLI - Main entry point
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
var sheets_client_js_1 = require("../lib/sheets-client.js");
// Load environment variables
(0, dotenv_1.config)();
function getClient() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheets_client_js_1.GoogleSheetsClient.create()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function showHelp() {
    console.log("\nsheets-cli - CLI tool for programmatic Google Sheets access\n\nVERSION\n  sheets-cli 0.3.1\n\nUSAGE\n  sheets-cli <command> [options]\n\nCOMMANDS\n  info                    Get spreadsheet information\n  get [range]             Get data from sheet (default: Sheet1!A1:Z1000)\n  update <range> <value>  Update a cell\n  update-notes <row> <notes>  Update notes column for a specific row\n  create <sheetName>      Create a new worksheet\n  list-sheets             List all worksheets\n\nOPTIONS\n  -h, --help              Show this help message\n  -v, --version           Show version number\n\nEXAMPLES\n  sheets-cli info\n  sheets-cli get \"Sheet1!A1:C10\"\n  sheets-cli update \"Sheet1!A1\" \"Hello World\"\n  sheets-cli update-notes 5 \"Today's notes\"\n  sheets-cli create \"NewSheet\"\n  sheets-cli list-sheets\n");
}
function showVersion() {
    console.log('sheets-cli 0.3.1');
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, command, _a, client, info, range, client, data, range, value, client, row, notes, client, rowNum, range, sheetName, client, client, sheets, _i, sheets_1, sheet, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = process.argv.slice(2);
                    command = args[0];
                    // Handle no command or help flags
                    if (!command || command === '-h' || command === '--help') {
                        showHelp();
                        process.exit(command ? 0 : 1);
                    }
                    if (command === '-v' || command === '--version') {
                        showVersion();
                        process.exit(0);
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 22, , 23]);
                    _a = command;
                    switch (_a) {
                        case 'info': return [3 /*break*/, 2];
                        case 'get': return [3 /*break*/, 5];
                        case 'update': return [3 /*break*/, 8];
                        case 'update-notes': return [3 /*break*/, 11];
                        case 'create': return [3 /*break*/, 14];
                        case 'list-sheets': return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 20];
                case 2: return [4 /*yield*/, getClient()];
                case 3:
                    client = _b.sent();
                    return [4 /*yield*/, client.getSpreadsheetInfo()];
                case 4:
                    info = _b.sent();
                    console.log(JSON.stringify(info, null, 2));
                    return [3 /*break*/, 21];
                case 5:
                    range = args[1] || 'Sheet1!A1:Z1000';
                    return [4 /*yield*/, getClient()];
                case 6:
                    client = _b.sent();
                    return [4 /*yield*/, client.getWorksheetData(range)];
                case 7:
                    data = _b.sent();
                    console.log(JSON.stringify(data, null, 2));
                    return [3 /*break*/, 21];
                case 8:
                    range = args[1];
                    value = args[2];
                    if (!range || value === undefined) {
                        console.error('Error: update requires <range> and <value> arguments');
                        console.error('Usage: sheets-cli update <range> <value>');
                        process.exit(1);
                    }
                    return [4 /*yield*/, getClient()];
                case 9:
                    client = _b.sent();
                    return [4 /*yield*/, client.updateCell(range, value)];
                case 10:
                    _b.sent();
                    console.log("Updated ".concat(range, " to \"").concat(value, "\""));
                    return [3 /*break*/, 21];
                case 11:
                    row = args[1];
                    notes = args[2];
                    if (!row || !notes) {
                        console.error('Error: update-notes requires <row> and <notes> arguments');
                        console.error('Usage: sheets-cli update-notes <row> <notes>');
                        process.exit(1);
                    }
                    return [4 /*yield*/, getClient()];
                case 12:
                    client = _b.sent();
                    rowNum = parseInt(row, 10);
                    range = "daily!C".concat(rowNum);
                    return [4 /*yield*/, client.updateCell(range, notes)];
                case 13:
                    _b.sent();
                    console.log("Updated notes for row ".concat(rowNum));
                    return [3 /*break*/, 21];
                case 14:
                    sheetName = args[1];
                    if (!sheetName) {
                        console.error('Error: create requires <sheetName> argument');
                        console.error('Usage: sheets-cli create <sheetName>');
                        process.exit(1);
                    }
                    return [4 /*yield*/, getClient()];
                case 15:
                    client = _b.sent();
                    return [4 /*yield*/, client.createWorksheet(sheetName)];
                case 16:
                    _b.sent();
                    console.log("Created worksheet: ".concat(sheetName));
                    return [3 /*break*/, 21];
                case 17: return [4 /*yield*/, getClient()];
                case 18:
                    client = _b.sent();
                    return [4 /*yield*/, client.listWorksheets()];
                case 19:
                    sheets = _b.sent();
                    console.log('Worksheets:');
                    for (_i = 0, sheets_1 = sheets; _i < sheets_1.length; _i++) {
                        sheet = sheets_1[_i];
                        console.log("  - ".concat(sheet.title, " (ID: ").concat(sheet.sheetId, ")"));
                    }
                    return [3 /*break*/, 21];
                case 20:
                    console.error("Error: Unknown command \"".concat(command, "\""));
                    console.error('Run "sheets-cli --help" for usage information');
                    process.exit(1);
                    _b.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    error_1 = _b.sent();
                    console.error('Error:', error_1.message);
                    process.exit(1);
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    });
}
main();
