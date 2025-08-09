import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Instagram, Download, Camera, Heart, Users, Sparkles } from 'lucide-react';

const Instagram = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Instagram className="h-16 w-16 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instagram Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download Instagram photos, videos, stories, and reels. Save your favorite Instagram content easily and securely.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Camera className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Photos & Videos</h3>
              <p className="text-gray-600">Download Instagram photos, videos, and carousel posts</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Stories & Reels</h3>
              <p className="text-gray-600">Save Instagram stories and reels in original quality</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Download content in the highest available quality</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Downloader Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Instagram className="h-6 w-6 mr-2 text-pink-600" />
              Download Instagram Content
            </CardTitle>
            <CardDescription>
              Paste an Instagram URL below to start downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Paste Instagram URL here..."
                  className="flex-1"
                />
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Supported: Photos, videos, stories, reels, IGTV, and highlights
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Download Instagram Content</CardTitle>
            <CardDescription>Follow these simple steps to download your favorite Instagram content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Copy Link</h3>
                <p className="text-gray-600">Copy the Instagram post, story, or reel URL</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Paste URL</h3>
                <p className="text-gray-600">Paste the URL and let our system process the content</p>
              </div>
              
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Choose format and download your content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Content Types</CardTitle>
            <CardDescription>Download various types of Instagram content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary" className="justify-center py-2">Photos</Badge>
              <Badge variant="secondary" className="justify-center py-2">Videos</Badge>
              <Badge variant="secondary" className="justify-center py-2">Stories</Badge>
              <Badge variant="secondary" className="justify-center py-2">Reels</Badge>
              <Badge variant="secondary" className="justify-center py-2">IGTV</Badge>
              <Badge variant="secondary" className="justify-center py-2">Highlights</Badge>
              <Badge variant="secondary" className="justify-center py-2">Carousel</Badge>
              <Badge variant="secondary" className="justify-center py-2">HD Quality</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Instagram;
