import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "flowbite-react";
import { HiChevronLeft, HiChevronRight, HiDownload } from "react-icons/hi";
import { IFileItem } from "./file-manager";

interface FileModalProps {
  show: boolean;
  onClose: () => void;
  currentFileIndex: number;
  currentFileType: 'existing' | 'selected';
  files: IFileItem[];
  selectedFiles: File[];
  previewUrls: string[];
  onPrevious: () => void;
  onNext: () => void;
}

const isImageFile = (file: File | IFileItem) => {
  if ('type' in file) {
    return file.type.startsWith('image/');
  }
  const url = file.url.toLowerCase();
  return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || 
         url.includes('.gif') || url.includes('.webp') || url.includes('.svg');
};

export const FileModal = ({
  show,
  onClose,
  currentFileIndex,
  currentFileType,
  files,
  selectedFiles,
  previewUrls,
  onPrevious,
  onNext
}: FileModalProps) => {
  const { t } = useTranslation();

  const getCurrentFile = () => {
    if (currentFileType === 'existing') {
      return files?.[currentFileIndex];
    } else {
      return selectedFiles?.[currentFileIndex];
    }
  };

  const getCurrentFileUrl = () => {
    const file = getCurrentFile();
    if (!file) return '';
    
    if (currentFileType === 'existing') {
      return (file as IFileItem).url;
    } else {
      const fileObj = file as File;
      if (isImageFile(fileObj)) {
        return previewUrls[currentFileIndex] || '';
      }
      return '';
    }
  };

  const getCurrentFileName = () => {
    const file = getCurrentFile();
    if (!file) return '';
    
    if (currentFileType === 'existing') {
      return (file as IFileItem).name;
    } else {
      return (file as File).name;
    }
  };

  const getTotalFiles = () => {
    return currentFileType === 'existing' ? files.length : selectedFiles.length;
  };


  const handleDownload = () => {
    const file = getCurrentFile();
    if (!file) return;
    
    const fileName = getCurrentFileName();
    
    if (currentFileType === 'existing') {
      const url = (file as IFileItem).url;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      const fileObj = file as File;
      const url = URL.createObjectURL(fileObj);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const currentFile = getCurrentFile();
  if (!currentFile) return null;

  const isImage = isImageFile(currentFile);
  const fileUrl = getCurrentFileUrl();
  const fileName = getCurrentFileName();
  const totalFiles = getTotalFiles();

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="7xl"
      position="center"
      className="backdrop-blur-sm"
    >
      <Modal.Header className="px-6 py-4">
        <span className="truncate">{fileName}</span>
      </Modal.Header>
      <Modal.Body className="px-6 py-4">
        <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-900 dark:bg-gray-800">
          {isImage && fileUrl ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg mb-2">{fileName}</p>
              <p className="text-sm text-gray-400 mb-4">
                {fileName.split('.').pop()?.toUpperCase()} File
              </p>
              <Button
                type="button"
                color="blue"
                onClick={handleDownload}
              >
                <HiDownload className="mr-2 h-4 w-4" />
                {t("fileManager.download")}
              </Button>
            </div>
          )}
          
          {totalFiles > 1 && (
            <>
              <Button
                type="button"
                size="lg"
                color="gray"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100"
                onClick={onPrevious}
              >
                <HiChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                type="button"
                size="lg"
                color="gray"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100"
                onClick={onNext}
              >
                <HiChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                {currentFileIndex + 1} / {totalFiles}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

