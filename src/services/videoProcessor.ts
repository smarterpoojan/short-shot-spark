
export interface Caption {
  text: string;
  start: number;
  end: number;
}

export interface VideoClip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  engagementScore: number;
  description: string;
  blob?: Blob;
  url?: string;
  captions?: Caption[];
}

interface ProcessingProgress {
  stage: string;
  progress: number;
  message: string;
}

interface ProcessingOptions {
  generateCaptions?: boolean;
  reframeSettings?: {
    aspectRatio: string;
    focusPoint: string;
    autoTrack: boolean;
  };
}

export class VideoProcessor {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async processVideo(
    file: File, 
    onProgress: (progress: ProcessingProgress) => void,
    options: ProcessingOptions = {}
  ): Promise<VideoClip[]> {
    console.log('🎬 Starting video processing pipeline');
    onProgress({ stage: 'initialization', progress: 10, message: 'Initializing video processing...' });
    
    // Create video element
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    const videoUrl = URL.createObjectURL(file);
    this.video.src = videoUrl;
    
    console.log(`📹 Video file loaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    return new Promise((resolve, reject) => {
      this.video!.onloadedmetadata = async () => {
        try {
          console.log(`🎞️ Video metadata loaded: ${this.video!.duration}s, ${this.video!.videoWidth}x${this.video!.videoHeight}`);
          
          onProgress({ stage: 'analysis', progress: 30, message: 'Analyzing video content for viral moments...' });
          
          const clips = await this.analyzeAndGenerateClips(onProgress);
          console.log(`🎯 Identified ${clips.length} potential viral clips`);
          
          onProgress({ stage: 'generation', progress: 60, message: 'Auto-reframing clips to vertical format...' });
          
          const processedClips = await this.generateVideoClips(clips, onProgress, options);
          
          if (options.generateCaptions) {
            onProgress({ stage: 'captions', progress: 85, message: 'Generating AI captions with animations...' });
            await this.generateCaptions(processedClips, onProgress);
          }
          
          onProgress({ stage: 'complete', progress: 100, message: 'Processing complete!' });
          console.log('✅ Video processing completed successfully');
          
          URL.revokeObjectURL(videoUrl);
          resolve(processedClips);
        } catch (error) {
          console.error('❌ Video processing failed:', error);
          reject(error);
        }
      };
      
      this.video!.onerror = () => {
        console.error('❌ Failed to load video file');
        reject(new Error('Failed to load video'));
      };
    });
  }

  private async analyzeAndGenerateClips(onProgress: (progress: ProcessingProgress) => void): Promise<VideoClip[]> {
    const duration = this.video!.duration;
    const clips: VideoClip[] = [];
    
    console.log('🔍 Starting AI analysis for viral moment detection');
    
    // Simulate AI analysis - in real implementation, this would use actual AI
    const numClips = Math.min(5, Math.floor(duration / 30)); // Generate up to 5 clips
    
    for (let i = 0; i < numClips; i++) {
      const startTime = Math.random() * (duration - 60);
      const clipDuration = 30 + Math.random() * 30; // 30-60 seconds
      
      const clip: VideoClip = {
        id: `clip-${i + 1}`,
        title: `Viral Moment #${i + 1}`,
        startTime,
        endTime: Math.min(startTime + clipDuration, duration),
        duration: Math.min(clipDuration, duration - startTime),
        engagementScore: 80 + Math.random() * 20,
        description: this.generateClipDescription(i)
      };
      
      console.log(`📊 Analyzed clip ${i + 1}: ${clip.title} (${clip.startTime.toFixed(1)}s - ${clip.endTime.toFixed(1)}s, score: ${clip.engagementScore.toFixed(1)}%)`);
      
      clips.push(clip);
      
      onProgress({ 
        stage: 'analysis', 
        progress: 30 + (i / numClips) * 25, 
        message: `Analyzing viral potential of segment ${i + 1}/${numClips}...` 
      });
    }
    
