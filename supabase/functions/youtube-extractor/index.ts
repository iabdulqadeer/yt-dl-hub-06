
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')

interface VideoFormat {
  quality: string;
  format: string;
  url: string;
  filesize?: number;
}

interface ExtractedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  view_count: number;
  upload_date: string;
  formats: VideoFormat[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoId, quality } = await req.json()

    if (!videoId || !quality) {
      return new Response(
        JSON.stringify({ error: 'Video ID and quality are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Extracting download URL for video ${videoId} with quality ${quality}`)

    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not configured')
      return generateErrorResponse('YouTube API key not configured', 400)
    }

    // Get video details from YouTube API first
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
    
    try {
      const videoResponse = await fetch(videoDetailsUrl)
      if (!videoResponse.ok) {
        throw new Error(`YouTube API error: ${videoResponse.status}`)
      }

      const videoData = await videoResponse.json()
      
      if (!videoData.items || videoData.items.length === 0) {
        throw new Error('Video not found')
      }

      const video = videoData.items[0]
      const title = video.snippet.title
      const duration = video.contentDetails.duration

      console.log(`Video found: ${title}`)

      try {
        // Extract video URL using Apify
        const extractionResult = await extractVideoUrlWithApify(videoId, quality, title)
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            downloadUrl: extractionResult.downloadUrl,
            filename: extractionResult.filename,
            filesize: extractionResult.filesize,
            isDirectDownload: true,
            title: title,
            duration: parseDuration(duration),
            format: extractionResult.format || 'mp4'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } catch (extractionError) {
        console.error('Video extraction failed:', extractionError)
        return generateErrorResponse(`Video extraction failed: ${extractionError.message}`)
      }

    } catch (apiError) {
      console.error('Error with YouTube API:', apiError)
      return generateErrorResponse(`YouTube API error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error extracting video:', error)
    return generateErrorResponse('Video extraction service unavailable')
  }
})

async function extractVideoUrlWithApify(videoId: string, quality: string, title: string) {
  if (!APIFY_API_KEY) {
    console.error('APIFY_API_KEY not found - extraction service not configured');
    throw new Error('Video extraction service not configured. Please configure Apify API key.');
  }

  try {
    console.log(`Using Apify to extract video ${videoId} with quality ${quality}`);
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Using Apify's YouTube Video Downloader with correct field names
    const apifyUrl = `https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items?token=${APIFY_API_KEY}`;
    
    const requestBody = {
      videos: [videoUrl], // Changed from videoUrls to videos
      downloadVideo: true,
      downloadAudio: false,
      videoQuality: quality.replace('p', ''), // Convert "720p" to "720"
      videoFormat: "mp4"
    };

    console.log('Apify request body:', JSON.stringify(requestBody));

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('Apify request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Apify error response:', errorText);
      
      let errorMessage = `API request failed: ${response.status} - ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          if (errorJson.error.message?.includes('insufficient credit')) {
            errorMessage = 'Apify account has insufficient credits. Please top up your Apify account.';
          } else if (errorJson.error.message?.includes('not found')) {
            errorMessage = 'Apify actor not found. Please check the actor configuration.';
          } else if (errorJson.error.message?.includes('Input is not valid')) {
            // Try alternative actor if current one fails with input validation
            console.log('Trying alternative Apify actor...');
            return await extractVideoUrlWithAlternativeActor(videoId, quality, title);
          } else {
            errorMessage = `Apify error: ${errorJson.error.message}`;
          }
        }
      } catch (parseError) {
        // Use default error message if we can't parse the error
      }
      
      throw new Error(errorMessage);
    }

    const datasetItems = await response.json();
    console.log('Apify response received, items count:', datasetItems.length);
    
    if (!datasetItems || datasetItems.length === 0) {
      throw new Error('No video data returned from Apify extraction service');
    }

    const videoData = datasetItems[0];
    console.log('Video data structure:', JSON.stringify(Object.keys(videoData), null, 2));

    // Extract download URL from Apify response
    let downloadUrl = null;
    let selectedFormat = null;
    let filesize = 0;

    // Apify typically returns video download links in videoFiles array
    if (videoData.videoFiles && Array.isArray(videoData.videoFiles)) {
      console.log('Available video files:', videoData.videoFiles.length);
      
      // Find the best matching quality
      const targetQuality = quality.replace('p', '');
      let bestMatch = null;
      
      // First try to find exact quality match
      for (const videoFile of videoData.videoFiles) {
        console.log(`Checking video file: quality=${videoFile.quality}, url=${videoFile.url ? 'present' : 'missing'}`);
        
        if (videoFile.quality && videoFile.quality.includes(targetQuality)) {
          bestMatch = videoFile;
          break;
        }
      }
      
      // If no exact match, find the closest quality
      if (!bestMatch) {
        const qualityOrder = ['1080', '720', '480', '360', '240'];
        for (const q of qualityOrder) {
          const match = videoData.videoFiles.find(vf => 
            vf.quality && vf.quality.includes(q) && vf.url
          );
          if (match) {
            bestMatch = match;
            break;
          }
        }
      }
      
      if (bestMatch) {
        downloadUrl = bestMatch.url;
        selectedFormat = bestMatch.quality || quality;
        filesize = bestMatch.contentLength || 0;
        console.log(`Selected video file: quality=${selectedFormat}, size=${filesize}`);
      }
    }

    // Fallback: check for direct download URL properties
    if (!downloadUrl) {
      if (videoData.videoUrl) {
        downloadUrl = videoData.videoUrl;
        selectedFormat = quality;
      } else if (videoData.downloadUrl) {
        downloadUrl = videoData.downloadUrl;
        selectedFormat = quality;
      }
    }

    if (!downloadUrl) {
      console.error('No suitable download URL found in Apify response:', JSON.stringify(videoData, null, 2));
      throw new Error(`No download URL found for quality ${quality}. Available data: ${Object.keys(videoData).join(', ')}`);
    }

    // Validate URL
    if (!downloadUrl.startsWith('http')) {
      throw new Error('Invalid download URL received from Apify extraction service');
    }

    console.log(`Successfully extracted - Format: ${selectedFormat}, URL: ${downloadUrl.substring(0, 100)}...`);

    return {
      success: true,
      downloadUrl: downloadUrl,
      filename: `${sanitizeFilename(title)}_${selectedFormat || quality}.mp4`,
      filesize: filesize || 0,
      format: 'mp4'
    };

  } catch (error) {
    console.error('Apify extraction service error:', error);
    throw error;
  }
}

