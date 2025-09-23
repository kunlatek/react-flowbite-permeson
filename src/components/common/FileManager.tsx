import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Spinner } from "flowbite-react";
import { HiTrash, HiPlus, HiX } from "react-icons/hi";

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

export default function FileManager({
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
}: FileManagerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
      <Card key={`${isSelected ? 'selected' : 'existing'}-${index}`} className="relative">
        <div className={`${isImage ? 'aspect-square' : 'h-20'} relative`}>
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
            className="absolute top-2 right-2 p-1"
            onClick={() => isSelected ? handleRemoveSelectedFile(index) : handleRemoveFile(index)}
            disabled={disabled || isUploading}
          >
            {isSelected ? <HiX className="h-3 w-3" /> : <HiTrash className="h-3 w-3" />}
          </Button>
        </div>
        <div className="p-2">
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={fileName}>
            {fileName}
          </p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label || t("fileManager.label")}
        </label>
        <Button
          type="button"
          size="md"
          color="gray"
          onClick={openFileDialog}
          disabled={disabled || isUploading || (maxFiles ? files.length >= maxFiles : false)}
        >
          <HiPlus className="mr-2 h-4 w-4" />
          {t("fileManager.addFiles")}
        </Button>
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
                    <Spinner size="sm" className="mr-2" />
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
    </div>
  );
}
