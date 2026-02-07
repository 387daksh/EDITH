import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const radarData = [
  { subject: 'Coding', A: 90 },
  { subject: 'Design', A: 65 },
  { subject: 'Comms', A: 80 },
  { subject: 'Leadership', A: 70 },
  { subject: 'Speed', A: 85 },
  { subject: 'Debug', A: 95 },
];

const activityData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 85, high: true },
  { name: 'Thu', value: 50 },
  { name: 'Fri', value: 30 },
];

const PerformanceView: React.FC = () => {
  return (
    <div className="animate-fadeIn pb-12 space-y-6">
      {/* Top Section: Score & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-card border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Overall Performance Score</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">94.8%</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +2.4%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wide">Top 5% among peers in Technical proficiency</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-primary border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">insights</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6">
              {[
                { label: 'Code Quality', val: 92, color: 'bg-primary', icon: 'code', iconColor: 'text-primary' },
                { label: 'Collaboration', val: 85, color: 'bg-emerald-500', icon: 'group', iconColor: 'text-emerald-500' },
                { label: 'Velocity', val: 78, color: 'bg-teal-500', icon: 'speed', iconColor: 'text-teal-500' },
                { label: 'Compliance', val: 100, color: 'bg-emerald-600', icon: 'verified', iconColor: 'text-emerald-600' },
              ].map((skill) => (
                <div key={skill.label} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-white border border-transparent group-hover:border-gray-100">
                        <span className={`material-symbols-outlined text-[18px] ${skill.iconColor}`}>{skill.icon}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{skill.label}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{skill.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color} rounded-full transition-all duration-1000`} style={{ width: `${skill.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                  <Radar 
                    name="Skills" 
                    dataKey="A" 
                    stroke="#0B3D2E" 
                    fill="#10B981" 
                    fillOpacity={0.15} 
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity Trend Card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest">Activity Trend</h3>
            <span className="text-primary text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">+$1,235 est. value</span>
          </div>
          
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, bottom: 0, left: 0, right: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 8 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {activityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.high ? '#0B3D2E' : '#D1FAE5'} 
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">Peak efficiency: Wed Afternoon</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">library_books</span>
            </div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Module Completion</h4>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-black text-gray-900 tracking-tighter">12</span>
              <span className="text-xs text-gray-400 mb-1.5 font-bold">/ 15 Modules</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-primary to-emerald-500 w-[80%] rounded-full shadow-sm"></div>
            </div>
            <span className="text-[10px] text-primary font-black bg-emerald-50 inline-block px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">Next: System Architecture II</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Personal Report</h4>
          </div>
          <div className="z-10 relative">
            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-primary text-[10px] font-black uppercase tracking-wider">Strong Leader</span>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">Needs Delegation</span>
            </div>
            <button className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-md">View Full Analysis</button>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mb-16 opacity-40"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">diversity_3</span>
            </div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Team Impact</h4>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black text-gray-900 tracking-tighter">914</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black mb-2">+12%</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Interactions this week</p>
            <div className="flex items-end gap-1.5 mt-4 h-12">
              {[40, 60, 30, 80, 50].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-md transition-all duration-500 ${i === 3 ? 'bg-primary shadow-lg' : 'bg-gray-100 group-hover:bg-gray-200'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Assessments Table */}
      <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Assessments</h3>
          <button className="text-[10px] font-black text-primary hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full transition-colors uppercase tracking-widest border border-emerald-100">View All Records</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-5 font-black pl-2">Module Name</th>
                <th className="pb-5 font-black">Date</th>
                <th className="pb-5 font-black">Status</th>
                <th className="pb-5 font-black text-right pr-2">Score</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Advanced Python Structures', date: 'Oct 24, 2023', status: 'Passed', statusType: 'success', score: '98/100', icon: 'terminal' },
                { name: 'Cybersecurity Basics', date: 'Oct 20, 2023', status: 'Passed', statusType: 'success', score: '92/100', icon: 'security' },
                { name: 'Cloud Infrastructure', date: 'In Progress', status: 'Active', statusType: 'warning', score: '--/100', icon: 'cloud' },
              ].map((row, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="py-5 pl-2 font-bold text-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">{row.icon}</span>
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-5 text-gray-500 font-bold text-[11px] uppercase tracking-wider">{row.date}</td>
                  <td className="py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      row.statusType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.statusType === 'success' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-5 text-right font-black text-gray-900 pr-2 font-mono text-base">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;