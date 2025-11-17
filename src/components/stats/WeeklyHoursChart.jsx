import React from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyHoursChart = ({ weeklyData }) => {
  if (weeklyData.length === 0) return null;

  return (
    <div className="card-gradient p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Horas por Semana
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '8px 12px'
            }}
            formatter={(value) => [`${value.toFixed(1)}h`, 'Horas']}
          />
          <Bar
            dataKey="hours"
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyHoursChart;
