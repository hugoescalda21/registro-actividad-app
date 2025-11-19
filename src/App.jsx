import React, { useState, useEffect } from 'react';
import StopwatchBanner from './components/StopwatchBanner';
import Header from './components/Header';
import StatsView from './components/StatsView';
import RegisterView from './components/RegisterView';
import HistoryView from './components/HistoryView';
import PlanningView from './components/PlanningView';
import ReturnVisitsView from './components/ReturnVisitsView';
import CongregationOutingsView from './components/CongregationOutingsView';
import SettingsModal from './components/SettingsModal';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';
import { useToast } from './contexts/ToastContext';
import { getMonthYear } from './utils/dateUtils';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState('register');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [publisherType, setPublisherType] = useState('publicador');
  const [activities, setActivities] = useState([]);
  const [showStopwatchWidget, setShowStopwatchWidget] = useState(false);
  const [triggerFormOpen, setTriggerFormOpen] = useState(0);
  const [triggerStopwatchOpen, setTriggerStopwatchOpen] = useState(0);
  const [editingActivity, setEditingActivity] = useState(null);

  // Tipos de publicadores
  const publisherTypes = {
    publicador: {
      label: 'Publicador',
      emoji: '📖',
      hours: 0,
      placements: 0,
      videos: 0,
      returnVisits: 0,
      studies: 0,
      canLogHours: false,
      canLogApproved: false
    },
    auxiliar15: {
      label: 'Precursor Auxiliar (15 hrs)',
      emoji: '⭐',
      hours: 15,
      placements: 0,
      videos: 0,
      returnVisits: 0,
      studies: 0,
      canLogHours: true,
      canLogApproved: false
    },
    auxiliar30: {
      label: 'Precursor Auxiliar (30 hrs)',
      emoji: '🌟',
      hours: 30,
      placements: 0,
      videos: 0,
      returnVisits: 0,
      studies: 0,
      canLogHours: true,
      canLogApproved: false
    },
    regular: {
      label: 'Precursor Regular',
      emoji: '💎',
      hours: 50,
      placements: 15,
      videos: 8,
      returnVisits: 6,
      studies: 2,
      canLogHours: true,
      canLogApproved: true
    },
    especial: {
      label: 'Precursor Especial',
      emoji: '✨',
      hours: 100,
      placements: 20,
      videos: 10,
      returnVisits: 8,
      studies: 3,
      canLogHours: true,
      canLogApproved: true
    }
  };

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedActivities = localStorage.getItem('activities');
    const savedPublisherType = localStorage.getItem('publisherType');

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        showToast('Error al cargar actividades guardadas', 'error');
      }
    }

    if (savedPublisherType) {
      setPublisherType(savedPublisherType);
    }

    // Verificar si hay un cronómetro activo
    const stopwatchState = localStorage.getItem('stopwatchState');
    if (stopwatchState) {
      setShowStopwatchWidget(true);
    }

    // Solicitar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Escuchar cambios en el localStorage para el cronómetro
  useEffect(() => {
    const handleStorageChange = () => {
      const stopwatchState = localStorage.getItem('stopwatchState');
      setShowStopwatchWidget(!!stopwatchState);
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const stopwatchState = localStorage.getItem('stopwatchState');
      setShowStopwatchWidget(!!stopwatchState);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Guardar actividades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  // Guardar tipo de publicador en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('publisherType', publisherType);
  }, [publisherType]);

  // Calcular estadísticas del mes actual usando dateUtils
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthActivities = activities.filter(activity => {
    const { month, year } = getMonthYear(activity.date);
    return month === currentMonth && year === currentYear;
  });

  const stats = {
  // Horas totales = predicación + aprobadas
  totalHours: currentMonthActivities.reduce((sum, act) => {
    const preachingHours = act.hours || 0;
    const approvedHours = act.approvedHours || 0;
    return sum + preachingHours + approvedHours;
  }, 0),
  // Solo horas de predicación (para mostrar por separado si es necesario)
  preachingHours: currentMonthActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
  // Solo horas aprobadas (para mostrar por separado si es necesario)
  approvedHours: currentMonthActivities.reduce((sum, act) => sum + (act.approvedHours || 0), 0),
  totalPlacements: currentMonthActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
  totalVideos: currentMonthActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
  totalReturnVisits: currentMonthActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
  totalStudies: currentMonthActivities.reduce((sum, act) => sum + (act.studies || 0), 0)
};

  // Hook de notificaciones
  const { checkAchievements, checkGoalProgress, checkStreak } = useNotifications(
    activities,
    stats,
    publisherTypes[publisherType]
  );

  const handleSave = (activity) => {
    setActivities([...activities, activity]);
    setEditingActivity(null);
    showToast('✅ Actividad guardada correctamente', 'success');
    
    // Verificar logros después de guardar
    setTimeout(() => {
      checkAchievements();
      checkGoalProgress();
      checkStreak();
    }, 500);
  };

  const handleUpdate = (updatedActivity) => {
    setActivities(activities.map(a => 
      a.id === updatedActivity.id ? updatedActivity : a
    ));
    setEditingActivity(null);
    showToast('✅ Actividad actualizada correctamente', 'success');
    
    // Verificar progreso después de actualizar
    setTimeout(() => {
      checkGoalProgress();
    }, 500);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setCurrentView('register');
    setTimeout(() => {
      setTriggerFormOpen(prev => prev + 1);
    }, 100);
  };

  const handleDelete = (id) => {
    setActivities(activities.filter(a => a.id !== id));
    showToast('🗑️ Actividad eliminada', 'info');
  };

  const handleImport = (importedActivities, importedPublisherType) => {
    if (importedActivities && Array.isArray(importedActivities)) {
      setActivities(importedActivities);
    }
    if (importedPublisherType) {
      setPublisherType(importedPublisherType);
    }
    showToast('📥 Datos importados exitosamente', 'success');
  };

  const handleOpenManualForm = () => {
    setEditingActivity(null);
    setCurrentView('register');
    setTriggerFormOpen(prev => prev + 1);
  };

  const handleOpenStopwatch = () => {
    setEditingActivity(null);
    setCurrentView('register');
    setTriggerStopwatchOpen(prev => prev + 1);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {showStopwatchWidget && <StopwatchBanner />}
      <Header
        publisherType={publisherType}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSettingsClick={() => setShowSettingsModal(true)}
        publisherTypes={publisherTypes}
        stats={stats}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="animate-fadeIn">
          {currentView === 'register' && (
            <RegisterView
              onSave={handleSave}
              onUpdate={handleUpdate}
              config={publisherTypes[publisherType]}
              activities={activities}
              triggerFormOpen={triggerFormOpen}
              triggerStopwatchOpen={triggerStopwatchOpen}
              editingActivity={editingActivity}
              onViewChange={setCurrentView}
            />
          )}

          {currentView === 'stats' && (
            <StatsView
              activities={activities}
              publisherType={publisherType}
              config={publisherTypes[publisherType]}
              publisherTypes={publisherTypes}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              activities={activities}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {currentView === 'planning' && (
            <PlanningView
              activities={activities}
              config={publisherTypes[publisherType]}
            />
          )}

          {currentView === 'returnVisits' && (
            <ReturnVisitsView />
          )}

          {currentView === 'outings' && (
            <CongregationOutingsView />
          )}
        </div>
      </main>

      {/* Bottom Navigation - Solo en móviles */}
      <div className="md:hidden">
        <BottomNav
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewActivity={handleOpenManualForm}
          onStopwatch={handleOpenStopwatch}
          showStopwatch={showStopwatchWidget}
          canUseStopwatch={publisherTypes[publisherType].canLogHours}
        />
      </div>

      {/* FAB - Solo en desktop */}
      <div className="hidden md:block">
        <FloatingActionButton
          onManualClick={handleOpenManualForm}
          onStopwatchClick={handleOpenStopwatch}
          canUseStopwatch={publisherTypes[publisherType].canLogHours}
        />
      </div>

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          publisherType={publisherType}
          onPublisherTypeChange={setPublisherType}
          publisherTypes={publisherTypes}
          activities={activities}
          onImport={handleImport}
        />
      )}
    </div>
  );
}

export default App;