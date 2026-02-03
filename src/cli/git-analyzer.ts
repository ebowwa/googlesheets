#!/usr/bin/env bun
/**
 * Git History Analyzer CLI
 */

import { Command } from 'commander';
import { config } from 'dotenv';
import { GitHistoryAnalyzer } from '../lib/git-analyzer.js';

// Load environment variables
config();

const program = new Command();

program
  .name('git-analyzer')
  .description('Analyze git commits across multiple repositories')
  .version('0.1.0');

program
  .option('--start-date <date>', 'Start date (YYYY-MM-DD)', '2025-09-30')
  .option('--end-date <date>', 'End date (YYYY-MM-DD)', '2025-10-09')
  .option('--repos-dir <path>', 'Directory containing repositories')
  .option('--output <file>', 'Output file', 'git_analysis.json')
  .option('--discover', 'Only discover repositories, no analysis')
  .action(async (options) => {
    const analyzer = new GitHistoryAnalyzer({
      startDate: options.startDate,
      endDate: options.endDate,
      reposDir: options.reposDir,
      output: options.output,
      discover: options.discover,
    });

    try {
      const result = await analyzer.analyzeAllRepos();
      analyzer.saveAnalysis(result, options.output);

      // Print summary
      console.log('\n--- Git Analysis Summary ---');
      console.log(`Period: ${result.metadata.startDate} to ${result.metadata.endDate}`);
      console.log(`Repositories: ${result.metadata.repositoryCount}`);
      console.log(`Total commits: ${result.metadata.totalCommits}`);
      console.log(`Days with activity: ${result.dailyNotes.length}`);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(1);
    }
  });

program.parse();
