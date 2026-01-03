import React from 'react';
import { createRoot } from 'react-dom/client';

import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function App() {
  return (
    <>
      <TopNav />
      <Sidebar />
    </>
  );
}

export function createApp() {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
}
