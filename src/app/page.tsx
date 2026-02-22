import Image from "next/image";
import AudioPlayer from "./components/audio-player";

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
