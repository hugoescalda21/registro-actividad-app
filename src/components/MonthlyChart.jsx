import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export const MonthlyChart = ({ activities, activityTypes }) => {
  // Datos para gráfico de barras (horas por semana)
  const getWeeklyData = () => {
    const weeks = { 'Semana 1': 0, 'Semana 2': 0, 'Semana 3': 0, 'Semana 4': 0, 'Semana 5': 0 };
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const day = date.getDate();
      const weekNum = Math.ceil(day / 7);
      const weekKey = `Semana ${weekNum}`;
      
      if (weeks[weekKey] !== undefined) {
        weeks[weekKey] += (activity.totalMinutes || 0) / 60;
      }
    });

    return Object.entries(weeks).map(([name, horas]) => ({
      name,
      horas: parseFloat(horas.toFixed(1))
    }));
  };

  // Datos para gráfico circular (tipos de actividad)
  const getActivityTypeData = () => {
    const types = {};
    
    activities.forEach(activity => {
      if (activity.totalMinutes > 0 && activity.type) {
        const label = activityTypes[activity.type]?.label || 'Otro';
        types[label] = (types[label] || 0) + (activity.totalMinutes / 60);
      }
    });

    return Object.entries(types).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(1))
    }));
  };

  const weeklyData = getWeeklyData();
  const typeData = getActivityTypeData();

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">No hay datos para mostrar gráficos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Barras */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Horas por Semana</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="horas" fill="#3b82f6" name="Horas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Circular */}
      {typeData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};