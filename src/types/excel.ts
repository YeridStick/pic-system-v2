export interface ExportSummary {
  productCount: number;
  canExport: boolean;
  validationIssues: string[];
  fileName: string;
  includesFormulas: boolean;
  includesColors: boolean;
  lastGenerated: Date | null;
}

export interface ExcelConfig {
  // Configuración del archivo
  fileName: string;
  includeDateInFileName: boolean;
  orientation: 'landscape' | 'portrait';
  scale: number;

  // Información de la entidad
  includeContract: boolean;
  contractText: string;
  includeEntity: boolean;
  entityName: string;
  includeCategory: boolean;
  categoryText: string;
  includeDate: boolean;
  documentDate: string;
  includeResponsible: boolean;
  responsibleName: string;

  // Configuración de la tabla
  includeFormulas: boolean;
  includeTotals: boolean;
  currencyFormat: boolean;
  autoFilters: boolean;
  autoColumnWidth: boolean;
  maxColumnWidth: number;
  autoRowHeight: boolean;
  centerHeaders: boolean;

  // Estilos y colores
  headerBgColor: string;
  headerTextColor: string;
  oddRowColor: string;
  evenRowColor: string;
  borderColor: string;
  borderStyle: 'thin' | 'medium' | 'thick';
  totalRowBgColor: string;

  // Configuración de páginas
  fitToPage: boolean;
  margins: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    header: number;
    footer: number;
  };

  // Fecha de última actualización
  lastUpdated: string;
  version: string;
}

export interface ExcelExportState {
  isGenerating: boolean;
  lastGenerated: Date | null;
  error: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}