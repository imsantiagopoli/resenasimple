import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, CheckCircle, X, Plus, Trash2, ExternalLink, MapPin, Check, AlertCircle } from 'lucide-react';
import { BusinessBranch } from '../hooks/useBusiness';
import { checkSlugAvailability } from '../lib/supabase';

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
  const [originalSlug, setOriginalSlug] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'create' | 'delete' | 'slug-change';
    branchId?: string;
    branchName?: string;
    branchIndex?: number;
  } | null>(null);
  const [slugAvailability, setSlugAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });
  const [slugCheckTimeout, setSlugCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize branches data
  useEffect(() => {
    if (branches) {
      setBranchesData(branches.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
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
      email: '',
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
    setOriginalSlug(branch.slug || '');

    // Check current slug availability
    if (branch.slug) {
      checkSlug(branch.slug, branch.id);
    }
  };

  const handleSaveBranch = async (index: number) => {
    if (!tempBranchData) return;

    // Validate slug availability before saving
    if (slugAvailability.available === false) {
      showMessage('error', 'El slug no está disponible. Por favor elige otro.');
      return;
    }

    // Check if slug has changed and show warning
    const slugHasChanged = originalSlug && tempBranchData.slug && originalSlug !== tempBranchData.slug;
    if (slugHasChanged) {
      setConfirmAction({
        type: 'slug-change',
        branchName: tempBranchData.name,
        branchIndex: index
      });
      setShowConfirmDialog(true);
      return;
    }

    // If slug hasn't changed, save directly
    await saveBranchData(index);
  };

  const saveBranchData = async (index: number) => {
    if (!tempBranchData) return;

    try {
      const branchToSave = {
        id: tempBranchData.id,
        name: tempBranchData.name,
        address: tempBranchData.address,
        phone: tempBranchData.phone,
        email: tempBranchData.email,
        is_main: tempBranchData.isMain,
        google_maps_link: tempBranchData.googleMapsLink,
        slug: tempBranchData.slug || await generateSlug(tempBranchData.name)
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
      setOriginalSlug('');
      setSlugAvailability({ checking: false, available: null });
      showMessage('success', 'Sucursal guardada correctamente');
    } catch (err: any) {
      console.error('Error saving branch:', err);
      showMessage('error', err.message || 'Error al guardar la sucursal');
    }
  };

  const handleCancelEditBranch = () => {
    setEditingBranchId(null);
    setTempBranchData(null);
    setOriginalSlug('');
    setSlugAvailability({ checking: false, available: null });
  };

  const checkSlug = async (slug: string, branchId: string | null) => {
    if (!slug || slug.trim() === '') {
      setSlugAvailability({ checking: false, available: null });
      return;
    }

    setSlugAvailability({ checking: true, available: null });

    const isAvailable = await checkSlugAvailability(slug, branchId || undefined);
    setSlugAvailability({ checking: false, available: isAvailable });
  };

  const updateBranch = (index: number, field: string, value: string | boolean) => {
    if (tempBranchData) {
      const updated = { ...tempBranchData, [field]: value };

      // Auto-generate slug when name changes
      if (field === 'name' && typeof value === 'string') {
        const generatedSlug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        updated.slug = generatedSlug;

        // Check slug availability with debounce
        if (slugCheckTimeout) clearTimeout(slugCheckTimeout);
        const timeout = setTimeout(() => {
          checkSlug(generatedSlug, updated.id);
        }, 500);
        setSlugCheckTimeout(timeout);
      }

      // Check slug availability when manually editing slug
      if (field === 'slug' && typeof value === 'string') {
        if (slugCheckTimeout) clearTimeout(slugCheckTimeout);
        const timeout = setTimeout(() => {
          checkSlug(value, updated.id);
        }, 500);
        setSlugCheckTimeout(timeout);
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

                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentData.email}
                      onChange={(e) => updateBranch(index, 'email', e.target.value)}
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

                  <div className="space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Link de Google Maps
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={currentData.googleMapsLink}
                        onChange={(e) => updateBranch(index, 'googleMapsLink', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://maps.google.com/..."
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
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                      Slug / URL
                    </label>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={currentData.slug}
                            onChange={(e) => updateBranch(index, 'slug', e.target.value)}
                            disabled={!isEditing}
                            placeholder="sucursal-ejemplo"
                            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
                            style={{
                              borderColor: isEditing && slugAvailability.available === false
                                ? 'rgb(239, 68, 68)'
                                : isEditing && slugAvailability.available === true
                                ? '#075E54'
                                : 'rgb(209, 213, 219)',
                              color: '#161616',
                              backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                            }}
                          />
                          {isEditing && currentData.slug && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              {slugAvailability.checking ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                              ) : slugAvailability.available === true ? (
                                <Check size={16} style={{ color: '#075E54' }} />
                              ) : slugAvailability.available === false ? (
                                <AlertCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                      {isEditing && currentData.slug && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            {slugAvailability.checking ? (
                              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                                Verificando disponibilidad...
                              </p>
                            ) : slugAvailability.available === true ? (
                              <p className="text-xs" style={{ color: '#075E54' }}>
                                ✓ Disponible
                              </p>
                            ) : slugAvailability.available === false ? (
                              <p className="text-xs" style={{ color: 'rgb(239, 68, 68)' }}>
                                ✗ No disponible
                              </p>
                            ) : null}
                          </div>
                          {originalSlug && currentData.slug !== originalSlug && (
                            <div className="bg-amber-50 border border-amber-200 rounded p-2">
                              <div className="flex items-start space-x-2">
                                <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs" style={{ color: '#92400e' }}>
                                  <strong>Advertencia:</strong> Al cambiar el slug, los códigos QR existentes dejarán de funcionar. En caso de haber impreso un PDF, será necesario volverlos a imprimir, ya que se cambió la ruta de la página de votación. 
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {!isEditing && currentData.slug && (
                        <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          {window.location.origin}/v/{currentData.slug}
                        </p>
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
            <div className="flex items-start space-x-3 mb-4">
              {confirmAction?.type === 'slug-change' && (
                <AlertCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#161616' }}>
                  {confirmAction?.type === 'create'
                    ? 'Confirmar Creación'
                    : confirmAction?.type === 'slug-change'
                    ? 'Advertencia: Cambio de URL'
                    : 'Confirmar Eliminación'}
                </h3>

                {confirmAction?.type === 'slug-change' ? (
                  <div className="space-y-3">
                    <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      Estás a punto de cambiar la URL (slug) de la sucursal <strong>"{confirmAction?.branchName}"</strong>.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2" style={{ color: '#92400e' }}>
                        ⚠️ Impacto importante:
                      </p>
                      <ul className="text-sm space-y-1" style={{ color: '#92400e' }}>
                        <li>• Todos los códigos QR impresos dejarán de funcionar</li>
                        <li>• Será necesario reimprimir los códigos QR con la nueva URL</li>
                        <li>• Los enlaces compartidos anteriormente quedarán inválidos</li>
                      </ul>
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#161616' }}>
                      ¿Estás seguro de que deseas continuar?
                    </p>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    {confirmAction?.type === 'create'
                      ? '¿Estás seguro que deseas agregar una nueva sucursal?'
                      : `¿Estás seguro que deseas eliminar la sucursal "${confirmAction?.branchName}"? Esta acción no se puede deshacer.`
                    }
                  </p>
                )}
              </div>
            </div>

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
                onClick={() => {
                  if (confirmAction?.type === 'create') {
                    confirmAddBranch();
                  } else if (confirmAction?.type === 'slug-change') {
                    saveBranchData(confirmAction.branchIndex!);
                    setShowConfirmDialog(false);
                    setConfirmAction(null);
                  } else {
                    confirmRemoveBranch();
                  }
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: confirmAction?.type === 'delete' ? '#ef4444' :
                                  confirmAction?.type === 'slug-change' ? '#d97706' :
                                  '#075E54',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (confirmAction?.type === 'delete') {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  } else if (confirmAction?.type === 'slug-change') {
                    e.currentTarget.style.backgroundColor = '#b45309';
                  } else {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }
                }}
                onMouseLeave={(e) => {
                  if (confirmAction?.type === 'delete') {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                  } else if (confirmAction?.type === 'slug-change') {
                    e.currentTarget.style.backgroundColor = '#d97706';
                  } else {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }
                }}
              >
                {confirmAction?.type === 'create'
                  ? 'Crear Sucursal'
                  : confirmAction?.type === 'slug-change'
                  ? 'Sí, Cambiar URL'
                  : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BranchesSection;