export interface Producto {
  id: number | string;
  item: number;
  producto: string;
  cantidad: number;
  presentacion: string;
  categoria: string;
  valorCosto: number;
  margen: number;
  valorTotal: number;
}

export interface ExportSummary {
  productCount: number;
  includesFormulas: boolean;
  includesColors: boolean;
  validationIssues: string[];
  configurationScore: number;
  estimatedFileSize: string;
  featuresEnabled: string[];
  canExport: boolean;
  fileName: string;
  lastGenerated: string | null;
}

export interface ExcelTheme {
  name: string;
  headerBgColor: string;
  headerTextColor: string;
  oddRowColor: string;
  evenRowColor: string;
  borderColor: string;
  totalRowBgColor: string;
}

export interface ExcelConfig {
  // Configuración del archivo
  fileName: string;
  includeDateInFileName: boolean;
  orientation: 'landscape' | 'portrait';
  scale: number;
  fitToPage: boolean;

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