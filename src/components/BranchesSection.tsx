import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, CheckCircle, X, Plus, Trash2, ExternalLink, MapPin } from 'lucide-react';
import { BusinessBranch } from '../hooks/useBusiness';

interface BranchesSectionProps {
  branches: BusinessBranch[];
  upsertBranch: (branch: Partial<BusinessBranch>) => Promise<{ data: any; error: string | null }>;
  deleteBranch: (branchId: string) => Promise<{ error: string | null }>;
  generateSlug: (name: string) => string;
  showMessage: (type: 'success' | 'error', text: string) => void;
}

const BranchesSection: React.FC<BranchesSectionProps> = ({
  branches,
  upsertBranch,
  deleteBranch,
  generateSlug,
  showMessage
}) => {
  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [tempBranchData, setTempBranchData] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'create' | 'delete';
    branchId?: string;
    branchName?: string;
  } | null>(null);

  // Initialize branches data
  useEffect(() => {
    if (branches) {
      setBranchesData(branches.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        isMain: branch.is_main,
        googleMapsLink: branch.google_maps_link || '',
        slug: branch.slug
      })));
    }
  }, [branches]);

  const handleAddBranch = () => {
    setConfirmAction({ type: 'create' });
    setShowConfirmDialog(true);
  };

  const confirmAddBranch = () => {
    const newBranch = {
      id: null, // null for new branches
      name: 'Nueva Sucursal',
      address: '',
      phone: '',
      isMain: false,
      googleMapsLink: '',
      slug: ''
    };
    setBranchesData([...branchesData, newBranch]);
    setShowConfirmDialog(false);
    setConfirmAction(null);
    // Automatically start editing the new branch
    setTimeout(() => {
      setEditingBranchId('new-' + Date.now());
      setTempBranchData(newBranch);
    }, 100);
  };

  const handleRemoveBranch = (index: number, branchName: string) => {
    setConfirmAction({ 
      type: 'delete', 
      branchId: index.toString(), 
      branchName 
    });
    setShowConfirmDialog(true);
  };

  const confirmRemoveBranch = async () => {
    if (!confirmAction || confirmAction.type !== 'delete') return;
    
    const index = parseInt(confirmAction.branchId!);
    const branch = branchesData[index];
    
    if (branch.id) {
      // Delete from database
      const { error } = await deleteBranch(branch.id);
      if (error) {
        showMessage('error', error);
        setShowConfirmDialog(false);
        setConfirmAction(null);
        return;
      }
    }
    
    // Remove from local state
    setBranchesData(branchesData.filter((_, i) => i !== index));
    setShowConfirmDialog(false);
    setConfirmAction(null);
    showMessage('success', 'Sucursal eliminada correctamente');
  };

  const handleEditBranch = (index: number) => {
    const branch = branchesData[index];
    setEditingBranchId(branch.id || `new-${index}`);
    setTempBranchData({ ...branch });
  };

  const handleSaveBranch = async (index: number) => {
    if (!tempBranchData) return;

    try {
      const branchToSave = {
        id: tempBranchData.id,
        name: tempBranchData.name,
        address: tempBranchData.address,
        phone: tempBranchData.phone,
        is_main: tempBranchData.isMain,
        google_maps_link: tempBranchData.googleMapsLink,
        slug: tempBranchData.slug || generateSlug(tempBranchData.name)
      };
      
      const { error } = await upsertBranch(branchToSave);
      if (error) {
        throw new Error(error);
      }

      // Update local state
      const updatedBranches = [...branchesData];
      updatedBranches[index] = tempBranchData;
      setBranchesData(updatedBranches);
      
      setEditingBranchId(null);
      setTempBranchData(null);
      showMessage('success', 'Sucursal guardada correctamente');
    } catch (err: any) {
      console.error('Error saving branch:', err);
      showMessage('error', err.message || 'Error al guardar la sucursal');
    }
  };

  const handleCancelEditBranch = () => {
    setEditingBranchId(null);
    setTempBranchData(null);
  };

  const updateBranch = (index: number, field: string, value: string | boolean) => {
    if (tempBranchData) {
      const updated = { ...tempBranchData, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name' && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }
      
      setTempBranchData(updated);
    }
  };

  return (
    <>
      {/* Branches */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Sucursales
          </h2>
          <button
            onClick={handleAddBranch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: '#075E54' + '20',
              color: '#075E54',
              border: '1px solid #075E54' + '30'
            }}
          >
            <Plus size={14} />
            <span>Agregar Sucursal</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {branchesData.map((branch, index) => {
            const branchId = branch.id || `new-${index}`;
            const isEditing = editingBranchId === branchId;
            const currentData = isEditing ? tempBranchData : branch;
            
            return (
              <div 
                key={branchId}
                className="p-4 rounded-lg border transition-all duration-200"
                style={{ 
                  borderColor: 'rgb(229, 231, 235)',
                  backgroundColor: 'rgb(249, 250, 251)'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentData.isMain ? '#075E54' : 'rgb(107, 114, 128)' }}
                    >
                      <Building2 size={16} style={{ color: 'white' }} />
                    </div>
                    {currentData.isMain && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: '#075E54' + '20',
                          color: '#075E54'
                        }}
                      >
                        Principal
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveBranch(index)}
                          className="p-1.5 rounded transition-colors duration-200"
                          style={{ 
                            backgroundColor: '#075E54',
                            color: 'white'
                          }}
                          title="Guardar sucursal"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={handleCancelEditBranch}
                          className="p-1.5 rounded transition-colors duration-200"
                          style={{ 
                            backgroundColor: 'rgb(239, 68, 68)',
                            color: 'white'
                          }}
                          title="Cancelar edición"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditBranch(index)}
                        className="p-1.5 rounded transition-colors duration-200"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                          e.currentTarget.style.color = '#075E54';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgb(107, 114, 128)';
                        }}
                        title="Editar sucursal"
                      >
                        <MapPin size={16} />
                      </button>
                    )}
                    
                    {!currentData.isMain && (
                      <button
                        onClick={() => handleRemoveBranch(index, currentData.name)}
                        className="p-1.5 rounded transition-colors duration-200"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                          e.currentTarget.style.color = 'rgb(239, 68, 68)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgb(107, 114, 128)';
                        }}
                        title="Eliminar sucursal"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={currentData.name}
                      onChange={(e) => updateBranch(index, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                      }}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={currentData.address}
                      onChange={(e) => updateBranch(index, 'address', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                      }}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Link de Google Maps
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={currentData.googleMapsLink}
                        onChange={(e) => updateBranch(index, 'googleMapsLink', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://maps.google.com/place/..."
                        className="flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{
                          borderColor: 'rgb(209, 213, 219)',
                          color: '#161616',
                          backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                        }}
                      />
                      
                      {!isEditing && currentData.googleMapsLink && (
                        <a 
                          href={currentData.googleMapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{ color: 'rgb(107, 114, 128)' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
              {confirmAction?.type === 'create' ? 'Confirmar Creación' : 'Confirmar Eliminación'}
            </h3>
            
            <p className="text-sm mb-6" style={{ color: 'rgb(107, 114, 128)' }}>
              {confirmAction?.type === 'create' 
                ? '¿Estás seguro que deseas agregar una nueva sucursal?' 
                : `¿Estás seguro que deseas eliminar la sucursal "${confirmAction?.branchName}"? Esta acción no se puede deshacer.`
              }
            </p>
            
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616'
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
                onClick={confirmAction?.type === 'create' ? confirmAddBranch : confirmRemoveBranch}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: confirmAction?.type === 'create' ? '#075E54' : '#ef4444',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (confirmAction?.type === 'create') {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  } else {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (confirmAction?.type === 'create') {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  } else {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                  }
                }}
              >
                {confirmAction?.type === 'create' ? 'Crear Sucursal' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BranchesSection;