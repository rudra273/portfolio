import SkillIcon from '@/components/SkillIcon'
import { FaPython, FaJs, FaDatabase, FaDocker, FaGit, FaLinux, FaAws } from 'react-icons/fa'
import { SiKubernetes, SiAzuredevops, SiDjango, SiFastapi, SiTailwindcss } from 'react-icons/si'

const skills = [
  { name: 'Python', icon: FaPython },
  { name: 'JavaScript', icon: FaJs },
  { name: 'PostgreSQL', icon: FaDatabase },
  { name: 'Docker', icon: FaDocker },
  { name: 'Kubernetes', icon: SiKubernetes },
  { name: 'Git', icon: FaGit },
  { name: 'Linux', icon: FaLinux },
  { name: 'AWS', icon: FaAws },
  { name: 'Azure', icon: SiAzuredevops },
  { name: 'Django', icon: SiDjango },
  { name: 'FastAPI', icon: SiFastapi },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
]

const Skills = () => {
  return (
    <div className="max-w-[95%] mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-roboto">Skills</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {skills.map((skill) => (
          <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
        ))}
      </div>
    </div>
  )
}

export default Skills