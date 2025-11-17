import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Copy, Wand2, Save, X } from 'lucide-react';
import { getMonthYear } from '../utils/dateUtils';
import { useModal } from '../contexts/ModalContext';

const PlanningView = ({ activities, config }) => {
  const modal = useModal();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [plannedDays, setPlannedDays] = useState(() => {
    const saved = localStorage.getItem('plannedDays');
    return saved ? JSON.parse(saved) : {};
  });
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [plannedHours, setPlannedHours] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Versión corta para pantallas muy pequeñas
  const weekDaysShort = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const weekDaysMedium = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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

    const totalCompleted = monthActivities.reduce((sum, act) => {
  const preachingHours = act.hours || 0;
  const approvedHours = act.approvedHours || 0;
  return sum + preachingHours + approvedHours;
}, 0);

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

  const handleCopyPreviousMonth = async () => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

    const prevMonthPlans = Object.entries(plannedDays)
      .filter(([key]) => key.startsWith(`${prevYear}-${prevMonth.toString().padStart(2, '0')}`));

    if (prevMonthPlans.length === 0) {
      await modal.info('No hay plan del mes anterior para copiar', 'Sin plan previo');
      return;
    }

    const confirmed = await modal.confirm(
      '¿Copiar la planificación del mes anterior?',
      'Copiar planificación'
    );
    if (!confirmed) {
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
    setShowTemplates(false);
    await modal.success('Plan copiado exitosamente', 'Éxito');
  };

  const handleUseTemplate = async (template) => {
    const confirmed = await modal.confirm(
      `¿Aplicar plantilla "${template.name}"?`,
      'Aplicar plantilla'
    );
    if (!confirmed) {
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
    setShowTemplates(false);
    await modal.success('Plantilla aplicada exitosamente', 'Éxito');
  };

  const templates = [
    { name: 'Fines de Semana', days: [0, 6], hours: 3, emoji: '📅' },
    { name: 'Entre Semana', days: [1, 2, 3, 4, 5], hours: 2, emoji: '📝' },
    { name: 'Mar/Jue', days: [2, 4], hours: 2.5, emoji: '📌' },
    { name: 'Sábados', days: [6], hours: 4, emoji: '⭐' }
  ];

  const getDayStyle = (dayInfo) => {
    if (!dayInfo) return 'bg-transparent cursor-default';

    if (dayInfo.isCompleted) {
      return 'bg-green-500 text-white font-bold shadow-md hover:bg-green-600 active:scale-95';
    }

    if (dayInfo.isToday) {
      if (dayInfo.planned) {
        return 'bg-yellow-400 text-gray-900 font-bold shadow-lg ring-4 ring-yellow-200 hover:bg-yellow-500 active:scale-95';
      }
      return 'bg-yellow-100 text-gray-900 font-bold shadow-lg ring-4 ring-yellow-200 hover:bg-yellow-200 active:scale-95';
    }

    if (dayInfo.planned) {
      return 'bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 active:scale-95';
    }

    if (dayInfo.isPast) {
      return 'bg-gray-100 text-gray-400 hover:bg-gray-200 active:scale-95';
    }

    return 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95';
  };

  // No mostrar si no tiene meta de horas
  if (!config.canLogHours || config.hours === 0) {
    return (
      <div className="card-gradient p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Planificación No Disponible
        </h3>
        <p className="text-sm text-gray-500">
          La planificación solo está disponible para tipos de publicador con meta de horas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fadeIn pb-6">
      {/* Header compacto con estadísticas */}
      <div className="card-gradient p-3 sm:p-4">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 touch-target"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              {months[selectedMonth - 1]}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">{selectedYear}</p>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 touch-target"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Estadísticas compactas - Responsive */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-blue-200">
            <p className="text-[10px] sm:text-xs font-semibold text-blue-600 mb-0.5 sm:mb-1">Planeado</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-800">{monthStats.totalPlanned.toFixed(1)}h</p>
            <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1">{monthStats.daysPlanned} días</p>
          </div>
          <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-green-200">
            <p className="text-[10px] sm:text-xs font-semibold text-green-600 mb-0.5 sm:mb-1">Completado</p>
            <p className="text-xl sm:text-2xl font-bold text-green-800">{monthStats.totalCompleted.toFixed(1)}h</p>
            <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">{monthStats.daysCompleted} días</p>
          </div>
        </div>

        {/* Diferencia destacada */}
        {monthStats.totalPlanned > 0 && (
          <div className={`mt-2 sm:mt-3 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 ${
            monthStats.difference >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm font-semibold ${
                monthStats.difference >= 0 ? 'text-green-700' : 'text-orange-700'
              }`}>
                Diferencia
              </span>
              <span className={`text-lg sm:text-xl font-bold ${
                monthStats.difference >= 0 ? 'text-green-800' : 'text-orange-800'
              }`}>
                {monthStats.difference >= 0 ? '+' : ''}{monthStats.difference.toFixed(1)}h
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Calendario ULTRA-OPTIMIZADO para móvil */}
      <div className="card-gradient p-2 sm:p-3">
        {/* Días de la semana - Adaptativos */}
       <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
  {weekDaysMedium.map(day => (
    <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
      {day}
    </div>
  ))}
</div>

        {/* Semanas con días - ADAPTATIVOS */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            {week.map((dayInfo, dayIndex) => (
              <button
                key={dayIndex}
                onClick={() => handleDayClick(dayInfo)}
                disabled={!dayInfo}
                className={`
                  min-h-[60px] xs:min-h-[65px] sm:min-h-[70px]
                  rounded-lg sm:rounded-2xl 
                  transition-all duration-200 
                  flex flex-col items-center justify-center 
                  p-0.5 sm:p-1
                  ${getDayStyle(dayInfo)} 
                  ${dayInfo ? 'cursor-pointer' : ''}
                `}
              >
                {dayInfo && (
                  <>
                    {/* Número del día - Responsive */}
                    <span className="text-base xs:text-lg sm:text-xl font-bold mb-0.5 sm:mb-1">
                      {dayInfo.day}
                    </span>
                    
                    {/* Horas - Responsive y legible */}
                    {(dayInfo.planned || dayInfo.activity) && (
                      <span className="text-[9px] xs:text-[10px] sm:text-xs font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full bg-black bg-opacity-20">
                        {dayInfo.activity 
                          ? `${dayInfo.activity.hours}h` 
                          : `${dayInfo.planned}h`}
                      </span>
                    )}
                    
                    {/* Check para completados */}
                    {dayInfo.isCompleted && (
                      <span className="text-sm xs:text-base sm:text-lg mt-0.5 sm:mt-1">✓</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        ))}

        {/* Leyenda - Compacta en móvil */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] xs:text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-[10px] xs:text-xs">✓</span>
              </div>
              <span className="text-gray-700 font-medium">Completado</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-lg flex-shrink-0"></div>
              <span className="text-gray-700 font-medium">Planeado</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-lg ring-2 ring-yellow-300 flex-shrink-0"></div>
              <span className="text-gray-700 font-medium">Hoy</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-gray-200 rounded-lg flex-shrink-0"></div>
              <span className="text-gray-700 font-medium">Sin plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas - Botones adaptativos */}
      <div className="card-gradient p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          Acciones Rápidas
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {/* Copiar mes anterior */}
          <button
            onClick={handleCopyPreviousMonth}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg text-sm sm:text-base"
          >
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            Copiar Mes Anterior
          </button>

          {/* Toggle plantillas */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg text-sm sm:text-base"
          >
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
            {showTemplates ? 'Ocultar Plantillas' : 'Ver Plantillas'}
          </button>

          {/* Plantillas - GRID adaptativo */}
          {showTemplates && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 animate-fadeIn">
              {templates.map(template => (
                <button
                  key={template.name}
                  onClick={() => handleUseTemplate(template)}
                  className="bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-2 rounded-xl transition-all text-xs sm:text-sm active:scale-95 shadow-md flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xl sm:text-2xl">{template.emoji}</span>
                  <span className="text-[10px] sm:text-xs leading-tight text-center">{template.name}</span>
                  <span className="text-[10px] sm:text-xs opacity-90">{template.hours}h</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de planificación de día - Adaptativo */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowDayModal(false)}
          />
          
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md p-5 sm:p-6 animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Día {selectedDay.day}
              </h3>
              <button
                onClick={() => setShowDayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mb-5 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                {new Date(selectedYear, selectedMonth - 1, selectedDay.day).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {selectedDay.isCompleted && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-green-800 font-semibold flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">✅</span>
                    Día completado: {selectedDay.activity.hours}h registradas
                  </p>
                </div>
              )}

              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                Horas Planeadas
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={plannedHours}
                onChange={(e) => setPlannedHours(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 text-lg sm:text-xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder="0.0"
                autoFocus
                style={{ fontSize: '18px' }}
              />
              <p className="text-[10px] xs:text-xs text-gray-500 mt-2">
                💡 Deja en blanco para quitar la planificación
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowDayModal(false)}
                className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base touch-target"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-target"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
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