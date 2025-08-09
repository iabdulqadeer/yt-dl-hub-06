import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Download, Play, Clock, Users, Sparkles } from 'lucide-react';

const TikTok = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Music className="h-16 w-16 text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TikTok Video Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download TikTok videos without watermark. Save your favorite TikTok content in high quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Watermark</h3>
              <p className="text-gray-600">Download TikTok videos without the TikTok watermark</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Download videos in the highest available quality</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast & Free</h3>
              <p className="text-gray-600">Quick downloads with no registration required</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Downloader Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="h-6 w-6 mr-2 text-pink-500" />
              Download TikTok Video
            </CardTitle>
            <CardDescription>
              Paste a TikTok video URL below to start downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Paste TikTok video URL here..."
                  className="flex-1"
                />
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Supported: TikTok videos, duets, and trending content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Download TikTok Videos</CardTitle>
            <CardDescription>Follow these simple steps to download your favorite TikTok content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Copy TikTok URL</h3>
                <p className="text-gray-600">Copy the TikTok video URL from the app or website</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Paste & Process</h3>
                <p className="text-gray-600">Paste the URL and let our system process the video</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Choose quality and download without watermark</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Content Types</CardTitle>
            <CardDescription>Download various types of TikTok content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary" className="justify-center py-2">Videos</Badge>
              <Badge variant="secondary" className="justify-center py-2">Duets</Badge>
              <Badge variant="secondary" className="justify-center py-2">Trending</Badge>
              <Badge variant="secondary" className="justify-center py-2">Original</Badge>
              <Badge variant="secondary" className="justify-center py-2">No Watermark</Badge>
              <Badge variant="secondary" className="justify-center py-2">HD Quality</Badge>
              <Badge variant="secondary" className="justify-center py-2">Fast Download</Badge>
              <Badge variant="secondary" className="justify-center py-2">Free</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TikTok;
