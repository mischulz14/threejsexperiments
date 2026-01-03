import {
  AcademicCapIcon,
  ClipboardIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export default function TopNav() {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-[#28292e] flex gap-1 justify-center items-center p-1 rounded-sm">
      <InformationCircleIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-700 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
      />
      <PuzzlePieceIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-700 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
      />
      <AcademicCapIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-700 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
      />
      <ClipboardIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-700 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
      />
    </div>
  );
}
