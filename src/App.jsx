import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsView from './components/StatsView';
import RegisterView from './components/RegisterView';
import HistoryView from './components/HistoryView';
import SettingsModal from './components/SettingsModal';
import StopwatchWidget from './components/StopwatchWidget';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';

function App() {
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
    
    // Verificar cada segundo si hay cambios
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

  // Calcular estadísticas del mes actual
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() + 1 === currentMonth && 
           activityDate.getFullYear() === currentYear;
  });

  const stats = {
    totalHours: currentMonthActivities.reduce((sum, act) => sum + (act.hours || 0), 0),
    totalPlacements: currentMonthActivities.reduce((sum, act) => sum + (act.placements || 0), 0),
    totalVideos: currentMonthActivities.reduce((sum, act) => sum + (act.videos || 0), 0),
    totalReturnVisits: currentMonthActivities.reduce((sum, act) => sum + (act.returnVisits || 0), 0),
    totalStudies: currentMonthActivities.reduce((sum, act) => sum + (act.studies || 0), 0)
  };

  const handleSave = (activity) => {
    setActivities([...activities, activity]);
    setEditingActivity(null);
  };

  const handleUpdate = (updatedActivity) => {
    setActivities(activities.map(a => 
      a.id === updatedActivity.id ? updatedActivity : a
    ));
    setEditingActivity(null);
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
  };

  const handleImport = (importedActivities, importedPublisherType) => {
    if (importedActivities && Array.isArray(importedActivities)) {
      setActivities(importedActivities);
    }
    if (importedPublisherType) {
      setPublisherType(importedPublisherType);
    }
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