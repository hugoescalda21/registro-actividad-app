import React, { useState, useEffect } from 'react';
import StopwatchBanner from './components/StopwatchBanner';
import Header from './components/Header';
import StatsView from './components/StatsView';
import RegisterView from './components/RegisterView';
import HistoryView from './components/HistoryView';
import PlanningView from './components/PlanningView';
import SettingsModal from './components/SettingsModal';
import StopwatchWidget from './components/StopwatchWidget';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';
import { usePublisher } from './contexts/PublisherContext';
import { useActivitiesManager } from './hooks/useActivitiesManager';
import { useStatsCalculation } from './hooks/useStatsCalculation';
import { useNotifications } from './hooks/useNotifications';
import storage from './services/storage';

function App() {
  // Contextos y hooks personalizados
  const { publisherType, setPublisherType, config, publisherTypes, canLogHours } = usePublisher();
  const {
    activities,
    editingActivity,
    addActivity,
    updateActivity,
    deleteActivity,
    startEditing,
    importActivities
  } = useActivitiesManager();
  const { stats } = useStatsCalculation(activities);

  // Estados locales
  const [currentView, setCurrentView] = useState('register');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStopwatchWidget, setShowStopwatchWidget] = useState(false);
  const [triggerFormOpen, setTriggerFormOpen] = useState(0);
  const [triggerStopwatchOpen, setTriggerStopwatchOpen] = useState(0);

  // Hook de notificaciones
  const { checkAchievements, checkGoalProgress, checkStreak } = useNotifications(
    activities,
    stats,
    config
  );

  // Verificar cronómetro activo al iniciar
  useEffect(() => {
    const stopwatchState = storage.getStopwatchState();
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
      const stopwatchState = storage.getStopwatchState();
      setShowStopwatchWidget(!!stopwatchState);
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      const stopwatchState = storage.getStopwatchState();
      setShowStopwatchWidget(!!stopwatchState);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handlers de actividades
  const handleSave = (activity) => {
    addActivity(activity);

    // Verificar logros después de guardar
    setTimeout(() => {
      checkAchievements();
      checkGoalProgress();
      checkStreak();
    }, 500);
  };

  const handleUpdate = (updatedActivity) => {
    updateActivity(updatedActivity);

    // Verificar progreso después de actualizar
    setTimeout(() => {
      checkGoalProgress();
    }, 500);
  };

  const handleEdit = (activity) => {
    startEditing(activity);
    setCurrentView('register');
    setTimeout(() => {
      setTriggerFormOpen(prev => prev + 1);
    }, 100);
  };

  const handleDelete = (id) => {
    deleteActivity(id);
  };

  const handleImport = (importedActivities, importedPublisherType) => {
    if (importedActivities) {
      importActivities(importedActivities);
    }
    if (importedPublisherType) {
      setPublisherType(importedPublisherType);
    }
  };

  const handleOpenManualForm = () => {
    startEditing(null);
    setCurrentView('register');
    setTriggerFormOpen(prev => prev + 1);
  };

  const handleOpenStopwatch = () => {
    startEditing(null);
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
              config={config}
              activities={activities}
              triggerFormOpen={triggerFormOpen}
              triggerStopwatchOpen={triggerStopwatchOpen}
              editingActivity={editingActivity}
            />
          )}

          {currentView === 'stats' && (
            <StatsView
              activities={activities}
              publisherType={publisherType}
              config={config}
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
              config={config}
            />
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
          canUseStopwatch={canLogHours}
        />
      </div>

      {/* FAB - Solo en desktop */}
      <div className="hidden md:block">
        <FloatingActionButton
          onManualClick={handleOpenManualForm}
          onStopwatchClick={handleOpenStopwatch}
          canUseStopwatch={canLogHours}
        />
      </div>

      {/* Widget flotante del cronómetro */}
      {showStopwatchWidget && (
        <StopwatchWidget onOpen={handleOpenStopwatch} />
      )}

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