// YouTube Service - Handles both mock and real YouTube data processing
import { supabase } from '@/integrations/supabase/client';
import { io, Socket } from 'socket.io-client';

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  qualities: string[];
  uploader?: string;
  view_count?: number;
  upload_date?: string;
  downloadUrl?: string;
}

export interface PlaylistData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_count: number;
  uploader: string;
  videos: VideoData[];
}

export interface ProcessResult {
  success: boolean;
  type?: 'video' | 'playlist';
  videos?: VideoData[];
  playlist?: PlaylistData;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  filesize?: number;
  isDirectDownload?: boolean;
  format?: string;
  quality?: string;
  error?: string;
}

export interface DownloadedFile {
  id: string;
  title: string;
  filename: string;
  size: number;
  createdAt: Date;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Socket.io connection
let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket || initializeSocket();
};

// Socket event listeners
export const onVideoStarted = (callback: (title: string) => void) => {
  const socket = getSocket();
  socket.on('VIDEO_STARTED', callback);
};

export const onVideoDownloaded = (callback: (title: string) => void) => {
  const socket = getSocket();
  socket.on('VIDEO_DOWNLOADED', callback);
};

export const onVideoError = (callback: (error: string) => void) => {
  const socket = getSocket();
  socket.on('VIDEO_ERROR', callback);
};

function extractVideoId(url: string): string | null {
  // More comprehensive regex to handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtube\.com\/watch\?.*&v=)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function extractPlaylistId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/playlist\?list=)([^&\n?#]+)/,
    /(?:youtube\.com\/watch\?.*&list=)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export const processYouTubeUrl = async (url: string): Promise<ProcessResult> => {
  try {
    // Real API call to our Express server
    const response = await fetch(`${API_BASE_URL}/youtube/info?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch video information');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // If the server is not running, provide a helpful message
    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Server is not running. Please start the backend server first.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to process YouTube URL'
    };
  }
};

export const generateDownloadLink = async (videoId: string, quality: string): Promise<DownloadResult> => {
  try {
    // Real API call to our Express server
    const response = await fetch(`${API_BASE_URL}/youtube/download?videoId=${videoId}&quality=${encodeURIComponent(quality)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate download link');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Download link generation error:', error);
    
    // If the server is not running, provide a helpful message
    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Server is not running. Please start the backend server first.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to generate download link'
    };
  }
};

// New function for direct file download
export const downloadVideoFile = async (videoId: string, quality: string, title: string): Promise<DownloadResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/download-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        quality,
        title
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to start download');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Download file error:', error);
    
    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Server is not running. Please start the backend server first.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to start download'
    };
  }
};

// Get all downloaded files
export const getDownloadedFiles = async (): Promise<DownloadedFile[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/downloads`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch downloaded files');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching downloaded files:', error);
    return [];
  }
};

// Download a specific file
export const downloadFile = async (filename: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/downloads/${filename}/download`);
    
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

// Delete a downloaded file
export const deleteFile = async (filename: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/downloads/${filename}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const isValidYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|playlist\?list=)|youtu\.be\/)/;
  return youtubeRegex.test(url);
};

export const getUrlType = (url: string): 'video' | 'playlist' | 'unknown' => {
  if (url.includes('playlist?list=')) return 'playlist';
  if (url.includes('watch?v=') || url.includes('youtu.be/')) return 'video';
  return 'unknown';
};