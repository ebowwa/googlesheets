"use strict";
/**
 * Productivity Tracker - Integrates git history analysis with Google Sheets
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
var sheets_client_js_1 = require("../src/lib/sheets-client.js");
var git_analyzer_js_1 = require("../src/lib/git-analyzer.js");
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
// Load environment variables
(0, dotenv_1.config)();
// Date to row mapping for the productivity tracker
var DATE_TO_ROW = {
    '2025-09-30': 2,
    '2025-10-01': 3,
    '2025-10-02': 4,
    '2025-10-03': 5,
    '2025-10-04': 6,
    '2025-10-05': 7,
    '2025-10-06': 8,
    '2025-10-07': 9,
    '2025-10-08': 10,
    '2025-10-09': 11,
};
function runGitAnalysis() {
    return __awaiter(this, void 0, void 0, function () {
        var analyzer, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    analyzer = new git_analyzer_js_1.GitHistoryAnalyzer({
                        startDate: '2025-09-30',
                        endDate: '2025-10-09',
                    });
                    return [4 /*yield*/, analyzer.analyzeAllRepos()];
                case 1:
                    result = _a.sent();
                    analyzer.saveAnalysis(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function updateTracker() {
    return __awaiter(this, void 0, void 0, function () {
        var analysis, client, successCount, failCount, _i, _a, dailyNote, rowNum, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    analysis = JSON.parse((0, fs_1.readFileSync)('git_analysis.json', 'utf-8'));
                    client = new sheets_client_js_1.GoogleSheetsClient();
                    successCount = 0;
                    failCount = 0;
                    _i = 0, _a = analysis.dailyNotes;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    dailyNote = _a[_i];
                    rowNum = DATE_TO_ROW[dailyNote.date];
                    if (!rowNum) {
                        console.log("No row mapping for ".concat(dailyNote.date));
                        return [3 /*break*/, 5];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client.updateCell("daily!C".concat(rowNum), dailyNote.note)];
                case 3:
                    _b.sent();
                    console.log("\u2713 Updated ".concat(dailyNote.date, " (row ").concat(rowNum, ")"));
                    successCount++;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("\u2717 Failed to update ".concat(dailyNote.date, ":"), error_1.message);
                    failCount++;
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("\nSummary: ".concat(successCount, " succeeded, ").concat(failCount, " failed"));
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, analyzeOnly, updateOnly;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    analyzeOnly = args.includes('--analyze-only');
                    updateOnly = args.includes('--update-only');
                    if (!analyzeOnly) return [3 /*break*/, 2];
                    return [4 /*yield*/, runGitAnalysis()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!updateOnly) return [3 /*break*/, 4];
                    return [4 /*yield*/, updateTracker()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4: 
                // Full workflow
                return [4 /*yield*/, runGitAnalysis()];
                case 5:
                    // Full workflow
                    _a.sent();
                    return [4 /*yield*/, updateTracker()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
