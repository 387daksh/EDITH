
import React, { useState } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import DashboardView from './components/DashboardView';
import CodeDomainView from './components/CodeDomainView';
import PerformanceView from './components/PerformanceView';
import ShowWorkView from './components/ShowWorkView';
import AskEdithView from './components/AskEdithView';
import HRDomainView from './components/HRDomainView';
import SettingsView from './components/SettingsView';
import NotificationsView from './components/NotificationsView';
import HelpCenterView from './components/HelpCenterView';
import ProjectsView from './components/ProjectsView';
import AnalyticsView from './components/AnalyticsView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard': return <DashboardView />;
      case 'CodeDomain': return <CodeDomainView />;
      case 'Performance': return <PerformanceView />;
      case 'ShowWork': return <ShowWorkView />;
      case 'AskEdith': return <AskEdithView />;
      case 'HRDomain': return <HRDomainView />;
      case 'Settings': return <SettingsView />;
      case 'Notifications': return <NotificationsView />;
      case 'HelpCenter': return <HelpCenterView />;
      case 'Projects': return <ProjectsView />;
      case 'Analytics': return <AnalyticsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAF9] font-sans text-slate-900 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
