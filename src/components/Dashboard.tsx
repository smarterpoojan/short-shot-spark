
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Video, Clock, Download, Play, TrendingUp, Eye, Edit } from 'lucide-react';

interface DashboardProps {
  videos: any[];
  onBack: () => void;
}

export const Dashboard = ({ videos, onBack }: DashboardProps) => {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentVideo] = videos;
  const [generatedShorts, setGeneratedShorts] = useState([]);

  useEffect(() => {
    // Simulate AI processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Generate mock shorts
          setGeneratedShorts([
            {
              id: 1,
              title: "Viral Moment #1: Key Insight",
              duration: "0:30",
              engagementScore: 95,
              format: "9:16",
              description: "High-energy segment with actionable advice"
            },
            {
              id: 2,
              title: "Emotional Peak #2: Story Time",
              duration: "0:45",
              engagementScore: 88,
              format: "9:16",
              description: "Personal story with emotional connection"
            },
            {
              id: 3,
              title: "Quick Tip #3: How-To Guide",
              duration: "0:15",
              engagementScore: 92,
              format: "9:16",
              description: "Practical tip in bite-sized format"
            }
          ]);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
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
                <h1 className="text-2xl font-bold text-white">Project Dashboard</h1>
                <p className="text-gray-400">AI-powered short video generation</p>
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
                    variant={processingProgress === 100 ? "default" : "secondary"}
                    className={processingProgress === 100 ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {processingProgress === 100 ? 'Completed' : 'Processing'}
                  </Badge>
                </div>
              </CardHeader>
              
              {processingProgress < 100 && (
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">AI Analysis Progress</span>
                      <span className="text-purple-400">{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2" />
                    <p className="text-sm text-gray-500">
                      Analyzing audio patterns, detecting viral moments, and optimizing clips...
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
                      AI has identified {generatedShorts.length} high-engagement clips
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedShorts.map((short) => (
                    <Card key={short.id} className="bg-black/40 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="aspect-[9/16] bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
                          <Play className="w-12 h-12 text-white/70" />
                        </div>
                        <CardTitle className="text-white text-lg">{short.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {short.duration}
                          </span>
                          <span>{short.format}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Engagement Score</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {short.engagementScore}%
                            </Badge>
                          </div>
                          <Progress value={short.engagementScore} className="mb-2" />
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-4">
                          {short.description}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
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
