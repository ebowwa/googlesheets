/**
 * Google Sheets API client
 */

import { google } from 'googleapis';
import type { JWT } from 'google-auth-library';
import type {
  CellData,
  RowData,
  SpreadsheetInfo,
} from '../types/index.js';
import { createAuthenticatedClient, getSheetId } from './auth.js';

export class GoogleSheetsClient {
  private client: JWT;
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.client = createAuthenticatedClient();
    this.sheets = google.sheets({ version: 'v4', auth: this.client });
    this.spreadsheetId = getSheetId();
  }

  /**
   * Get spreadsheet metadata
   */
  async getSpreadsheetInfo(): Promise<SpreadsheetInfo> {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const data = response.data;
    return {
      spreadsheetId: data.spreadsheetId!,
      title: data.properties!.title!,
      url: data.spreadsheetUrl!,
      sheets: (data.sheets || []).map((sheet: any) => ({
        sheetId: sheet.properties.sheetId,
        title: sheet.properties.title,
        index: sheet.properties.index,
      })),
    };
  }

  /**
   * Get data from a range
   */
  async getWorksheetData(rangeName: string): Promise<RowData[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: rangeName,
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return [];
    }

    const headers = values[0];
    const rows: RowData[] = [];

    for (let i = 1; i < values.length; i++) {
      const row: RowData = {};
      for (let j = 0; j < headers.length && j < values[i].length; j++) {
        row[headers[j]] = values[i][j];
      }
      rows.push(row);
    }

    return rows;
  }

  /**
   * Get raw values (not as records)
   */
  async getRangeValues(rangeName: string): Promise<any[][]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: rangeName,
    });

    return response.data.values || [];
  }

  /**
   * Update a single cell or range
   */
  async updateCell(rangeName: string, value: string): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: rangeName,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[value]],
      },
    });
  }

  /**
   * Update multiple cells at once
   */
  async updateCells(rangeName: string, values: any[][]): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: rangeName,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
  }

  /**
   * Create a new worksheet
   */
  async createWorksheet(title: string): Promise<void> {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title,
              },
            },
          },
        ],
      },
    });
  }

  /**
   * List all worksheets
   */
  async listWorksheets(): Promise<Array<{ title: string; sheetId: number }>> {
    const info = await this.getSpreadsheetInfo();
    return info.sheets.map((sheet) => ({
      title: sheet.title,
      sheetId: sheet.sheetId,
    }));
  }

  /**
   * Append data to a sheet
   */
  async appendData(rangeName: string, values: any[][]): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: rangeName,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
  }
}