    return clips.sort((a, b) => b.engagementScore - a.engagementScore);
  }

  private generateClipDescription(index: number): string {
    const descriptions = [
      "High-energy segment with key insights and viral potential",
      "Emotional peak with strong audience engagement markers",
      "Educational content optimized for short-form consumption",
      "Entertaining moment with high shareability score",
      "Action-packed sequence perfect for vertical format"
    ];
    return descriptions[index % descriptions.length];
  }

  private async generateVideoClips(clips: VideoClip[], onProgress: (progress: ProcessingProgress) => void, options: ProcessingOptions): Promise<VideoClip[]> {
    const processedClips: VideoClip[] = [];
    
    console.log('🎨 Starting video clip generation with auto-reframing');
    
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      
      console.log(`🎞️ Processing clip ${i + 1}/${clips.length}: ${clip.title}`);
      
      onProgress({ 
        stage: 'generation', 
        progress: 60 + (i / clips.length) * 20, 
        message: `Auto-reframing clip ${i + 1}/${clips.length}...` 
      });
      
      try {
        const videoBlob = await this.extractVideoSegment(clip.startTime, clip.endTime, options.reframeSettings);
        const processedBlob = await this.autoReframe(videoBlob, options.reframeSettings);
        
        console.log(`✅ Clip ${i + 1} processed successfully (${(processedBlob.size / 1024).toFixed(2)} KB)`);
        
        processedClips.push({
          ...clip,
          blob: processedBlob,
          url: URL.createObjectURL(processedBlob)
        });
      } catch (error) {
        console.error(`❌ Failed to process clip ${clip.id}:`, error);
        // Add clip without blob for preview
        processedClips.push(clip);
      }
    }
    
    return processedClips;
  }

  private async generateCaptions(clips: VideoClip[], onProgress: (progress: ProcessingProgress) => void): Promise<void> {
    console.log('📝 Starting caption generation');
    
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      
      console.log(`🎯 Generating captions for clip: ${clip.title}`);
      
      // Simulate AI caption generation
      const captions: Caption[] = this.generateMockCaptions(clip.duration);
      clip.captions = captions;
      
      console.log(`✅ Generated ${captions.length} caption segments for ${clip.title}`);
      
      onProgress({ 
        stage: 'captions', 
        progress: 85 + (i / clips.length) * 10, 
        message: `Generating captions for clip ${i + 1}/${clips.length}...` 
      });
    }
  }

  private generateMockCaptions(duration: number): Caption[] {
    const captionTexts = [
      "Welcome to this amazing tutorial",
      "Here's what you need to know",
      "This will change everything",
      "Pay attention to this part",
      "The secret is right here",
      "Don't miss this important tip",
      "This is game-changing advice",
      "You won't believe what happens next",
      "Here's the breakthrough moment",
      "This is absolutely incredible"
    ];
    
    const captions: Caption[] = [];
    const numCaptions = Math.min(Math.floor(duration / 3), captionTexts.length);
    const segmentDuration = duration / numCaptions;
    
    for (let i = 0; i < numCaptions; i++) {
      captions.push({
        text: captionTexts[i],
        start: i * segmentDuration,
        end: (i + 1) * segmentDuration
      });
    }
    
    return captions;
  }

  private async extractVideoSegment(startTime: number, endTime: number, reframeSettings?: any): Promise<Blob> {
    console.log(`🎬 Extracting video segment: ${startTime.toFixed(1)}s - ${endTime.toFixed(1)}s`);
    
    // Set up canvas based on reframe settings
    const aspectRatio = reframeSettings?.aspectRatio || '9:16';
    const [width, height] = this.getCanvasDimensions(aspectRatio);
    
    this.canvas!.width = width;
    this.canvas!.height = height;
    
    console.log(`📐 Canvas configured: ${width}x${height} (${aspectRatio})`);
    
    // Create MediaRecorder for the canvas
    const stream = this.canvas!.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    
    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log(`📦 Video segment extracted: ${(blob.size / 1024).toFixed(2)} KB`);
        resolve(blob);
      };
      
      mediaRecorder.onerror = (error) => {
        console.error('❌ MediaRecorder error:', error);
        reject(error);
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Set video to start time
      this.video!.currentTime = startTime;
      
      const recordFrame = () => {
        if (this.video!.currentTime >= endTime) {
          mediaRecorder.stop();
          return;
        }
        
        // Draw current frame with auto-reframing
        this.drawReframedVideo(reframeSettings);
        
        // Continue to next frame
        requestAnimationFrame(recordFrame);
      };
      
      this.video!.onseeked = () => {
        this.video!.play();
        recordFrame();
      };
      
      // Stop recording after duration
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, (endTime - startTime) * 1000);
    });
  }

  private getCanvasDimensions(aspectRatio: string): [number, number] {
    switch (aspectRatio) {
      case '9:16':
        return [720, 1280];
      case '16:9':
        return [1280, 720];
      case '1:1':
        return [1080, 1080];
      default:
        return [720, 1280];
    }
  }

  private drawReframedVideo(reframeSettings?: any) {
    if (!this.video || !this.canvas || !this.ctx) return;
    
    const videoWidth = this.video.videoWidth;
    const videoHeight = this.video.videoHeight;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    // Calculate scaling for specified format
    const videoAspect = videoWidth / videoHeight;
    const targetAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    const focusPoint = reframeSettings?.focusPoint || 'center';
    
    if (videoAspect > targetAspect) {
      // Video is wider - crop sides
      drawHeight = canvasHeight;
      drawWidth = drawHeight * videoAspect;
      offsetY = 0;
      
      // Apply focus point logic
      switch (focusPoint) {
        case 'face':
          offsetX = (canvasWidth - drawWidth) * 0.3; // Slightly left of center
          break;
        case 'action':
          offsetX = (canvasWidth - drawWidth) * 0.4; // Focus on action area
          break;
        default:
          offsetX = (canvasWidth - drawWidth) / 2; // Center
      }
    } else {
      // Video is taller - crop top/bottom
      drawWidth = canvasWidth;
      drawHeight = drawWidth / videoAspect;
      offsetX = 0;
      
      switch (focusPoint) {
        case 'face':
          offsetY = (canvasHeight - drawHeight) * 0.2; // Upper third
          break;
        case 'action':
          offsetY = (canvasHeight - drawHeight) * 0.3; // Action focus
          break;
        default:
          offsetY = (canvasHeight - drawHeight) / 2; // Center
      }
    }
    
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw video frame with auto-reframing
    this.ctx.drawImage(this.video, offsetX, offsetY, drawWidth, drawHeight);
    
    // Add subtle vignette effect for better visual appeal
    const gradient = this.ctx.createRadialGradient(
      canvasWidth/2, canvasHeight/2, 0,
      canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight)/2
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  private async autoReframe(videoBlob: Blob, reframeSettings?: any): Promise<Blob> {
    console.log('🎨 Applying auto-reframe enhancements');
    // The reframing is already applied in drawReframedVideo
    // This method could be extended for additional processing
    return videoBlob;
  }

  downloadClip(clip: VideoClip) {
    if (!clip.blob) {
      console.error('❌ No video data available for download');
      return;
    }
    
    console.log(`💾 Starting download: ${clip.title}`);
    
    const url = URL.createObjectURL(clip.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Download initiated: ${a.download}`);
  }
}

export const videoProcessor = new VideoProcessor();
