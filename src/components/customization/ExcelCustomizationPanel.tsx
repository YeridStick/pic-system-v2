import React, { useState } from 'react';

export const ExcelCustomizationPanel: React.FC = () => {
  // Estados de configuración
  const [includeObject, setIncludeObject] = useState(true);
  const [objectText, setObjectText] = useState('SUMINISTRO DE MATERIAL DE PAPELERIA...');
  const [includeEntity, setIncludeEntity] = useState(true);
  const [entityName, setEntityName] = useState('ESE HOSPITAL MUNICIPAL...');
  const [includeResponsible, setIncludeResponsible] = useState(true);
  const [responsibleName, setResponsibleName] = useState('Karen Daniela');
  const [headerBgColor, setHeaderBgColor] = useState('#4CAF50');
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff');
  const [includeFormulas, setIncludeFormulas] = useState(true);
  // ...otros estados

  // --- Vista previa dinámica ---
  const renderPreview = () => {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 mt-8">
        {/* Encabezados principales */}
        {includeObject && (
          <div
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              marginBottom: 15,
              textTransform: 'uppercase',
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            OBJETO: {objectText}
          </div>
        )}
        {includeEntity && (
          <div style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            {entityName}
          </div>
        )}
        {includeResponsible && (
          <div style={{ fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
            Responsable: {responsibleName}
          </div>
        )}
        {/* Tabla de ejemplo */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr style={{ background: headerBgColor, color: headerTextColor }}>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>ITEM</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>PRODUCTO</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>CANT</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>PRESENTACIÓN</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Valor costo</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Margen %</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>VALOR TOTAL</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {/* Ejemplo de filas */}
            <tr style={{ background: '#f9f9f9' }}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>BANDAS ELASTICAS SILICONADAS DE CAUCHO</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>BOLSA MEDIANA</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$800,00</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>125,00%</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$1.800,00</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$1.800,00</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>2</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>BISTURI ENCAUCHETADO 3 HOJAS</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>1</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>UNIDAD</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$5.450,00</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>137,20%</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$12.927,40</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>$12.927,40</td>
            </tr>
            {/* ...más filas de ejemplo o reales */}
            {includeFormulas && (
              <tr style={{ background: '#e0f7fa', fontWeight: 'bold' }}>
                <td colSpan={6} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>TOTALES</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>$14.727,40</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>$14.727,40</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sección de configuración de encabezados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={includeObject} onChange={e => setIncludeObject(e.target.checked)} />
            Incluir Objeto del Contrato
          </label>
          <textarea
            value={objectText}
            onChange={e => setObjectText(e.target.value)}
            rows={2}
            className="w-full border rounded p-2 mb-4"
            disabled={!includeObject}
          />

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={includeEntity} onChange={e => setIncludeEntity(e.target.checked)} />
            Incluir Nombre de la Entidad
          </label>
          <input
            type="text"
            value={entityName}
            onChange={e => setEntityName(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            disabled={!includeEntity}
          />

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={includeResponsible} onChange={e => setIncludeResponsible(e.target.checked)} />
            Incluir Responsable
          </label>
          <input
            type="text"
            value={responsibleName}
            onChange={e => setResponsibleName(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            disabled={!includeResponsible}
          />

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={includeFormulas}
              onChange={e => setIncludeFormulas(e.target.checked)}
            />
            Incluir fórmulas automáticas (SUMA, SUBTOTALES, etc.)
          </label>
        </div>
        <div>
          <label className="block mb-2">Color de fondo de encabezado</label>
          <input
            type="color"
            value={headerBgColor}
            onChange={e => setHeaderBgColor(e.target.value)}
            className="mb-4"
          />
          <label className="block mb-2">Color de texto de encabezado</label>
          <input
            type="color"
            value={headerTextColor}
            onChange={e => setHeaderTextColor(e.target.value)}
            className="mb-4"
          />
        </div>
      </div>
      {renderPreview()}
      {/* ...botón de generación... */}
    </div>
  );
} 