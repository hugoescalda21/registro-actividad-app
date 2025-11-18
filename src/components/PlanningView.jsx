import React, { useState, useMemo } from 'react';
import { Copy, Wand2 } from 'lucide-react';
import { getMonthYear } from '../utils/dateUtils';
import { useModal } from '../contexts/ModalContext';
import MonthSelector from './planning/MonthSelector';
import PlanningStats from './planning/PlanningStats';
import CalendarGrid from './planning/CalendarGrid';
import DayPlanModal from './planning/DayPlanModal';
import PlanningTemplates from './planning/PlanningTemplates';

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
      {/* Header con navegación de mes */}
      <div className="card-gradient p-3 sm:p-4">
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      {/* Estadísticas */}
      <PlanningStats stats={monthStats} config={config} />

      {/* Calendario */}
      <CalendarGrid
        calendarDays={calendarDays}
        onDayClick={handleDayClick}
      />

      {/* Acciones rápidas */}
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

          {/* Mostrar plantillas */}
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg text-sm sm:text-base"
          >
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Ver Plantillas
          </button>
        </div>
      </div>

      {/* Modal de planificación de día */}
      {showDayModal && (
        <DayPlanModal
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          plannedHours={plannedHours}
          setPlannedHours={setPlannedHours}
          onClose={() => setShowDayModal(false)}
          onSave={handleSavePlan}
        />
      )}

      {/* Modal de plantillas */}
      {showTemplates && (
        <PlanningTemplates
          onClose={() => setShowTemplates(false)}
          onCopyPrevious={handleCopyPreviousMonth}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </div>
  );
};

export default PlanningView;
