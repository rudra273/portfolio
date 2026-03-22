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
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group cursor-default"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderLeft: '2px solid rgba(102, 252, 241, 0.2)',
      }}
    >
      <div className="relative">
        <Icon className="text-xl text-accent-cyan/60 group-hover:text-accent-cyan transition-all duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-accent-cyan/20 rounded-full" />
      </div>
      <span className="text-white/70 text-sm font-space group-hover:text-white/90 transition-colors duration-300">
        {name}
      </span>
    </div>
  );
};

const Skills = () => {
  const developmentSkills = skills.filter(skill =>
    ['Python', 'JavaScript', 'FastAPI', 'Django', 'Tailwind CSS'].includes(skill.name)
  );
  const databaseSkills = skills.filter(skill =>
    ['PostgreSQL', 'MongoDB', 'Redis'].includes(skill.name)
  );
  const devOpsSkills = skills.filter(skill =>
    ['Docker', 'Kubernetes', 'MLflow', 'Git', 'Linux', 'Terraform'].includes(skill.name)
  );
  const cloudSkills = skills.filter(skill =>
    ['AWS', 'Azure', 'Databricks'].includes(skill.name)
  );

  const categories = [
    { title: 'Development', skills: developmentSkills, accent: '#66FCF1' },
    { title: 'Database', skills: databaseSkills, accent: '#9D4EDD' },
    { title: 'MLOps & DevOps', skills: devOpsSkills, accent: '#4F46E5' },
    { title: 'Cloud', skills: cloudSkills, accent: '#66FCF1' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="glass-card p-6 group/card"
            style={{
              borderTop: `2px solid ${cat.accent}22`,
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: cat.accent,
                  boxShadow: `0 0 10px ${cat.accent}40`,
                }}
              />
              <h3 className="text-sm font-semibold font-space text-white/80 tracking-wide uppercase">
                {cat.title}
              </h3>
            </div>

            <div className="space-y-2">
              {cat.skills.map(skill => (
                <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;