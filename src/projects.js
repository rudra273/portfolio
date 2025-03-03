// src/projects.js

export const projects = [
  {
    id: '1',
    title: 'Chat App',
    description: 'This real-time chat application is built using FastAPI WebSockets, Next.js, and PostgreSQL. Users can sign in, join channels, and engage in live conversations.',
    image: '/projects/chatapp/main.png',
    images: ['/projects/chatapp/main.png', '/projects/chatapp/chat.png', '/projects/chatapp/channel.png', '/projects/chatapp/search.png'],
    features: [
      'Real-time messaging with WebSocket connections for instant communication',
      'User authentication, channel-based communication, and message persistence in PostgreSQL',
      'Real-time presence indicators and typing notifications',
      'Responsive design that works across all devices with advanced message search capabilities'
    ],
    techStack: ['FastAPI', 'Next.js', 'PostgreSQL'],
    categories: ['Full Stack', 'Backend'],
    githubUrl: 'https://github.com/rudra273/flux',
    liveUrl: 'https://project1.com',
  },
  {
    id: '2',
    title: 'Stock Dashboard',
    description: 'Built with Django, Next.js, and Chart.js, lets users add stocks to their portfolio and view dynamic KPIs, charts, and dashboards for efficient stock tracking and analysis.',
    image: '/projects/stock-dashboard/portfolio.png',
    images: ['/projects/stock-dashboard/portfolio.png', '/projects/stock-dashboard/dashboard.png', '/projects/stock-dashboard/chart.png', '/projects/stock-dashboard/portfolio-report.png'],
    features: [
      'Portfolio management system for adding and tracking stocks',
      'Dynamic KPIs and metrics for performance analysis',
      'Interactive charts and visualization with Chart.js',
      'Comprehensive dashboard for efficient stock tracking and analysis'
    ],
    techStack: ['Django', 'Next.js', 'PostgreSQL', 'Kubernetes', 'Prometheus', 'Grafana'],
    categories: ['Full Stack', 'DevOps'],
    githubUrl: 'https://github.com/rudra273/STOCK',
    liveUrl: 'https://project2.com',
  },
  {
    id: '3',
    title: 'Code Assistant',
    description: 'A versatile code assistant that leverages multiple LLMs including local Ollama models to help developers write better code. Features include multi-file context support and intelligent code suggestions.',
    image: '/projects/code-assistant/main.png',
    images: ['/projects/code-assistant/main.png', '/projects/code-assistant/azure.png', '/projects/code-assistant/ollama.png', '/projects/code-assistant/context-preview.png'],
    features: [
      'Support for both cloud-based LLMs and local Ollama models for enhanced privacy',
      'Directory and file selection for context-aware assistance',
      'Multi-file analysis for comprehensive code understanding',
      'Intelligent code suggestions based on project context'
    ],
    techStack: ['Python', 'LangChain', 'Ollama', 'Streamlit'],
    categories: ['LLM', 'MLOps'],
    githubUrl: 'https://github.com/rudra273/code-assistant',
    liveUrl: 'https://code-assistant-demo.com',
  },
  {
    id: '4',
    title: 'Text-to-SQL',
    description: 'An advanced natural language to SQL query generator that leverages LLMs to transform plain text into complex SQL queries. The system vectorizes database schemas to enable accurate query generation without exposing sensitive data.',
    image: '/projects/text-to-sql/chat.png',
    images: ['/projects/text-to-sql/chat.png', '/projects/text-to-sql/home.png', '/projects/text-to-sql/load.png', '/projects/text-to-sql/connection.png'],
    features: [
      'Supports multiple database systems including PostgreSQL, Databricks, Snowflake, MongoDB, and BigQuery',
      'Schema vectorization for privacy-preserving query generation without exposing actual data',
      'Integrated rules engine for handling complex business logic and constraints',
      'Feedback loop system for continuous query improvement and optimization',
      'Compatible with multiple frontier LLM models including OpenAI and Claude Gemini'
    ],
    techStack: ['Python', 'LangChain', 'SQLAlchemy', 'FastAPI'],
    categories: ['LLM'], 
    githubUrl: 'https://github.com/rudra273/text-to-sql',
    liveUrl: 'https://text-to-sql-demo.com',
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