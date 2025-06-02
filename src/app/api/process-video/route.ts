// src/app/api/process-video/route.ts
import { NextResponse } from 'next/server';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const maxDuration = 300; // 5 minutes max execution time
export const dynamic = 'force-dynamic'; // Ensure dynamic evaluation

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get('video') as File;
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    console.log('Processing video file:', {
      name: videoFile.name,
      type: videoFile.type,
      size: videoFile.size
    });

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg();
    
    // Load FFmpeg
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js'
    });
    
    // Enable logging
    ffmpeg.on('log', ({ type, message }) => {
      console.log(`[FFmpeg ${type}] ${message}`);
    });
    
    const inputName = 'input.webm';
    const outputName = 'output.mp4';
    
    // Write the file to FFmpeg's virtual filesystem
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
    
    // Run FFmpeg commands
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '22',
      '-pix_fmt', 'yuv420p',
      outputName
    ]);

    // Read the result
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: 'video/mp4' });
    
    // Clean up
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="export-${Date.now()}.mp4"`
      }
    });
    
  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}