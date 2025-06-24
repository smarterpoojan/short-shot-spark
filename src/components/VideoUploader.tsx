
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, FileVideo, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onUploadComplete: (videoData: any) => void;
  onBack: () => void;
}

export const VideoUploader = ({ onUploadComplete, onBack }: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (!videoFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, MOV, AVI)",
        variant: "destructive",
      });
      return;
    }

    if (videoFile.size > 2 * 1024 * 1024 * 1024) { // 2GB limit
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 2GB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(videoFile);
    simulateUpload(videoFile);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Simulate video data
          const videoData = {
            id: Date.now(),
            name: file.name,
            duration: '45:30',
            size: formatFileSize(file.size),
            uploadedAt: new Date().toISOString(),
            status: 'processing',
            thumbnailUrl: '/placeholder.svg'
          };
          
          onUploadComplete(videoData);
          
          toast({
            title: "Upload Complete!",
            description: "Your video is now being processed by AI",
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Upload Section */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Upload Your Video
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Upload your long-form content and let AI create viral shorts
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Up to 2 hours
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  MP4, MOV, AVI
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Max 2GB
                </Badge>
              </div>
            </div>

            <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-8">
                {!isUploading && !uploadedFile && (
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-600 hover:border-purple-500/50 hover:bg-purple-500/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Drag and drop your video here
                    </h3>
                    <p className="text-gray-400 mb-6">
                      or click to browse your files
                    </p>
                    
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload">
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 cursor-pointer"
                        asChild
                      >
                        <span>
                          <Video className="w-4 h-4 mr-2" />
                          Select Video File
                        </span>
                      </Button>
                    </label>
                  </div>
                )}

                {isUploading && (
                  <div className="text-center">
                    <div className="mb-6">
                      <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Uploading Your Video
                      </h3>
                      <p className="text-gray-400">
                        {uploadedFile?.name}
                      </p>
                    </div>
                    
                    <Progress value={uploadProgress} className="mb-4" />
                    <p className="text-gray-400">
                      {Math.round(uploadProgress)}% completed
                    </p>
                  </div>
                )}

                {uploadProgress === 100 && !isUploading && (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Upload Complete!
                    </h3>
                    <p className="text-gray-400">
                      Redirecting to your dashboard...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
