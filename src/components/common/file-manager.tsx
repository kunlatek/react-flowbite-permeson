import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "flowbite-react";
import { HiTrash, HiPlus, HiX } from "react-icons/hi";
import { KuSpinner, KuCard } from "@/components/ku-components";
import { FileModal } from "./file-modal";

export interface IFileItem {
  name: string;
  url: string;
}

interface FileManagerProps {
  files: IFileItem[];
  onFilesChange: (files: IFileItem[]) => void;
  onFilesSelect?: (files: File[]) => void;
  onFilesUpload?: (files: File[]) => Promise<void>;
  isUploading?: boolean;
  disabled?: boolean;
  label?: string;
  accept?: string;
  maxFiles?: number;
  showPreview?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export const FileManager = ({
  files,
  onFilesChange,
  onFilesSelect,
  onFilesUpload,
  isUploading = false,
  disabled = false,
  label,
  accept = "*/*",
  maxFiles,
  showPreview = true,
  emptyMessage,
  emptySubMessage
}: FileManagerProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [currentFileType, setCurrentFileType] = useState<'existing' | 'selected'>('existing');
  const [isLoadingClipboard, setIsLoadingClipboard] = useState(false);
  const [isWaitingForPaste, setIsWaitingForPaste] = useState(false);
  const pasteHandlerRef = useRef<((event: ClipboardEvent) => void) | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;

    // Apply max files limit if specified
    const filesToAdd = maxFiles ? newFiles.slice(0, maxFiles - files.length) : newFiles;
    
    setSelectedFiles(filesToAdd);
    
    // Create preview URLs for images
    const urls = filesToAdd.map(file => {
      if (showPreview && file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviewUrls(urls);

    // Call onFilesSelect if provided
    if (onFilesSelect) {
      onFilesSelect(filesToAdd);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    if (onFilesUpload) {
      try {
        await onFilesUpload(selectedFiles);
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleFileSelection = () => {
    if (onFilesSelect) {
      onFilesSelect(selectedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleRemoveSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!isWaitingForPaste) return;

    const handlePaste = async (event: ClipboardEvent) => {
      if (disabled || isUploading) return;

      event.preventDefault();
      setIsWaitingForPaste(false);

      const items = event.clipboardData?.items;
      if (!items) {
        setIsLoadingClipboard(false);
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            const filesToAdd = maxFiles 
              ? [file].slice(0, maxFiles - files.length - selectedFiles.length)
              : [file];
            
            if (filesToAdd.length > 0) {
              const newSelectedFiles = [...selectedFiles, ...filesToAdd];
              setSelectedFiles(newSelectedFiles);
              
              const newUrls = filesToAdd.map(f => {
                if (showPreview && f.type.startsWith('image/')) {
                  return URL.createObjectURL(f);
                }
                return '';
              });
              setPreviewUrls([...previewUrls, ...newUrls]);

              if (onFilesSelect) {
                onFilesSelect(newSelectedFiles);
              }
            }
          }
          setIsLoadingClipboard(false);
          return;
        }
      }
      setIsLoadingClipboard(false);
    };

    pasteHandlerRef.current = handlePaste;
    document.addEventListener('paste', handlePaste);

    return () => {
      if (pasteHandlerRef.current) {
        document.removeEventListener('paste', handlePaste);
        pasteHandlerRef.current = null;
      }
    };
  }, [isWaitingForPaste, disabled, isUploading, maxFiles, files.length, selectedFiles, previewUrls, showPreview, onFilesSelect]);

  const handlePasteFromClipboard = async () => {
    if (disabled || isUploading) return;
    if (maxFiles && files.length + selectedFiles.length >= maxFiles) return;

    setIsLoadingClipboard(true);
    
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        
        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            if (type.startsWith('image/')) {
              const blob = await clipboardItem.getType(type);
              const extension = type.split('/')[1] === 'png' ? 'png' : type.split('/')[1] === 'jpeg' ? 'jpg' : 'png';
              const file = new File([blob], `clipboard-image-${Date.now()}.${extension}`, { type });
              
              const filesToAdd = maxFiles 
                ? [file].slice(0, maxFiles - files.length - selectedFiles.length)
                : [file];
              
              if (filesToAdd.length > 0) {
                const newSelectedFiles = [...selectedFiles, ...filesToAdd];
                setSelectedFiles(newSelectedFiles);
                
                const newUrls = filesToAdd.map(f => {
                  if (showPreview && f.type.startsWith('image/')) {
                    return URL.createObjectURL(f);
                  }
                  return '';
                });
                setPreviewUrls([...previewUrls, ...newUrls]);

                if (onFilesSelect) {
                  onFilesSelect(newSelectedFiles);
                }
              }
              
              setIsLoadingClipboard(false);
              return;
            }
          }
        }
      }
      
      setIsWaitingForPaste(true);
      
      const tempInput = document.createElement('textarea');
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-9999px';
      tempInput.style.top = '-9999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      
      setTimeout(() => {
        document.body.removeChild(tempInput);
        if (isWaitingForPaste) {
          setIsWaitingForPaste(false);
          setIsLoadingClipboard(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Erro ao acessar área de transferência:', error);
      setIsWaitingForPaste(true);
      
      const tempInput = document.createElement('textarea');
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-9999px';
      tempInput.style.top = '-9999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      
      setTimeout(() => {
        document.body.removeChild(tempInput);
        if (isWaitingForPaste) {
          setIsWaitingForPaste(false);
          setIsLoadingClipboard(false);
        }
      }, 5000);
    }
  };

  const openFileModal = (index: number, type: 'existing' | 'selected') => {
    setCurrentFileIndex(index);
    setCurrentFileType(type);
    setIsModalOpen(true);
  };

  const closeFileModal = () => {
    setIsModalOpen(false);
    setCurrentFileIndex(-1);
  };

  const getTotalFiles = () => {
    return currentFileType === 'existing' ? files.length : selectedFiles.length;
  };

  const goToPreviousFile = () => {
    const total = getTotalFiles();
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    } else {
      setCurrentFileIndex(total - 1);
    }
  };

  const goToNextFile = () => {
    const total = getTotalFiles();
    if (currentFileIndex < total - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      setCurrentFileIndex(0);
    }
  };

  const isImageFile = (file: File | IFileItem) => {
    if ('type' in file) {
      return file.type.startsWith('image/');
    }
    // For IFileItem, check by extension or URL
    const url = file.url.toLowerCase();
    return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || 
           url.includes('.gif') || url.includes('.webp') || url.includes('.svg');
  };

  const renderFilePreview = (file: File | IFileItem, index: number, isSelected: boolean = false) => {
    const isImage = isImageFile(file);
    const fileUrl = 'url' in file ? file.url : (isImage ? previewUrls[index] : '');
    const fileName = 'name' in file ? file.name : (file as IFileItem).name;

    return (
      <KuCard key={`${isSelected ? 'selected' : 'existing'}-${index}`}>
        <div 
          className={`${isImage ? 'aspect-square' : 'h-20'} relative cursor-pointer`}
          onClick={() => openFileModal(index, isSelected ? 'selected' : 'existing')}
        >
          {isImage && fileUrl ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate px-2">
                  {fileName.split('.').pop()?.toUpperCase()}
                </div>
              </div>
            </div>
          )}
          <Button
            type="button"
            size="sm"
            color="failure"
            className="absolute top-2 right-2 p-1 z-10"
            onClick={(e) => {
              e.stopPropagation();
              isSelected ? handleRemoveSelectedFile(index) : handleRemoveFile(index);
            }}
            disabled={disabled || isUploading}
          >
            {isSelected ? <HiX className="h-3 w-3" /> : <HiTrash className="h-3 w-3" />}
          </Button>
        </div>
        <div className="p-2">
          <p 
            className="text-xs text-gray-600 dark:text-gray-400 truncate cursor-pointer" 
            title={fileName}
            onClick={() => openFileModal(index, isSelected ? 'selected' : 'existing')}
          >
            {fileName}
          </p>
        </div>
      </KuCard>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label || t("fileManager.label")}
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="md"
            color="gray"
            onClick={handlePasteFromClipboard}
            disabled={disabled || isUploading || isLoadingClipboard || (maxFiles ? files.length + selectedFiles.length >= maxFiles : false)}
          >
            {isLoadingClipboard ? (
              <>
                <span className="mr-2">
                  <KuSpinner size="sm" />
                </span>
                {t("fileManager.pasting") || "Colando..."}
              </>
            ) : (
              t("fileManager.pasteFromClipboard")
            )}
          </Button>
          <Button
            type="button"
            size="md"
            color="gray"
            onClick={openFileDialog}
            disabled={disabled || isUploading || (maxFiles ? files.length + selectedFiles.length >= maxFiles : false)}
          >
            <HiPlus className="mr-2 h-4 w-4" />
            {t("fileManager.addFiles")}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={!maxFiles || maxFiles > 1}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Existing Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => renderFilePreview(file, index, false))}
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("fileManager.newFilesToUpload")}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => renderFilePreview(file, index, true))}
          </div>
          
          {onFilesUpload && (
            <div className="flex gap-2">
              <Button
                type="button"
                color="blue"
                onClick={handleUpload}
                disabled={disabled || isUploading}
              >
                {isUploading ? (
                  <>
                    <KuSpinner />
                    {t("fileManager.uploading")}
                  </>
                ) : (
                  t("fileManager.uploadFiles")
                )}
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={() => {
                  setSelectedFiles([]);
                  setPreviewUrls([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={disabled || isUploading}
              >
                {t("fileManager.cancel")}
              </Button>
            </div>
          )}
        </div>
      )}

      {files.length === 0 && selectedFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">{emptyMessage || t("fileManager.emptyMessage")}</p>
          <p className="text-xs mt-1">{emptySubMessage || t("fileManager.emptySubMessage")}</p>
        </div>
      )}

      {maxFiles && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("fileManager.filesUploaded", { current: files.length, max: maxFiles })}
        </div>
      )}

      <FileModal
        show={isModalOpen}
        onClose={closeFileModal}
        currentFileIndex={currentFileIndex}
        currentFileType={currentFileType}
        files={files}
        selectedFiles={selectedFiles}
        previewUrls={previewUrls}
        onPrevious={goToPreviousFile}
        onNext={goToNextFile}
      />
    </div>
  );
}
