'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
}

interface AudioPlayerProps {
  tracks: Track[];
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}

type RepeatMode = 'none' | 'all' | 'one';

export default function AudioPlayer({ 
  tracks, 
  autoPlay = false, 
  showPlaylist = true,
  className = "" 
}: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Format time from seconds to MM:SS
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Handle next track
  const nextTrack = useCallback(() => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    
    if (isPlaying) {
      setIsPlaying(true);
      // Use setTimeout to ensure audio element has updated with new track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
        }
      }, 100);
    }
  }, [tracks.length, currentTrackIndex, isPlaying]);

  // Handle previous track
  const previousTrack = useCallback(() => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    
    if (isPlaying) {
      setIsPlaying(true);
      // Use setTimeout to ensure audio element has updated with new track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
        }
      }, 100);
    }
  }, [tracks.length, currentTrackIndex, isPlaying]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  // Handle playlist track selection
  const selectAndPlayTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    
    // Use setTimeout to ensure audio element has updated with new track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }, 100);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeatMode(current => {
      switch (current) {
        case 'none':
          return 'all';
        case 'all':
          return 'one';
        case 'one':
          return 'none';
        default:
          return 'none';
      }
    });
  }, []);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Audio event handlers
  const handleLoadStart = () => setIsLoading(true);
  const handleLoadedData = () => setIsLoading(false);
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const handleEnded = () => {
    setIsPlaying(false);
    
    switch (repeatMode) {
      case 'one':
        // Repeat current track
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsPlaying(true);
        }
        break;
      case 'all':
        // Go to next track, or first track if at the end
        if (currentTrackIndex < tracks.length - 1) {
          nextTrack();
        } else {
          setCurrentTrackIndex(0);
        }
        break;
      case 'none':
      default:
        // Only go to next track if not at the end
        if (currentTrackIndex < tracks.length - 1) {
          nextTrack();
        }
        break;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            e.preventDefault();
            nextTrack();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            e.preventDefault();
            previousTrack();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          toggleRepeat();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, nextTrack, previousTrack, toggleRepeat]);

  // Auto play when track changes
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, autoPlay, isPlaying]);

  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-600">No tracks available</p>
      </div>
    );
  }

  return (
    <div
  className={`min-h-screen relative overflow-hidden rounded-2xl p-6 max-w-md mx-auto
  bg-gradient-to-br from-[#0b1d3a] via-[#0f2c59] to-[#081426]
  shadow-[0_0_40px_rgba(37,99,235,0.35)]
  border border-blue-500/20
  backdrop-blur-sm
  ${className}`}
>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_70%)] pointer-events-none" />
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Track Info */}
      <div className="text-center mb-6 relative z-10">
        <h3 className="text-xl font-bold tracking-wide text-white drop-shadow-md">
          {currentTrack?.title || 'Unknown Title'}
        </h3>
        <p className="text-sm text-blue-200/80 tracking-wide">
          {currentTrack?.artist || 'Unknown Artist'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          className="h-2 rounded-full cursor-pointer relative overflow-hidden bg-blue-900/40 backdrop-blur-sm border border-blue-400/20"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full transition-all duration-150 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-blue-200/70 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={previousTrack}
          disabled={isLoading}
          className="p-2 rounded-full bg-blue-900/40  hover:bg-blue-800/60  border border-blue-400/20 text-blue-200 transition-all duration-200 hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] disabled:opacity-40"
          aria-label="Previous track"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 11H15a1 1 0 100-2H7.414l2.293-2.293z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.9)] hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,1)] transition-all duration-200 disabled:opacity-40"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <svg className="w-6 h-6 animate-spin" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          onClick={nextTrack}
          disabled={isLoading}
          className="p-2 rounded-full bg-blue-900/40 hover:bg-blue-800/60 border border-blue-400/20 text-blue-200 transition-all duration-200 hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] disabled:opacity-40"
          aria-label="Next track"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L11.586 9H4a1 1 0 100 2h7.586l-2.293 2.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <button
          onClick={toggleMute}
          className="p-1 rounded-md hover:bg-blue-800/40 text-blue-200 transition"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-900/40 accent-cyan-400"
          />
        </div>
      </div>

      {/* Secondary Controls Menu */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3 px-3 py-2 bg-blue-900/20 border border-blue-400/10 rounded-lg backdrop-blur-sm">
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-md border border-blue-400/20 text-blue-200 transition-all duration-200 ${
              repeatMode !== 'none'
                ? 'bg-blue-600/60 shadow-[0_0_8px_rgba(59,130,246,0.8)] hover:shadow-[0_0_12px_rgba(59,130,246,1)]'
                : 'bg-blue-900/30 hover:bg-blue-800/50 hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]'
            }`}
            aria-label={`Repeat mode: ${repeatMode}`}
            title={`Repeat: ${repeatMode === 'none' ? 'Off' : repeatMode === 'all' ? 'All' : 'One'}`}
          >
            <div className="relative">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {repeatMode === 'one' && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-900">1</span>
                </div>
              )}
            </div>
          </button>
          
          <div className="text-xs text-blue-300/60 font-medium tracking-wide">
            {repeatMode === 'none' && 'No Repeat'}
            {repeatMode === 'all' && 'Repeat All'}
            {repeatMode === 'one' && 'Repeat One'}
          </div>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && (
        <div className="  border-t border-blue-500/20 pt-4 relative z-10">
          <h4 className="text-sm font-semibold text-blue-200 mb-3 tracking-wide">Playlist</h4>
          <div className="h-full overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => selectAndPlayTrack(index)}
                className={`w-full text-left p-2 rounded text-sm transition-colors flex items-center justify-between ${
                  index === currentTrackIndex
                    ? 'bg-gradient-to-r from-blue-600/40 to-cyan-500/30 text-white border border-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                    : 'hover:bg-blue-800/30 text-blue-200/80'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{track.title}</div>
                  <div className="text-gray-500">{track.artist}</div>
                </div>
                <div className="text-xs text-blue-300/60 ml-2">
                  {track.duration ? formatTime(track.duration) : '--:--'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts info */}
      <div className="text-xs text-blue-300/40 text-center mt-3 tracking-wide">
        Space: Play/Pause • ⇧←/→: Prev/Next track • R: Repeat mode
      </div>
    </div>
  );
}
