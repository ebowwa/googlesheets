/**
 * Git History Analyzer - Analyzes git commits across multiple repositories
 */

import { simpleGit, SimpleGit } from 'simple-git';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import type {
  GitCommit,
  DailyNote,
  GitAnalysisResult,
  AnalyzerOptions,
} from '../types/index.js';

export class GitHistoryAnalyzer {
  private options: Required<AnalyzerOptions>;
  private reposDir: string;

  // Default repository patterns to discover
  private readonly repoPatterns = [
    'openhardwareai',
    'app-store-connect-wrapper',
    'CleanShot',
    'speakd',
    'node-starter',
  ];

  constructor(options: AnalyzerOptions = {}) {
    this.reposDir = options.reposDir || process.env.REPOS_DIR || '/Users/ebowwa/apps';
    this.options = {
      startDate: options.startDate || '2025-09-30',
      endDate: options.endDate || '2025-10-09',
      reposDir: this.reposDir,
      output: options.output || 'git_analysis.json',
      discover: options.discover || false,
    };
  }

  /**
   * Discover git repositories based on patterns
   */
  discoverRepositories(): string[] {
    const repositories: string[] = [];

    if (!existsSync(this.reposDir)) {
      console.error(`Repositories directory does not exist: ${this.reposDir}`);
      return repositories;
    }

    const entries = readdirSync(this.reposDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const repoPath = join(this.reposDir, entry.name);
      const gitDir = join(repoPath, '.git');

      // Check if it's a git repository
      if (!existsSync(gitDir)) continue;

      // Check if it matches any pattern
      const matchesPattern = this.repoPatterns.some((pattern) => {
        if (pattern.includes('*')) {
          const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
          return regex.test(entry.name);
        }
        return entry.name === pattern;
      });

      if (matchesPattern) {
        repositories.push(repoPath);
      }
    }

    return repositories;
  }

  /**
   * Get git commits from a repository within a date range
   */
  async getGitCommits(
    repoPath: string,
    startDate: string,
    endDate: string
  ): Promise<GitCommit[]> {
    const git: SimpleGit = simpleGit(repoPath);
    const commits: GitCommit[] = [];

    try {
      const log = await git.log({
        from: startDate,
        to: endDate,
      });

      for (const commit of log.all) {
        commits.push({
          hash: commit.hash,
          date: commit.date,
          message: commit.message,
          author: commit.author_name,
          repository: repoPath.split('/').pop() || repoPath,
        });
      }
    } catch (error) {
      console.error(`Error getting commits from ${repoPath}:`, (error as Error).message);
    }

    return commits;
  }

  /**
   * Generate human-readable daily notes from commits
   */
  generateDailyNotes(commits: GitCommit[]): DailyNote[] {
    const dailyMap = new Map<string, GitCommit[]>();

    // Group commits by date (YYYY-MM-DD)
    for (const commit of commits) {
      const date = commit.date.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)!.push(commit);
    }

    const notes: DailyNote[] = [];

    for (const [date, dayCommits] of dailyMap.entries()) {
      const significantCommits = dayCommits.filter((c) =>
        this.isSignificantCommit(c.message)
      );

      const note = this.generateDayNote(date, dayCommits, significantCommits);
      const sortedCommits = dayCommits.sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      notes.push({
        date,
        note,
        commitCount: dayCommits.length,
        firstCommit: sortedCommits[0]?.date,
        lastCommit: sortedCommits[sortedCommits.length - 1]?.date,
      });
    }

    return notes.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Check if a commit message indicates a significant change
   */
  private isSignificantCommit(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const significantPrefixes = [
      'feat',
      'fix',
      'merge',
      'refactor',
      'chore:',
      'perf',
      'docs',
      'test',
      'break',
    ];

    return significantPrefixes.some((prefix) =>
      lowerMessage.startsWith(prefix)
    );
  }

  /**
   * Generate a human-readable note for a day
   */
  private generateDayNote(
    date: string,
    allCommits: GitCommit[],
    significantCommits: GitCommit[]
  ): string {
    if (allCommits.length === 0) {
      return 'No activity';
    }

    if (significantCommits.length === 0) {
      return `${allCommits.length} commit${allCommits.length > 1 ? 's' : ''}`;
    }

    const parts: string[] = [];
    const byType = new Map<string, GitCommit[]>();

    for (const commit of significantCommits) {
      const type = commit.message.split(':')[0].toLowerCase() || 'other';
      if (!byType.has(type)) {
        byType.set(type, []);
      }
      byType.get(type)!.push(commit);
    }

    for (const [type, commits] of byType.entries()) {
      parts.push(`${type}: ${commits.length}`);
    }

    return parts.join(', ');
  }

  /**
   * Analyze all discovered repositories
   */
  async analyzeAllRepos(): Promise<GitAnalysisResult> {
    const repositories = this.discoverRepositories();

    if (this.options.discover) {
      console.log('Discovered repositories:');
      for (const repo of repositories) {
        console.log(`  - ${repo}`);
      }
      process.exit(0);
    }

    const allCommits: GitCommit[] = [];

    for (const repoPath of repositories) {
      const commits = await this.getGitCommits(
        repoPath,
        this.options.startDate,
        this.options.endDate
      );
      allCommits.push(...commits);
    }

    const dailyNotes = this.generateDailyNotes(allCommits);

    return {
      metadata: {
        startDate: this.options.startDate,
        endDate: this.options.endDate,
        reposDir: this.options.reposDir,
        repositoryCount: repositories.length,
        totalCommits: allCommits.length,
      },
      dailyNotes,
      commits: allCommits,
    };
  }

  /**
   * Save analysis to JSON file
   */
  saveAnalysis(result: GitAnalysisResult, outputFile?: string): void {
    const output = outputFile || this.options.output;
    // Use Bun.write if available, otherwise use fs
    if (typeof (globalThis as any).Bun !== 'undefined') {
      (globalThis as any).Bun.write(output, JSON.stringify(result, null, 2));
    } else {
      const { writeFileSync } = require('fs');
      writeFileSync(output, JSON.stringify(result, null, 2));
    }
    console.log(`Analysis saved to ${output}`);
  }
}
