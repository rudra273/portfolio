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
    githubUrl: 'https://github.com/rudra273/sql-gen-app',
    liveUrl: 'https://text-to-sql-demo.com',
  },
  {
    id: '5',
    title: 'Stock Advisory',
    description: 'An advanced stock advisory application that leverages AI agents for technical analysis, news sentiment analysis, and in-depth research on specific stocks. The platform integrates multiple LLMs, including GPT and Gemini, to provide actionable insights and a comprehensive dashboard experience.',
    image: '/projects/stock-adv/technical.png',
    images: [
      '/projects/stock-adv/stock.png',
      '/projects/stock-adv/technical.png',
      '/projects/stock-adv/dashboard.png',
      '/projects/stock-adv/financial.png',
      '/projects/stock-adv/research.png',
      '/projects/stock-adv/home.png',
      '/projects/stock-adv/topmovers.png'
    ],
    features: [
      'AI-powered technical analysis agent for real-time stock trend detection and signal generation',
      'News sentiment analysis agent that aggregates and interprets financial news to assess market sentiment',
      'Research agent for deep-dive analysis on specific stocks, including financials and company news',
      'Unified dashboard with interactive visualizations, top movers, and actionable insights powered by multiple LLMs (GPT, Gemini, etc.)'
    ],
    techStack: ['Python', 'LangChain', 'redis', 'FastAPI', 'Next.js', 'PostgreSQL'],
    categories: ['LLM', 'Data Analysis', 'Full Stack'],
    githubUrl: 'https://github.com/rudra273/stock_advisory',
    liveUrl: 'https://stock-adv-demo.com',
  },
  {
    id: '6',
    title: 'Hisab-Kitab',
    description: 'Hisab-Kitab is a personal finance app that displays your transaction KPIs, daily dashboards, and enables chat with an LLM about your finances. The Android client collects transaction data via SMS, which the backend filters and transforms for analysis. Users can view dashboards and interact with an LLM-powered chat that uses tools to generate SQL queries and fetch transaction summaries.',
    image: '/projects/hisab-kitab/dashboard1.png',
    images: [
      '/projects/hisab-kitab/dashboard1.png',
      '/projects/hisab-kitab/chat.png',
      '/projects/hisab-kitab/dashboard.png'
    ],
    features: [
      'Android client collects transaction data via SMS',
      'Backend filters and transforms SMS data for analysis',
      'Daily transaction dashboards and KPIs',
      'LLM-powered chat that executes tools to generate SQL queries and summarize transactions',
      'Interactive financial insights and summaries'
    ],
    techStack: ['Python', 'FastAPI', 'LangChain', 'PostgreSQL'],
    categories: ['LLM', 'Data Analysis'],
    githubUrl: 'https://github.com/rudra273/hisab-kitab',
    liveUrl: '',
  },
];


export const allTechStacks = Array.from(new Set(projects.map(project => project.techStack).flat()));

export const projectCategories = [
  'LLM',
  'MLOps',
  'Backend',
  'Full Stack',
  'DevOps',
  'Data Analysis',
  'Cloud',
];
