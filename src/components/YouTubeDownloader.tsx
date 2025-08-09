import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Youtube, Download, Play, Clock, Users, Shield, Camera, Heart, MessageCircle, Zap, Loader2, FileText, List, Eye, Trash2 } from 'lucide-react';
import { processYouTubeUrl, generateDownloadLink, downloadVideoFile, initializeSocket, onVideoStarted, onVideoDownloaded, onVideoError, getDownloadedFiles, downloadFile, deleteFile, type VideoData, type DownloadedFile } from '@/services/youtubeService';

interface YouTubeDownloaderProps {
  className?: string;
}

export const YouTubeDownloader: React.FC<YouTubeDownloaderProps> = ({ className }) => {
  const [url, setUrl] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({});
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket();
    
    // Set up socket event listeners
    onVideoStarted((title) => {
      toast.success(`Download started: ${title}`);
    });
    
    onVideoDownloaded((title) => {
      toast.success(`Download completed: ${title}`);
      setIsDownloading(prev => ({ ...prev, [title]: false }));
      loadDownloadedFiles(); // Refresh the downloaded files list
    });
    
    onVideoError((error) => {
      toast.error(`Download failed: ${error}`);
      setIsDownloading(prev => ({ ...prev, [error]: false }));
    });

    // Load existing downloaded files
    loadDownloadedFiles();

    return () => {
      socket?.disconnect();
    };
  }, []);

  const loadDownloadedFiles = async () => {
    try {
      const files = await getDownloadedFiles();
      setDownloadedFiles(files);
    } catch (error) {
      console.error('Error loading downloaded files:', error);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await processYouTubeUrl(url);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (result.success && result.videos) {
        setVideos(result.videos);
        if (result.videos.length > 0 && result.videos[0].qualities.length > 0) {
          setSelectedQuality(result.videos[0].qualities[0]);
        }
        toast.success(`Found ${result.videos.length} video(s)`);
      } else {
        toast.error(result.error || 'Failed to process URL');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProcessingProgress(0);
      toast.error('Failed to process YouTube URL');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const handleDownload = async (video: VideoData, quality: string) => {
    if (!quality) {
      toast.error('Please select a quality');
      return;
    }

    setIsDownloading(prev => ({ ...prev, [video.id]: true }));

    try {
      // Use direct file download instead of link generation
      const result = await downloadVideoFile(video.id, quality, video.title);
      
      if (result.success) {
        toast.success(`Download started for: ${video.title}`);
      } else {
        toast.error(result.error || 'Failed to start download');
        setIsDownloading(prev => ({ ...prev, [video.id]: false }));
      }
    } catch (error) {
      toast.error('Failed to start download');
      setIsDownloading(prev => ({ ...prev, [video.id]: false }));
    }
  };

  const handleDownloadFile = async (filename: string) => {
    try {
      await downloadFile(filename);
      toast.success('File download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      await deleteFile(filename);
      toast.success('File deleted successfully');
      loadDownloadedFiles(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Video Downloader
          </CardTitle>
          <CardDescription>
            Enter a YouTube URL to download videos in your preferred quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button type="submit" disabled={isProcessing || !url.trim()}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Process URL
                  </>
                )}
              </Button>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={processingProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Processing video information...
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Video Results */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Video Information</CardTitle>
            <CardDescription>
              Select quality and download your video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {video.uploader && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {video.uploader}
                          </span>
                        )}
                        {video.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                        )}
                        {video.view_count && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.view_count.toLocaleString()} views
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {video.qualities.map((quality) => (
                          <SelectItem key={quality} value={quality}>
                            {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handleDownload(video, selectedQuality)}
                      disabled={isDownloading[video.id] || !selectedQuality}
                      className="flex items-center gap-2"
                    >
                      {isDownloading[video.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloaded Files Section */}
      {downloadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Downloaded Files
            </CardTitle>
            <CardDescription>
              Your previously downloaded videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {downloadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{file.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Downloaded: {formatDate(file.createdAt)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownloadFile(file.filename)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFile(file.filename)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">Safe & Secure</h4>
                <p className="text-sm text-muted-foreground">No personal data collected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">High Quality</h4>
                <p className="text-sm text-muted-foreground">Multiple quality options</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium">Fast Downloads</h4>
                <p className="text-sm text-muted-foreground">Optimized for speed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <List className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">Playlist Support</h4>
                <p className="text-sm text-muted-foreground">Download entire playlists</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium">Free to Use</h4>
                <p className="text-sm text-muted-foreground">No registration required</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              <div>
                <h4 className="font-medium">Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">Live progress tracking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};