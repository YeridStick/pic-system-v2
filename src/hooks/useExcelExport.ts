import { useState, useCallback, useMemo } from 'react';
import { useConfigStore, validateConfig } from '../stores/configStore';
import { useProductStore } from '../stores/productStore';
import type { ExportSummary } from '../types/types';

interface UseExcelExportReturn {
  generateExcel: () => Promise<boolean>;
  generateSample: () => void;
  isGenerating: boolean;
  canExport: boolean;
  getExportSummary: () => ExportSummary;
  previewHtml: string;
  updatePreview: () => void;
}

export const useExcelExport = (): UseExcelExportReturn => {
  const { excelConfig } = useConfigStore();
  const { productos } = useProductStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedTimestamp, setLastGeneratedTimestamp] = useState<string | null>(null);

  // Verificar si puede exportar
  const canExport = useMemo(() => {
    const issues = validateConfig(excelConfig);
    return productos.length > 0 && issues.length === 0;
  }, [productos.length, excelConfig]);

  // Helper to generate filename (replicated from ExcelService for now)
  const generateCurrentFileName = useCallback(() => {
    let fileName = excelConfig.fileName || 'PRESUPUESTO_PIC';
    if (excelConfig.includeDateInFileName) {
      const fecha = new Date().toISOString().split('T')[0];
      fileName += `_${fecha}`;
    }
    return `${fileName}.xlsx`;
  }, [excelConfig.fileName, excelConfig.includeDateInFileName]);

  // Generar resumen de exportación
  const getExportSummary = useCallback((): ExportSummary => {
    const validationIssues = validateConfig(excelConfig);
    
    const featuresEnabled = [];
    if (excelConfig.includeFormulas) featuresEnabled.push('Fórmulas automáticas');
    if (excelConfig.includeTotals) featuresEnabled.push('Fila de totales');
    if (excelConfig.currencyFormat) featuresEnabled.push('Formato de moneda');
    if (excelConfig.autoFilters) featuresEnabled.push('Filtros automáticos');
    if (excelConfig.autoColumnWidth) featuresEnabled.push('Ajuste de columnas');
    if (excelConfig.autoRowHeight) featuresEnabled.push('Ajuste de filas');

    // Estimar tamaño del archivo (muy aproximado)
    const baseSize = 15; // KB base para estructura Excel
    const productSize = productos.length * 0.5; // ~0.5KB por producto
    const featuresSize = featuresEnabled.length * 2; // ~2KB por característica
    const estimatedKB = baseSize + productSize + featuresSize;
    
    let estimatedFileSize = '';
    if (estimatedKB < 1024) {
      estimatedFileSize = `${Math.round(estimatedKB)} KB`;
    } else {
      estimatedFileSize = `${(estimatedKB / 1024).toFixed(1)} MB`;
    }

    // Calcular puntuación de configuración
    const sectionsEnabled = [
      excelConfig.includeContract,
      excelConfig.includeEntity,
      excelConfig.includeCategory,
      excelConfig.includeDate,
      excelConfig.includeResponsible
    ].filter(Boolean).length;

    const hasCustomColors = excelConfig.headerBgColor !== '#4CAF50' ||
                           excelConfig.oddRowColor !== '#F8F9FA' ||
                           excelConfig.totalRowBgColor !== '#E8F5E8';

    const configurationScore = Math.round(
      ((sectionsEnabled / 5) * 40) + 
      ((featuresEnabled.length / 6) * 40) + 
      (hasCustomColors ? 20 : 0)
    );

    return {
      productCount: productos.length,
      includesFormulas: excelConfig.includeFormulas,
      includesColors: hasCustomColors,
      validationIssues,
      configurationScore,
      estimatedFileSize,
      featuresEnabled,
      canExport,
      fileName: generateCurrentFileName(),
      lastGenerated: lastGeneratedTimestamp
    };
  }, [excelConfig, productos, canExport, generateCurrentFileName, lastGeneratedTimestamp]);

  // Generar HTML de vista previa
  const generatePreviewHtml = useCallback((): string => {
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };

    // Datos para mostrar (productos reales o ejemplos)
    const displayData = productos.length > 0 ? productos.slice(0, 3) : [
      {
        item: 1,
        producto: "BANDAS ELASTICAS SILICONADAS DE CAUCHO",
        cantidad: 1,
        presentacion: "BOLSA MEDIANA",
        valorCosto: 800,
        margen: 125,
        valorTotal: 1800
      },
      {
        item: 2,
        producto: "BISTURI ENCAUCHETADO 3 HOJAS",
        cantidad: 1,
        presentacion: "UNIDAD",
        valorCosto: 5450,
        margen: 137.2,
        valorTotal: 12927.40
      }
    ];

    let html = '';

    // Estilos de borde
    const borderWidth = excelConfig.borderStyle === 'thick' ? '3px' : 
                       excelConfig.borderStyle === 'medium' ? '2px' : '1px';
    const borderStyle = `${borderWidth} solid ${excelConfig.borderColor}`;

    // Encabezados
    if (excelConfig.includeContract && excelConfig.contractText) {
      html += `<div style="font-weight: bold; font-size: 14px; margin-bottom: 15px; text-transform: uppercase; line-height: 1.4; ${excelConfig.centerHeaders ? 'text-align: center;' : ''}">
        OBJETO: ${excelConfig.contractText}
      </div>`;
    }

    if (excelConfig.includeEntity && excelConfig.entityName) {
      html += `<div style="font-weight: bold; font-size: 13px; margin-bottom: 10px; ${excelConfig.centerHeaders ? 'text-align: center;' : ''}">
        ${excelConfig.entityName}
      </div>`;
    }

    if (excelConfig.includeCategory && excelConfig.categoryText) {
      html += `<div style="font-weight: bold; font-size: 12px; margin-bottom: 15px; background: #f0f0f0; padding: 8px; border-radius: 4px; ${excelConfig.centerHeaders ? 'text-align: center;' : ''}">
        ${excelConfig.categoryText}
      </div>`;
    }

    if (excelConfig.includeDate && excelConfig.documentDate) {
      const fecha = new Date(excelConfig.documentDate).toLocaleDateString('es-CO');
      html += `<div style="font-size: 11px; color: #666; margin-bottom: 10px; ${excelConfig.centerHeaders ? 'text-align: center;' : ''}">
        Fecha: ${fecha}
      </div>`;
    }

    if (excelConfig.includeResponsible && excelConfig.responsibleName) {
      html += `<div style="font-size: 11px; color: #666; margin-bottom: 10px; ${excelConfig.centerHeaders ? 'text-align: center;' : ''}">
        Responsible: ${excelConfig.responsibleName}
      </div>`;
    }

    // Tabla
    html += `<div style="margin-top: 30px; border: ${borderStyle}; border-radius: 8px; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${excelConfig.headerBgColor}; color: ${excelConfig.headerTextColor};">
            <th style="padding: 12px; text-align: center; font-weight: bold; border: ${borderStyle};">ITEM</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; border: ${borderStyle};">PRODUCTO</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; border: ${borderStyle};">CANT.</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; border: ${borderStyle};">PRESENTACIÓN</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; border: ${borderStyle};">VALOR TOTAL</th>
          </tr>
        </thead>
        <tbody>`;

    // Filas de datos
    displayData.forEach((item, index) => {
      const esImpar = index % 2 === 0;
      const colorFila = esImpar ? excelConfig.oddRowColor : excelConfig.evenRowColor;

      html += `<tr style="background-color: ${colorFila};">
        <td style="padding: 12px; text-align: center; border: ${borderStyle};">${item.item}</td>
        <td style="padding: 12px; text-align: left; border: ${borderStyle};">${item.producto}</td>
        <td style="padding: 12px; text-align: center; border: ${borderStyle};">${item.cantidad}</td>
        <td style="padding: 12px; text-align: center; border: ${borderStyle};">${item.presentacion}</td>
        <td style="padding: 12px; text-align: right; font-weight: bold; border: ${borderStyle};">${formatCurrency(item.valorTotal)}</td>
      </tr>`;
    });

    // Fila de totales
    if (excelConfig.includeTotals) {
      const totalSubtotal = displayData.reduce((sum, item) => sum + item.valorTotal, 0);
      html += `<tr style="background-color: ${excelConfig.totalRowBgColor}; font-weight: bold;">
        <td style="padding: 12px; text-align: center; border: ${borderStyle};"></td>
        <td style="padding: 12px; text-align: center; border: ${borderStyle};">TOTALES</td>
        <td style="padding: 12px; text-align: center; border: ${borderStyle};"></td>
        <td style="padding: 12px; text-align: center; border: ${borderStyle};"></td>
        <td style="padding: 12px; text-align: right; font-weight: bold; border: ${borderStyle};">${formatCurrency(totalSubtotal)}</td>
      </tr>`;
    }

    html += `</tbody></table></div>`;

    return html;
  }, [excelConfig, productos]);

  const previewHtml = useMemo(() => generatePreviewHtml(), [generatePreviewHtml]);

  // Función para generar Excel
  const generateExcel = useCallback(async (): Promise<boolean> => {
    if (!canExport) {
      throw new Error('No se puede exportar: faltan productos o hay errores de configuración');
    }

    setIsGenerating(true);

    try {
      // Aquí irá la lógica de ExcelJS
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation

      // Call actual ExcelService
      // Replace this line with the actual ExcelService call:
      // await ExcelService.generateExcel(productos, excelConfig);
      
      setLastGeneratedTimestamp(new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [canExport, excelConfig, productos]);

  // Generar archivo de ejemplo
  const generateSample = useCallback((): void => {
    console.log('Generando archivo de ejemplo...');
    // Aquí generarías un archivo de ejemplo con datos ficticios
  }, []);

  // Función para actualizar vista previa (se puede llamar desde otros componentes)
  const updatePreview = useCallback(() => {
    // No necesita lógica aquí ya que previewHtml es un useMemo con dependencias
    // y se actualizará automáticamente cuando cambien excelConfig o productos
  }, []);

  return {
    generateExcel,
    generateSample,
    isGenerating,
    canExport,
    getExportSummary,
    previewHtml,
    updatePreview
  };
};