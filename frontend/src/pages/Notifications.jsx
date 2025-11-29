import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'Health Analysis ready',
    message: 'Behavioral cashflow summary stored for report HA-MSME002-...',
    type: 'success',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Document reminder',
    message: 'Upload Oct GST filing to move APP-2025-09-008 to approval.',
    type: 'warning',
    time: 'Yesterday',
  },
  {
    id: 3,
    title: 'New lender match',
    message: 'FinServe NBFC added Invoice AI product for AA-compliant MSMEs.',
    type: 'info',
    time: '3 days ago',
  },
];

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6 flex items-center gap-4">
        <Bell className="w-10 h-10 text-[#00FF75]" />
        <div>
          <p className="text-white font-semibold text-lg">Real-time alerts</p>
          <p className="text-white/60 text-sm">Every alert is tied back to your latest sync or loan workflow.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => {
          const Icon = ICONS[item.type] || Info;
          return (
            <div
              key={item.id}
              className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#00FF75]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-white/60 text-sm">{item.message}</p>
              </div>
              <span className="text-white/40 text-xs">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;

