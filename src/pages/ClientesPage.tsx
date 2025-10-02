import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, Upload, Download, Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AddEditCustomerModal from '../components/customers/AddEditCustomerModal';
import ImportCSVModal from '../components/customers/ImportCSVModal';

interface Customer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ClientesPage: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [user]);

  const loadCustomers = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: businessData } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessData) {
        setLoading(false);
        return;
      }

      setBusinessId(businessData.id);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessData.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error al eliminar el cliente');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsAddEditModalOpen(true);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    await loadCustomers();
    setIsAddEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleImportComplete = async () => {
    await loadCustomers();
    setIsImportModalOpen(false);
  };

  const exportToCSV = () => {
    if (customers.length === 0) {
      alert('No hay clientes para exportar');
      return;
    }

    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Notas'];
    const rows = customers.map(c => [
      c.first_name,
      c.last_name,
      c.email,
      c.phone,
      c.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(query) ||
      customer.last_name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
            Clientes
          </h1>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Gestiona tu base de datos de clientes
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'white',
              color: '#161616',
              border: '1px solid rgb(209, 213, 219)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'white',
              color: '#161616',
              border: '1px solid rgb(209, 213, 219)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Upload size={16} />
            <span>Importar CSV</span>
          </button>

          <button
            onClick={handleAddCustomer}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: '#075E54',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#064e45';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#075E54';
            }}
          >
            <Plus size={16} />
            <span>Agregar Cliente</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: 'rgb(107, 114, 128)' }}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>

        {filteredCustomers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              No se encontraron clientes
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Intenta con otra búsqueda
            </p>
          </div>
        )}

        {filteredCustomers.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
              No hay clientes aún
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
              Comienza agregando tu primer cliente o importa desde un CSV
            </p>
            <button
              onClick={handleAddCustomer}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: '#075E54',
                color: 'white'
              }}
            >
              <Plus size={16} />
              <span>Agregar Primer Cliente</span>
            </button>
          </div>
        )}

        {filteredCustomers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(107, 114, 128)' }}>
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(107, 114, 128)' }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(107, 114, 128)' }}>
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(107, 114, 128)' }}>
                    Notas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(107, 114, 128)' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y" style={{ borderColor: 'rgb(229, 231, 235)' }}>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: '#161616' }}>
                        {customer.first_name} {customer.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm line-clamp-2" style={{ color: 'rgb(107, 114, 128)' }}>
                        {customer.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-1.5 rounded transition-colors duration-200"
                          style={{ color: '#075E54' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-1.5 rounded transition-colors duration-200"
                          style={{ color: 'rgb(239, 68, 68)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddEditModalOpen && businessId && (
        <AddEditCustomerModal
          customer={selectedCustomer}
          businessId={businessId}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />
      )}

      {isImportModalOpen && businessId && (
        <ImportCSVModal
          businessId={businessId}
          onClose={() => setIsImportModalOpen(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
};

export default ClientesPage;
