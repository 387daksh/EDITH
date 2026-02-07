
import React from 'react';

const CodeDomainView: React.FC = () => {
  return (
    <div className="h-[calc(100vh-80px)] w-full bg-white overflow-hidden relative animate-fadeIn flex">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none opacity-60"></div>

      {/* Control Pane */}
      <div className="w-80 bg-white border-r border-gray-100 p-10 flex flex-col gap-10 relative z-20 shadow-sm">
        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Architecture Layer</h3>
          <div className="p-6 bg-emerald-50 rounded-[24px] border border-emerald-100">
            <h4 className="text-forest font-bold text-base mb-1">Microservice Mesh</h4>
            <p className="text-emerald-700/80 text-xs leading-relaxed font-medium">Real-time dependency map of system services and event clusters.</p>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Visibility Filters</h3>
          <div className="space-y-3">
            {[
              { label: 'API Services', active: true },
              { label: 'Databases', active: false },
              { label: 'Message Queues', active: false },
              { label: 'Edge Nodes', active: true },
            ].map((filter) => (
              <label key={filter.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                <span className="text-sm font-semibold text-slate-700">{filter.label}</span>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${filter.active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${filter.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full py-4 bg-forest hover:bg-emerald-900 text-white rounded-pill text-xs font-black uppercase tracking-widest shadow-lg transition-all hover:-translate-y-0.5 active:scale-95">
            Export Graph Model
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative flex items-center justify-center p-20 overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
           <path className="graph-connection" d="M 400 300 L 600 450" fill="none" stroke="#10b981" strokeWidth="2" />
           <path className="graph-connection" d="M 600 450 L 850 350" fill="none" stroke="#10b981" strokeWidth="2" />
           <path className="graph-connection" d="M 600 450 L 550 650" fill="none" stroke="#10b981" strokeWidth="2" />
        </svg>

        {/* Central Core */}
        <div className="relative z-10 group cursor-pointer">
          <div className="w-28 h-28 rounded-[32px] bg-white border-4 border-emerald-500 shadow-2xl flex items-center justify-center transition-all hover:scale-105 group">
            <span className="material-symbols-outlined text-emerald-600 text-5xl">dns</span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white"></div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-forest text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Load Balancer (Primary)</div>
        </div>

        {/* Satellites */}
        <div className="absolute left-[30%] top-[35%] flex flex-col items-center gap-3 group cursor-pointer">
          <div className="w-16 h-16 rounded-[20px] bg-emerald-50 border border-emerald-100 shadow-md flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">database</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User DB</span>
        </div>

        <div className="absolute left-[65%] top-[25%] flex flex-col items-center gap-3 group cursor-pointer">
          <div className="w-16 h-16 rounded-[20px] bg-emerald-50 border border-emerald-100 shadow-md flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stripe SDK</span>
        </div>

        <div className="absolute left-[70%] top-[60%] flex flex-col items-center gap-3 group cursor-pointer">
          <div className="w-16 h-16 rounded-[20px] bg-emerald-50 border border-emerald-100 shadow-md flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-2xl">notifications_active</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Webhooks</span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-gray-100">
            <button className="text-slate-400 hover:text-forest transition-colors"><span className="material-symbols-outlined text-[22px]">remove</span></button>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-emerald-500"></div>
            </div>
            <button className="text-slate-400 hover:text-forest transition-colors"><span className="material-symbols-outlined text-[22px]">add</span></button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button className="text-emerald-600 transition-colors"><span className="material-symbols-outlined text-[22px]">center_focus_strong</span></button>
          </div>
        </div>
      </div>

      {/* Mini Inspector Overlay */}
      <div className="absolute top-10 right-10 w-80 bg-white/95 backdrop-blur-xl rounded-[32px] border border-emerald-100 shadow-2xl p-8 z-30 animate-fadeIn">
        <div className="flex gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined">api</span>
            </div>
            <div>
                <h3 className="text-slate-900 font-bold text-lg leading-tight">Auth-GW-v1</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Core Cluster</p>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-700 text-[9px] font-bold uppercase tracking-widest mb-1">Latency</p>
                    <p className="text-forest font-bold text-xl">42ms</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-700 text-[9px] font-bold uppercase tracking-widest mb-1">Health</p>
                    <p className="text-emerald-600 font-bold text-xl">100%</p>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Links</h4>
                {['UserDB-Primary', 'Session-Redis'].map(link => (
                    <div key={link} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:border-emerald-200 cursor-pointer group transition-all">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-pulse"></div>
                        <span className="text-sm font-semibold text-slate-700">{link}</span>
                    </div>
                ))}
            </div>

            <button className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-slate-900 rounded-pill text-xs font-black uppercase tracking-widest transition-all">
                View Source Config
            </button>
        </div>
      </div>
    </div>
  );
};

export default CodeDomainView;
