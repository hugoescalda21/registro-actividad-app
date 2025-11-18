import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Ups! Algo salió mal
              </h1>
              <p className="text-gray-600">
                La aplicación encontró un error inesperado
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-red-800 mb-2">Error:</h3>
                <p className="text-sm text-red-700 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
                <summary className="font-bold text-gray-800 cursor-pointer mb-2">
                  Stack Trace (solo en desarrollo)
                </summary>
                <pre className="text-xs text-gray-700 overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
              >
                🔄 Recargar Aplicación
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
              >
                🏠 Ir al Inicio
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Si el problema persiste, intenta limpiar el caché del navegador
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;