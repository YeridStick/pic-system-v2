import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useExcelExport } from '../../hooks/useExcelExport';

export const ExportButton: React.FC = () => {
  const { generateExcel, isGenerating } = useExcelExport();

  return (
    <button
      onClick={generateExcel}
      disabled={isGenerating}
      className="btn bg-green-600 hover:bg-green-700"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generando Excel...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Exportar a Excel
        </>
      )}
    </button>
  );
};