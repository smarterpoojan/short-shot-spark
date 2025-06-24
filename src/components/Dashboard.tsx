
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Video, Clock, Download, Play, TrendingUp, Eye, Edit } from 'lucide-react';
import { videoProcessor } from '@/services/videoProcessor';
import { useToast } from "@/hooks/use-toast";

interface VideoClip {
  id: string;
  title: string;
  duration: number;
  engagementScore: number;
  description: string;
  blob?: Blob;
  url?: string;
}

interface DashboardProps {
  videos: any[];
  onBack: () => void;
}

export const Dashboard = ({ videos, onBack }: DashboardProps) => {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  const [currentVideo] = videos;
  const [generatedShorts, setGeneratedShorts] = useState<VideoClip[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (currentVideo && currentVideo.file) {
      processVideoFile();
    } else {
      // Fallback to mock data if no actual file
      setTimeout(() => {
        setGeneratedShorts([
          {
            id: '1',
            title: "Viral Moment #1: Key Insight",
            duration: 30,
            engagementScore: 95,
            description: "High-energy segment with actionable advice"
          },
          {
            id: '2',
            title: "Emotional Peak #2: Story Time",
            duration: 45,
            engagementScore: 88,
            description: "Personal story with emotional connection"
          },
          {
            id: '3',
            title: "Quick Tip #3: How-To Guide",
            duration: 15,
            engagementScore: 92,
            description: "Practical tip in bite-sized format"
          }
        ]);
        setProcessingProgress(100);
        setIsProcessing(false);
      }, 3000);
    }
  }, [currentVideo]);

  const processVideoFile = async () => {
    try {
      const clips = await videoProcessor.processVideo(currentVideo.file, (progress) => {
        setProcessingProgress(progress.progress);
        setProcessingStage(progress.stage);
        setProcessingMessage(progress.message);
      });
      
      setGeneratedShorts(clips);
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete!",
        description: `Generated ${clips.length} viral-ready short clips`,
      });
      
    } catch (error) {
      console.error('Video processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "Unable to process video. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDownload = (clip: VideoClip) => {
    if (clip.blob) {
      videoProcessor.downloadClip(clip);
      toast({
        title: "Download Started",
        description: `Downloading ${clip.title}`,
      });
    } else {
      toast({
        title: "Download Unavailable",
        description: "Video processing is still in progress",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = () => {
    const availableClips = generatedShorts.filter(clip => clip.blob);
    if (availableClips.length === 0) {
      toast({
        title: "No Downloads Available",
        description: "Please wait for processing to complete",
        variant: "destructive",
      });
      return;
    }
    
    availableClips.forEach((clip, index) => {
      setTimeout(() => {
        videoProcessor.downloadClip(clip);
      }, index * 1000); // Stagger downloads
    });
    
    toast({
      title: "Batch Download Started",
      description: `Downloading ${availableClips.length} clips`,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-white hover:bg-white/10 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Video Processing</h1>
                <p className="text-gray-400">Auto-reframing and short clip generation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Original Video Info */}
            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl mb-2">
                      {currentVideo?.name || 'Uploaded Video'}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentVideo?.duration || '45:30'}
                      </span>
                      <span>{currentVideo?.size || '1.2 GB'}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={!isProcessing ? "default" : "secondary"}
                    className={!isProcessing ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {!isProcessing ? 'Completed' : 'Processing'}
                  </Badge>
                </div>
              </CardHeader>
              
              {isProcessing && (
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {processingMessage || 'AI Analysis Progress'}
                      </span>
                      <span className="text-purple-400">{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <p className="text-sm text-gray-500">
                      {processingStage === 'analysis' && 'Detecting viral moments and optimal segments...'}
                      {processingStage === 'generation' && 'Auto-reframing to 9:16 format and generating clips...'}
                      {processingStage === 'complete' && 'Processing complete! Your viral shorts are ready.'}
                      {!processingStage && 'Analyzing audio patterns, detecting viral moments, and optimizing clips...'}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Generated Shorts */}
            {generatedShorts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Generated Viral Shorts
                    </h2>
                    <p className="text-gray-400">
                      AI has identified {generatedShorts.length} high-engagement clips with auto-reframing
                    </p>
                  </div>
                  <Button 
                    onClick={handleDownloadAll}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={generatedShorts.filter(clip => clip.blob).length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All ({generatedShorts.filter(clip => clip.blob).length})
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedShorts.map((short) => (
                    <Card key={short.id} className="bg-black/40 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="aspect-[9/16] bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center mb-4 border border-gray-700 relative overflow-hidden">
                          {short.url ? (
                            <video 
                              src={short.url} 
                              className="w-full h-full object-cover rounded-lg"
                              muted
                              loop
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <Play className="w-12 h-12 text-white/70 mb-2" />
                              <span className="text-xs text-white/50">Processing...</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-white text-lg">{short.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(short.duration)}
                          </span>
                          <span>9:16</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Engagement Score</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {Math.round(short.engagementScore)}%
                            </Badge>
                          </div>
                          <Progress value={short.engagementScore} className="mb-2" />
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-4">
                          {short.description}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                            disabled={!short.url}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                            onClick={() => handleDownload(short)}
                            disabled={!short.blob}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