async function extractVideoUrlWithAlternativeActor(videoId: string, quality: string, title: string) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  // Try alternative Apify actor with different input schema
  const alternativeActorUrl = `https://api.apify.com/v2/acts/bernardo~youtube-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`;
  
  const alternativeRequestBody = {
    startUrls: [{ url: videoUrl }],
    downloadVideos: true,
    videoQuality: quality.replace('p', ''),
    maxResults: 1
  };

  console.log('Trying alternative actor with body:', JSON.stringify(alternativeRequestBody));

  const response = await fetch(alternativeActorUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alternativeRequestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Alternative actor failed:', errorText);
    throw new Error(`Alternative extraction method also failed: ${response.status}`);
  }

  const datasetItems = await response.json();
  console.log('Alternative actor response:', JSON.stringify(datasetItems, null, 2));

  if (!datasetItems || datasetItems.length === 0) {
    throw new Error('Alternative extraction method returned no data');
  }

  const videoData = datasetItems[0];
  let downloadUrl = videoData.downloadUrl || videoData.videoUrl;

  if (!downloadUrl) {
    throw new Error('Alternative extraction method found no download URL');
  }

  return {
    success: true,
    downloadUrl: downloadUrl,
    filename: `${sanitizeFilename(title)}_${quality}.mp4`,
    filesize: 0,
    format: 'mp4'
  };
}

function generateErrorResponse(error: string, status: number = 500) {
  return new Response(
    JSON.stringify({ 
      success: false,
      error: error
    }),
    { 
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^\w\-_\.\s]/g, '').replace(/\s+/g, '_').substring(0, 50)
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
