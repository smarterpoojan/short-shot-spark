
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, Youtube, Zap, TrendingUp, Scissors, Download, Eye } from 'lucide-react';
import { VideoUploader } from '@/components/VideoUploader';
import { Dashboard } from '@/components/Dashboard';
import { FeatureCard } from '@/components/FeatureCard';
import { HeroSection } from '@/components/HeroSection';

const Index = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const handleVideoUpload = (videoData) => {
    setUploadedVideos(prev => [...prev, videoData]);
    setCurrentView('dashboard');
  };

  if (currentView === 'upload') {
    return <VideoUploader onUploadComplete={handleVideoUpload} onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard videos={uploadedVideos} onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative">
        <HeroSection onGetStarted={() => setCurrentView('upload')} />
        
        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Transform Your Content with AI
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Upload once, go viral everywhere. Our AI analyzes your long-form videos and creates viral shorts automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Upload className="w-8 h-8" />}
                title="Smart Upload"
                description="Drag & drop videos up to 2 hours. Supports MP4, MOV, AVI formats with real-time progress tracking."
                gradient="from-blue-500 to-cyan-500"
              />
              
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="AI Analysis"
                description="Advanced AI detects viral moments using audio cues, facial expressions, and scene changes."
                gradient="from-purple-500 to-pink-500"
              />
              
              <FeatureCard
                icon={<Scissors className="w-8 h-8" />}
                title="Auto-Generate Shorts"
                description="Create 1-10+ viral shorts (15s, 30s, 60s) with smart cropping for vertical format."
                gradient="from-green-500 to-emerald-500"
              />
              
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Viral Optimization"
                description="Auto-captions, trending filters, viral background music, and emoji integration."
                gradient="from-orange-500 to-red-500"
              />
              
              <FeatureCard
                icon={<Eye className="w-8 h-8" />}
                title="Preview & Edit"
                description="Review each short, make tweaks, trim clips, and adjust captions before export."
                gradient="from-indigo-500 to-purple-500"
              />
              
              <FeatureCard
                icon={<Download className="w-8 h-8" />}
                title="Export & Share"
                description="Download in HD or share directly to Instagram, TikTok, and YouTube Shorts."
                gradient="from-pink-500 to-rose-500"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-300">
                From upload to viral content in just 4 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Upload', desc: 'Drop your long-form video' },
                { step: '02', title: 'AI Process', desc: 'Our AI finds viral moments' },
                { step: '03', title: 'Preview', desc: 'Review & edit your shorts' },
                { step: '04', title: 'Share', desc: 'Export & go viral' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Go Viral?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already transforming their content with AI
            </p>
            <Button 
              onClick={() => setCurrentView('upload')}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              Start Creating Shorts
              <Video className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
