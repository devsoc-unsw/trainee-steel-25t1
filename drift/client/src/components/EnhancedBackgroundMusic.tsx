import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Music, Waves } from 'lucide-react';

interface EnhancedBackgroundMusicProps {
  autoPlay?: boolean;
  volume?: number;
}

const EnhancedBackgroundMusic: React.FC<EnhancedBackgroundMusicProps> = ({ 
  autoPlay = false, 
  volume = 0.2 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [showControls, setShowControls] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [masterGain, setMasterGain] = useState<GainNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs for ongoing audio processes
  const waveTimeouts = useRef<NodeJS.Timeout[]>([]);
  const ambientOscillators = useRef<OscillatorNode[]>([]);

  // Initialize audio context
  const initializeAudio = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = context.createGain();
      gain.connect(context.destination);
      gain.gain.value = currentVolume;
      
      setAudioContext(context);
      setMasterGain(gain);
      setIsInitialized(true);
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }, [isInitialized, currentVolume]);

  // Create realistic ocean wave sound
  const createOceanWave = useCallback(() => {
    if (!audioContext || !masterGain) return;

    // Main wave oscillator (low frequency rumble)
    const waveOsc = audioContext.createOscillator();
    const waveGain = audioContext.createGain();
    const waveFilter = audioContext.createBiquadFilter();
    
    waveOsc.type = 'sine';
    waveOsc.frequency.setValueAtTime(40, audioContext.currentTime);
    waveOsc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 8);
    
    waveFilter.type = 'lowpass';
    waveFilter.frequency.value = 200;
    waveFilter.Q.value = 0.5;
    
    // Wave envelope (natural wave build-up and crash)
    waveGain.gain.setValueAtTime(0, audioContext.currentTime);
    waveGain.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 3);
    waveGain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 6);
    waveGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 12);
    
    // Foam/bubbles sound (higher frequency)
    const foamOsc = audioContext.createOscillator();
    const foamGain = audioContext.createGain();
    const foamFilter = audioContext.createBiquadFilter();
    
    foamOsc.type = 'sawtooth';
    foamOsc.frequency.setValueAtTime(800, audioContext.currentTime + 2);
    foamOsc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 8);
    
    foamFilter.type = 'highpass';
    foamFilter.frequency.value = 400;
    foamFilter.Q.value = 2;
    
    foamGain.gain.setValueAtTime(0, audioContext.currentTime + 2);
    foamGain.gain.exponentialRampToValueAtTime(0.03, audioContext.currentTime + 3);
    foamGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
    
    // Connect audio graph
    waveOsc.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(masterGain);
    
    foamOsc.connect(foamFilter);
    foamFilter.connect(foamGain);
    foamGain.connect(masterGain);
    
    // Start and schedule stop
    const startTime = audioContext.currentTime;
    waveOsc.start(startTime);
    foamOsc.start(startTime + 2);
    
    waveOsc.stop(startTime + 12);
    foamOsc.stop(startTime + 10);
    
  }, [audioContext, masterGain]);

  // Create ambient ocean background
  const createAmbientOcean = useCallback(() => {
    if (!audioContext || !masterGain) return;

    // Clear existing ambient sounds
    ambientOscillators.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    ambientOscillators.current = [];

    // Create multiple layers of ambient ocean sounds
    for (let i = 0; i < 3; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = 60 + (i * 20); // 60Hz, 80Hz, 100Hz
      
      filter.type = 'lowpass';
      filter.frequency.value = 150 + (i * 50);
      filter.Q.value = 0.3;
      
      gain.gain.value = 0.02 - (i * 0.005); // Decreasing volume for higher frequencies
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      ambientOscillators.current.push(osc);
    }
  }, [audioContext, masterGain]);

  // Schedule wave sounds
  const scheduleWaves = useCallback(() => {
    if (!isPlaying || !audioContext) return;

    const scheduleNextWave = () => {
      createOceanWave();
      
      // Random interval between waves (20-60 seconds)
      const nextWaveDelay = Math.random() * 40000 + 20000;
      const timeout = setTimeout(scheduleNextWave, nextWaveDelay);
      waveTimeouts.current.push(timeout);
    };

    // Start first wave after 3 seconds
    const initialTimeout = setTimeout(scheduleNextWave, 3000);
    waveTimeouts.current.push(initialTimeout);
  }, [isPlaying, audioContext, createOceanWave]);

  // Update volume
  useEffect(() => {
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(currentVolume, audioContext.currentTime, 0.1);
    }
  }, [currentVolume, masterGain, audioContext]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      createAmbientOcean();
      scheduleWaves();
    } else {
      // Clear all timeouts
      waveTimeouts.current.forEach(timeout => clearTimeout(timeout));
      waveTimeouts.current = [];
      
      // Stop ambient oscillators
      ambientOscillators.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      ambientOscillators.current = [];
    }

    return () => {
      waveTimeouts.current.forEach(timeout => clearTimeout(timeout));
      waveTimeouts.current = [];
    };
  }, [isPlaying, createAmbientOcean, scheduleWaves]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      waveTimeouts.current.forEach(timeout => clearTimeout(timeout));
      ambientOscillators.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  const toggleMusic = async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Music Control Button */}
      <div className="relative">
        <button
          onClick={() => setShowControls(!showControls)}
          className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
            isPlaying 
              ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-400/20 animate-pulse' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          title="Ocean Waves - Background Music"
        >
          <Waves className="h-5 w-5" />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
          )}
        </button>

        {/* Controls Panel */}
        {showControls && (
          <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl min-w-[220px]">
            <div className="space-y-4">
              {/* Title */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Waves className="h-4 w-4 text-blue-400" />
                  <h3 className="text-white font-medium text-sm">Ocean Waves</h3>
                </div>
                <p className="text-white/60 text-xs">Realistic ocean soundscape</p>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={toggleMusic}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isPlaying
                    ? 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg shadow-blue-400/20'
                    : 'bg-white/20 text-white/80 hover:bg-white/30 border border-white/30'
                }`}
              >
                {isPlaying ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Waves Playing</span>
                  </div>
                ) : (
                  'Start Ocean Waves'
                )}
              </button>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">Volume</span>
                  <span className="text-white/60 text-xs">{Math.round(currentVolume * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <VolumeX className="h-4 w-4 text-white/60" />
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={currentVolume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 appearance-none cursor-pointer music-slider"
                  />
                  <Volume2 className="h-4 w-4 text-white/60" />
                </div>
              </div>

              {/* Wave Info */}
              <div className="text-center pt-2 border-t border-white/20">
                <p className="text-white/50 text-xs mb-1">
                  🌊 Natural wave sounds every 20-60s
                </p>
                <p className="text-white/40 text-xs">
                  Continuous ambient ocean background
                </p>
              </div>

              {/* Status Indicator */}
              {isPlaying && (
                <div className="bg-blue-500/20 rounded-lg p-2 text-center">
                  <p className="text-blue-300 text-xs font-medium">
                    Ocean waves are drifting...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBackgroundMusic; 