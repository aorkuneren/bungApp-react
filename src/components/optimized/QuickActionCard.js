import React, { memo } from 'react';
import { Button } from '../ui';

const QuickActionCard = memo(({ title, subtitle, buttonText, icon: Icon, buttonColor = "bg-gray-900 text-white hover:bg-gray-800", onClick }) => (
  <div className="bg-white text-gray-900 flex flex-col gap-2 rounded-xl border border-gray-200 py-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
      <div className="leading-none font-semibold flex items-center gap-2">
        <Icon className="h-5 w-5" aria-hidden="true" />
        {title}
      </div>
      <div className="text-gray-500 text-sm">
        {subtitle}
      </div>
    </div>
    <div className="px-6">
      <Button 
        onClick={onClick}
        className={`w-full ${buttonColor}`}
      >
        {buttonText}
      </Button>
    </div>
  </div>
));

QuickActionCard.displayName = 'QuickActionCard';

export default QuickActionCard;
