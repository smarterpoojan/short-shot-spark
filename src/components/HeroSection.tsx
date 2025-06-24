
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Play, TrendingUp, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="pt-20 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Video Creation
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Long Videos Into
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Viral Shorts
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Upload your podcasts, interviews, and tutorials. Our AI automatically creates viral short clips optimized for TikTok, Instagram Reels, and YouTube Shorts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Video className="mr-2 w-5 h-5" />
              Start Creating Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">10x</div>
              <div className="text-gray-400">More Engagement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">5 Min</div>
              <div className="text-gray-400">Processing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Video Preview Mockup */}
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-black/40 rounded-lg aspect-video flex items-center justify-center border border-gray-700">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Long-form Video Input</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-black/40 rounded-lg aspect-[9/16] flex items-center justify-center border border-gray-700">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Short #{i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
