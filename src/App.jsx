import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatsView } from './components/StatsView';
import { RegisterView } from './components/RegisterView';
import { SettingsModal } from './components/SettingsModal';
import { ActivityModal } from './components/ActivityModal';
import { MonthSelector } from './components/MonthSelector';
import { useActivities } from './hooks/useActivities';
import { useStats } from './hooks/useStats';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { publisherTypes } from './utils/constants';

function App() {
  const now = new Date();
  const [currentView, setCurrentView] = useState('register');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [publisherType, setPublisherType] = useLocalStorage('publisherType', 'publicador');
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const { isDark, toggleTheme } = useTheme();
  const { requestPermission, scheduleNotification } = useNotifications();
  
  const {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getSortedActivities,
    editingId,
    setEditingId
  } = useActivities();

  const stats = useStats(activities, publisherType, selectedMonth, selectedYear);
  const config = publisherTypes[publisherType];

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleNewActivity = () => {
    setEditingId(null);
    setShowActivityModal(true);
  };

  const handleEditActivity = (activity) => {
    setEditingId(activity.id);
    setShowActivityModal(true);
  };

  const handleSubmitActivity = (formData) => {
    if (editingId) {
      updateActivity(editingId, formData);
    } else {
      addActivity(formData);
      // Programar notificación para mañana
      scheduleNotification();
    }
    setShowActivityModal(false);
    setEditingId(null);
  };

  const handleCloseActivityModal = () => {
    setShowActivityModal(false);
    setEditingId(null);
  };

  const editingActivity = editingId 
    ? activities.find(a => a.id === editingId) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        publisherType={publisherType}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSettingsClick={() => setShowSettingsModal(true)}
        publisherTypes={publisherTypes}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
        />

        {currentView === 'stats' ? (
          <StatsView
            stats={stats}
            config={config}
            activities={activities}
            publisherType={publisherType}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        ) : (
          <RegisterView
            stats={stats}
            config={config}
            sortedActivities={getSortedActivities()}
            onNewActivity={handleNewActivity}
            onEdit={handleEditActivity}
            onDelete={deleteActivity}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        )}
      </div>

      <ActivityModal
        show={showActivityModal}
        onClose={handleCloseActivityModal}
        onSubmit={handleSubmitActivity}
        editingActivity={editingActivity}
        config={config}
      />

     <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        publisherType={publisherType}
        onPublisherTypeChange={setPublisherType}
        publisherTypes={publisherTypes}
        activities={activities}
        setActivities={setActivities}
        isDark={isDark}
        toggleTheme={toggleTheme}
        requestNotificationPermission={requestPermission}
      />
    </div>
  );
}

export default App;