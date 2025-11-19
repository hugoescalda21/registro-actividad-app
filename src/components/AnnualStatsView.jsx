import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Award, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnnualStatsView = ({ activities, onClose, publisherType, publisherTypes }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Calcular estadísticas anuales
  const yearlyStats = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(selectedYear, i).toLocaleDateString('es', { month: 'short' }),
      monthNum: i,
      hours: 0,
      placements: 0,
      videos: 0,
      returnVisits: 0,
      studies: 0,
      activities: 0
    }));

    activities.forEach(act => {
      const actDate = new Date(act.date);
      if (actDate.getFullYear() === selectedYear) {
        const month = actDate.getMonth();
        monthlyData[month].hours += (act.hours || 0) + (act.approvedHours || 0);
        monthlyData[month].placements += act.placements || 0;
        monthlyData[month].videos += act.videos || 0;
        monthlyData[month].returnVisits += act.returnVisits || 0;
        monthlyData[month].studies += act.studies || 0;
        monthlyData[month].activities += 1;
      }
    });

    return monthlyData;
  }, [activities, selectedYear]);

  // Comparar con año anterior
  const previousYearStats = useMemo(() => {
    return yearlyStats.map((month, i) => {
      const prevYearActivities = activities.filter(act => {
        const actDate = new Date(act.date);
        return actDate.getFullYear() === selectedYear - 1 && actDate.getMonth() === i;
      });

      return {
        hours: prevYearActivities.reduce((sum, act) => sum + (act.hours || 0) + (act.approvedHours || 0), 0),
        placements: prevYearActivities.reduce((sum, act) => sum + (act.placements || 0), 0)
      };
    });
  }, [activities, selectedYear]);

  // Totales del año
  const yearTotals = useMemo(() => {
    return yearlyStats.reduce((acc, month) => ({
      hours: acc.hours + month.hours,
      placements: acc.placements + month.placements,
      videos: acc.videos + month.videos,
      returnVisits: acc.returnVisits + month.returnVisits,
      studies: acc.studies + month.studies,
      activities: acc.activities + month.activities
    }), { hours: 0, placements: 0, videos: 0, returnVisits: 0, studies: 0, activities: 0 });
  }, [yearlyStats]);

  // Comparación con año anterior
  const previousYearTotals = useMemo(() => {
    return previousYearStats.reduce((acc, month) => ({
      hours: acc.hours + month.hours,
      placements: acc.placements + month.placements
    }), { hours: 0, placements: 0 });
  }, [previousYearStats]);

  // Calcular tendencias
  const trends = {
    hours: yearTotals.hours - previousYearTotals.hours,
    placements: yearTotals.placements - previousYearTotals.placements,
    hoursPercent: previousYearTotals.hours > 0
      ? ((yearTotals.hours - previousYearTotals.hours) / previousYearTotals.hours * 100).toFixed(1)
      : 0,
    placementsPercent: previousYearTotals.placements > 0
      ? ((yearTotals.placements - previousYearTotals.placements) / previousYearTotals.placements * 100).toFixed(1)
      : 0
  };

  // Mejor mes del año
  const bestMonth = yearlyStats.reduce((best, month) =>
    month.hours > best.hours ? month : best
  , yearlyStats[0]);

  // Promedio mensual
  const avgHours = (yearTotals.hours / 12).toFixed(1);

  // Meses disponibles
  const years = Array.from(new Set(activities.map(act => new Date(act.date).getFullYear()))).sort((a, b) => b - a);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Estadísticas Anuales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis comparativo y tendencias
          </p>
        </div>

        {/* Year selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:border-blue-500 transition-all font-semibold"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Horas Totales</div>
          <div className="text-3xl font-bold">{yearTotals.hours.toFixed(1)}</div>
          {previousYearTotals.hours > 0 && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${
              trends.hours >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {trends.hours >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trends.hoursPercent)}% vs {selectedYear - 1}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Colocaciones</div>
          <div className="text-3xl font-bold">{yearTotals.placements}</div>
          {previousYearTotals.placements > 0 && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${
              trends.placements >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {trends.placements >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trends.placementsPercent)}% vs {selectedYear - 1}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Promedio Mensual</div>
          <div className="text-3xl font-bold">{avgHours}h</div>
          <div className="text-xs mt-2 opacity-80">
            {yearTotals.activities} actividades
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Mejor Mes</div>
          <div className="text-2xl font-bold capitalize">{bestMonth.month}</div>
          <div className="text-xs mt-2 opacity-80">
            {bestMonth.hours.toFixed(1)} horas
          </div>
        </div>
      </div>

      {/* Monthly Hours Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Horas por Mes ({selectedYear} vs {selectedYear - 1})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyStats.map((month, i) => ({
            ...month,
            prevYear: previousYearStats[i].hours
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={2}
              name={`${selectedYear}`}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="prevYear"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              name={`${selectedYear - 1}`}
              dot={{ fill: '#94a3b8', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-600" />
          Distribución de Actividad
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="placements" fill="#10b981" name="Colocaciones" />
            <Bar dataKey="videos" fill="#8b5cf6" name="Videos" />
            <Bar dataKey="returnVisits" fill="#f59e0b" name="Revisitas" />
            <Bar dataKey="studies" fill="#ef4444" name="Estudios" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Detalles Mensuales</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-2 text-gray-700 dark:text-gray-300">Mes</th>
              <th className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">Horas</th>
              <th className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">Coloc.</th>
              <th className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">Videos</th>
              <th className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">Rev.</th>
              <th className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">Est.</th>
            </tr>
          </thead>
          <tbody>
            {yearlyStats.map((month, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-2 px-2 font-medium text-gray-900 dark:text-white capitalize">
                  {month.month}
                </td>
                <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">
                  {month.hours.toFixed(1)}
                </td>
                <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">
                  {month.placements}
                </td>
                <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">
                  {month.videos}
                </td>
                <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">
                  {month.returnVisits}
                </td>
                <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">
                  {month.studies}
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100 dark:bg-gray-700">
              <td className="py-2 px-2 text-gray-900 dark:text-white">TOTAL</td>
              <td className="text-right py-2 px-2 text-gray-900 dark:text-white">
                {yearTotals.hours.toFixed(1)}
              </td>
              <td className="text-right py-2 px-2 text-gray-900 dark:text-white">
                {yearTotals.placements}
              </td>
              <td className="text-right py-2 px-2 text-gray-900 dark:text-white">
                {yearTotals.videos}
              </td>
              <td className="text-right py-2 px-2 text-gray-900 dark:text-white">
                {yearTotals.returnVisits}
              </td>
              <td className="text-right py-2 px-2 text-gray-900 dark:text-white">
                {yearTotals.studies}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnualStatsView;
