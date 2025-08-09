import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, Facebook, Instagram, Twitter, Music, Download, Play, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import YouTubeDownloader from '@/components/YouTubeDownloader';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Download className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Universal Video Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Download videos from YouTube, Facebook, Instagram, Twitter, TikTok and more. 
            Fast, free, and secure downloads for all your favorite content.
          </p>
          
          {/* Quick Download Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-6 w-6 mr-2 text-blue-600" />
                Quick Download
              </CardTitle>
              <CardDescription>
                Try our YouTube downloader right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeDownloader />
            </CardContent>
          </Card>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/youtube">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Youtube className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">YouTube</h3>
                  <p className="text-gray-600 mb-4">Download videos, music, and playlists</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">MP4</Badge>
                    <Badge variant="secondary">MP3</Badge>
                    <Badge variant="secondary">4K</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Try YouTube Downloader</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/facebook">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Facebook className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Facebook</h3>
                  <p className="text-gray-600 mb-4">Download videos, reels, and stories</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">MP4</Badge>
                    <Badge variant="secondary">HD</Badge>
                    <Badge variant="secondary">Reels</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Try Facebook Downloader</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/instagram">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Instagram className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Instagram</h3>
                  <p className="text-gray-600 mb-4">Download photos, videos, and stories</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">Photos</Badge>
                    <Badge variant="secondary">Videos</Badge>
                    <Badge variant="secondary">Stories</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Try Instagram Downloader</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/twitter">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Twitter className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Twitter</h3>
                  <p className="text-gray-600 mb-4">Download videos and GIFs</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">MP4</Badge>
                    <Badge variant="secondary">GIF</Badge>
                    <Badge variant="secondary">Tweets</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Try Twitter Downloader</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/tiktok">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Music className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">TikTok</h3>
                  <p className="text-gray-600 mb-4">Download videos without watermark</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">No Watermark</Badge>
                    <Badge variant="secondary">HD</Badge>
                    <Badge variant="secondary">Fast</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Try TikTok Downloader</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/how-to">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">How to Download</h3>
                  <p className="text-gray-600 mb-4">Complete guide and tutorials</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">Guide</Badge>
                    <Badge variant="secondary">Tutorials</Badge>
                    <Badge variant="secondary">Tips</Badge>
                  </div>
                  <div className="flex items-center justify-center mt-4 text-blue-600">
                    <span className="text-sm font-medium">Learn How to Download</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Download videos in 4K, 1080p, 720p, and more quality options</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast & Free</h3>
              <p className="text-gray-600">Lightning-fast downloads with no registration required</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
              <p className="text-gray-600">Support for all major social media platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Downloading?</h2>
            <p className="text-gray-600 mb-6">Choose your platform and start downloading your favorite content</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link to="/youtube">
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube Downloader
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/how-to">
                  <Download className="h-4 w-4 mr-2" />
                  Learn How
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
