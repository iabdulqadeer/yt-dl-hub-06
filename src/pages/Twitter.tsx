import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Twitter, Download, MessageCircle, TrendingUp, Users, Zap } from 'lucide-react';

const Twitter = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Twitter className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Twitter Video Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download Twitter videos, GIFs, and media content. Save your favorite tweets and videos from Twitter easily.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Downloads</h3>
              <p className="text-gray-600">Download Twitter videos and GIFs in high quality</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tweet Media</h3>
              <p className="text-gray-600">Extract media from tweets, replies, and threads</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Quick downloads with optimized processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Downloader Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Twitter className="h-6 w-6 mr-2 text-blue-400" />
              Download Twitter Video
            </CardTitle>
            <CardDescription>
              Paste a Twitter video URL below to start downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input 
                  placeholder="Paste Twitter video URL here..."
                  className="flex-1"
                />
                <Button className="bg-blue-400 hover:bg-blue-500">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Supported: Videos, GIFs, images, and media from tweets
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Download Twitter Videos</CardTitle>
            <CardDescription>Follow these simple steps to download your favorite Twitter content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Copy Tweet URL</h3>
                <p className="text-gray-600">Copy the Twitter video or tweet URL</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Paste & Process</h3>
                <p className="text-gray-600">Paste the URL and let our system extract the media</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Choose quality and download your content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Content Types</CardTitle>
            <CardDescription>Download various types of Twitter content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="secondary" className="justify-center py-2">Videos</Badge>
              <Badge variant="secondary" className="justify-center py-2">GIFs</Badge>
              <Badge variant="secondary" className="justify-center py-2">Images</Badge>
              <Badge variant="secondary" className="justify-center py-2">Tweets</Badge>
              <Badge variant="secondary" className="justify-center py-2">Threads</Badge>
              <Badge variant="secondary" className="justify-center py-2">Replies</Badge>
              <Badge variant="secondary" className="justify-center py-2">High Quality</Badge>
              <Badge variant="secondary" className="justify-center py-2">HD</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Twitter;
