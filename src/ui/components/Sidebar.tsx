import { Bars2Icon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

import { EXPERIMENTS } from '../../constants/Constants';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <aside
      style={{
        bottom: isSidebarOpen ? '0.5rem' : 'auto',
      }}
      className="w-32 rounded-sm bg-[#28292e] flex flex-col items-center fixed top-2 p-0.5 left-2 transition-all duration-200 overflow-hidden"
    >
      <div className="w-full flex p-0.5">
        <Bars2Icon
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          style={{
            rotate: isSidebarOpen ? '90deg' : '0deg',
          }}
          className="w-3 h-4 ml-auto cursor-pointer transition-all duration-200"
          stroke="#d1d5dc"
          strokeWidth={3}
        />
      </div>
      <div
        className="flex flex-col overflow-hidden"
        style={{
          height: isSidebarOpen ? 'auto' : 0,
        }}
      >
        {EXPERIMENTS.map((e) => (
          <div
            className="hover:bg-slate-600 transition-all duration-100 rounded-xs w-full px-2 py-1.5 cursor-pointer flex justify-center items-center"
            onClick={() => {
              // attach url to url pathname and reload page with url
              const url = new URL(window.location.href);
              url.pathname = e.url;
              window.location.href = url.href;
            }}
            key={e.name}
          >
            <span className="text-center text-xs text-gray-300">{e.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
