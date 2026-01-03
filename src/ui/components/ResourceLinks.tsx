import React from 'react';

import type { ResourceLink } from '../../types/types';

export default function ResourceLinks({
  resourceLinks,
}: {
  resourceLinks: ResourceLink[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {resourceLinks.map((link) => (
        <div className="" key={link.url}>
          <span>{link.label ?? ''}</span>
          <a target="_blank" href={link.url} />
        </div>
      ))}
    </div>
  );
}
