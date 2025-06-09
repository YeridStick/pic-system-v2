import React from 'react';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';
import { Breadcrumb } from './Breadcrumb';
import { StorageStatus } from '../common/StorageStatus';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <StorageStatus />
      <TabNavigation />
      <Breadcrumb />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl min-h-[70vh] p-8">
          {children}
        </div>
      </main>
    </div>
  );
};