
export interface VoiceSettings {
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

export class VoiceService {
  private apiKey: string = '';
  
  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🎙️ ElevenLabs API key configured');
  }

  async generateVoice(text: string, settings: VoiceSettings): Promise<Blob> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log(`🎙️ Generating voice for: "${text.substring(0, 50)}..."`);
    console.log(`🎯 Voice settings: ${settings.voiceId}, model: ${settings.model}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: settings.model,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarityBoost,
          style: settings.style,
          use_speaker_boost: settings.useSpeakerBoost
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Voice generation failed:', error);
      throw new Error(`Voice generation failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    console.log(`✅ Voice generated: ${(audioBlob.size / 1024).toFixed(2)} KB`);
    return audioBlob;
  }

  getDefaultVoices() {
    return [
      { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Energetic female voice' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Professional female voice' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Clear male voice' },
      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Young female voice' },
      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Mature male voice' }
    ];
  }

  getDefaultModels() {
    return [
      { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: 'High quality, 29+ languages' },
      { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: 'Fast, 32+ languages' },
      { id: 'eleven_turbo_v2', name: 'Turbo v2', description: 'Fastest, English only' }
    ];
  }
}

export const voiceService = new VoiceService();
