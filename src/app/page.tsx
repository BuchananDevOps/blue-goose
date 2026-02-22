'use client';

import Image from "next/image";
import AudioPlayer from "./components/audio-player";
import { useState, useEffect } from "react";

const tracks = [
  {
    id: '1',
    title: 'Individual Calls',
    artist: 'Greater Snow Goose',
    src: '/audio/Greater Snow Goose ⧸ Individual Calls. Chincoteague, Delmarva Peninsula, Virginia, U.S.A [uhkihKFdZqo].mp3'
  },
  {
    id: '2', 
    title: 'Mid Range Calls',
    artist: 'Lesser Snow Goose',
    src: '/audio/Lesser Snow Free.mp3'
  },
  {
    id: '3',
    title: 'Individual Calls',
    artist: 'Greater Snow Goose',
    src: '/audio/Greater Snow Goose ⧸ Individual Calls. Chincoteague, Delmarva Peninsula, Virginia, U.S.A [uhkihKFdZqo].mp3'
  },
  {
    id: '4', 
    title: 'Mid Range Calls',
    artist: 'Lesser Snow Goose',
    src: '/audio/Lesser Snow Free.mp3'
  }
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-900">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/logo/splash-screen.png"
            alt="Blue Goose Splash Screen"
            width={800}
            height={600}
            className="object-contain max-w-full max-h-full"
            priority
          />
          {/* Optional: Add a fade-out animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full animate-pulse bg-white/5 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 text-blue-200 flex flex-col items-center justify-center ">
      <AudioPlayer 
        tracks={tracks}
        autoPlay={false}
        showPlaylist={true}
      />
    </div>
  );
}
