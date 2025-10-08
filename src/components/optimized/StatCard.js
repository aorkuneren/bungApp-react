import React, { memo } from 'react';

const StatCard = memo(({ title, value, icon: Icon, subtitle }) => (
  <div className="bg-white text-gray-900 flex flex-col gap-2 rounded-xl border border-gray-200 py-6 shadow-sm">
    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
    <div className="px-6">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;
