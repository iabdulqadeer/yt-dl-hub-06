import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Youtube, Download, Play, Clock, Users, TrendingUp } from 'lucide-react';
import YouTubeDownloader from '@/components/YouTubeDownloader';

const YouTube = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Youtube className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YouTube Video Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download YouTube videos in high quality. Fast, free, and secure downloads for all your favorite content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Quality Downloads</h3>
              <p className="text-gray-600">Download videos in 4K, 1080p, 720p, and more quality options</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Lightning-fast downloads with our optimized processing system</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">User Friendly</h3>
              <p className="text-gray-600">Simple and intuitive interface for the best user experience</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Downloader Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Youtube className="h-6 w-6 mr-2 text-red-600" />
              Download YouTube Video
            </CardTitle>
            <CardDescription>
              Paste a YouTube URL below to start downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YouTubeDownloader />
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Download YouTube Videos</CardTitle>
            <CardDescription>Follow these simple steps to download your favorite videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Paste URL</h3>
                <p className="text-gray-600">Copy and paste the YouTube video URL into the input field</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Select Quality</h3>
                <p className="text-gray-600">Choose your preferred video quality and format</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Click download and save your video to your device</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
            <CardDescription>We support various video and audio formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary" className="justify-center py-2">MP4</Badge>
              <Badge variant="secondary" className="justify-center py-2">WebM</Badge>
              <Badge variant="secondary" className="justify-center py-2">3GP</Badge>
              <Badge variant="secondary" className="justify-center py-2">MP3</Badge>
              <Badge variant="secondary" className="justify-center py-2">M4A</Badge>
              <Badge variant="secondary" className="justify-center py-2">AAC</Badge>
              <Badge variant="secondary" className="justify-center py-2">OGG</Badge>
              <Badge variant="secondary" className="justify-center py-2">WAV</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YouTube;
