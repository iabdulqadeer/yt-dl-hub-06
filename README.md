# YouTube Downloader Hub

A modern, responsive web application for downloading videos from multiple platforms including YouTube, Facebook, Instagram, Twitter, and TikTok.

## 🚀 Features

- **Multi-Platform Support**: Download videos from YouTube, Facebook, Instagram, Twitter, and TikTok
- **High-Quality Downloads**: Support for multiple video qualities (4K, 1080p, 720p, 480p, 360p)
- **Modern UI**: Beautiful, responsive design built with React, TypeScript, and Tailwind CSS
- **Real-time Processing**: Live progress indicators and loading states
- **Bulk Operations**: Process multiple videos at once
- **Export Options**: Copy links or export to text files

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Query
- **Notifications**: Sonner
- **Backend**: Express.js, ytdl-core (for real implementation)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yt-dl-hub-06
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Current Status

### ✅ Working Features
- **Real YouTube Downloader**: Fully functional with ytdl-core integration
- **Playlist Support**: Extract and process entire YouTube playlists
- **Real-time Updates**: Socket.io integration for live progress tracking
- **Direct File Downloads**: Server-side file storage and management
- **Multi-page Navigation**: Complete routing between different platforms
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Progress indicators and spinners
- **Error Handling**: Comprehensive error messages and user feedback
- **Fallback Mechanisms**: Automatic fallback when ytdl-core fails
- **Download History**: Track and manage downloaded files
- **Real Downloads**: Actual video download functionality with file management

### 🔧 Real Implementation
The application now uses real ytdl-core integration with robust fallback mechanisms:

**Real Features:**
- Real YouTube video information extraction
- Real playlist processing with all videos
- Quality selection (1080p, 720p, 480p, 360p)
- Direct file downloads with server-side storage
- Real-time progress tracking via Socket.io
- Download history and file management
- Fallback methods when YouTube updates break ytdl-core
- Progress tracking and comprehensive error handling

## 🚀 Quick Start (Real Implementation)

The application is now fully functional with real YouTube integration!

### Option 1: Start Backend Server (Recommended)
1. **Start the backend server** (for real YouTube processing):
   ```bash
   # Windows
   start-backend.bat
   
   # Or PowerShell
   .\start-backend.ps1
   
   # Or manually
   cd server
   npm install
   npm start
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```

### Option 2: Frontend Only (Fallback Mode)
If the backend server is not running, the application will automatically use fallback methods:
- Video information extraction from YouTube pages
- Mock download links with realistic simulation
- Full UI functionality with error handling

### Environment Variables
Create a `.env` file in the root directory (optional):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📱 Usage

1. **Home Page**: Overview of all supported platforms
2. **YouTube Page**: Dedicated YouTube video downloader
3. **Platform Pages**: Specific downloaders for each platform
4. **How-to Page**: Complete guide and tutorials
5. **Install Page**: Download options and installation guide

### YouTube Download Process
1. Paste a YouTube URL
2. Click "Process URL" to fetch video information
3. Select your preferred quality
4. Click "Get Link" to generate download link
5. Click "Download" to start the download

## 🎨 UI Components

The application uses a comprehensive set of UI components:
- Cards, Buttons, Inputs, Select dropdowns
- Progress bars, Badges, Toasts
- Responsive navigation and layouts
- Loading spinners and animations

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Shadcn/ui components
│   ├── Layout.tsx     # Main layout wrapper
│   ├── Navbar.tsx     # Navigation component
│   └── YouTubeDownloader.tsx
├── pages/             # Page components
├── services/          # API and utility services
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

### Key Components
- **YouTubeDownloader**: Main download functionality
- **Layout**: Master layout with navigation
- **Navbar**: Responsive navigation menu
- **Services**: API integration and utilities

## 🎯 Future Enhancements

- [ ] Real YouTube API integration
- [ ] Facebook video downloader
- [ ] Instagram content downloader
- [ ] Twitter video downloader
- [ ] TikTok video downloader
- [ ] Playlist support
- [ ] Batch download functionality
- [ ] Download history
- [ ] User preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This application is for educational and demonstration purposes. Please respect YouTube's Terms of Service and only download content you have permission to download.
