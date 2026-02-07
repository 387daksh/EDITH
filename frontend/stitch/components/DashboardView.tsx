import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

const commitData = [
  { name: 'M', value: 45 },
  { name: 'T', value: 58 },
  { name: 'W', value: 84 },
  { name: 'T', value: 61 },
  { name: 'F', value: 73 },
];

const DashboardView: React.FC = () => {
  return (
    <div className="animate-fadeIn pb-12">
      {/* Top Grid: Onboarding and Commits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden group shadow-card border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D2E] to-[#14533E] z-0"></div>
          <div className="absolute inset-0 opacity-10 z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-emerald-100 text-sm font-semibold mb-1 uppercase tracking-wide">Technical Onboarding</h2>
                <div className="text-4xl font-bold mb-2 tracking-tight">85% Complete</div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                  </span>
                  <span className="text-emerald-100/80 text-xs font-medium">Since last week</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all text-white">
                <span className="material-symbols-outlined">bar_chart</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div className="space-y-5">
                {[
                  { label: 'System Design', val: 80, count: '12/15', icon: 'architecture', color: 'bg-emerald-400' },
                  { label: 'Security Protocol', val: 45, count: '8/18', icon: 'security', color: 'bg-teal-300' },
                  { label: 'API Integration', val: 92, count: '15/16', icon: 'api', color: 'bg-white' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2 text-emerald-100">
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-white font-mono text-xs">{item.count}</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full ${item.label === 'System Design' ? 'shadow-[0_0_10px_rgba(52,211,153,0.5)]' : ''}`} 
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative h-40 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 p-4 overflow-hidden">
                <svg className="w-full h-full opacity-40 stroke-emerald-200 stroke-[0.5] fill-none" viewBox="0 0 100 100">
                  <polygon points="50,10 90,35 90,75 50,100 10,75 10,35"></polygon>
                  <polygon points="50,25 75,40 75,65 50,80 25,65 25,40"></polygon>
                  <line x1="50" x2="50" y1="50" y2="10"></line>
                  <line x1="50" x2="90" y1="50" y2="35"></line>
                  <line x1="50" x2="90" y1="50" y2="75"></line>
                  <line x1="50" x2="50" y1="50" y2="100"></line>
                  <line x1="50" x2="10" y1="50" y2="75"></line>
                  <line x1="50" x2="10" y1="50" y2="35"></line>
                </svg>
                <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100">
                  <polygon className="fill-emerald-400/20 stroke-emerald-300 stroke-[1.5]" points="50,20 80,45 65,80 50,70 30,65 30,40"></polygon>
                  {[
                    [50, 20], [80, 45], [65, 80], [50, 70], [30, 65], [30, 40]
                  ].map(([cx, cy], i) => (
                    <circle key={i} className="fill-white" cx={cx} cy={cy} r="2.5"></circle>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Commits Chart Card */}
        <div className="bg-surface rounded-2xl p-6 flex flex-col border border-gray-100 shadow-sm overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-900 font-bold text-lg">Commits</h3>
            <span className="text-emerald-600 bg-emerald-50 text-xs font-bold px-2 py-1 rounded-full">+1,235</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commitData} margin={{ top: 10, bottom: 0, left: 0, right: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#e5e7eb', radius: 4 }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
                  {commitData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'W' ? '#0B3D2E' : '#D1D5DB'} 
                      className="transition-all duration-300 cursor-pointer hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Grid: Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { 
            title: 'Repositories', 
            val: '24', 
            change: '+3 New', 
            sub: 'this month', 
            icon: 'folder_copy', 
            color: 'text-emerald-600',
            badgeBg: 'bg-emerald-100 text-emerald-700',
            chartColor: 'bg-emerald-500',
            data: [40, 60, 80, 50, 70]
          },
          { 
            title: 'Active Bugs', 
            val: '12', 
            change: '-2 Resolved', 
            sub: 'today', 
            icon: 'bug_report', 
            color: 'text-rose-500',
            badgeBg: 'bg-rose-100 text-rose-700',
            chartColor: 'bg-rose-400',
            data: [30, 40, 20, 60, 40]
          },
          { 
            title: 'Contributors', 
            val: '84', 
            change: '+5 New', 
            sub: 'this week', 
            icon: 'group_add', 
            color: 'text-blue-500',
            badgeBg: 'bg-blue-100 text-blue-700',
            chartColor: 'bg-blue-500',
            data: [50, 90, 60, 40, 70]
          },
        ].map((card) => (
          <div key={card.title} className="bg-surface rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
              </div>
              <h3 className="text-gray-900 font-semibold">{card.title}</h3>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.val}</div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className={`${card.badgeBg} px-2 py-0.5 rounded-full font-bold`}>{card.change}</span>
                <span className="text-gray-400">{card.sub}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-1 h-12 items-end opacity-80">
              {card.data.map((h, i) => (
                <div 
                  key={i} 
                  className={`w-1/5 rounded-t transition-all duration-500 ${i === 2 && card.title === 'Repositories' || i === 3 && card.title === 'Active Bugs' || i === 1 && card.title === 'Contributors' ? card.chartColor : 'bg-gray-200'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Architecture Updates */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Architecture Updates</h3>
          <button className="text-sm font-semibold text-primary hover:text-emerald-700 transition-colors">View All</button>
        </div>
        <div className="bg-surface rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 uppercase text-xs tracking-wider">Module Name</th>
                <th className="px-6 py-4 font-semibold text-gray-900 uppercase text-xs tracking-wider">Owner</th>
                <th className="px-6 py-4 font-semibold text-gray-900 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-900 uppercase text-xs tracking-wider text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[
                { name: 'Authentication Service', icon: 'dns', color: 'bg-emerald-50 text-primary border-emerald-100', status: 'Live', statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', time: '2h ago', users: ['A', 'B'] },
                { name: 'Payment Gateway', icon: 'schema', color: 'bg-orange-50 text-orange-600 border-orange-100', status: 'In Review', statusColor: 'bg-orange-100 text-orange-800 border-orange-200', time: '5h ago', users: ['C'] },
                { name: 'User Data Pipeline', icon: 'cloud_queue', color: 'bg-blue-50 text-blue-600 border-blue-100', status: 'Testing', statusColor: 'bg-blue-100 text-blue-800 border-blue-200', time: '1d ago', users: ['D', 'E', 'F'] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${row.color}`}>
                      <span className="material-symbols-outlined text-sm">{row.icon}</span>
                    </div>
                    {row.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {row.users.map((u, idx) => (
                        <img key={idx} alt="" className="w-7 h-7 rounded-full border-2 border-white bg-gray-200" src={`https://picsum.photos/seed/user-${u}/28/28`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;