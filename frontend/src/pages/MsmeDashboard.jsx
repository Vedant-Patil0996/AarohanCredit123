import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Home from '../pages/Home';
import Reports from '../pages/Reports';
import { Activity } from 'lucide-react';

export default function MsmeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize theme from localStorage or default to true (dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [user, setUser] = useState({ name: 'Guest', gstin: 'N/A' });

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] font-sans text-white">
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,117,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,117,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* 1. Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="lg:ml-64 min-h-screen flex flex-col">

        {/* 2. Header Component (Includes Sync Button) */}
        <Header
          user={user}
          onSync={handleSync}
          isSyncing={isSyncing}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          showSync={true}
        />

        {/* 3. Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
          {activeTab === 'home' && <Home isDarkMode={isDarkMode} />}
          {activeTab === 'reports' && <Reports isDarkMode={isDarkMode} />}
          {/* Placeholders for other routes */}
          {activeTab !== 'home' && activeTab !== 'reports' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-white/60">
              <div className="w-16 h-16 bg-[#151920] rounded-2xl flex items-center justify-center mb-4 border border-[#00FF75]/20">
                <Activity size={32} className="text-[#00FF75]" />
              </div>
              <h2 className="text-xl font-semibold text-white capitalize">{activeTab} Module</h2>
              <p className="text-sm mt-2 text-white/40">Connecting to backend services...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}