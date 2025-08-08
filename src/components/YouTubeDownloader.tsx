import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
// import { supabase } from '@/integrations/supabase/client'; // Uncomment when Supabase is configured
import { 
  Download, 
  Play, 
  Copy, 
  FileText, 
  Loader2, 
  CheckCircle, 
  Youtube,
  Link as LinkIcon,
  Settings,
  List
} from 'lucide-react';

import { VideoData, PlaylistData, processYouTubeUrl, generateDownloadLink, isValidYouTubeUrl, getUrlType, DownloadResult } from '@/services/youtubeService';
import { triggerDownload, downloadWithProgress, formatFileSize } from '@/services/downloadService';

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
}

const YouTubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [contentType, setContentType] = useState<'video' | 'playlist' | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    currentStep: ''
  });
  const [selectedQualities, setSelectedQualities] = useState<Record<string, string>>({});
  const [bulkQuality, setBulkQuality] = useState('');
  const [downloadLinks, setDownloadLinks] = useState<Record<string, DownloadResult>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  const processYouTubeUrlHandler = async () => {
    setProcessing({ isProcessing: true, progress: 0, currentStep: 'Validating URL...' });
    
    try {
      // Step 1: Validate URL
      setProcessing({ isProcessing: true, progress: 25, currentStep: 'Validating URL...' });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Detect content type
      const urlType = getUrlType(url);
      const stepMessage = urlType === 'playlist' ? 'Fetching playlist information...' : 'Fetching video information...';
      setProcessing({ isProcessing: true, progress: 50, currentStep: stepMessage });
      
      const result = await processYouTubeUrl(url);

      if (!result.success) {
        throw new Error(result.error || 'Failed to process YouTube URL');
      }

      // Step 3: Process results
      setProcessing({ isProcessing: true, progress: 75, currentStep: 'Analyzing available formats...' });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Complete
      setProcessing({ isProcessing: true, progress: 100, currentStep: 'Preparing results...' });
      await new Promise(resolve => setTimeout(resolve, 300));

      setContentType(result.type || 'video');
      setVideos(result.videos || []);
      setPlaylist(result.playlist || null);
      setProcessing({ isProcessing: false, progress: 100, currentStep: 'Complete!' });
      
      const count = result.videos?.length || 0;
      const message = result.type === 'playlist' 
        ? `Successfully processed playlist with ${count} video(s)!`
        : `Successfully processed ${count} video(s)!`;
      toast.success(message);

    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      setProcessing({ isProcessing: false, progress: 0, currentStep: '' });
      toast.error(error.message || 'Failed to process YouTube URL. Please check the URL and try again.');
    }
  };

  const handleProcess = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    await processYouTubeUrlHandler();
  };

  const generateDownloadLinkHandler = async (videoId: string) => {
    const quality = selectedQualities[videoId];
    if (!quality) {
      toast.error('Please select a quality first');
      return;
    }

    try {
      const result = await generateDownloadLink(videoId, quality);

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate download link');
      }

      setDownloadLinks(prev => ({ ...prev, [videoId]: result }));
      toast.success('Download link generated!');
    } catch (error: any) {
      console.error('Error generating download link:', error);
      toast.error(error.message || 'Failed to generate download link');
    }
  };

  const generateAllLinks = async () => {
    if (!bulkQuality) {
      toast.error('Please select a quality for bulk processing');
      return;
    }

    try {
      const promises = videos
        .filter(video => video.qualities.includes(bulkQuality))
        .map(async (video) => {
          const result = await generateDownloadLink(video.id, bulkQuality);

          if (result.success) {
            return { videoId: video.id, downloadResult: result };
          }
          return null;
        });

      const results = await Promise.all(promises);
      const newLinks: Record<string, DownloadResult> = {};
      
      results.forEach(result => {
        if (result) {
          newLinks[result.videoId] = result.downloadResult;
        }
      });

      setDownloadLinks(prev => ({ ...prev, ...newLinks }));
      toast.success(`Generated ${Object.keys(newLinks).length} download links!`);
    } catch (error: any) {
      console.error('Error generating bulk links:', error);
      toast.error('Failed to generate some download links');
    }
  };

  const copyAllLinks = () => {
    const links = Object.values(downloadLinks)
      .map(result => result.downloadUrl)
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(links);
    toast.success('All links copied to clipboard!');
  };

  const exportToTxt = () => {
    const content = videos.map(video => {
      const downloadResult = downloadLinks[video.id];
      const link = downloadResult?.downloadUrl || 'No download link generated';
      const filename = downloadResult?.filename || 'Unknown filename';
      const filesize = downloadResult?.filesize ? formatFileSize(downloadResult.filesize) : 'Unknown size';
      
      return `Title: ${video.title}\nFilename: ${filename}\nSize: ${filesize}\nDownload URL: ${link}\n${'='.repeat(50)}\n`;
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube_downloads.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File exported successfully!');
  };

  const handleDirectDownload = async (videoId: string) => {
    const downloadResult = downloadLinks[videoId];
    if (!downloadResult) {
      toast.error('No download link available');
      return;
    }

    if (downloadResult.isDirectDownload && downloadResult.downloadUrl && downloadResult.filename) {
      await triggerDownload({
        url: downloadResult.downloadUrl,
        filename: downloadResult.filename,
        isDirectDownload: true
      });
    } else {
      // Fallback to opening link
      window.open(downloadResult.downloadUrl, '_blank');
      toast.info('Download link opened in new tab');
    }
  };

  const handleDownloadWithProgress = async (videoId: string) => {
    const downloadResult = downloadLinks[videoId];
    if (!downloadResult?.downloadUrl || !downloadResult.filename) {
      toast.error('No download link available');
      return;
    }

    try {
      await downloadWithProgress(
        downloadResult.downloadUrl,
        downloadResult.filename,
        (progress) => {
          setDownloadProgress(prev => ({ ...prev, [videoId]: progress }));
        }
      );
      setDownloadProgress(prev => ({ ...prev, [videoId]: 100 }));
    } catch (error) {
      setDownloadProgress(prev => ({ ...prev, [videoId]: 0 }));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 gradient-primary rounded-xl shadow-glow">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              YouTube Downloader
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Download videos and playlists from YouTube with ease. Paste a URL and get high-quality download links instantly.
          </p>
        </div>

        {/* URL Input Section */}
        <Card className="gradient-card border-border/50 shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Enter YouTube URL
            </CardTitle>
            <CardDescription>
              Paste a YouTube video or playlist URL to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg"
                disabled={processing.isProcessing}
              />
              <Button 
                onClick={handleProcess}
                disabled={processing.isProcessing}
                variant="hero"
                size="lg"
                className="px-8"
              >
                {processing.isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Process URL
                  </>
                )}
              </Button>
            </div>

            {processing.isProcessing && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{processing.currentStep}</span>
                  <span className="text-primary font-medium">{Math.round(processing.progress)}%</span>
                </div>
                <Progress value={processing.progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {videos.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            {/* Playlist Info */}
            {playlist && contentType === 'playlist' && (
              <Card className="gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    Playlist: {playlist.title}
                  </CardTitle>
                  <CardDescription>
                    {playlist.description && playlist.description.length > 100 
                      ? `${playlist.description.substring(0, 100)}...` 
                      : playlist.description
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img 
                      src={playlist.thumbnail} 
                      alt={playlist.title}
                      className="w-32 h-18 object-cover rounded-lg border border-border/50"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{playlist.video_count} videos</Badge>
                        <Badge variant="outline">{playlist.uploader}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This playlist contains {playlist.video_count} videos. You can download individual videos or use bulk actions below.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video List */}
            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5 text-accent" />
                  {contentType === 'playlist' ? `Videos in Playlist (${videos.length})` : `Found Videos (${videos.length})`}
                </CardTitle>
                <CardDescription>
                  Select quality and generate download links for each video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videos.map((video, index) => (
                  <div key={video.id} className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-3" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex gap-4">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-32 h-18 object-cover rounded-lg border border-border/50"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{video.duration}</Badge>
                          <Badge variant="outline">{video.qualities.length} qualities</Badge>
                          {video.uploader && (
                            <Badge variant="outline" className="text-xs">{video.uploader}</Badge>
                          )}
                          {video.view_count && video.view_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {video.view_count.toLocaleString()} views
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Select 
                        value={selectedQualities[video.id] || ''}
                        onValueChange={(value) => setSelectedQualities(prev => ({ ...prev, [video.id]: value }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          {video.qualities.map(quality => (
                            <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        onClick={() => generateDownloadLinkHandler(video.id)}
                        variant="outline"
                        size="sm"
                        disabled={!selectedQualities[video.id]}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Get Link
                      </Button>

                      {downloadLinks[video.id] && (
                        <>
                          <Button
                            onClick={() => handleDirectDownload(video.id)}
                            variant="hero"
                            size="sm"
                            disabled={downloadProgress[video.id] > 0 && downloadProgress[video.id] < 100}
                          >
                            {downloadProgress[video.id] > 0 && downloadProgress[video.id] < 100 ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {Math.round(downloadProgress[video.id])}%
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span className="text-sm text-accent font-medium">Ready</span>
                          </div>
                        </>
                      )}
                    </div>

                    {downloadLinks[video.id] && (
                      <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-sm text-accent font-mono truncate">
                            {downloadLinks[video.id].downloadUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(downloadLinks[video.id].downloadUrl!);
                              toast.success('Link copied!');
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        {downloadLinks[video.id].filename && (
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>📁 {downloadLinks[video.id].filename}</span>
                            {downloadLinks[video.id].filesize && (
                              <span>📊 {formatFileSize(downloadLinks[video.id].filesize!)}</span>
                            )}
                          </div>
                        )}
                        {downloadProgress[video.id] > 0 && downloadProgress[video.id] < 100 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Downloading...</span>
                              <span>{Math.round(downloadProgress[video.id])}%</span>
                            </div>
                            <Progress value={downloadProgress[video.id]} className="h-1" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Bulk Actions
                </CardTitle>
                <CardDescription>
                  Process all videos at once with the same quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Select value={bulkQuality} onValueChange={setBulkQuality}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080p">1080p HD</SelectItem>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="360p">360p</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={generateAllLinks}
                    disabled={!bulkQuality}
                    variant="hero"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate All Links
                  </Button>
                </div>

                {Object.keys(downloadLinks).length > 0 && (
                  <div className="flex gap-2 pt-4 border-t border-border/30">
                    <Button onClick={copyAllLinks} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Links
                    </Button>
                    <Button onClick={exportToTxt} variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Export to TXT
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeDownloader;