/**
 * Google Sheets API types and interfaces
 */

export interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  title: string;
  url: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    index: number;
  }>;
}

export interface CellData {
  range: string;
  values: any[][];
}

export interface RowData {
  [key: string]: any;
}

/**
 * CLI types
 */

export interface CliOptions {
  verbose?: boolean;
}

export interface SheetsCliOptions extends CliOptions {
  range?: string;
  value?: string;
  row?: string;
  notes?: string;
  sheetName?: string;
}
