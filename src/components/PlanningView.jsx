import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Copy, Wand2, Save, X, Plus } from 'lucide-react';
import { getMonthYear } from '../utils/dateUtils';

const PlanningView = ({ activities, config }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [plannedDays, setPlannedDays] = useState(() => {
    const saved = localStorage.getItem('plannedDays');
    return saved ? JSON.parse(saved) : {};
  });
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [plannedHours, setPlannedHours] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Guardar planes en localStorage
  const savePlans = (plans) => {
    setPlannedDays(plans);
    localStorage.setItem('plannedDays', JSON.stringify(plans));
  };

  // Obtener clave del día
  const getDayKey = (year, month, day) => {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Obtener días del mes
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Obtener primer día de la semana del mes
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // Obtener actividades del mes
  const monthActivities = useMemo(() => {
    return activities.filter(activity => {
      const { month, year } = getMonthYear(activity.date);
      return month === selectedMonth && year === selectedYear;
    });
  }, [activities, selectedMonth, selectedYear]);

  // Generar array de días
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = getDayKey(selectedYear, selectedMonth, day);
      const activity = monthActivities.find(act => act.date === dayKey);
      const planned = plannedDays[dayKey];
      
      const today = new Date();
      const isToday = today.getDate() === day && 
                      today.getMonth() + 1 === selectedMonth && 
                      today.getFullYear() === selectedYear;

      days.push({
        day,
        dayKey,
        activity,
        planned,
        isToday,
        isCompleted: !!activity,
        isPast: new Date(selectedYear, selectedMonth - 1, day) < new Date().setHours(0, 0, 0, 0)
      });
    }

    return days;
  }, [selectedYear, selectedMonth, monthActivities, plannedDays]);

  // Estadísticas del mes
  const monthStats = useMemo(() => {
    const totalPlanned = Object.entries(plannedDays)
      .filter(([key]) => key.startsWith(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`))
      .reduce((sum, [_, hours]) => sum + hours, 0);

    const totalCompleted = monthActivities.reduce((sum, act) => sum + (act.hours || 0), 0);

    const daysPlanned = Object.keys(plannedDays)
      .filter(key => key.startsWith(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`))
      .length;

    const daysCompleted = monthActivities.length;

    return {
      totalPlanned,
      totalCompleted,
      daysPlanned,
      daysCompleted,
      difference: totalCompleted - totalPlanned,
      percentageCompleted: totalPlanned > 0 ? (totalCompleted / totalPlanned) * 100 : 0
    };
  }, [plannedDays, monthActivities, selectedYear, selectedMonth]);

  // Dividir días en semanas
  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksArray.push(calendarDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [calendarDays]);

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDayClick = (dayInfo) => {
    if (!dayInfo) return;
    setSelectedDay(dayInfo);
    setPlannedHours(dayInfo.planned || '');
    setShowDayModal(true);
  };

  const handleSavePlan = () => {
    if (!selectedDay) return;

    const newPlans = { ...plannedDays };
    
    if (plannedHours && parseFloat(plannedHours) > 0) {
      newPlans[selectedDay.dayKey] = parseFloat(plannedHours);
    } else {
      delete newPlans[selectedDay.dayKey];
    }

    savePlans(newPlans);
    setShowDayModal(false);
    setSelectedDay(null);
    setPlannedHours('');
  };

  const handleCopyPreviousMonth = () => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    
    const prevMonthPlans = Object.entries(plannedDays)
      .filter(([key]) => key.startsWith(`${prevYear}-${prevMonth.toString().padStart(2, '0')}`));

    if (prevMonthPlans.length === 0) {
      alert('No hay plan del mes anterior para copiar');
      return;
    }

    if (!window.confirm('¿Copiar la planificación del mes anterior?')) {
      return;
    }

    const newPlans = { ...plannedDays };
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    prevMonthPlans.forEach(([key, hours]) => {
      const day = parseInt(key.split('-')[2]);
      if (day <= daysInMonth) {
        const newKey = getDayKey(selectedYear, selectedMonth, day);
        newPlans[newKey] = hours;
      }
    });

    savePlans(newPlans);
    alert('✅ Plan copiado exitosamente');
  };

  const handleUseTemplate = (template) => {
    if (!window.confirm(`¿Aplicar plantilla "${template.name}"?`)) {
      return;
    }

    const newPlans = { ...plannedDays };
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dayOfWeek = date.getDay();
      const dayKey = getDayKey(selectedYear, selectedMonth, day);

      if (template.days.includes(dayOfWeek)) {
        newPlans[dayKey] = template.hours;
      }
    }

    savePlans(newPlans);
    alert('✅ Plantilla aplicada exitosamente');
  };

  const templates = [
    { name: 'Fines de Semana', days: [0, 6], hours: 3 }, // Dom, Sáb
    { name: 'Entre Semana', days: [1, 2, 3, 4, 5], hours: 2 }, // Lun-Vie
    { name: 'Martes y Jueves', days: [2, 4], hours: 2.5 },
    { name: 'Sábados', days: [6], hours: 4 }
  ];

  const getDayStyle = (dayInfo) => {
    if (!dayInfo) return 'bg-transparent';

    if (dayInfo.isCompleted) {
      return 'bg-green-500 text-white hover:bg-green-600';
    }

    if (dayInfo.isToday) {
      if (dayInfo.planned) {
        return 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 ring-4 ring-yellow-300';
      }
      return 'bg-yellow-100 text-gray-900 hover:bg-yellow-200 ring-4 ring-yellow-300';
    }

    if (dayInfo.planned) {
      return 'bg-blue-500 text-white hover:bg-blue-600';
    }

    if (dayInfo.isPast) {
      return 'bg-gray-200 text-gray-500 hover:bg-gray-300';
    }

    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  // No mostrar si no tiene meta de horas
  if (!config.canLogHours || config.hours === 0) {
    return (
      <div className="card-gradient p-12 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Planificación No Disponible
        </h3>
        <p className="text-gray-500">
          La planificación solo está disponible para tipos de publicador con meta de horas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header con navegación */}
      <div className="card-gradient p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Planificación
          </h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {months[selectedMonth - 1]} {selectedYear}
            </h3>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
            <p className="text-xs font-semibold text-blue-600 mb-1">Planeado</p>
            <p className="text-2xl font-bold text-blue-800">{monthStats.totalPlanned.toFixed(1)}h</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 border-2 border-green-200">
            <p className="text-xs font-semibold text-green-600 mb-1">Completado</p>
            <p className="text-2xl font-bold text-green-800">{monthStats.totalCompleted.toFixed(1)}h</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
            <p className="text-xs font-semibold text-purple-600 mb-1">Días Plan</p>
            <p className="text-2xl font-bold text-purple-800">{monthStats.daysPlanned}</p>
          </div>
          <div className={`rounded-xl p-3 border-2 ${
            monthStats.difference >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <p className={`text-xs font-semibold mb-1 ${
              monthStats.difference >= 0 ? 'text-green-600' : 'text-orange-600'
            }`}>
              Diferencia
            </p>
            <p className={`text-2xl font-bold ${
              monthStats.difference >= 0 ? 'text-green-800' : 'text-orange-800'
            }`}>
              {monthStats.difference >= 0 ? '+' : ''}{monthStats.difference.toFixed(1)}h
            </p>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="card-gradient p-4 md:p-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Semanas */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((dayInfo, dayIndex) => (
              <button
                key={dayIndex}
                onClick={() => handleDayClick(dayInfo)}
                disabled={!dayInfo}
                className={`aspect-square rounded-xl transition-all duration-200 flex flex-col items-center justify-center p-2 ${
                  getDayStyle(dayInfo)
                } ${dayInfo ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
              >
                {dayInfo && (
                  <>
                    <span className="text-lg font-bold">{dayInfo.day}</span>
                    {(dayInfo.planned || dayInfo.activity) && (
                      <span className="text-xs font-semibold mt-1">
                        {dayInfo.activity ? `${dayInfo.activity.hours}h` : `${dayInfo.planned}h`}
                      </span>
                    )}
                    {dayInfo.isCompleted && (
                      <span className="text-xs">✓</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        ))}

        {/* Leyenda */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Planeado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded ring-2 ring-yellow-300"></div>
              <span className="text-gray-700">Hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-gray-700">Sin plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card-gradient p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          Acciones Rápidas
        </h3>

        <div className="space-y-3">
          <button
            onClick={handleCopyPreviousMonth}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Copy className="w-5 h-5" />
            Copiar Mes Anterior
          </button>

          <div className="grid grid-cols-2 gap-3">
            {templates.map(template => (
              <button
                key={template.name}
                onClick={() => handleUseTemplate(template)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-xl transition-all text-sm active:scale-95"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de planificación de día */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowDayModal(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Planificar Día {selectedDay.day}
              </h3>
              <button
                onClick={() => setShowDayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {new Date(selectedYear, selectedMonth - 1, selectedDay.day).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {selectedDay.isCompleted && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-3">
                  <p className="text-sm text-green-800 font-semibold">
                    ✅ Día completado: {selectedDay.activity.hours}h registradas
                  </p>
                </div>
              )}

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Horas Planeadas
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={plannedHours}
                onChange={(e) => setPlannedHours(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder="0.0"
                autoFocus
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDayModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningView;