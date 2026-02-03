/**
 * Productivity Tracker - Integrates git history analysis with Google Sheets
 */

import { GoogleSheetsClient } from '../src/lib/sheets-client.js';
import { GitHistoryAnalyzer } from '../src/lib/git-analyzer.js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
config();

// Date to row mapping for the productivity tracker
const DATE_TO_ROW: Record<string, number> = {
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

async function runGitAnalysis() {
  const analyzer = new GitHistoryAnalyzer({
    startDate: '2025-09-30',
    endDate: '2025-10-09',
  });

  const result = await analyzer.analyzeAllRepos();
  analyzer.saveAnalysis(result);
  return result;
}

async function updateTracker() {
  // Load git analysis
  const analysis = JSON.parse(readFileSync('git_analysis.json', 'utf-8'));
  const client = new GoogleSheetsClient();

  let successCount = 0;
  let failCount = 0;

  for (const dailyNote of analysis.dailyNotes) {
    const rowNum = DATE_TO_ROW[dailyNote.date];
    if (!rowNum) {
      console.log(`No row mapping for ${dailyNote.date}`);
      continue;
    }

    try {
      await client.updateCell(`daily!C${rowNum}`, dailyNote.note);
      console.log(`✓ Updated ${dailyNote.date} (row ${rowNum})`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to update ${dailyNote.date}:`, (error as Error).message);
      failCount++;
    }
  }

  console.log(`\nSummary: ${successCount} succeeded, ${failCount} failed`);
}

async function main() {
  const args = process.argv.slice(2);
  const analyzeOnly = args.includes('--analyze-only');
  const updateOnly = args.includes('--update-only');

  if (analyzeOnly) {
    await runGitAnalysis();
  } else if (updateOnly) {
    await updateTracker();
  } else {
    // Full workflow
    await runGitAnalysis();
    await updateTracker();
  }
}

main();
