import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, Smartphone, Monitor, Globe, CheckCircle } from 'lucide-react';

const Install = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Settings className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download & Install
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get our video downloader app on your preferred platform. Available for desktop and mobile devices.
          </p>
        </div>

        {/* Platform Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Desktop App</h3>
              <p className="text-gray-600 mb-4">Download for Windows, Mac, and Linux</p>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Windows
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Mac
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Linux
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile App</h3>
              <p className="text-gray-600 mb-4">Available on iOS and Android</p>
              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  App Store
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Google Play
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Web Version</h3>
              <p className="text-gray-600 mb-4">Use directly in your browser</p>
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Open Web App
                </Button>
                <p className="text-sm text-gray-500">No installation required</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browser Extensions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Browser Extensions</CardTitle>
            <CardDescription>Install our extension for quick access to video downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Chrome</h3>
                <Button size="sm" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Firefox</h3>
                <Button size="sm" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Safari</h3>
                <Button size="sm" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Globe className="h-8 w-8 text-blue-700 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Edge</h3>
                <Button size="sm" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>Check if your system meets the requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Desktop Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Windows 10/11, macOS 10.15+, or Linux</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>4GB RAM minimum, 8GB recommended</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2GB free disk space</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Internet connection required</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Mobile Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>iOS 13+ or Android 8+</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>2GB RAM minimum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>500MB free storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>WiFi or mobile data</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Installation Guide</CardTitle>
            <CardDescription>Follow these steps to install the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Download</h3>
                  <p className="text-gray-600">Click the download button for your operating system above</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Install</h3>
                  <p className="text-gray-600">Run the installer and follow the on-screen instructions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Launch</h3>
                  <p className="text-gray-600">Open the application and start downloading videos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Features Comparison</CardTitle>
            <CardDescription>Compare features across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">Desktop App</th>
                    <th className="text-center py-2">Mobile App</th>
                    <th className="text-center py-2">Web Version</th>
                    <th className="text-center py-2">Browser Extension</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Batch Downloads</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Offline Mode</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Quick Access</td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">-</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Cross-Platform</td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Install;
