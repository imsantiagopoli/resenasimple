import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Upload, 
  File, 
  FileText, 
  Image, 
  FileArchive,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    priority: 'medium'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: '', label: 'Select category...' },
    { value: 'tax-forms', label: 'Tax Forms' },
    { value: 'legal-docs', label: 'Legal Documents' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'financial', label: 'Financial Records' },
    { value: 'hr', label: 'HR Documents' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'rgb(107, 114, 128)' },
    { value: 'medium', label: 'Medium Priority', color: 'rgb(245, 158, 11)' },
    { value: 'high', label: 'High Priority', color: 'rgb(239, 68, 68)' }
  ];

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return Image;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    if (fileType.includes('zip') || fileType.includes('rar')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id) {
            const newProgress = f.progress + Math.random() * 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'completed' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const uploadData = {
      ...formData,
      files: uploadedFiles.filter(f => f.status === 'completed')
    };
    
    onUpload(uploadData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: '',
      priority: 'medium'
    });
    setUploadedFiles([]);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  // Use createPortal to render the modal at the root level to avoid z-index conflicts
  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#161616' }}>
            Upload Documents
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'rgb(107, 114, 128)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Files
            </label>
            
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                dragActive ? 'border-opacity-100 bg-opacity-10' : 'border-opacity-30'
              }`}
              style={{
                borderColor: dragActive ? '#6e54dc' : 'rgb(209, 213, 219)',
                backgroundColor: dragActive ? '#6e54dc' : 'transparent'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.zip"
                className="hidden"
              />
              
              <div className="space-y-4">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto flex items-center justify-center"
                  style={{ backgroundColor: dragActive ? 'rgba(255, 255, 255, 0.2)' : 'rgb(243, 244, 246)' }}
                >
                  <Upload 
                    size={32} 
                    style={{ color: dragActive ? 'white' : 'rgb(107, 114, 128)' }}
                  />
                </div>
                
                <div>
                  <p 
                    className="text-lg font-medium mb-2"
                    style={{ color: dragActive ? 'white' : '#161616' }}
                  >
                    {dragActive ? 'Drop files here' : 'Drag and drop files here'}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: dragActive ? 'rgba(255, 255, 255, 0.8)' : 'rgb(107, 114, 128)' }}
                  >
                    or click to browse your computer
                  </p>
                </div>
                
                <div 
                  className="text-xs"
                  style={{ color: dragActive ? 'rgba(255, 255, 255, 0.6)' : 'rgb(156, 163, 175)' }}
                >
                  Supported formats: PDF, DOC, DOCX, XLSX, XLS, PNG, JPG, ZIP (Max 10MB each)
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium" style={{ color: '#161616' }}>
                  Files ({uploadedFiles.length})
                </p>
                
                <div className="space-y-2">
                  {uploadedFiles.map((uploadedFile) => {
                    const FileIcon = getFileIcon(uploadedFile.type);
                    
                    return (
                      <div
                        key={uploadedFile.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border"
                        style={{ 
                          backgroundColor: 'rgb(249, 250, 251)',
                          borderColor: 'rgb(229, 231, 235)'
                        }}
                      >
                        {/* File Icon */}
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: 'rgb(243, 244, 246)' }}
                        >
                          <FileIcon size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#161616' }}>
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                            {uploadedFile.size}
                          </p>
                          
                          {/* Progress Bar */}
                          {uploadedFile.status === 'uploading' && (
                            <div className="mt-2">
                              <div 
                                className="h-1 rounded-full"
                                style={{ backgroundColor: 'rgb(229, 231, 235)' }}
                              >
                                <div
                                  className="h-1 rounded-full transition-all duration-200"
                                  style={{
                                    backgroundColor: '#6e54dc',
                                    width: `${uploadedFile.progress}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {uploadedFile.status === 'uploading' && (
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" style={{ color: '#6e54dc' }} />
                          )}
                          {uploadedFile.status === 'completed' && (
                            <CheckCircle size={16} style={{ color: 'rgb(34, 197, 94)' }} />
                          )}
                          {uploadedFile.status === 'error' && (
                            <AlertCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
                          )}
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="p-1 rounded transition-colors duration-200 flex-shrink-0"
                          style={{ color: 'rgb(107, 114, 128)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                            e.currentTarget.style.color = 'rgb(239, 68, 68)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'rgb(107, 114, 128)';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="title" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Document Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Enter document title..."
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Enter tags separated by commas..."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-sm font-medium" style={{ color: '#161616' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="Add a description for this document..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadedFiles.filter(f => f.status === 'completed').length === 0}
              className="px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: uploadedFiles.filter(f => f.status === 'completed').length > 0 ? '#6e54dc' : 'rgb(156, 163, 175)',
                borderColor: uploadedFiles.filter(f => f.status === 'completed').length > 0 ? '#6e54dc' : 'rgb(156, 163, 175)',
                color: 'white'
              }}
            >
              Upload {uploadedFiles.filter(f => f.status === 'completed').length} Document{uploadedFiles.filter(f => f.status === 'completed').length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // Render the modal directly to document.body to avoid stacking context issues
  );
};

export default UploadDocumentModal;