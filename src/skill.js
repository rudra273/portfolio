import { FaPython, FaJs, FaDatabase, FaDocker, FaGit, FaLinux, FaAws } from 'react-icons/fa'
import { SiKubernetes, SiAzuredevops, SiDjango, 
    SiFastapi, SiTailwindcss, SiTerraform, 
    SiMongodb, SiRedis, SiDatabricks, SiMlflow } from 'react-icons/si'

export const skills = [
  { name: 'Python', icon: FaPython },
  { name: 'FastAPI', icon: SiFastapi },
  { name: 'Django', icon: SiDjango },
  { name: 'PostgreSQL', icon: FaDatabase },
  { name: 'AWS', icon: FaAws },
  { name: 'Azure', icon: SiAzuredevops },

  { name: 'Docker', icon: FaDocker },
  { name: 'Kubernetes', icon: SiKubernetes },
  { name: 'Git', icon: FaGit },
  { name: 'Linux', icon: FaLinux },
  { name: 'Terraform', icon: SiTerraform },

  { name: 'JavaScript', icon: FaJs },
  { name: 'Tailwind CSS', icon: SiTailwindcss },

  { name: 'MongoDB', icon: SiMongodb },
  { name: 'Redis', icon: SiRedis },
  { name: 'Databricks', icon: SiDatabricks },
  { name: 'MLflow', icon: SiMlflow },
]