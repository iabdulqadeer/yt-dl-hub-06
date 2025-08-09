// Simple test script to verify server endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

async function testServer() {
  console.log('🧪 Testing YouTube Downloader Server...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test downloads endpoint
    console.log('\n2. Testing downloads endpoint...');
    const downloadsResponse = await fetch(`${BASE_URL}/downloads`);
    const downloadsData = await downloadsResponse.json();
    console.log('✅ Downloads list:', Array.isArray(downloadsData) ? `${downloadsData.length} files` : 'Error');

    // Test YouTube info endpoint with a sample URL
    console.log('\n3. Testing YouTube info endpoint...');
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll
    const infoResponse = await fetch(`${BASE_URL}/youtube/info?url=${encodeURIComponent(testUrl)}`);
    const infoData = await infoResponse.json();
    
    if (infoData.success) {
      console.log('✅ YouTube info:', `Found ${infoData.videos?.length || 0} video(s)`);
      if (infoData.videos && infoData.videos.length > 0) {
        console.log('   Title:', infoData.videos[0].title);
        console.log('   Qualities:', infoData.videos[0].qualities.join(', '));
      }
    } else {
      console.log('❌ YouTube info failed:', infoData.error);
    }

    console.log('\n🎉 Server test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the frontend: npm run dev');
    console.log('2. Open http://localhost:5173');
    console.log('3. Test with any YouTube URL');

  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 3001');
  }
}

testServer();





