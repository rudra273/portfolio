// src/components/SkillIcon.tsx
import { IconType } from 'react-icons';

interface SkillIconProps {
  name: string;
  Icon: IconType;
}

export default function SkillIcon({ name, Icon }: SkillIconProps) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="text-4xl text-white mb-2 " />
      <span className="text-white font-poppins">{name}</span>
    </div>
  );
}