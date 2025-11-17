import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error en la consola (en producción podrías enviarlo a un servicio de logging)
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
            {/* Icono de error */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Algo salió mal
            </h1>

            {/* Descripción */}
            <p className="text-gray-600 text-center mb-8">
              Lo sentimos, ha ocurrido un error inesperado en la aplicación.
              No te preocupes, tus datos están seguros.
            </p>

            {/* Detalles del error (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="font-semibold text-red-800 mb-2">Detalles del error:</p>
                <pre className="text-sm text-red-700 overflow-x-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-semibold text-red-800 hover:text-red-900">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Recargar página
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors active:scale-95"
              >
                <Home className="w-5 h-5" />
                Ir al inicio
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>=¡ Consejo:</strong> Si el problema persiste, intenta:
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Limpiar la caché del navegador</li>
                <li>Actualizar la aplicación (si es PWA)</li>
                <li>Verificar tu conexión a internet</li>
                <li>Exportar tus datos como respaldo desde Configuración</li>
              </ul>
            </div>

            {/* Versión */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Versión 2.5.3
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
