declare module 'xlsx' {
  export interface CellStyle {
    font?: {
      bold?: boolean;
      color?: { rgb: string };
      sz?: number;
      name?: string;
    };
    fill?: {
      type?: "pattern";
      pattern?: "solid";
      fgColor?: { rgb: string };
    };
    alignment?: {
      horizontal?: 'center' | 'left' | 'right';
      vertical?: 'center' | 'top' | 'bottom';
      wrapText?: boolean;
    };
    border?: {
      top?: { style: string; color: { rgb: string } };
      bottom?: { style: string; color: { rgb: string } };
      left?: { style: string; color: { rgb: string } };
      right?: { style: string; color: { rgb: string } };
    };
    z?: string;
  }

  export interface Cell {
    t: string;
    v: string | number;
    s?: CellStyle;
    f?: string;
    z?: string;
  }

  export interface WorkSheet {
    '!ref'?: string;
    '!merges'?: Array<{ s: { r: number; c: number }; e: { r: number; c: number } }>;
    '!cols'?: Array<{ wch: number }>;
    '!pageSetup'?: {
      orientation: 'portrait' | 'landscape';
      fitToPage: boolean;
      scale: number;
      fitToWidth: number;
      fitToHeight: number;
    };
    '!margins'?: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      header: number;
      footer: number;
    };
    '!autofilter'?: { ref: string };
    [key: string]: Cell | unknown;
  }

  export interface Workbook {
    SheetNames: string[];
    Sheets: { [key: string]: WorkSheet };
  }

  export const utils: {
    book_new(): Workbook;
    aoa_to_sheet(data: unknown[][]): WorkSheet;
    book_append_sheet(wb: Workbook, ws: WorkSheet, name: string): void;
    writeFile(wb: Workbook, filename: string): void;
    decode_range(ref: string): { s: { r: number; c: number }; e: { r: number; c: number } };
    encode_cell(ref: { r: number; c: number }): string;
  };

  // Add the 'write' function directly here for browser compatibility
  export function write(wb: Workbook, opts?: { bookType?: 'xlsx' | 'xlsm' | 'xlsb' | 'biff8' | 'biff5' | 'biff4' | 'biff3' | 'biff2' | 'xlml' | 'ods' | 'fods' | 'sylk' | 'html' | 'dif' | 'dbf' | 'prn' | 'txt' | 'eth' | 'rtf' | 'csv' | 'txt' | 'html'; type?: 'base64' | 'binary' | 'array' | 'string' | 'buffer'; }): Uint8Array;
} 