import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { Mail, Sparkles, Award } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const EmailStatsChart = ({ emails = [] }) => {
  if (!emails || emails.length === 0) {
    return null;
  }

  // Count by Type
  const typeCounts = emails.reduce((acc, curr) => {
    acc[curr.emailType] = (acc[curr.emailType] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(typeCounts).map((key) => ({
    name: key,
    count: typeCounts[key],
  }));

  // Count by Tone
  const toneCounts = emails.reduce((acc, curr) => {
    acc[curr.tone] = (acc[curr.tone] || 0) + 1;
    return acc;
  }, {});

  const toneData = Object.keys(toneCounts).map((key) => ({
    name: key,
    value: toneCounts[key],
  }));

  // Find top category
  let topType = 'N/A';
  let maxTypeCount = 0;
  Object.entries(typeCounts).forEach(([k, v]) => {
    if (v > maxTypeCount) {
      maxTypeCount = v;
      topType = k;
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Saved Emails Analytics
          </h3>
          <p className="text-xs text-slate-500">Distribution of your saved drafts across categories and tones</p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Mail className="w-3.5 h-3.5" />
            <span>Total Saved: {emails.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Award className="w-3.5 h-3.5" />
            <span>Top Type: {topType}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Bar chart for Categories */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Emails by Category
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tone Distribution */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Writing Tone Breakdown
          </h4>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toneData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {toneData.map((entry, index) => (
                    <Cell key={`tone-cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStatsChart;
