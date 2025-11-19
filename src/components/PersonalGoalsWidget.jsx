import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import { loadPersonalGoals, getGoalProgress, addPersonalGoal, deletePersonalGoal } from '../utils/personalGoalsUtils';

const PersonalGoalsWidget = ({ activities }) => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'returnVisits',
    target: 5,
    period: 'month',
    label: 'Revisitas este mes'
  });

  useEffect(() => {
    setGoals(loadPersonalGoals().filter(g => g.active));
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    addPersonalGoal(newGoal);
    setGoals(loadPersonalGoals().filter(g => g.active));
    setShowForm(false);
    setNewGoal({ type: 'returnVisits', target: 5, period: 'month', label: 'Revisitas este mes' });
  };

  const handleDeleteGoal = (id) => {
    deletePersonalGoal(id);
    setGoals(loadPersonalGoals().filter(g => g.active));
  };

  const goalTypes = {
    hours: { label: 'Horas', icon: '⏱️' },
    placements: { label: 'Colocaciones', icon: '📚' },
    videos: { label: 'Videos', icon: '📱' },
    returnVisits: { label: 'Revisitas', icon: '🔄' },
    studies: { label: 'Estudios', icon: '🎓' }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Metas Personales
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
              required
            >
              {Object.entries(goalTypes).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
              placeholder="Meta"
              className="px-3 py-2 border rounded-lg text-sm"
              min="1"
              required
            />
          </div>
          <input
            type="text"
            value={newGoal.label}
            onChange={(e) => setNewGoal({ ...newGoal, label: e.target.value })}
            placeholder="Etiqueta (ej: Mis revisitas)"
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
            required
          />
          <select
            value={newGoal.period}
            onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
          >
            <option value="month">Este mes</option>
            <option value="week">Esta semana</option>
          </select>
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold"
          >
            Agregar Meta
          </button>
        </form>
      )}

      {goals.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No hay metas. Agrega una para motivarte.
        </p>
      )}

      <div className="space-y-3">
        {goals.map(goal => {
          const progress = getGoalProgress(goal, activities);
          return (
            <div key={goal.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {goal.label}
                </span>
                <div className="flex items-center gap-2">
                  {progress.achieved && <Check className="w-4 h-4 text-green-500" />}
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-1">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                    progress.achieved ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{progress.current} / {progress.target}</span>
                <span>{progress.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalGoalsWidget;
