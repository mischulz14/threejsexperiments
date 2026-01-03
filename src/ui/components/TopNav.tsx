import {
  AcademicCapIcon,
  ClipboardIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { EXPERIMENTS } from '../../constants/Constants';
import { experience } from '../../main';
import type { InfoPanelInfo } from '../../types/types';

export default function TopNav() {
  const [isInfoPanelShown, setIsInfoPanelShown] = useState(false);
  const [shownInfoType, setShownInfoType] = useState<InfoPanelInfo>('info');

  const handleClick = (infoType: InfoPanelInfo) => {
    setIsInfoPanelShown(true);
    setShownInfoType(infoType);
  };

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-[#28292e] flex gap-1 justify-center items-center p-1 rounded-sm">
      <InformationCircleIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-600 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
        onClick={() => handleClick('info')}
      />
      <PuzzlePieceIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-600 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
        onClick={() => handleClick('challenge')}
      />
      <AcademicCapIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-600 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
        onClick={() => handleClick('resources')}
      />
      <ClipboardIcon
        className="w-7 h-7 p-1 rounded-xs hover:bg-slate-600 transition-all duration-200 cursor-pointer flex justify-center items-center"
        stroke="#d1d5dc"
        onClick={() => handleClick('notes')}
      />
      <InfoPanel
        shownInfoType={shownInfoType}
        setIsInfoPanelShown={setIsInfoPanelShown}
        isInfoPanelShown={isInfoPanelShown}
      />
    </div>
  );
}

export function InfoPanel({
  isInfoPanelShown,
  setIsInfoPanelShown,
  shownInfoType,
}: {
  isInfoPanelShown: boolean;
  setIsInfoPanelShown: (isShown: boolean) => void;
  shownInfoType: InfoPanelInfo;
}) {
  const ref = useRef(null);

  useClickAway(ref, () => {
    setIsInfoPanelShown(false);
  });

  if (!isInfoPanelShown) return null;

  const currentExperience = experience.currentExperience;
  const currentExperienceInfos = EXPERIMENTS.find(
    (ex) => ex.name === currentExperience?.experienceName,
  );

  return (
    <div
      ref={ref}
      className="p-2 bg-[#28292e] flex flex-col min-w-3xs max-w-3xl gap-2 fixed top-10 left-1/2 -translate-x-1/2 z-9999 rounded-sm"
    >
      <span className="uppercase text-xs font-semibold tracking-wider text-gray-400!">
        {shownInfoType}
      </span>
      <div className="text-sm">
        {currentExperienceInfos && currentExperienceInfos[shownInfoType]
          ? currentExperienceInfos[shownInfoType]()
          : null}
      </div>
    </div>
  );
}
