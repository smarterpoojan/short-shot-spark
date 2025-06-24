import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Video, Clock, Download, Play, TrendingUp, Eye, Edit, Terminal, Captions, Settings } from 'lucide-react';
import { videoProcessor, VideoClip } from '@/services/videoProcessor';
import { useToast } from "@/hooks/use-toast";

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
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [reframeSettings, setReframeSettings] = useState({
    aspectRatio: '9:16',
    focusPoint: 'center',
    autoTrack: true
  });
  const { toast } = useToast();

  const addConsoleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setConsoleLogs(prev => [...prev, logMessage]);
  };

  useEffect(() => {
    addConsoleLog('Dashboard initialized');
    if (currentVideo && currentVideo.file) {
      addConsoleLog(`Processing video: ${currentVideo.name}`);
      processVideoFile();
    } else {
      addConsoleLog('No video file provided, using mock data');
      // Fallback to mock data if no actual file
      setTimeout(() => {
        addConsoleLog('Generating mock viral clips');
        setGeneratedShorts([
          {
            id: '1',
            title: "Viral Moment #1: Key Insight",
            startTime: 15,
            endTime: 45,
            duration: 30,
            engagementScore: 95,
            description: "High-energy segment with actionable advice",
            captions: [
              { text: "This is the most important tip", start: 0, end: 2.5 },
              { text: "that will change everything", start: 2.5, end: 4.8 },
              { text: "for your success!", start: 4.8, end: 6.5 }
            ]
          },
          {
            id: '2',
            title: "Emotional Peak #2: Story Time",
            startTime: 120,
            endTime: 165,
            duration: 45,
            engagementScore: 88,
            description: "Personal story with emotional connection",
            captions: [
              { text: "Let me tell you a story", start: 0, end: 2.2 },
              { text: "that changed my perspective", start: 2.2, end: 4.5 },
              { text: "on everything I thought I knew", start: 4.5, end: 7.0 }
            ]
          },
          {
            id: '3',
            title: "Quick Tip #3: How-To Guide",
            startTime: 300,
            endTime: 315,
            duration: 15,
            engagementScore: 92,
            description: "Practical tip in bite-sized format",
            captions: [
              { text: "Here's the secret technique", start: 0, end: 2.0 },
              { text: "that pros don't want you to know", start: 2.0, end: 4.5 }
            ]
          }
        ]);
        setProcessingProgress(100);
        setIsProcessing(false);
        addConsoleLog('Mock data generation completed');
      }, 3000);
    }
  }, [currentVideo]);

  const processVideoFile = async () => {
    try {
      addConsoleLog('Starting video processing pipeline');
      
      const clips = await videoProcessor.processVideo(
        currentVideo.file, 
        (progress) => {
          setProcessingProgress(progress.progress);
          setProcessingStage(progress.stage);
          setProcessingMessage(progress.message);
          addConsoleLog(`Processing: ${progress.stage} - ${progress.message} (${progress.progress}%)`);
        },
        {
          generateCaptions: captionsEnabled,
          reframeSettings: reframeSettings
        }
      );
      
      addConsoleLog(`Generated ${clips.length} clips successfully`);
      setGeneratedShorts(clips);
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete!",
        description: `Generated ${clips.length} viral-ready short clips with captions`,
      });
      
    } catch (error) {
      console.error('Video processing failed:', error);
      addConsoleLog(`Error: Video processing failed - ${error}`);
      toast({
        title: "Processing Failed",
        description: "Unable to process video. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDownload = (clip: VideoClip) => {
    addConsoleLog(`Initiating download for clip: ${clip.title}`);
    if (clip.blob) {
      videoProcessor.downloadClip(clip);
      addConsoleLog(`Download started: ${clip.title}`);
      toast({
        title: "Download Started",
        description: `Downloading ${clip.title}`,
      });
    } else {
      addConsoleLog(`Download failed: No blob available for ${clip.title}`);
      toast({
        title: "Download Unavailable",
        description: "Video processing is still in progress",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = () => {
    const availableClips = generatedShorts.filter(clip => clip.blob);
    addConsoleLog(`Batch download initiated for ${availableClips.length} clips`);
    
    if (availableClips.length === 0) {
      addConsoleLog('Batch download failed: No clips available');
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
        addConsoleLog(`Batch download ${index + 1}/${availableClips.length}: ${clip.title}`);
      }, index * 1000);
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
                <p className="text-gray-400">Auto-reframing, captions, and short clip generation</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showConsole ? "default" : "outline"}
                onClick={() => setShowConsole(!showConsole)}
                className="text-white border-gray-600"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Console
              </Button>
              <Button
                variant="outline"
                className="text-white border-gray-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Console Panel */}
            {showConsole && (
              <Card className="bg-black/80 border-gray-800 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Terminal className="w-4 h-4 mr-2" />
                    Processing Console
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/60 rounded p-4 max-h-48 overflow-y-auto font-mono text-sm">
                    {consoleLogs.map((log, index) => (
                      <div key={index} className="text-green-400 mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Settings */}
            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white">Processing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="captions"
                      checked={captionsEnabled}
                      onChange={(e) => setCaptionsEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="captions" className="text-white flex items-center">
                      <Captions className="w-4 h-4 mr-2" />
                      Auto-generate Captions
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-white">Aspect Ratio:</label>
                    <select
                      value={reframeSettings.aspectRatio}
                      onChange={(e) => setReframeSettings({...reframeSettings, aspectRatio: e.target.value})}
                      className="bg-gray-800 text-white rounded px-2 py-1"
                    >
                      <option value="9:16">9:16 (Vertical)</option>
                      <option value="16:9">16:9 (Horizontal)</option>
                      <option value="1:1">1:1 (Square)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-white">Focus:</label>
                    <select
                      value={reframeSettings.focusPoint}
                      onChange={(e) => setReframeSettings({...reframeSettings, focusPoint: e.target.value})}
                      className="bg-gray-800 text-white rounded px-2 py-1"
                    >
                      <option value="center">Center</option>
                      <option value="face">Face Tracking</option>
                      <option value="action">Action Focus</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      {captionsEnabled && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Captions className="w-3 h-3 mr-1" />
                          Captions Enabled
                        </Badge>
                      )}
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
                      {processingStage === 'generation' && 'Auto-reframing to specified format and generating clips...'}
                      {processingStage === 'captions' && 'Generating AI captions with animations...'}
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
                      {captionsEnabled && ' and animated captions'}
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
                          
                          {/* Caption Preview */}
                          {short.captions && short.captions.length > 0 && (
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-black/80 text-white text-xs p-2 rounded text-center animate-fade-in">
                                {short.captions[0].text}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <CardTitle className="text-white text-lg">{short.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(short.duration)}
                          </span>
                          <span>{reframeSettings.aspectRatio}</span>
                          {short.captions && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              <Captions className="w-3 h-3 mr-1" />
                              {short.captions.length} lines
                            </Badge>
                          )}
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
