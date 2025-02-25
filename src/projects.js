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
      githubUrl: 'https://github.com/yourusername/project1',
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
      githubUrl: 'https://github.com/yourusername/project2',
      liveUrl: 'https://project2.com',
    },
    
  ];

export const allTechStacks = Array.from(new Set(projects.map(project => project.techStack).flat()));

// create const like where i can add value like frontend, backend, fullstack, etc
// and then filter the projects based on that value
// and then display the projects based on that value in the projects page

// create another const of all the unique tech stact list in projects page and by selecting that tech stack we can filter the projects based on that tech stack