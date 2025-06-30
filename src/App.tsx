import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { ProductsTab } from './components/products/ProductsTab';
import { FormulasTab } from './components/formulas/FormulasTab';
import { AdjustmentsTab } from './components/adjustments/AdjustmentsTab';
import { CustomizationTab } from './components/customization/CustomizationTab';
import { BackupTab } from './components/backup/BackupTab';
import { useUIStore } from './stores/uiStore';
import { ModalWrapper } from './components/common/ModalWrapper';
import ApiIntegrationTab from './components/integration/ApiIntegrationTab';
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
      <ModalWrapper
        title="Integración con API Externa"
        description="Conecta tu sistema a cualquier API y mapea los datos para importar productos."
        icon={<svg className="w-7 h-7 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12m-5 4v-4m0 0H7m5 0h5" /></svg>}
        modalType="api_integration"
        maxWidthClass="max-w-3xl"
      >
        <ApiIntegrationTab />
      </ModalWrapper>
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