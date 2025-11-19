import React, { useState } from 'react';
import { X, QrCode, Download, Upload } from 'lucide-react';

const QRSyncModal = ({ isOpen, onClose, activities, publisherType, onImport }) => {
  const [qrData, setQrData] = useState('');
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const generateQR = () => {
    const data = {
      publisherType,
      activities,
      exportDate: new Date().toISOString(),
      version: '2.10.0'
    };

    const jsonStr = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    setQrData(base64);
    setShowQR(true);
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const decoded = decodeURIComponent(escape(atob(text)));
      const data = JSON.parse(decoded);

      if (data.activities && data.publisherType) {
        if (window.confirm(`¿Importar ${data.activities.length} actividades?`)) {
          onImport(data.activities, data.publisherType);
          onClose();
        }
      }
    } catch (error) {
      alert('❌ Error al leer el archivo QR. Verifica que sea válido.');
    }
  };

  const downloadQRData = () => {
    if (!qrData) return;

    const blob = new Blob([qrData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sync-qr-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <QrCode className="w-7 h-7" />
              Sincronización QR
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sincroniza tus datos entre dispositivos usando un archivo QR
          </p>

          {/* Generate QR */}
          <div>
            <button
              onClick={generateQR}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600
                       text-white py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              <QrCode className="w-5 h-5" />
              Generar Código QR
            </button>
          </div>

          {/* QR Display */}
          {showQR && qrData && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-xs break-all font-mono text-gray-600 max-h-32 overflow-y-auto">
                  {qrData}
                </div>
              </div>
              <button
                onClick={downloadQRData}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                         text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Descargar Código
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Guarda este archivo y ábrelo en otro dispositivo
              </p>
            </div>
          )}

          {/* Import QR */}
          <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <label className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600
                           text-white py-3 px-4 rounded-xl font-semibold transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Importar desde Código QR
              <input
                type="file"
                accept=".txt"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Selecciona el archivo QR que descargaste anteriormente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRSyncModal;
