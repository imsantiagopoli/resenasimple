import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImportCSVModalProps {
  businessId: string;
  onClose: () => void;
  onImportComplete: () => void;
}

interface CSVColumn {
  name: string;
  sample: string;
}

type FieldMapping = {
  [key: string]: string;
};

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  businessId,
  onClose,
  onImportComplete
}) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'importing' | 'complete'>('upload');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importResults, setImportResults] = useState({ success: 0, errors: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setError('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data = lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      return values;
    });

    const columns: CSVColumn[] = headers.map((name, index) => ({
      name,
      sample: data[0]?.[index] || ''
    }));

    setCsvData(data);
    setCsvColumns(columns);

    const autoMapping = detectMapping(headers);
    setFieldMapping(autoMapping);

    setStep('mapping');
    setError(null);
  };

  const detectMapping = (headers: string[]): FieldMapping => {
    const mapping: FieldMapping = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      notes: ''
    };

    const lowerHeaders = headers.map(h => h.toLowerCase());

    const namePatterns = ['nombre', 'name', 'first_name', 'firstname', 'primer nombre'];
    const lastNamePatterns = ['apellido', 'lastname', 'last_name', 'surname'];
    const emailPatterns = ['email', 'correo', 'e-mail', 'mail'];
    const phonePatterns = ['teléfono', 'telefono', 'phone', 'celular', 'móvil', 'movil'];
    const notesPatterns = ['notas', 'notes', 'comentarios', 'comments', 'observaciones'];

    lowerHeaders.forEach((header, index) => {
      if (namePatterns.some(p => header.includes(p))) {
        mapping.first_name = headers[index];
      }
      if (lastNamePatterns.some(p => header.includes(p))) {
        mapping.last_name = headers[index];
      }
      if (emailPatterns.some(p => header.includes(p))) {
        mapping.email = headers[index];
      }
      if (phonePatterns.some(p => header.includes(p))) {
        mapping.phone = headers[index];
      }
      if (notesPatterns.some(p => header.includes(p))) {
        mapping.notes = headers[index];
      }
    });

    return mapping;
  };

  const handleImport = async () => {
    if (!fieldMapping.first_name && !fieldMapping.last_name) {
      setError('Debes mapear al menos el campo Nombre o Apellido');
      return;
    }

    setStep('importing');
    setImportProgress({ current: 0, total: csvData.length });

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];

      try {
        const getColumnValue = (fieldName: string): string => {
          const columnName = fieldMapping[fieldName];
          if (!columnName) return '';
          const columnIndex = csvColumns.findIndex(c => c.name === columnName);
          return columnIndex >= 0 ? (row[columnIndex] || '').trim() : '';
        };

        const firstName = getColumnValue('first_name');
        const lastName = getColumnValue('last_name');

        if (!firstName && !lastName) {
          errorCount++;
          continue;
        }

        const { error } = await supabase
          .from('customers')
          .insert([{
            business_id: businessId,
            first_name: firstName,
            last_name: lastName,
            email: getColumnValue('email'),
            phone: getColumnValue('phone'),
            notes: getColumnValue('notes') || null
          }]);

        if (error) {
          console.error('Error importing row:', error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Error processing row:', err);
        errorCount++;
      }

      setImportProgress({ current: i + 1, total: csvData.length });
    }

    setImportResults({ success: successCount, errors: errorCount });
    setStep('complete');
  };

  const handleComplete = () => {
    onImportComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <h2 className="text-xl font-bold" style={{ color: '#161616' }}>
            Importar Clientes desde CSV
          </h2>
          <button
            onClick={onClose}
            disabled={step === 'importing'}
            className="p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            style={{ color: 'rgb(107, 114, 128)' }}
            onMouseEnter={(e) => {
              if (step !== 'importing') {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg border text-sm bg-red-50 border-red-200 text-red-800">
                  {error}
                </div>
              )}

              <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: 'rgb(209, 213, 219)' }}>
                <Upload size={48} className="mx-auto mb-4" style={{ color: 'rgb(107, 114, 128)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
                  Selecciona un archivo CSV
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
                  Sube un archivo CSV con la información de tus clientes
                </p>
                <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white'
                  }}
                >
                  <Upload size={16} />
                  <span>Seleccionar Archivo</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium" style={{ color: '#161616' }}>
                  Formato del archivo CSV:
                </h4>
                <ul className="text-sm space-y-1" style={{ color: 'rgb(107, 114, 128)' }}>
                  <li>• Primera fila: encabezados de columnas</li>
                  <li>• Columnas sugeridas: Nombre, Apellido, Email, Teléfono, Notas</li>
                  <li>• El sistema detectará automáticamente las columnas</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#075E54' + '10', borderColor: '#075E54' + '30' }}>
                <p className="text-sm" style={{ color: '#161616' }}>
                  Se detectaron {csvColumns.length} columnas y {csvData.length} filas. Mapea las columnas de tu CSV con los campos de cliente.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { field: 'first_name', label: 'Nombre', required: true },
                  { field: 'last_name', label: 'Apellido', required: true },
                  { field: 'email', label: 'Email', required: false },
                  { field: 'phone', label: 'Teléfono', required: false },
                  { field: 'notes', label: 'Notas', required: false }
                ].map(({ field, label, required }) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                      {label} {required && <span style={{ color: 'rgb(239, 68, 68)' }}>*</span>}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={fieldMapping[field]}
                        onChange={(e) => setFieldMapping(prev => ({ ...prev, [field]: e.target.value }))}
                        className="px-3 py-2 rounded-lg border text-sm"
                        style={{
                          borderColor: 'rgb(209, 213, 219)',
                          color: '#161616'
                        }}
                      >
                        <option value="">No mapear</option>
                        {csvColumns.map((col) => (
                          <option key={col.name} value={col.name}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                      {fieldMapping[field] && (
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'rgb(229, 231, 235)', backgroundColor: 'rgb(249, 250, 251)' }}>
                          <span style={{ color: 'rgb(107, 114, 128)' }}>Ejemplo:</span>
                          <span style={{ color: '#161616' }}>
                            {csvColumns.find(c => c.name === fieldMapping[field])?.sample || '-'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-lg border text-sm bg-red-50 border-red-200 text-red-800">
                  {error}
                </div>
              )}

              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                * Al menos uno de los campos Nombre o Apellido debe estar mapeado
              </p>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'white',
                    color: '#161616',
                    border: '1px solid rgb(209, 213, 219)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  Volver
                </button>

                <button
                  onClick={handleImport}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }}
                >
                  <ArrowRight size={16} />
                  <span>Importar {csvData.length} Clientes</span>
                </button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#075E54' }}></div>
                <h3 className="text-lg font-medium" style={{ color: '#161616' }}>
                  Importando clientes...
                </h3>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {importProgress.current} de {importProgress.total} procesados
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: '#075E54',
                      width: `${(importProgress.current / importProgress.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <CheckCircle size={64} className="mx-auto" style={{ color: '#10b981' }} />
                <h3 className="text-lg font-medium" style={{ color: '#161616' }}>
                  Importación Completada
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border text-center" style={{ borderColor: 'rgb(229, 231, 235)', backgroundColor: 'rgb(240, 253, 244)' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
                    {importResults.success}
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Importados
                  </p>
                </div>

                <div className="p-4 rounded-lg border text-center" style={{ borderColor: 'rgb(229, 231, 235)', backgroundColor: 'rgb(254, 242, 242)' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: 'rgb(239, 68, 68)' }}>
                    {importResults.errors}
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Errores
                  </p>
                </div>
              </div>

              {importResults.errors > 0 && (
                <div className="p-3 rounded-lg border text-sm bg-yellow-50 border-yellow-200 text-yellow-800">
                  Algunos registros no pudieron importarse. Verifica que tengan al menos nombre o apellido.
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: '#075E54',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }}
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
