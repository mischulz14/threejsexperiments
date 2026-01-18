import React from 'react';

export function Heading1({ heading }: { heading: string }) {
  return <h1 className="text-lg font-semibold text-gray-200">{heading}</h1>;
}

export function Heading2({ heading }: { heading: string }) {
  return <h2 className="text-md font-semibold text-gray-200">{heading}</h2>;
}

export function Heading3({ heading }: { heading: string }) {
  return <h3 className="text-sm font-semibold text-gray-200">{heading}</h3>;
}

export function Heading4({ heading }: { heading: string }) {
  return <h4 className="text-xs font-semibold text-gray-200">{heading}</h4>;
}

export function Heading5({ heading }: { heading: string }) {
  return <h5 className="text-[9px] font-semibold text-gray-200">{heading}</h5>;
}
