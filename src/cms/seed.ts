import payload from 'payload';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Initial data for seeding
const seedData = {
  // Site Settings
  siteSettings: {
    siteTitle: 'Monynha Softwares',
    siteDescription: 'Criando experiências digitais futuristas e inclusivas',
    socialLinks: {
      github: 'https://github.com/monynha-softwares',
      twitter: 'https://twitter.com/monynha',
      linkedin: 'https://linkedin.com/company/monynha',
      email: 'contato@monynha.com',
    },
    heroSection: {
      heading: 'Monynha',
      subheading: 'Criamos experiências digitais futuristas e inclusivas com tecnologias de ponta. Desenvolvendo o futuro da web com amor e diversidade.',
      primaryButtonText: 'Explorar Projetos',
      primaryButtonLink: '#projects',
      secondaryButtonText: 'Ver Documentação',
      secondaryButtonLink: '#docs',
      techStack: [
        { name: 'React' },
        { name: 'TypeScript' },
        { name: 'Next.js' },
        { name: 'Supabase' },
        { name: 'Tailwind' },
        { name: 'Payload CMS' },
        { name: 'Turborepo' },
      ],
    },
    aboutSection: {
      heading: 'Sobre a Monynha',
      description: 'Somos uma comunidade de desenvolvedores apaixonados por criar o futuro da web. Nascemos da necessidade de tecnologia mais inclusiva, acessível e extraordinária.',
      stats: [
        { label: 'Projetos Ativos', value: '50+', suffix: '' },
        { label: 'Contribuidores', value: '200+', suffix: '' },
        { label: 'Países Alcançados', value: '25+', suffix: '' },
        { label: 'Stars no GitHub', value: '15k+', suffix: '' },
      ],
      values: [
        {
          title: 'Inclusão & Diversidade',
          description: 'Criamos tecnologia para todas as pessoas, celebrando a diversidade como nossa maior força.',
          icon: 'Heart',
          color: 'text-pink-400',
        },
        {
          title: 'Inovação Constante',
          description: 'Exploramos tecnologias emergentes para criar soluções que transcendem o presente.',
          icon: 'Sparkles',
          color: 'text-primary',
        },
        {
          title: 'Performance Extrema',
          description: 'Otimizamos cada linha de código para entregar experiências instantâneas e fluidas.',
          icon: 'Zap',
          color: 'text-secondary',
        },
        {
          title: 'Comunidade Ativa',
          description: 'Construímos juntos, compartilhamos conhecimento e crescemos como coletivo.',
          icon: 'Users',
          color: 'text-purple-400',
        },
        {
          title: 'Impacto Global',
          description: 'Nossas soluções conectam culturas e transformam vidas ao redor do mundo.',
          icon: 'Globe',
          color: 'text-green-400',
        },
        {
          title: 'Open Source',
          description: 'Acreditamos no poder do código aberto para democratizar a tecnologia.',
          icon: 'Code2',
          color: 'text-cyan-400',
        },
      ],
      missionStatement: 'Democratizar a tecnologia através de soluções inovadoras e inclusivas, criando um futuro digital onde todas as pessoas possam prosperar. Utilizamos nosso conhecimento técnico como ferramenta de transformação social, sempre celebrando a diversidade e promovendo a igualdade.',
    },
    footerSection: {
      description: 'Criamos experiências digitais futuristas e inclusivas. Nossa missão é democratizar a tecnologia e construir um futuro mais diverso e igualitário.',
      newsletterHeading: 'Fique por dentro das novidades',
      newsletterDescription: 'Receba atualizações sobre nossos projetos, novidades da comunidade e conteúdo exclusivo sobre desenvolvimento futurista.',
      newsletterButtonText: 'Inscrever-se',
      copyrightText: '© 2024 Monynha Softwares. Feito com',
    },
  },

  // Navigation
  navigation: {
    mainNavigation: [
      { label: 'Início', link: '#home' },
      { label: 'Projetos', link: '#projects' },
      { label: 'Docs', link: '#docs' },
      { label: 'Blog', link: '#blog' },
    ],
    footerNavigation: {
      column1: {
        title: 'Navegação',
        links: [
          { label: 'Início', link: '#home' },
          { label: 'Projetos', link: '#projects' },
          { label: 'Documentação', link: '#docs' },
          { label: 'Blog', link: '#blog' },
          { label: 'Comunidade', link: '#community' },
        ],
      },
      column2: {
        title: 'Recursos',
        links: [
          { label: 'API Docs', link: '#' },
          { label: 'GitHub', link: '#' },
          { label: 'Contribuir', link: '#' },
          { label: 'Roadmap', link: '#' },
          { label: 'Status', link: '#' },
        ],
      },
    },
    legalLinks: [
      { label: 'Privacidade', link: '#' },
      { label: 'Termos', link: '#' },
      { label: 'Cookies', link: '#' },
    ],
  },

  // Projects
  projects: [
    {
      title: 'Nexus Lab',
      description: 'Plataforma experimental para desenvolvimento de protótipos futuristas com tecnologias emergentes.',
      slug: 'nexus-lab',
      status: 'Em desenvolvimento',
      tech: [
        { name: 'React' },
        { name: 'WebGL' },
        { name: 'AI/ML' },
        { name: 'WebAssembly' },
      ],
      stars: '2.1k',
      contributors: '12',
      gradient: 'from-primary to-primary-glow',
      githubUrl: 'https://github.com/monynha-softwares/nexus-lab',
      demoUrl: 'https://nexus-lab.monynha.com',
    },
    {
      title: 'Quantum UI',
      description: 'Sistema de design futurista com componentes holográficos e animações quânticas.',
      slug: 'quantum-ui',
      status: 'Stable',
      tech: [
        { name: 'Framer Motion' },
        { name: 'Three.js' },
        { name: 'GSAP' },
        { name: 'CSS3' },
      ],
      stars: '856',
      contributors: '8',
      gradient: 'from-secondary to-secondary-glow',
      githubUrl: 'https://github.com/monynha-softwares/quantum-ui',
      demoUrl: 'https://quantum-ui.monynha.com',
    },
    {
      title: 'Neural CMS',
      description: 'Sistema de gerenciamento de conteúdo com IA integrada e edição inteligente.',
      slug: 'neural-cms',
      status: 'Beta',
      tech: [
        { name: 'Payload CMS' },
        { name: 'OpenAI' },
        { name: 'PostgreSQL' },
        { name: 'Docker' },
      ],
      stars: '1.3k',
      contributors: '15',
      gradient: 'from-purple-500 to-pink-500',
      githubUrl: 'https://github.com/monynha-softwares/neural-cms',
      demoUrl: 'https://neural-cms.monynha.com',
    },
  ],

  // Categories
  categories: [
    {
      name: 'Frontend',
      slug: 'frontend',
      description: 'Tudo sobre desenvolvimento frontend e interfaces de usuário',
    },
    {
      name: 'Backend',
      slug: 'backend',
      description: 'Desenvolvimento de servidores, APIs e infraestrutura',
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX, design systems e experiência do usuário',
    },
    {
      name: 'DevOps',
      slug: 'devops',
      description: 'Infraestrutura, CI/CD, e operações de desenvolvimento',
    },
  ],

  // Authors
  authors: [
    {
      name: 'Ana Silva',
      bio: 'Desenvolvedora frontend especializada em acessibilidade e interfaces inclusivas.',
      links: {
        github: 'https://github.com/anasilva',
        twitter: 'https://twitter.com/anasilva',
        linkedin: 'https://linkedin.com/in/anasilva',
        website: 'https://anasilva.dev',
      },
    },
    {
      name: 'Carlos Oliveira',
      bio: 'Engenheiro de software full-stack com foco em arquitetura de sistemas distribuídos.',
      links: {
        github: 'https://github.com/carlosoliveira',
        twitter: 'https://twitter.com/carlosoliveira',
        linkedin: 'https://linkedin.com/in/carlosoliveira',
        website: 'https://carlosoliveira.dev',
      },
    },
  ],

  // Admin user
  adminUser: {
    email: 'admin@monynha.com',
    password: 'MonynhaAdmin123!',
    name: 'Admin User',
    roles: ['admin'],
  },
};

const seed = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'a-very-secure-secret-key',
    local: true,
    onInit: async (payload) => {
      try {
        // Create admin user
        const { email, password, name, roles } = seedData.adminUser;
        await payload.create({
          collection: 'users',
          data: {
            email,
            password,
            name,
            roles,
          },
        });
        console.log('✅ Admin user created');

        // Create categories
        for (const category of seedData.categories) {
          await payload.create({
            collection: 'categories',
            data: category,
          });
        }
        console.log('✅ Categories created');

        // Create authors
        for (const author of seedData.authors) {
          await payload.create({
            collection: 'authors',
            data: author,
          });
        }
        console.log('✅ Authors created');

        // Create projects
        for (const project of seedData.projects) {
          await payload.create({
            collection: 'projects',
            data: project,
          });
        }
        console.log('✅ Projects created');

        // Create site settings
        await payload.updateGlobal({
          slug: 'site-settings',
          data: seedData.siteSettings,
        });
        console.log('✅ Site settings created');

        // Create navigation
        await payload.updateGlobal({
          slug: 'navigation',
          data: seedData.navigation,
        });
        console.log('✅ Navigation created');

        console.log('🌱 Seed completed successfully!');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    },
  });
};

seed();