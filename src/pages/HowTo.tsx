import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Youtube, Facebook, Instagram, Twitter, Music, Download, Copy, Paste, CheckCircle } from 'lucide-react';

const HowTo = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Download Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete guide on how to download videos from various social media platforms. Follow these step-by-step instructions.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Youtube className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">YouTube</h3>
              <p className="text-gray-600 mb-4">Download videos, music, and playlists</p>
              <Badge variant="secondary">MP4, MP3, WebM</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Facebook className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Facebook</h3>
              <p className="text-gray-600 mb-4">Download videos, reels, and stories</p>
              <Badge variant="secondary">MP4, HD Quality</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Instagram className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instagram</h3>
              <p className="text-gray-600 mb-4">Download photos, videos, and stories</p>
              <Badge variant="secondary">MP4, Photos</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Twitter className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Twitter</h3>
              <p className="text-gray-600 mb-4">Download videos and GIFs</p>
              <Badge variant="secondary">MP4, GIF</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Music className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">TikTok</h3>
              <p className="text-gray-600 mb-4">Download videos without watermark</p>
              <Badge variant="secondary">MP4, No Watermark</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Platforms</h3>
              <p className="text-gray-600 mb-4">Universal downloader for all platforms</p>
              <Badge variant="secondary">Multi-Platform</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Step by Step Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step-by-Step Download Guide</CardTitle>
            <CardDescription>Follow these universal steps for any platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Find the Video</h3>
                  <p className="text-gray-600">Navigate to the video you want to download on your chosen platform (YouTube, Facebook, Instagram, etc.)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Copy the URL</h3>
                  <p className="text-gray-600">Copy the video URL from your browser's address bar or use the share button to copy the link</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Paste and Process</h3>
                  <p className="text-gray-600">Paste the URL into our downloader and wait for the system to process the video</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Choose Quality</h3>
                  <p className="text-gray-600">Select your preferred video quality and format from the available options</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Download</h3>
                  <p className="text-gray-600">Click the download button and save your video to your device</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Specific Guides */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform-Specific Instructions</CardTitle>
            <CardDescription>Detailed guides for each platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="youtube">
                <AccordionTrigger className="flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                  YouTube Download Guide
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Go to YouTube and find your video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Copy the URL from the address bar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Paste into our YouTube downloader</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose quality (4K, 1080p, 720p, etc.)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Download video or audio only</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="facebook">
                <AccordionTrigger className="flex items-center">
                  <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                  Facebook Download Guide
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Find the Facebook video you want to download</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Click the share button and copy the link</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Paste the URL into our Facebook downloader</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Select quality and download</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="instagram">
                <AccordionTrigger className="flex items-center">
                  <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                  Instagram Download Guide
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Open Instagram and find the post/story</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Click the share button and copy the link</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Paste the URL into our Instagram downloader</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Download photo or video</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tiktok">
                <AccordionTrigger className="flex items-center">
                  <Music className="h-5 w-5 mr-2 text-pink-500" />
                  TikTok Download Guide
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Open TikTok and find the video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Click share and copy the link</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Paste into our TikTok downloader</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Download without watermark</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Tips and Tricks */}
        <Card>
          <CardHeader>
            <CardTitle>Tips & Best Practices</CardTitle>
            <CardDescription>Get the most out of your downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quality Selection</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Choose higher quality for better viewing experience</li>
                  <li>• Lower quality for faster downloads</li>
                  <li>• Audio-only for music downloads</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Download Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ensure stable internet connection</li>
                  <li>• Use supported browsers (Chrome, Firefox, Safari)</li>
                  <li>• Check available storage space</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowTo;
