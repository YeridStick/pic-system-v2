import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Product, ExcelConfig } from '../types';

export class ExcelExportService {
  private config: ExcelConfig;
  private productos: Product[];

  constructor(config: ExcelConfig, productos: Product[]) {
    this.config = config;
    this.productos = productos;
  }

  async exportToExcel(): Promise<void> {
    if (this.productos.length === 0) {
      throw new Error('No hay productos para exportar');
    }

    try {
      // Crear workbook con ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Presupuesto PIC');

      let currentRow = 1;

      // ENCABEZADOS PRINCIPALES
      currentRow = await this.addHeaders(worksheet, currentRow);
      
      // TABLA DE PRODUCTOS
      await this.addProductTable(worksheet, currentRow);
      
      // CONFIGURAR ESTILOS Y FORMATO
      await this.applyFormatting(worksheet);

      // GENERAR Y DESCARGAR ARCHIVO
      await this.downloadFile(workbook);

    } catch (error) {
      console.error('Error al generar Excel:', error);
      throw new Error(`Error al generar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async addHeaders(worksheet: ExcelJS.Worksheet, startRow: number): Promise<number> {
    let currentRow = startRow;

    // OBJETO DEL CONTRATO
    if (this.config.includeContract && this.config.contractText) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const objetoCell = worksheet.getCell(`A${currentRow}`);
      objetoCell.value = `OBJETO: ${this.config.contractText}`;
      
      objetoCell.alignment = {
        horizontal: this.config.centerHeaders ? 'center' : 'left',
        vertical: 'middle',
        wrapText: true,
      };
      objetoCell.font = {
        bold: true,
        size: 12,
        name: 'Arial',
      };
      
      // Calcular altura basada en contenido
      const textLength = this.config.contractText.length;
      const estimatedHeight = Math.max(40, Math.ceil(textLength / 100) * 20);
      worksheet.getRow(currentRow).height = estimatedHeight;
      
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // ENTIDAD
    if (this.config.includeEntity && this.config.entityName) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const entidadCell = worksheet.getCell(`A${currentRow}`);
      entidadCell.value = this.config.entityName;

      entidadCell.alignment = {
        horizontal: this.config.centerHeaders ? 'center' : 'left',
        vertical: 'middle',
        wrapText: true,
      };
      entidadCell.font = {
        bold: true,
        size: 11,
        name: 'Arial',
      };
      entidadCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // CATEGORÍA
    if (this.config.includeCategory && this.config.categoryText) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const categoriaCell = worksheet.getCell(`A${currentRow}`);
      categoriaCell.value = this.config.categoryText;

      categoriaCell.alignment = {
        horizontal: this.config.centerHeaders ? 'center' : 'left',
        vertical: 'middle',
        wrapText: true,
      };
      categoriaCell.font = {
        bold: true,
        size: 11,
        name: 'Arial',
      };
      categoriaCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
      categoriaCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.getRow(currentRow).height = 25;
      currentRow++;
    }

    // Línea vacía
    worksheet.getRow(currentRow).height = 15;
    currentRow++;

    // FECHA
    if (this.config.includeDate && this.config.documentDate) {
      const fecha = new Date(this.config.documentDate).toLocaleDateString('es-CO');
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const fechaCell = worksheet.getCell(`A${currentRow}`);
      fechaCell.value = `Fecha: ${fecha}`;

      fechaCell.alignment = {
        horizontal: this.config.centerHeaders ? 'center' : 'left',
        vertical: 'middle',
      };
      fechaCell.font = {
        size: 10,
        name: 'Arial',
      };

      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    }

    // RESPONSABLE
    if (this.config.includeResponsible && this.config.responsibleName) {
      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const responsableCell = worksheet.getCell(`A${currentRow}`);
      responsableCell.value = `Responsable: ${this.config.responsibleName}`;

      responsableCell.alignment = {
        horizontal: this.config.centerHeaders ? 'center' : 'left',
        vertical: 'middle',
      };
      responsableCell.font = {
        size: 10,
        name: 'Arial',
      };

      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    }

    // Línea vacía antes de tabla
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    return currentRow;
  }

  private async addProductTable(worksheet: ExcelJS.Worksheet, startRow: number): Promise<number> {
    let currentRow = startRow;

    // ENCABEZADOS DE TABLA
    const headers = [
      'ITEM',
      'PRODUCTO',
      'CANT',
      'PRESENTACION',
      'Valor costo',
      'Margen %',
      'VALOR TOTAL',
      'SUBTOTAL',
    ];

    // Agregar encabezados
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(currentRow, index + 1);
      cell.value = header;

      // Estilo para encabezados
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.font = {
        bold: true,
        color: { argb: this.config.headerTextColor.replace('#', 'FF') },
        size: 11,
        name: 'Arial',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.config.headerBgColor.replace('#', 'FF') },
      };

      const borderStyle = this.config.borderStyle;
      const borderColor = { argb: this.config.borderColor.replace('#', 'FF') };

      cell.border = {
        top: { style: borderStyle, color: borderColor },
        left: { style: borderStyle, color: borderColor },
        bottom: { style: borderStyle, color: borderColor },
        right: { style: borderStyle, color: borderColor },
      };
    });

    worksheet.getRow(currentRow).height = 35;
    currentRow++;

    // DATOS DE PRODUCTOS
    this.productos.forEach((producto, index) => {
      const row = currentRow + index;

      // Datos del producto
      const rowData = [
        producto.item,
        producto.producto,
        producto.cantidad,
        producto.presentacion,
        producto.valorCosto,
        producto.margen / 100, // Como decimal para porcentaje
        producto.valorTotal,
        producto.valorTotal * producto.cantidad,
      ];

      rowData.forEach((dato, colIndex) => {
        const cell = worksheet.getCell(row, colIndex + 1);
        cell.value = dato;

        // Aplicar colores alternados
        const isOddRow = index % 2 === 0;
        const rowColor = isOddRow 
          ? this.config.oddRowColor.replace('#', 'FF')
          : this.config.evenRowColor.replace('#', 'FF');

        const borderColor = { argb: this.config.borderColor.replace('#', 'FF') };
        const borderStyle = this.config.borderStyle;

        // Estilos para datos
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.font = {
          size: 10,
          name: 'Arial',
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowColor },
        };
        cell.border = {
          top: { style: borderStyle, color: borderColor },
          left: { style: borderStyle, color: borderColor },
          bottom: { style: borderStyle, color: borderColor },
          right: { style: borderStyle, color: borderColor },
        };

        // Formato de moneda y porcentajes
        if (this.config.currencyFormat) {
          if (colIndex === 4 || colIndex === 6 || colIndex === 7) {
            // Columnas de moneda
            cell.numFmt = '"$"#,##0.00';
          } else if (colIndex === 5) {
            // Margen %
            cell.numFmt = '0.00%';
          }
        }
      });

      // Calcular altura de fila basada en contenido
      if (this.config.autoRowHeight) {
        const productNameLength = producto.producto.length;
        const presentationLength = producto.presentacion.length;
        
        const productHeight = Math.ceil(productNameLength / 45) * 15;
        const presentationHeight = Math.ceil(presentationLength / 20) * 15;
        const finalHeight = Math.max(25, productHeight, presentationHeight);

        worksheet.getRow(row).height = finalHeight;
      } else {
        worksheet.getRow(row).height = 30;
      }
    });

    currentRow += this.productos.length;

    // FILA DE TOTALES
    if (this.config.includeTotals) {
      const totalCost = this.productos.reduce(
        (sum, p) => sum + p.valorCosto * p.cantidad,
        0
      );
      const totalBudget = this.productos.reduce(
        (sum, p) => sum + p.valorTotal * p.cantidad,
        0
      );

      const totalsData = ['', 'TOTALES', '', '', totalCost, '', '', totalBudget];

      totalsData.forEach((dato, colIndex) => {
        const cell = worksheet.getCell(currentRow, colIndex + 1);
        cell.value = dato;

        // Estilos para totales
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.font = {
          bold: true,
          size: 11,
          name: 'Arial',
        };

        const totalRowColor = this.config.totalRowBgColor.replace('#', 'FF');
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: totalRowColor },
        };

        cell.border = {
          top: { style: 'medium' },
          left: { style: 'thin' },
          bottom: { style: 'medium' },
          right: { style: 'thin' },
        };

        // Formato de moneda para totales
        if (this.config.currencyFormat && (colIndex === 4 || colIndex === 7)) {
          cell.numFmt = '"$"#,##0.00';
        }
      });

      worksheet.getRow(currentRow).height = 30;
      currentRow++;
    }

    return currentRow;
  }

  private async applyFormatting(worksheet: ExcelJS.Worksheet): Promise<void> {
    // CONFIGURAR ANCHOS DE COLUMNA
    if (this.config.autoColumnWidth) {
      const maxWidth = this.config.maxColumnWidth;
      
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
      worksheet.columns.forEach(col => {
        if (col.width && col.width > maxWidth) {
          col.width = maxWidth;
        }
      });
    }

    // CONFIGURAR PÁGINA
    worksheet.pageSetup = {
      orientation: this.config.orientation,
      fitToPage: this.config.fitToPage,
      fitToWidth: 1,
      fitToHeight: 0,
      scale: this.config.scale,
      margins: {
        left: this.config.margins.left,
        right: this.config.margins.right,
        top: this.config.margins.top,
        bottom: this.config.margins.bottom,
        header: this.config.margins.header,
        footer: this.config.margins.footer
      }
    };

    // FILTROS AUTOMÁTICOS
    if (this.config.autoFilters && this.productos.length > 0) {
      // Encontrar la fila de encabezados (buscar "ITEM")
      let headerRowNum = 1;
      for (let row = 1; row <= worksheet.rowCount; row++) {
        const cell = worksheet.getCell(row, 1);
        if (cell.value === 'ITEM') {
          headerRowNum = row;
          break;
        }
      }
      
      if (headerRowNum > 0) {
        worksheet.autoFilter = {
          from: { row: headerRowNum, column: 1 },
          to: { row: headerRowNum + (this.config.includeTotals ? worksheet.rowCount - 1 : worksheet.rowCount), column: 8 }
        };
      }
    }
  }

  private async downloadFile(workbook: ExcelJS.Workbook): Promise<void> {
    // Generar nombre de archivo
    let fileName = this.config.fileName || 'PRESUPUESTO_PIC';
    
    if (this.config.includeDateInFileName) {
      const fecha = new Date().toISOString().split('T')[0];
      fileName += `_${fecha}`;
    }
    
    fileName += '.xlsx';

    // Crear buffer y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, fileName);
  }
}