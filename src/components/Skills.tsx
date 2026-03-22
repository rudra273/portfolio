import React from 'react';
import { IconType } from 'react-icons';
import { skills } from '@/skill';

interface SkillIconProps {
  name: string;
  Icon: IconType;
}

const SkillIcon = ({ name, Icon }: SkillIconProps) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group cursor-default bg-white/5 hover:bg-white/10"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="relative flex-shrink-0">
        <Icon className="text-lg text-accent-cyan/70 group-hover:text-accent-cyan transition-all duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-accent-cyan/30 rounded-full" />
      </div>
      <span className="text-white/80 text-xs md:text-sm font-space group-hover:text-white transition-colors duration-300 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

const Skills = () => {
  // Combine all skills we want to show into a single array
  const allSkills = skills.filter(skill =>
    [
      'Python', 'JavaScript', 'FastAPI', 'Django', 'Tailwind CSS',
      'PostgreSQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'MLflow', 'Git', 'Linux', 'Terraform',
      'AWS', 'Azure', 'Databricks'
    ].includes(skill.name)
  );

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <p className="text-accent-cyan/50 font-space text-xs tracking-[0.3em] uppercase mb-3">
          Expertise
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-space tracking-wide">
          Technical Skills
        </h2>
        <p className="text-white/30 text-sm font-poppins mt-3">
          Technologies powering my projects
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center items-center">
        {allSkills.map(skill => (
          <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
        ))}
      </div>
    </div>
  );
};

export default Skills;