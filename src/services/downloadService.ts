// Download Service - Handles file downloads
import { toast } from 'sonner';

export interface DownloadOptions {
  url: string;
  filename: string;
  isDirectDownload?: boolean;
}

export const triggerDownload = async (options: DownloadOptions): Promise<void> => {
  const { url, filename, isDirectDownload = false } = options;

  try {
    if (isDirectDownload) {
      // For direct download URLs, we can trigger browser download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Download started: ${filename}`);
    } else {
      // For non-direct URLs, open in new tab
      window.open(url, '_blank');
      toast.info('Download link opened in new tab');
    }
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to start download');
  }
};

export const downloadWithProgress = async (
  url: string, 
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read response body');
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (total > 0 && onProgress) {
        onProgress((loaded / total) * 100);
      }
    }

    // Create blob and download
    const blob = new Blob(chunks);
    const downloadUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(downloadUrl);
    toast.success(`Download completed: ${filename}`);
    
  } catch (error) {
    console.error('Download with progress error:', error);
    toast.error(`Download failed: ${error.message}`);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};