import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { CollegesView } from './components/CollegesView';
import { AttendanceView } from './components/AttendanceView';
import { LeavesView } from './components/LeavesView';
import { ReportsView } from './components/ReportsView';
import { UsersView } from './components/UsersView';
import { PhpSourceView } from './components/PhpSourceView';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { Menu } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden bg-[#0a2540] text-white p-3 px-4 flex items-center justify-between sticky top-0 z-40 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-slate-200 hover:text-white cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/src/assets/images/borana_university_crest_1794424747251.jpg"
            alt="Crest"
            className="w-7 h-7 rounded-full bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold text-xs tracking-tight">BORANA UNIVERSITY</span>
        </div>
        <button
          onClick={() => setShowProjectInfo(true)}
          className="text-[11px] font-bold text-[#c59b27] bg-white/10 px-2 py-1 rounded cursor-pointer"
        >
          Group 3
        </button>
      </div>

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeTab={activeTab}
            onOpenProjectInfo={() => setShowProjectInfo(true)}
            onOpenCodeExplorer={() => setActiveTab('php_source')}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'employees' && <EmployeesView />}
            {activeTab === 'colleges' && <CollegesView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'leaves' && <LeavesView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'php_source' && <PhpSourceView />}
          </main>

          <Footer
            onOpenProjectInfo={() => setShowProjectInfo(true)}
            onOpenCodeExplorer={() => setActiveTab('php_source')}
          />
        </div>
      </div>

      {/* Group 3 Project Information Modal */}
      {showProjectInfo && (
        <ProjectInfoModal onClose={() => setShowProjectInfo(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
