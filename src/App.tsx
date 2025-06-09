import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { ProductsTab } from './components/products/ProductsTab';
import { FormulasTab } from './components/formulas/FormulasTab';
import { AdjustmentsTab } from './components/adjustments/AdjustmentsTab';
import { CustomizationTab } from './components/customization/CustomizationTab';
import { BackupTab } from './components/backup/BackupTab';
import { useUIStore } from './stores/uiStore';
import './App.css';

function App() {
  const { activeTab } = useUIStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'productos':
        return <ProductsTab />;
      case 'formulas':
        return <FormulasTab />;
      case 'ajustes':
        return <AdjustmentsTab />;
      case 'personalizacion':
        return <CustomizationTab />;
      case 'backup':
        return <BackupTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-4">
        <Header />
        {/*<StorageStatus /> */}
        <TabNavigation />
        
        <div className="mt-6">
          {renderActiveTab()}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;