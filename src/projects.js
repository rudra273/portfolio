// src/projects.js

export const projects = [
    {
      id: '1',
      title: 'Chat App',
      description: 'This real-time chat application is built using FastAPI WebSockets, Next.js, and PostgreSQL. Users can sign in, join channels, and engage in live conversations.',
      fullDescription: 'Detailed description of Project 1. This is where you can provide an in-depth explanation of the project, its goals, and the challenges you faced during development.',
      image: '/projects/chatapp/chat.jpeg',
      images: ['/projects/project1/image1.jpg', '/projects/project1/image2.jpg', '/projects/project1/image3.jpg'],
      techStack: ['FastAPI', 'Next.js', 'PostgreSQL'],
      categories: ['Full Stack', 'Backend'],
      githubUrl: 'https://github.com/rudra273/flux',
      liveUrl: 'https://project1.com',
    },
    {
      id: '2',
      title: 'Stock Dashboard',
      description: 'Built with Django, Next.js, and Chart.js, lets users add stocks to their portfolio and view dynamic KPIs, charts, and dashboards for efficient stock tracking and analysis.',
      fullDescription: 'Detailed description of Project 2. Explain the purpose of this project, the technologies used, and any interesting features or challenges.',
      image: '/projects/stock-dashboard/stock.jpeg',
      images: ['/projects/project2/image1.jpg', '/projects/project2/image2.jpg'],
      techStack: ['Django', 'Next.js', 'PostgreSQL', 'Kubernetes'],
      categories: ['Full Stack', 'DevOps'],
      githubUrl: 'https://github.com/rudra273/STOCK',
      liveUrl: 'https://project2.com',
    },
    {
      id: '3',
      title: 'Code Assistant',
      description: 'A versatile code assistant that leverages multiple LLMs including local Ollama models to help developers write better code. Features include multi-file context support and intelligent code suggestions.',
      fullDescription: 'An advanced code assistance tool that helps developers write, analyze, and improve their code using various language models. The application supports both cloud-based LLMs and local Ollama models for enhanced privacy and flexibility. Key features include directory/file selection for context-aware assistance, multi-file analysis, and intelligent code suggestions based on project context.',
      image: '/projects/code-assistant/main.png',
      images: ['/projects/code-assistant/main.png', '/projects/code-assistant/azure.png', '/projects/code-assistant/ollama.png', '/projects/code-assistant/context-preview.png'],
      techStack: ['Python', 'LangChain', 'Ollama', 'Streamlit'],
      categories: ['LLM', 'MLOps'],
      githubUrl: 'https://github.com/rudra273/code-assistant',
      liveUrl: 'https://code-assistant-demo.com',
    },
    
  ];

export const allTechStacks = Array.from(new Set(projects.map(project => project.techStack).flat()));

export const projectCategories = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'MLOps',
  'Data Analysis',
  'LLM'
];