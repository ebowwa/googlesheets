"use strict";
/**
 * Google Sheets API client
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
exports.GoogleSheetsClient = void 0;
var googleapis_1 = require("googleapis");
var oauth_auth_js_1 = require("./oauth-auth.js");
var auth_js_1 = require("./auth.js");
var GoogleSheetsClient = /** @class */ (function () {
    function GoogleSheetsClient() {
    }
    /**
     * Create a new GoogleSheetsClient instance
     * Tries OAuth first, falls back to service account
     */
    GoogleSheetsClient.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        instance = new GoogleSheetsClient();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = instance;
                        return [4 /*yield*/, (0, oauth_auth_js_1.createOAuthClient)()];
                    case 2:
                        _a.client = _c.sent();
                        instance.spreadsheetId = (0, oauth_auth_js_1.getSheetId)();
                        return [3 /*break*/, 4];
                    case 3:
                        _b = _c.sent();
                        // Fall back to service account
                        instance.client = (0, auth_js_1.createDriveClient)();
                        instance.spreadsheetId = (0, auth_js_1.getSheetId)();
                        return [3 /*break*/, 4];
                    case 4:
                        instance.sheets = googleapis_1.google.sheets({ version: 'v4', auth: instance.client });
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    /**
     * Get spreadsheet metadata
     */
    GoogleSheetsClient.prototype.getSpreadsheetInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.get({
                            spreadsheetId: this.spreadsheetId,
                        })];
                    case 1:
                        response = _a.sent();
                        data = response.data;
                        return [2 /*return*/, {
                                spreadsheetId: data.spreadsheetId,
                                title: data.properties.title,
                                url: data.spreadsheetUrl,
                                sheets: (data.sheets || []).map(function (sheet) { return ({
                                    sheetId: sheet.properties.sheetId,
                                    title: sheet.properties.title,
                                    index: sheet.properties.index,
                                }); }),
                            }];
                }
            });
        });
    };
    /**
     * Get data from a range
     */
    GoogleSheetsClient.prototype.getWorksheetData = function (rangeName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, values, headers, rows, i, row, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.values.get({
                            spreadsheetId: this.spreadsheetId,
                            range: rangeName,
                        })];
                    case 1:
                        response = _a.sent();
                        values = response.data.values;
                        if (!values || values.length === 0) {
                            return [2 /*return*/, []];
                        }
                        headers = values[0];
                        rows = [];
                        for (i = 1; i < values.length; i++) {
                            row = {};
                            for (j = 0; j < headers.length && j < values[i].length; j++) {
                                row[headers[j]] = values[i][j];
                            }
                            rows.push(row);
                        }
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    /**
     * Get raw values (not as records)
     */
    GoogleSheetsClient.prototype.getRangeValues = function (rangeName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.values.get({
                            spreadsheetId: this.spreadsheetId,
                            range: rangeName,
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.values || []];
                }
            });
        });
    };
    /**
     * Update a single cell or range
     */
    GoogleSheetsClient.prototype.updateCell = function (rangeName, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.values.update({
                            spreadsheetId: this.spreadsheetId,
                            range: rangeName,
                            valueInputOption: 'RAW',
                            requestBody: {
                                values: [[value]],
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update multiple cells at once
     */
    GoogleSheetsClient.prototype.updateCells = function (rangeName, values) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.values.update({
                            spreadsheetId: this.spreadsheetId,
                            range: rangeName,
                            valueInputOption: 'RAW',
                            requestBody: {
                                values: values,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new worksheet
     */
    GoogleSheetsClient.prototype.createWorksheet = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.batchUpdate({
                            spreadsheetId: this.spreadsheetId,
                            requestBody: {
                                requests: [
                                    {
                                        addSheet: {
                                            properties: {
                                                title: title,
                                            },
                                        },
                                    },
                                ],
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all worksheets
     */
    GoogleSheetsClient.prototype.listWorksheets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSpreadsheetInfo()];
                    case 1:
                        info = _a.sent();
                        return [2 /*return*/, info.sheets.map(function (sheet) { return ({
                                title: sheet.title,
                                sheetId: sheet.sheetId,
                            }); })];
                }
            });
        });
    };
    /**
     * Append data to a sheet
     */
    GoogleSheetsClient.prototype.appendData = function (rangeName, values) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sheets.spreadsheets.values.append({
                            spreadsheetId: this.spreadsheetId,
                            range: rangeName,
                            valueInputOption: 'RAW',
                            requestBody: {
                                values: values,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return GoogleSheetsClient;
}());
exports.GoogleSheetsClient = GoogleSheetsClient;
