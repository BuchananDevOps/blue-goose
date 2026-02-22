import Image from "next/image";
import AudioPlayer from "./components/audio-player";

const tracks = [
  {
    id: '1',
    title: 'Individual Calls',
    artist: 'Greater Snow Goose',
    src: '/audio/Greater Snow Goose ⧸ Individual Calls. Chincoteague, Delmarva Peninsula, Virginia, U.S.A [uhkihKFdZqo].mp3',
    duration: 180 // 3:00 (placeholder, will be updated when metadata loads)
  },
  {
    id: '2', 
    title: 'Mid Range Calls',
    artist: 'Lesser Snow Goose',
    src: '/audio/Lesser Snow Free.mp3',
    duration: 142 // 2:22 (placeholder)
  },
  {
    id: '3',
    title: 'Large Flock Taking Off',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Cucal ⧸ Snow Goose. CU Calls From A Large Flock Of About 3,000 Birds Taking Off And Circ [t3p3C27Em-0].mp3',
    duration: 195 // 3:15 (placeholder)
  },
  {
    id: '4', 
    title: 'Massive Flock Flying Overhead',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Cump ⧸ Snow Goose. CU-MP Calls From A Massive Flock Flying Overhead. Slight Aircraft Noi [QfNSPKt6Id8].mp3',
    duration: 158 // 2:38 (placeholder)
  },
  {
    id: '5',
    title: 'Flock Calls with Flight',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Mc Ufl ⧸ Snow Goose. MCU Flock Calls, With Several Birds Flying Past Calling. Crickets I [J_OM49FGHvU].mp3',
    duration: 203 // 3:23 (placeholder)
  },
  {
    id: '6',
    title: 'Contact Calls - Adults & Young',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Ucon ⧸ Snow Goose. CU Contact Calls From Adults And Young While Wading And Swimming In W [Qd8MDNAAPEw].mp3',
    duration: 167 // 2:47 (placeholder)
  },
  {
    id: '7',
    title: 'Flight Calls with Flock',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Ufli ⧸ Snow Goose. CU Flight Calls With MD Flock Calls. Eastern Meadowlark Calling In B⧸ [7WbAM2F32rQ].mp3',
    duration: 189 // 3:09 (placeholder)
  },
  {
    id: '8',
    title: 'Small Parties Joining Flock',
    artist: 'Snow Goose',
    src: '/audio/Snow Goose Uflo ⧸ Snow Goose. CU Flock Calls, Small Parties Fly In To Join A Group Of About 100 Bir [mzTbYUxxonY].mp3',
    duration: 175 // 2:55 (placeholder)
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
