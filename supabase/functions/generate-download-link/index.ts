import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log(`Generating download link for video ${videoId} with quality ${quality}`)

    // Call the youtube-extractor function to get real download URLs
    const extractorUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/youtube-extractor`
    const extractorResponse = await fetch(extractorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ videoId, quality })
    })

    if (!extractorResponse.ok) {
      throw new Error(`Extractor service error: ${extractorResponse.status}`)
    }

    const extractorData = await extractorResponse.json()

    if (!extractorData.success) {
      throw new Error(extractorData.error || 'Failed to extract video')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        downloadUrl: extractorData.downloadUrl,
        filename: extractorData.filename,
        filesize: extractorData.filesize,
        isDirectDownload: extractorData.isDirectDownload,
        format: extractorData.format,
        videoId,
        quality
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating download link:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate download link' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})