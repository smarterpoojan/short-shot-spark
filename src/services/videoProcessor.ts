
interface VideoClip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  engagementScore: number;
  description: string;
  blob?: Blob;
  url?: string;
}

interface ProcessingProgress {
  stage: string;
  progress: number;
  message: string;
}

export class VideoProcessor {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async processVideo(
    file: File, 
    onProgress: (progress: ProcessingProgress) => void
  ): Promise<VideoClip[]> {
    onProgress({ stage: 'initialization', progress: 10, message: 'Initializing video processing...' });
    
    // Create video element
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    const videoUrl = URL.createObjectURL(file);
    this.video.src = videoUrl;
    
    return new Promise((resolve, reject) => {
      this.video!.onloadedmetadata = async () => {
        try {
          onProgress({ stage: 'analysis', progress: 30, message: 'Analyzing video content...' });
          
          const clips = await this.analyzeAndGenerateClips(onProgress);
          
          onProgress({ stage: 'generation', progress: 80, message: 'Generating short clips...' });
          
          const processedClips = await this.generateVideoClips(clips, onProgress);
          
          onProgress({ stage: 'complete', progress: 100, message: 'Processing complete!' });
          
          URL.revokeObjectURL(videoUrl);
          resolve(processedClips);
        } catch (error) {
          reject(error);
        }
      };
      
      this.video!.onerror = () => reject(new Error('Failed to load video'));
    });
  }

  private async analyzeAndGenerateClips(onProgress: (progress: ProcessingProgress) => void): Promise<VideoClip[]> {
    const duration = this.video!.duration;
    const clips: VideoClip[] = [];
    
    // Simulate AI analysis - in real implementation, this would use actual AI
    const numClips = Math.min(5, Math.floor(duration / 30)); // Generate up to 5 clips
    
    for (let i = 0; i < numClips; i++) {
      const startTime = Math.random() * (duration - 60);
      const clipDuration = 30 + Math.random() * 30; // 30-60 seconds
      
      clips.push({
        id: `clip-${i + 1}`,
        title: `Viral Moment #${i + 1}`,
        startTime,
        endTime: Math.min(startTime + clipDuration, duration),
        duration: Math.min(clipDuration, duration - startTime),
        engagementScore: 80 + Math.random() * 20,
        description: this.generateClipDescription(i)
      });
      
      onProgress({ 
        stage: 'analysis', 
        progress: 30 + (i / numClips) * 40, 
        message: `Analyzing segment ${i + 1}/${numClips}...` 
      });
    }
    
    return clips.sort((a, b) => b.engagementScore - a.engagementScore);
  }

  private generateClipDescription(index: number): string {
    const descriptions = [
      "High-energy segment with key insights",
      "Emotional peak with strong engagement potential",
      "Educational content in bite-sized format",
      "Entertaining moment with viral potential",
      "Action-packed sequence perfect for shorts"
    ];
    return descriptions[index % descriptions.length];
  }

  private async generateVideoClips(clips: VideoClip[], onProgress: (progress: ProcessingProgress) => void): Promise<VideoClip[]> {
    const processedClips: VideoClip[] = [];
    
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      
      onProgress({ 
        stage: 'generation', 
        progress: 80 + (i / clips.length) * 15, 
        message: `Generating clip ${i + 1}/${clips.length}...` 
      });
      
      try {
        const videoBlob = await this.extractVideoSegment(clip.startTime, clip.endTime);
        const processedBlob = await this.autoReframe(videoBlob);
        
        processedClips.push({
          ...clip,
          blob: processedBlob,
          url: URL.createObjectURL(processedBlob)
        });
      } catch (error) {
        console.error(`Failed to process clip ${clip.id}:`, error);
        // Add clip without blob for preview
        processedClips.push(clip);
      }
    }
    
    return processedClips;
  }

  private async extractVideoSegment(startTime: number, endTime: number): Promise<Blob> {
    // Set up canvas for 9:16 aspect ratio (vertical format)
    this.canvas!.width = 720;
    this.canvas!.height = 1280;
    
    // Create MediaRecorder for the canvas
    const stream = this.canvas!.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    
    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
      
      mediaRecorder.onerror = reject;
      
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
        this.drawReframedVideo();
        
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

  private drawReframedVideo() {
    if (!this.video || !this.canvas || !this.ctx) return;
    
    const videoWidth = this.video.videoWidth;
    const videoHeight = this.video.videoHeight;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    // Calculate scaling for 9:16 format (auto-reframing)
    const videoAspect = videoWidth / videoHeight;
    const targetAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (videoAspect > targetAspect) {
      // Video is wider - crop sides (focus on center)
      drawHeight = canvasHeight;
      drawWidth = drawHeight * videoAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Video is taller - crop top/bottom
      drawWidth = canvasWidth;
      drawHeight = drawWidth / videoAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }
    
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw video frame with auto-reframing
    this.ctx.drawImage(this.video, offsetX, offsetY, drawWidth, drawHeight);
    
    // Add subtle vignette effect
    const gradient = this.ctx.createRadialGradient(
      canvasWidth/2, canvasHeight/2, 0,
      canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight)/2
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  private async autoReframe(videoBlob: Blob): Promise<Blob> {
    // The reframing is already applied in drawReframedVideo
    // This method could be extended for additional processing
    return videoBlob;
  }

  downloadClip(clip: VideoClip) {
    if (!clip.blob) {
      console.error('No video data available for download');
      return;
    }
    
    const url = URL.createObjectURL(clip.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const videoProcessor = new VideoProcessor();
