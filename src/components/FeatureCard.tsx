
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

export const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => {
  return (
    <Card className="bg-black/40 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
      <CardHeader>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <CardTitle className="text-white text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400 text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
