import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { tabs, type TabItem } from './TabNavigation';
import type { TabType } from '../../types/ui';

export const Breadcrumb: React.FC = () => {
  const { activeTab } = useUIStore();
  
  const getTabInfo = (tabId: TabType) => {
    const tab = tabs.find((t: TabItem) => t.id === tabId);
    return tab ? { label: tab.label, icon: tab.icon } : null;
  };

  const currentTab = getTabInfo(activeTab);

  return (
    <nav className="breadcrumb-modern">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-sm">
          <Home className="w-4 h-4 text-gray-500" />
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Sistema PIC</span>
          {currentTab && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                {currentTab.icon}
                <span className="text-gray-900 font-medium">{currentTab.label}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};