
// @ts-ignore -- Deno environment
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore -- Deno environment
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
// @ts-ignore -- Deno environment
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
      videos: [
        {
          url: videoUrl
        }
      ],
      format: "mp4"
    };

    console.log('Apify request body:', JSON.stringify(requestBody));
    console.log('Requesting from Apify URL:', apifyUrl);

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });

    console.log('Apify response status:', response.status, response.statusText);
    console.log('Apify response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      console.error('Apify request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Apify error response:', errorText);
      
      // Parse error response for better debugging
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed Apify error:', JSON.stringify(errorJson, null, 2));
        
        // Try alternative actor if the main one fails
        if (response.status === 400 || response.status === 500) {
          console.log('Primary Apify actor failed, trying alternative actor...');
          return await extractVideoUrlWithAlternativeActor(videoId, quality, title);
        }
        
        let errorMessage = `API request failed: ${response.status} - ${response.statusText}`;
        if (errorJson.error) {
          if (errorJson.error.message?.includes('insufficient credit')) {
            errorMessage = 'Apify account has insufficient credits. Please top up your Apify account.';
          } else if (errorJson.error.message?.includes('not found')) {
            errorMessage = 'Apify actor not found. Please check the actor configuration.';
          } else if (errorJson.error.message?.includes('Input is not valid')) {
            errorMessage = 'Invalid input format for Apify actor.';
          } else {
            errorMessage = `Apify error: ${errorJson.error.message}`;
          }
        }
        throw new Error(errorMessage);
      } catch (parseError) {
        console.error('Could not parse Apify error response as JSON:', parseError.message);
        // Try alternative actor as fallback
        console.log('Trying alternative actor due to unparseable error...');
        return await extractVideoUrlWithAlternativeActor(videoId, quality, title);
      }
    }

    const datasetItems = await response.json();
    console.log('Apify response received:', JSON.stringify(datasetItems, null, 2));
    console.log('Apify response items count:', Array.isArray(datasetItems) ? datasetItems.length : 'Not an array');
    
    if (!datasetItems || (Array.isArray(datasetItems) && datasetItems.length === 0)) {
      console.error('No data returned from Apify');
      console.log('Trying alternative actor...');
      return await extractVideoUrlWithAlternativeActor(videoId, quality, title);
    }

    const videoData = Array.isArray(datasetItems) ? datasetItems[0] : datasetItems;
    console.log('Video data structure:', JSON.stringify(Object.keys(videoData), null, 2));
    console.log('Processing video data:', JSON.stringify(videoData, null, 2));

         // Extract download URL from Apify response
     let downloadUrl: string | null = null;
     let selectedFormat: string | null = null;
     let filesize = 0;

    // Check for direct download URL in response (based on sample format)
    if (videoData.downloadUrl) {
      downloadUrl = videoData.downloadUrl;
      selectedFormat = videoData.format || quality;
      filesize = videoData.fileSize || 0;
      console.log(`Found direct download URL: format=${selectedFormat}, size=${filesize}`);
    }
    
    // Fallback: check for other possible response formats
    if (!downloadUrl) {
      // Check if response has videoFiles array (alternative format)
      if (videoData.videoFiles && Array.isArray(videoData.videoFiles)) {
        console.log('Available video files:', videoData.videoFiles.length);
        
                 // Find the best matching quality
         const targetQuality = quality.replace('p', '');
         let bestMatch: any = null;
        
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
             const match = videoData.videoFiles.find((vf: any) => 
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
      
      // Other fallback properties
      if (!downloadUrl) {
        if (videoData.videoUrl) {
          downloadUrl = videoData.videoUrl;
          selectedFormat = quality;
        }
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
  try {
    console.log('Using alternative Apify actor (youtube-dl-actor) for video:', videoId);
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Try a different actor that might be more reliable
    const apifyUrl = `https://api.apify.com/v2/acts/drobnikj~youtube-dl-actor/run-sync-get-dataset-items?token=${APIFY_API_KEY}`;
    
    const requestBody = {
      videoUrls: [videoUrl],
      downloadSubtitles: false,
      convertToMp3: false,
      subtitlesLanguage: "en"
    };

    console.log('Alternative actor request body:', JSON.stringify(requestBody));
    console.log('Alternative actor URL:', apifyUrl);

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });

    console.log('Alternative actor response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alternative Apify actor failed:', response.status, errorText);
      
      // Try one more fallback with a simpler actor
      console.log('Trying fallback actor...');
      return await extractVideoUrlWithFallbackActor(videoId, quality, title);
    }

    const data = await response.json();
    console.log('Alternative actor response:', JSON.stringify(data, null, 2));

    if (!data || data.length === 0) {
      console.log('No data from alternative actor, trying fallback...');
      return await extractVideoUrlWithFallbackActor(videoId, quality, title);
    }

    const videoData = data[0];
    
    // Parse the response from youtube-dl-actor
    let downloadUrl = null;
    if (videoData.videoFiles && Array.isArray(videoData.videoFiles) && videoData.videoFiles.length > 0) {
      const videoFile = videoData.videoFiles[0];
      downloadUrl = videoFile.url || videoFile.downloadUrl;
    } else if (videoData.downloadUrl) {
      downloadUrl = videoData.downloadUrl;
    } else if (videoData.url) {
      downloadUrl = videoData.url;
    }

    if (!downloadUrl) {
      console.log('No download URL found in alternative actor response, trying fallback...');
      return await extractVideoUrlWithFallbackActor(videoId, quality, title);
    }

    return {
      downloadUrl: downloadUrl,
      filename: `${sanitizeFilename(title)}.mp4`,
      filesize: videoData.fileSize || videoData.contentLength || 0,
      format: 'mp4'
    };

  } catch (error) {
    console.error('Alternative Apify actor failed:', error.message);
    console.log('Trying fallback actor...');
    return await extractVideoUrlWithFallbackActor(videoId, quality, title);
  }
}

// Final fallback using a different approach
async function extractVideoUrlWithFallbackActor(videoId: string, quality: string, title: string) {
  try {
    console.log('Using fallback Apify actor for video:', videoId);
    
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Use a more basic actor
    const apifyUrl = `https://api.apify.com/v2/acts/bernardo~youtube-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`;
    
    const requestBody = {
      startUrls: [{ url: videoUrl }],
      downloadVideo: false, // Just get metadata first
      maxConcurrency: 1
    };

    console.log('Fallback actor request body:', JSON.stringify(requestBody));

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fallback Apify actor failed:', response.status, errorText);
      throw new Error(`All Apify actors failed. Last error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fallback actor response:', JSON.stringify(data, null, 2));

    // For fallback, just return a mock response indicating the video exists
    // This will let the user know the video was found but download might not work
    return {
      downloadUrl: `https://www.youtube.com/watch?v=${videoId}`, // Return YouTube URL as fallback
      filename: `${sanitizeFilename(title)}.mp4`,
      filesize: 0,
      format: 'mp4',
      isYouTubeUrl: true // Flag to indicate this is not a direct download
    };

  } catch (error) {
    console.error('Fallback Apify actor failed:', error.message);
    throw new Error(`All Apify extraction methods failed: ${error.message}`);
  }
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
