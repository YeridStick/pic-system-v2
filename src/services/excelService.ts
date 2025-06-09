// src/services/excelService.ts - Versión Completa con todas las operaciones
import * as ExcelJS from 'exceljs';
import type { Product } from '../types/product';
import type { ExcelConfig } from '../types/excel';

export class ExcelService {
  
  /**
   * Genera archivo Excel con ExcelJS
   */
  static async generateExcel(products: Product[], config: ExcelConfig): Promise<void> {
    if (products.length === 0) {
      throw new Error('No hay productos para exportar');
    }

    if (typeof ExcelJS === 'undefined') {
      throw new Error('ExcelJS no está disponible');
    }

    try {
      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Presupuesto PIC');

      let currentRow = 1;

      // Agregar encabezados según configuración
      currentRow = await this.addHeaders(worksheet, config, currentRow);
      
      // Agregar tabla de datos
      await this.addDataTable(worksheet, products, config, currentRow);

      // Configurar propiedades del documento
      this.configureWorksheet(worksheet, config);

      // Generar y descargar archivo
      await this.downloadExcel(workbook, config);

    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error(`Error al generar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Agregar encabezados al worksheet
   */
  private static async addHeaders(
    worksheet: ExcelJS.Worksheet, 
    config: ExcelConfig, 
    startRow: number
  ): Promise<number> {
    let currentRow = startRow;

    // Objeto del contrato
    if (config.includeContract && config.contractText) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const cell = worksheet.getCell(`A${currentRow}`);
      cell.value = `OBJETO: ${config.contractText}`;
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      cell.font = {
        bold: true,
        size: 12,
        name: 'Arial'
      };
      
      // Calcular altura basada en contenido
      const textLength = config.contractText.length;
      const estimatedHeight = Math.max(40, Math.ceil(textLength / 100) * 20);
      worksheet.getRow(currentRow).height = estimatedHeight;
      
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // Entidad
    if (config.includeEntity && config.entityName) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const cell = worksheet.getCell(`A${currentRow}`);
      cell.value = config.entityName;
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      cell.font = {
        bold: true,
        size: 11,
        name: 'Arial'
      };
      
      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // Categoría
    if (config.includeCategory && config.categoryText) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const cell = worksheet.getCell(`A${currentRow}`);
      cell.value = config.categoryText;
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      cell.font = {
        bold: true,
        size: 11,
        name: 'Arial'
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // Fecha
    if (config.includeDate && config.documentDate) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const cell = worksheet.getCell(`A${currentRow}`);
      const fecha = new Date(config.documentDate).toLocaleDateString('es-CO');
      cell.value = `Fecha: ${fecha}`;
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.font = {
        size: 10,
        name: 'Arial'
      };
      
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    }

    // Responsable
    if (config.includeResponsible && config.responsibleName) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const cell = worksheet.getCell(`A${currentRow}`);
      cell.value = `Responsable: ${config.responsibleName}`;
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      cell.font = {
        size: 10,
        name: 'Arial'
      };
      
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    }

    // Línea vacía antes de tabla
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    return currentRow;
  }

  /**
   * Agregar tabla de datos
   */
  private static async addDataTable(
    worksheet: ExcelJS.Worksheet,
    productos: Product[],
    config: ExcelConfig,
    startRow: number
  ): Promise<number> {
    let currentRow = startRow;

    // Encabezados de tabla
    const headers = [
      'ITEM',
      'PRODUCTO', 
      'CANT',
      'PRESENTACION',
      'Valor costo',
      'Margen %',
      'VALOR TOTAL',
      'SUBTOTAL'
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(currentRow, index + 1);
      cell.value = header;
      
      // Aplicar estilos de encabezado
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      cell.font = {
        bold: true,
        color: { argb: config.headerTextColor.replace('#', 'FF') },
        size: 11,
        name: 'Arial'
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: config.headerBgColor.replace('#', 'FF') }
      };
      
      // Aplicar bordes
      const borderStyle = this.getBorderStyle(config.borderStyle);
      const borderColor = { argb: config.borderColor.replace('#', 'FF') };
      
      cell.border = {
        top: { style: borderStyle, color: borderColor },
        left: { style: borderStyle, color: borderColor },
        bottom: { style: borderStyle, color: borderColor },
        right: { style: borderStyle, color: borderColor }
      };
    });

    worksheet.getRow(currentRow).height = 35;
    currentRow++;

    // Filas de datos
    productos.forEach((producto, index) => {
      const row = currentRow + index;
      
      const rowData = [
        producto.item,
        producto.producto,
        producto.cantidad,
        producto.presentacion,
        producto.valorCosto,
        producto.margen / 100, // Como decimal para porcentaje
        producto.valorTotal,
        producto.valorTotal * producto.cantidad
      ];

      rowData.forEach((data, colIndex) => {
        const cell = worksheet.getCell(row, colIndex + 1);
        cell.value = data;
        
        // Aplicar colores alternados
        const isOddRow = index % 2 === 0;
        const rowColor = isOddRow 
          ? config.oddRowColor.replace('#', 'FF')
          : config.evenRowColor.replace('#', 'FF');

        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        };
        cell.font = {
          size: 10,
          name: 'Arial'
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowColor }
        };

        // Bordes
        const borderStyle = this.getBorderStyle('thin');
        const borderColor = { argb: config.borderColor.replace('#', 'FF') };
        
        cell.border = {
          top: { style: borderStyle, color: borderColor },
          left: { style: borderStyle, color: borderColor },
          bottom: { style: borderStyle, color: borderColor },
          right: { style: borderStyle, color: borderColor }
        };

        // Formato específico por columna
        if (config.currencyFormat) {
          if (colIndex === 4 || colIndex === 6 || colIndex === 7) {
            // Columnas de moneda
            cell.numFmt = '"$"#,##0.00';
          } else if (colIndex === 5) {
            // Margen %
            cell.numFmt = '0.00%';
          }
        }
      });

      // Altura de fila basada en contenido
      if (config.autoRowHeight) {
        const productNameLength = producto.producto.length;
        const presentationLength = producto.presentacion.length;
        const estimatedHeight = Math.max(
          25,
          Math.ceil(productNameLength / 45) * 15,
          Math.ceil(presentationLength / 20) * 15
        );
        worksheet.getRow(row).height = estimatedHeight;
      } else {
        worksheet.getRow(row).height = 25;
      }
    });

    currentRow += productos.length;

    // Fila de totales
    if (config.includeTotals) {
      const totalCost = productos.reduce((sum, p) => sum + (p.valorCosto * p.cantidad), 0);
      const totalBudget = productos.reduce((sum, p) => sum + (p.valorTotal * p.cantidad), 0);
      
      const totalsData = ['', 'TOTALES', '', '', totalCost, '', '', totalBudget];
      
      totalsData.forEach((data, colIndex) => {
        const cell = worksheet.getCell(currentRow, colIndex + 1);
        cell.value = data;
        
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        };
        cell.font = {
          bold: true,
          size: 11,
          name: 'Arial'
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: config.totalRowBgColor.replace('#', 'FF') }
        };
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'thin' },
          bottom: { style: 'medium' },
          right: { style: 'thin' }
        };

        // Formato de moneda para totales
        if (config.currencyFormat && (colIndex === 4 || colIndex === 7)) {
          cell.numFmt = '"$"#,##0.00';
        }
      });

      worksheet.getRow(currentRow).height = 30;
      currentRow++;
    }

    return currentRow;
  }

  /**
   * Configurar propiedades del worksheet
   */
  private static configureWorksheet(worksheet: ExcelJS.Worksheet, config: ExcelConfig): void {
    // Ancho de columnas
    if (config.autoColumnWidth) {
      worksheet.columns = [
        { width: 8 },   // A - ITEM
        { width: 45 },  // B - PRODUCTO
        { width: 8 },   // C - CANT
        { width: 20 },  // D - PRESENTACION
        { width: 15 },  // E - Valor costo
        { width: 12 },  // F - Margen %
        { width: 18 },  // G - VALOR TOTAL
        { width: 18 }   // H - SUBTOTAL
      ];
      
      // Ajustar ancho máximo si está configurado
      const maxWidth = config.maxColumnWidth;
      worksheet.columns.forEach(col => {
        if (col.width && col.width > maxWidth) {
          col.width = maxWidth;
        }
      });
    }

    // Configuración de página
    worksheet.pageSetup = {
      orientation: config.orientation,
      fitToPage: config.fitToPage,
      fitToWidth: 1,
      fitToHeight: 0,
      scale: config.scale,
      margins: {
        left: config.margins.left,
        right: config.margins.right,
        top: config.margins.top,
        bottom: config.margins.bottom,
        header: config.margins.header,
        footer: config.margins.footer
      }
    };

    // Filtros automáticos si están habilitados
    if (config.autoFilters) {
      // Encontrar la fila de encabezados de tabla (buscar "ITEM")
      let headerRow = 1;
      for (let row = 1; row <= worksheet.rowCount; row++) {
        const cell = worksheet.getCell(row, 1);
        if (cell.value === 'ITEM') {
          headerRow = row;
          break;
        }
      }
      
      if (headerRow > 0) {
        worksheet.autoFilter = {
          from: { row: headerRow, column: 1 },
          to: { row: headerRow + (config.includeTotals ? worksheet.rowCount - 1 : worksheet.rowCount), column: 8 }
        };
      }
    }
  }

  /**
   * Convertir estilo de borde a formato ExcelJS
   */
  private static getBorderStyle(style: string): 'thin' | 'medium' | 'thick' {
    switch (style) {
      case 'medium': return 'medium';
      case 'thick': return 'thick';
      default: return 'thin';
    }
  }

  /**
   * Descargar archivo Excel
   */
  private static async downloadExcel(workbook: ExcelJS.Workbook, config: ExcelConfig): Promise<void> {
    // Generar nombre de archivo
    let fileName = this.generateFileName(config);
    fileName += '.xlsx';

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Crear blob y descargar
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Generar nombre de archivo basado en la configuración
   */
  private static generateFileName(config: ExcelConfig): string {
    let fileName = config.fileName || 'PRESUPUESTO_PIC';
    if (config.includeDateInFileName) {
      const fecha = new Date().toISOString().split('T')[0];
      fileName += `_${fecha}`;
    }
    return fileName;
  }

  /**
   * Genera archivo de ejemplo para importación
   */
  static generateSampleFile(): void {
    const sampleData = [
      {
        id: "sample_1",
        item: 1,
        producto: "BANDAS ELASTICAS SILICONADAS DE CAUCHO",
        cantidad: 5,
        presentacion: "BOLSA MEDIANA",
        categoria: "papeleria" as const,
        valorCosto: 2500,
        margen: 25,
        valorTotal: 3125,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        impuestos: [],
        costosAdicionales: [],
      },
      {
        id: "sample_2",
        item: 2,
        producto: "ARROZ BLANCO PREMIUM",
        cantidad: 10,
        presentacion: "BOLSA 500G",
        categoria: "alimentos" as const,
        valorCosto: 1800,
        margen: 30,
        valorTotal: 2340,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        impuestos: [],
        costosAdicionales: [],
      },
      {
        id: "sample_3",
        item: 3,
        producto: "SEMILLAS DE CILANTRO ORGANICAS",
        cantidad: 20,
        presentacion: "SOBRE",
        categoria: "semillas" as const,
        valorCosto: 1200,
        margen: 40,
        valorTotal: 1680,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        impuestos: [],
        costosAdicionales: [],
      }
    ];

    const defaultConfig = {
      fileName: 'EJEMPLO_PRESUPUESTO_PIC',
      includeDateInFileName: true,
      orientation: 'landscape' as const,
      scale: 85,
      includeContract: true,
      contractText: 'EJEMPLO - SUMINISTRO DE MATERIAL DE PAPELERIA Y OTROS',
      includeEntity: true,
      entityName: 'EJEMPLO - ESE HOSPITAL MUNICIPAL',
      includeCategory: true,
      categoryText: 'EJEMPLO - MATERIAL DE PAPELERIA',
      includeDate: true,
      documentDate: new Date().toISOString().split('T')[0],
      includeResponsible: true,
      responsibleName: 'Usuario Ejemplo',
      includeFormulas: true,
      includeTotals: true,
      currencyFormat: true,
      autoFilters: true,
      autoColumnWidth: true,
      maxColumnWidth: 50,
      autoRowHeight: true,
      centerHeaders: true,
      headerBgColor: '#4CAF50',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F8F9FA',
      evenRowColor: '#FFFFFF',
      borderColor: '#DDDDDD',
      borderStyle: 'thin' as const,
      totalRowBgColor: '#E8F5E8',
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3
      },
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      fitToPage: true
    };

    this.generateExcel(sampleData, defaultConfig);
  }

  /**
   * Exporta configuración Excel para backup
   */
  static exportConfig(config: ExcelConfig): void {
    const configData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      config: config
    };

    const dataStr = JSON.stringify(configData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config_excel_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Valida que los productos tengan la estructura correcta
   */
  static validateProducts(products: Product[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(products)) {
      errors.push('Los productos deben ser un array');
      return { isValid: false, errors };
    }

    if (products.length === 0) {
      errors.push('No hay productos para exportar');
      return { isValid: false, errors };
    }

    products.forEach((product, index) => {
      const requiredFields = ['id', 'item', 'producto', 'cantidad', 'presentacion', 'categoria', 'valorCosto', 'margen', 'valorTotal'];
      
      for (const field of requiredFields) {
        if (!(field in product)) {
          errors.push(`Producto ${index + 1}: Falta el campo "${field}"`);
        }
      }

      // Validaciones específicas
      if (typeof product.cantidad !== 'number' || product.cantidad <= 0) {
        errors.push(`Producto ${index + 1}: Cantidad debe ser un número mayor a 0`);
      }

      if (typeof product.valorCosto !== 'number' || product.valorCosto <= 0) {
        errors.push(`Producto ${index + 1}: Valor costo debe ser un número mayor a 0`);
      }

      if (typeof product.margen !== 'number' || product.margen < 0) {
        errors.push(`Producto ${index + 1}: Margen debe ser un número mayor o igual a 0`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Genera CSV como fallback si XLSX no está disponible
   */
  static generateCSVFallback(products: Product[], config: ExcelConfig): void {
    let csvContent = '';

    // Agregar encabezados según configuración
    if (config.includeContract && config.contractText) {
      csvContent += `"OBJETO: ${config.contractText}"\n\n`;
    }

    if (config.includeEntity && config.entityName) {
      csvContent += `"${config.entityName}"\n`;
    }

    if (config.includeCategory && config.categoryText) {
      csvContent += `"${config.categoryText}"\n`;
    }

    if (config.includeDate && config.documentDate) {
      const fecha = new Date(config.documentDate).toLocaleDateString('es-CO');
      csvContent += `"Fecha: ${fecha}"\n`;
    }

    if (config.includeResponsible && config.responsibleName) {
      csvContent += `"Responsable: ${config.responsibleName}"\n`;
    }

    csvContent += '\n'; // Línea vacía antes de la tabla

    // Encabezados de tabla
    csvContent += 'ITEM,PRODUCTO,CANT,PRESENTACION,Valor costo,Margen %,VALOR TOTAL,SUBTOTAL\n';

    // Datos de productos
    products.forEach((producto) => {
      csvContent += [
        producto.item,
        `"${producto.producto}"`,
        producto.cantidad,
        `"${producto.presentacion}"`,
        producto.valorCosto.toFixed(2),
        (producto.margen).toFixed(2) + '%',
        producto.valorTotal.toFixed(2),
        (producto.valorTotal * producto.cantidad).toFixed(2),
      ].join(',') + '\n';
    });

    // Fila de totales si está habilitada
    if (config.includeTotals) {
      const totalCosto = products.reduce((sum, p) => sum + (p.valorCosto * p.cantidad), 0);
      const totalPresupuesto = products.reduce((sum, p) => sum + (p.valorTotal * p.cantidad), 0);

      csvContent += [
        '',
        'TOTALES',
        '',
        '',
        totalCosto.toFixed(2),
        '',
        '',
        totalPresupuesto.toFixed(2),
      ].join(',') + '\n';
    }

    // Descargar CSV
    const fileName = this.generateFileName(config).replace('.xlsx', '.csv');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}