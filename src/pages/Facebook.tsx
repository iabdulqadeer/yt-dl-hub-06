import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FacebookIcon, Download, Play, Clock, Users, Shield } from 'lucide-react';

const Facebook = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FacebookIcon className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Facebook Video Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download Facebook videos, reels, and stories easily. High-quality downloads for all your social media content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Downloads</h3>
              <p className="text-gray-600">Download Facebook videos, reels, and stories in original quality</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your downloads are secure and your privacy is protected</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Quick downloads with our optimized processing system</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Downloader Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FacebookIcon className="h-6 w-6 mr-2 text-blue-600" />
              Download Facebook Video
            </CardTitle>
            <CardDescription>
              Paste a Facebook video URL below to start downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Paste Facebook video URL here..."
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Supported: Facebook videos, reels, stories, and live videos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Download Facebook Videos</CardTitle>
            <CardDescription>Follow these simple steps to download your favorite Facebook content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Copy URL</h3>
                <p className="text-gray-600">Copy the Facebook video URL from your browser</p>
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
                <p className="text-gray-600">Choose quality and download your video</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Content Types</CardTitle>
            <CardDescription>Download various types of Facebook content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary" className="justify-center py-2">Videos</Badge>
              <Badge variant="secondary" className="justify-center py-2">Reels</Badge>
              <Badge variant="secondary" className="justify-center py-2">Stories</Badge>
              <Badge variant="secondary" className="justify-center py-2">Live Videos</Badge>
              <Badge variant="secondary" className="justify-center py-2">IGTV</Badge>
              <Badge variant="secondary" className="justify-center py-2">Posts</Badge>
              <Badge variant="secondary" className="justify-center py-2">High Quality</Badge>
              <Badge variant="secondary" className="justify-center py-2">HD</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Facebook;
