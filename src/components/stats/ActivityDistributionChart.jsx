import React from 'react';
import { Award } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityDistributionChart = ({ activityTypeData }) => {
  if (activityTypeData.length === 0) return null;

  return (
    <div className="card-gradient p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" />
        DistribuciÃ³n de Actividad
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={activityTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {activityTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '8px 12px'
            }}
            formatter={(value) => value.toFixed(1)}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityDistributionChart;
