import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Video, Clock, Download, Play, TrendingUp, Eye, Edit, Terminal, Captions, Settings, Zap, Mic, Volume2, Sparkles } from 'lucide-react';
import { videoProcessor, VideoClip } from '@/services/videoProcessor';
import { voiceService, VoiceSettings } from '@/services/voiceService';
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
  
  // Enhanced settings
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [captionStyle, setCaptionStyle] = useState<'opus' | 'tiktok' | 'youtube'>('opus');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [quality, setQuality] = useState<'HD' | 'FHD' | '4K'>('FHD');
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x');
  const [selectedModel, setSelectedModel] = useState('eleven_multilingual_v2');
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
    addConsoleLog('🚀 HIGH-QUALITY Dashboard initialized with premium features');
    if (currentVideo && currentVideo.file) {
      addConsoleLog(`⚡ Processing video: ${currentVideo.name} in ${quality} quality`);
      processVideoFile();
    } else {
      addConsoleLog('📝 Generating premium mock data with voice and enhanced captions');
      // Enhanced mock data
      setTimeout(() => {
        addConsoleLog('🎯 Generating premium viral clips with voice and advanced captions');
        setGeneratedShorts([
          {
            id: '1',
            title: "🔥 This Will Blow Your Mind",
            startTime: 15,
            endTime: 45,
            duration: 30,
            engagementScore: 95,
            description: "High-energy viral moment with maximum engagement potential",
            quality: 'FHD',
            captions: [
              { 
                text: "THIS MOMENT WILL", 
                start: 0, 
                end: 1.5, 
                style: 'highlight', 
                position: 'center', 
                animation: 'typewriter',
                fontSize: 48,
                backgroundColor: 'rgba(255,215,0,0.9)',
                textColor: '#000000'
              },
              { 
                text: "CHANGE EVERYTHING", 
                start: 1.7, 
                end: 3.2, 
                style: 'emphasis', 
                position: 'center', 
                animation: 'bounce',
                fontSize: 48,
                backgroundColor: 'rgba(255,0,100,0.8)',
                textColor: '#FFFFFF'
              }
            ]
          },
          {
            id: '2',
            title: "💡 The Secret Everyone's Talking About",
            startTime: 120,
            endTime: 165,
            duration: 45,
            engagementScore: 88,
            description: "Emotional peak designed for maximum shares and saves",
            quality: 'FHD',
            captions: [
              { 
                text: "THE SECRET THEY", 
                start: 0, 
                end: 1.8, 
                style: 'emphasis', 
                position: 'top', 
                animation: 'typewriter',
                fontSize: 36,
                backgroundColor: 'rgba(0,0,0,0.8)',
                textColor: '#FFFFFF'
              }
            ]
          }
        ]);
        setProcessingProgress(100);
        setIsProcessing(false);
        addConsoleLog('✅ Premium mock data generation completed');
      }, 2000);
    }
  }, [currentVideo, quality]);

  const processVideoFile = async () => {
    try {
      addConsoleLog(`🚀 Starting ${quality} video processing with premium features`);
      addConsoleLog(`🎨 Settings: Captions=${captionsEnabled}, Voice=${voiceEnabled}, Style=${captionStyle.toUpperCase()}`);
      
      if (voiceEnabled && apiKey) {
        voiceService.setApiKey(apiKey);
        addConsoleLog('🎙️ ElevenLabs API configured successfully');
      }
      
      const voiceSettings: VoiceSettings = {
        voiceId: selectedVoice,
        model: selectedModel,
        stability: 0.5,
        similarityBoost: 0.8,
        style: 0.2,
        useSpeakerBoost: true
      };
      
      const clips = await videoProcessor.processVideo(
        currentVideo.file, 
        (progress) => {
          setProcessingProgress(progress.progress);
          setProcessingStage(progress.stage);
          setProcessingMessage(progress.message);
          addConsoleLog(`⚡ ${quality}: ${progress.stage} - ${progress.message} (${progress.progress}%)`);
        },
        {
          generateCaptions: captionsEnabled,
          captionStyle: captionStyle,
          generateVoice: voiceEnabled && !!apiKey,
          voiceSettings: voiceEnabled && apiKey ? voiceSettings : undefined,
          reframeSettings: reframeSettings,
          quality: quality
        }
      );
      
      addConsoleLog(`🏆 ${quality} PROCESSING: Generated ${clips.length} premium clips successfully`);
      setGeneratedShorts(clips);
      setIsProcessing(false);
      
      toast({
        title: `✨ ${quality} Processing Complete!`,
        description: `Generated ${clips.length} premium viral clips${voiceEnabled ? ' with AI voiceovers' : ''}`,
      });
      
    } catch (error) {
      console.error(`❌ ${quality} PROCESSING: Failed:`, error);
      addConsoleLog(`❌ Error: ${quality} processing failed - ${error}`);
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
                <h1 className="text-2xl font-bold text-white">✨ Premium AI Video Processing</h1>
                <p className="text-gray-400">High-quality reframing, captions, and AI voiceovers</p>
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
                    ✨ Premium Processing Console
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

            {/* Enhanced Processing Settings */}
            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  ✨ Premium Processing Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Quality Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">🎬 Video Quality</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-white">Quality:</label>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value as 'HD' | 'FHD' | '4K')}
                          className="bg-gray-800 text-white rounded px-2 py-1"
                        >
                          <option value="HD">🎥 HD (720p)</option>
                          <option value="FHD">🎬 Full HD (1080p)</option>
                          <option value="4K">✨ 4K Ultra HD</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-white">Aspect Ratio:</label>
                        <select
                          value={reframeSettings.aspectRatio}
                          onChange={(e) => setReframeSettings({...reframeSettings, aspectRatio: e.target.value})}
                          className="bg-gray-800 text-white rounded px-2 py-1"
                        >
                          <option value="9:16">📱 9:16 (Vertical)</option>
                          <option value="16:9">🖥️ 16:9 (Horizontal)</option>
                          <option value="1:1">⬜ 1:1 (Square)</option>
                          <option value="4:5">📸 4:5 (Instagram)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Caption Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">📝 Premium Captions</h3>
                    <div className="space-y-2">
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
                          Auto-Captions
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-white">Style:</label>
                        <select
                          value={captionStyle}
                          onChange={(e) => setCaptionStyle(e.target.value as 'opus' | 'tiktok' | 'youtube')}
                          className="bg-gray-800 text-white rounded px-2 py-1"
                          disabled={!captionsEnabled}
                        >
                          <option value="opus">🎯 Opus Premium</option>
                          <option value="tiktok">📱 TikTok Style</option>
                          <option value="youtube">📺 YouTube Style</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Voice Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">🎙️ AI Voiceovers</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="voice"
                          checked={voiceEnabled}
                          onChange={(e) => setVoiceEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="voice" className="text-white flex items-center">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Generate Voice
                        </label>
                      </div>
                      
                      {voiceEnabled && (
                        <>
                          <input
                            type="password"
                            placeholder="ElevenLabs API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          />
                          
                          <div className="flex items-center space-x-2">
                            <label className="text-white text-sm">Voice:</label>
                            <select
                              value={selectedVoice}
                              onChange={(e) => setSelectedVoice(e.target.value)}
                              className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                            >
                              {voiceService.getDefaultVoices().map(voice => (
                                <option key={voice.id} value={voice.id}>{voice.name}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
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
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {quality} Quality
                      </Badge>
                      {captionsEnabled && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Captions className="w-3 h-3 mr-1" />
                          {captionStyle.toUpperCase()}
                        </Badge>
                      )}
                      {voiceEnabled && apiKey && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Mic className="w-3 h-3 mr-1" />
                          AI Voice
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={!isProcessing ? "default" : "secondary"}
                    className={!isProcessing ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {!isProcessing ? '✅ Completed' : '⚡ Processing'}
                  </Badge>
                </div>
              </CardHeader>
              
              {isProcessing && (
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {processingMessage || `⚡ ${quality} Processing Progress`}
                      </span>
                      <span className="text-purple-400">{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <p className="text-sm text-gray-500">
                      {processingStage === 'analysis' && `🎯 Premium AI analyzing viral moments in ${quality}...`}
                      {processingStage === 'generation' && `🎨 Generating ${quality} video clips with premium reframing...`}
                      {processingStage === 'captions' && `📝 Creating ${captionStyle.toUpperCase()} premium captions...`}
                      {processingStage === 'voice' && '🎙️ Generating AI voiceovers with ElevenLabs...'}
                      {processingStage === 'complete' && `✅ ${quality} processing complete with premium features!`}
                      {!processingStage && `⚡ Premium ${quality} analysis in progress...`}
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
                      ✨ Premium Viral Shorts ({quality})
                    </h2>
                    <p className="text-gray-400">
                      🎯 AI generated {generatedShorts.length} high-engagement clips in {quality} quality
                      {captionsEnabled && ` with ${captionStyle.toUpperCase()} captions`}
                      {voiceEnabled && apiKey && ' and AI voiceovers'}
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
                              <span className="text-xs text-white/50">⚡ {quality} Processing...</span>
                            </div>
                          )}
                          
                          {/* Premium Caption Preview */}
                          {short.captions && short.captions.length > 0 && (
                            <div className="absolute bottom-4 left-4 right-4">
                              <div 
                                className="text-white text-xs p-2 rounded text-center font-bold transition-all duration-300"
                                style={{
                                  backgroundColor: short.captions[0].backgroundColor || 'rgba(0,0,0,0.8)',
                                  color: short.captions[0].textColor || '#FFFFFF',
                                  fontSize: `${(short.captions[0].fontSize || 24) / 3}px`
                                }}
                              >
                                {short.captions[0].text}
                              </div>
                            </div>
                          )}

                          {/* Quality Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                              {short.quality}
                            </Badge>
                          </div>
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
                              {short.captions.length}
                            </Badge>
                          )}
                          {short.audioBlob && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              <Volume2 className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Premium Caption Details */}
                        {short.captions && short.captions.length > 0 && (
                          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                            <h4 className="text-white text-sm font-semibold mb-2">
                              ✨ {captionStyle.toUpperCase()} Premium Captions:
                            </h4>
                            <div className="space-y-1">
                              {short.captions.slice(0, 2).map((caption, index) => (
                                <div key={index} className="text-xs text-gray-300 flex justify-between">
                                  <span>"{caption.text}"</span>
                                  <div className="flex gap-1">
                                    <span className="text-purple-400">{caption.animation}</span>
                                    <span className="text-blue-400">{caption.fontSize}px</span>
                                  </div>
                                </div>
                              ))}
                              {short.captions.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{short.captions.length - 2} more premium captions...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
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
