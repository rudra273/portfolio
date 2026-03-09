import React from 'react';
import { IconType } from 'react-icons';
import { skills } from '@/skill';

interface SkillIconProps {
  name: string;
  Icon: IconType;
}

const SkillIcon = ({ name, Icon }: SkillIconProps) => {
  return (
    <div className="flex items-center px-4 py-3 bg-gray-800 hover:bg-gray-700 border-l-2 border-blue-500 transition-all duration-300 mb-3">
      <Icon className="text-2xl text-white mr-3" />
      <span className="text-white">{name}</span>
    </div>
  );
};

const Skills = () => {
  // Categorize skills
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

  return (
    <section className="py-12 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8 text-center font-roboto">Technical Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="text-xl mb-4">Development</h3>
            {developmentSkills.map(skill =>
              <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl mb-4">Database</h3>
            {databaseSkills.map(skill =>
              <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl mb-4">MLOps & DevOps</h3>
            {devOpsSkills.map(skill =>
              <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl mb-4">Cloud</h3>
            {cloudSkills.map(skill =>
              <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;