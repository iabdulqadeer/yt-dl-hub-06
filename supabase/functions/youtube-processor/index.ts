// This file runs in Deno environment, not Node.js
// @ts-ignore -- Deno environment
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore -- Deno environment
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')

// Debug: Check if API key is available
console.log('YouTube API Key available:', !!YOUTUBE_API_KEY)
console.log('YouTube API Key length:', YOUTUBE_API_KEY?.length || 0)
console.log('Environment variables check:')
// @ts-ignore -- Deno environment
console.log('- YOUTUBE_API_KEY exists:', !!Deno.env.get('YOUTUBE_API_KEY'))
// @ts-ignore -- Deno environment
console.log('- APIFY_API_KEY exists:', !!Deno.env.get('APIFY_API_KEY'))

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  qualities: string[];
  uploader: string;
  view_count: number;
  upload_date: string;
}

interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_count: number;
  uploader: string;
  videos: VideoInfo[];
}

interface ProcessResult {
  success: boolean;
  type: 'video' | 'playlist';
  videos?: VideoInfo[];
  playlist?: PlaylistInfo;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()

    if (!url || !YOUTUBE_API_KEY) {
      return new Response(
        JSON.stringify({ error: !url ? 'URL is required' : 'YouTube API key not configured' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Detect URL type and extract IDs
    const playlistId = extractPlaylistId(url)
    const videoId = extractVideoId(url)
    
    if (!playlistId && !videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let result: ProcessResult

    if (playlistId) {
      console.log('Processing playlist ID:', playlistId)
      result = await processPlaylist(playlistId)
    } else {
      console.log('Processing video ID:', videoId)
      result = await processSingleVideo(videoId!)
    }

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || 'Processing failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function extractPlaylistId(url: string): string | null {
  const regex = /[?&]list=([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function processSingleVideo(videoId: string): Promise<ProcessResult> {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${YOUTUBE_API_KEY}`
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return { success: false, type: 'video', error: 'Video not found' }
    }

    const videoData = data.items[0]
    const video: VideoInfo = {
      id: videoData.id,
      title: videoData.snippet.title,
      thumbnail: videoData.snippet.thumbnails.maxres?.url || videoData.snippet.thumbnails.high?.url || videoData.snippet.thumbnails.default.url,
      duration: parseDuration(videoData.contentDetails.duration),
      qualities: ['1080p', '720p', '480p', '360p'],
      uploader: videoData.snippet.channelTitle,
      view_count: parseInt(videoData.statistics.viewCount) || 0,
      upload_date: videoData.snippet.publishedAt.split('T')[0]
    }

    console.log('Processed video:', video)
    return { success: true, type: 'video', videos: [video] }
  } catch (error) {
    console.error('Error processing video:', error)
    return { success: false, type: 'video', error: error.message }
  }
}

async function processPlaylist(playlistId: string): Promise<ProcessResult> {
  try {
    // First, get playlist metadata
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
    
    const playlistResponse = await fetch(playlistUrl)
    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`)
    }

    const playlistData = await playlistResponse.json()
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return { success: false, type: 'playlist', error: 'Playlist not found' }
    }

    const playlistInfo = playlistData.items[0]
    const videoCount = playlistInfo.contentDetails.itemCount

    console.log(`Processing playlist: ${playlistInfo.snippet.title} (${videoCount} videos)`)

    // Get playlist items (videos in the playlist)
    const videos: VideoInfo[] = []
    let nextPageToken = ''
    let pageCount = 0
    const maxPages = 10 // Limit to prevent API quota exhaustion

    do {
      const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}`
      
      const itemsResponse = await fetch(itemsUrl)
      if (!itemsResponse.ok) {
        throw new Error(`YouTube API error: ${itemsResponse.status}`)
      }

      const itemsData = await itemsResponse.json()
      
      if (itemsData.items && itemsData.items.length > 0) {
        // Get detailed video information in batch
        const videoIds = itemsData.items.map((item: any) => item.contentDetails.videoId).join(',')
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=snippet,contentDetails,statistics&key=${YOUTUBE_API_KEY}`
        
        const videosResponse = await fetch(videosUrl)
        if (videosResponse.ok) {
          const videosData = await videosResponse.json()
          
          videosData.items?.forEach((videoData: any) => {
            const video: VideoInfo = {
              id: videoData.id,
              title: videoData.snippet.title,
              thumbnail: videoData.snippet.thumbnails.maxres?.url || videoData.snippet.thumbnails.high?.url || videoData.snippet.thumbnails.default.url,
              duration: parseDuration(videoData.contentDetails.duration),
              qualities: ['1080p', '720p', '480p', '360p'],
              uploader: videoData.snippet.channelTitle,
              view_count: parseInt(videoData.statistics.viewCount) || 0,
              upload_date: videoData.snippet.publishedAt.split('T')[0]
            }
            videos.push(video)
          })
        }
      }

      nextPageToken = itemsData.nextPageToken || ''
      pageCount++
    } while (nextPageToken && pageCount < maxPages)

    const playlist: PlaylistInfo = {
      id: playlistId,
      title: playlistInfo.snippet.title,
      description: playlistInfo.snippet.description || '',
      thumbnail: playlistInfo.snippet.thumbnails.maxres?.url || playlistInfo.snippet.thumbnails.high?.url || playlistInfo.snippet.thumbnails.default.url,
      video_count: videos.length,
      uploader: playlistInfo.snippet.channelTitle,
      videos
    }

    console.log(`Processed playlist: ${playlist.title} with ${videos.length} videos`)
    return { success: true, type: 'playlist', videos, playlist }
  } catch (error) {
    console.error('Error processing playlist:', error)
    return { success: false, type: 'playlist', error: error.message }
  }
}

function parseDuration(duration: string): string {
  // Parse ISO 8601 duration format (PT4M13S -> 4:13)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}