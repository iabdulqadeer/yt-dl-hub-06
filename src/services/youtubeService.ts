// YouTube Service - Handles both mock and real YouTube data processing
import { supabase } from '@/integrations/supabase/client';

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
  error?: string;
}

const USE_REAL_API = true; // Set to true when backend is configured

// Mock data for demonstration (matching your test URL)
const getMockVideoData = (url: string): VideoData[] => {
  // Extract video ID from URL to provide more realistic mock data
  const videoId = extractVideoId(url);
  
  if (url.includes('7wnove7K-ZQ')) {
    return [{
      id: '7wnove7K-ZQ',
      title: 'The video from your URL: Build a Complete YouTube Downloader',
      thumbnail: 'https://img.youtube.com/vi/7wnove7K-ZQ/maxresdefault.jpg',
      duration: '12:34',
      qualities: ['1080p', '720p', '480p', '360p'],
      uploader: 'Tech Channel',
      view_count: 125000,
      upload_date: '2024-01-15'
    }];
  }
  
  return [{
    id: videoId || 'mock-video',
    title: 'Sample Video from Your URL',
    thumbnail: 'https://img.youtube.com/vi/' + (videoId || 'dQw4w9WgXcQ') + '/maxresdefault.jpg',
    duration: '8:45',
    qualities: ['1080p', '720p', '480p', '360p'],
    uploader: 'YouTube Channel',
    view_count: 50000,
    upload_date: '2024-01-10'
  }];
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

export const processYouTubeUrl = async (url: string): Promise<ProcessResult> => {
  try {
    if (USE_REAL_API) {
      // Real API call using Supabase edge function
      const { data, error } = await supabase.functions.invoke('youtube-processor', {
        body: { url }
      });
      
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Mock processing for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const videos = getMockVideoData(url);
      return {
        success: true,
        videos
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process YouTube URL'
    };
  }
};

export const generateDownloadLink = async (videoId: string, quality: string): Promise<DownloadResult> => {
  try {
    if (USE_REAL_API) {
      // Real API call using Supabase edge function
      const { data, error } = await supabase.functions.invoke('generate-download-link', {
        body: { videoId, quality }
      });
      
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Mock download link generation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      return {
        success: true,
        downloadUrl: `https://youtube-download.example.com/v/${videoId}?quality=${quality}&format=mp4`,
        filename: `video_${videoId}_${quality}.mp4`,
        isDirectDownload: true,
        format: 'mp4'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to generate download link'
    };
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