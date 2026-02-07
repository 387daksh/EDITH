
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const coreDomains = [
    { label: 'Code Domain', icon: 'code', view: 'CodeDomain' as ViewType },
    { label: 'HR & People', icon: 'people', view: 'HRDomain' as ViewType },
    { label: 'Ask EDITH', icon: 'question_answer', view: 'AskEdith' as ViewType },
    { label: 'Performance', icon: 'trending_up', view: 'Performance' as ViewType },
    { label: 'Show Work', icon: 'visibility', view: 'ShowWork' as ViewType },
  ];

  const systemItems = [
    { label: 'Settings', icon: 'settings', view: 'Settings' as ViewType },
    { label: 'Notifications', icon: 'notifications', badge: true, view: 'Notifications' as ViewType },
    { label: 'Help Center', icon: 'help_outline', view: 'HelpCenter' as ViewType },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 flex flex-col h-full shrink-0 relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveView('AskEdith')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-lg">memory</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">EDITH</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Core Domains</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('Dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-pill transition-all ${
                activeView === 'Dashboard' 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'text-gray-600 hover:bg-white hover:shadow-card group'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeView === 'Dashboard' ? 'text-white' : 'group-hover:text-primary'}`}>dashboard</span>
              <span className={`text-sm ${activeView === 'Dashboard' ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
            </button>
            {coreDomains.map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-pill transition-all ${
                  activeView === item.view 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-gray-600 hover:bg-white hover:shadow-card group'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeView === item.view ? 'text-white' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${activeView === item.view ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">System</h3>
          <nav className="space-y-1">
            {systemItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-pill transition-all relative ${
                  activeView === item.view 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-gray-600 hover:bg-white hover:shadow-card group'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeView === item.view ? 'text-white' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${activeView === item.view ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                {item.badge && activeView !== item.view && <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div 
          onClick={() => setActiveView('Settings')}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
        >
          <img 
            alt="User Avatar" 
            className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white shadow-inner" 
            src="https://picsum.photos/seed/edith-user/40/40" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Alex Developer</p>
            <p className="text-xs text-gray-500 truncate">Senior Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
