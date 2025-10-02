import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string | null;
}

interface AddEditCustomerModalProps {
  customer: Customer | null;
  businessId: string;
  onClose: () => void;
  onSave: () => void;
}

const AddEditCustomerModal: React.FC<AddEditCustomerModalProps> = ({
  customer,
  businessId,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() && !formData.last_name.trim()) {
      setError('Debe ingresar al menos un nombre o apellido');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (customer) {
        const { error } = await supabase
          .from('customers')
          .update({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            notes: formData.notes.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', customer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{
            business_id: businessId,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            notes: formData.notes.trim() || null
          }]);

        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      console.error('Error saving customer:', err);
      setError(err.message || 'Error al guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <h2 className="text-xl font-bold" style={{ color: '#161616' }}>
            {customer ? 'Editar Cliente' : 'Agregar Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'rgb(107, 114, 128)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg border text-sm bg-red-50 border-red-200 text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Nombre
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616'
                }}
                placeholder="Juan"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Apellido
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616'
                }}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              placeholder="Notas adicionales sobre el cliente..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: '#075E54',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#075E54';
                }
              }}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{customer ? 'Guardar Cambios' : 'Agregar Cliente'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCustomerModal;
