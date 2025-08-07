# Monynha Nexus Lab

Monynha Nexus Lab is a futuristic web platform showcasing innovative projects and technologies. This project combines a modern React frontend with Payload CMS for content management.

## Features

- Modern, responsive UI with futuristic design elements
- Fully integrated Payload CMS for content management
- Dynamic content sections: Hero, About, Projects, and more
- Multi-language support (PT/EN)
- Supabase integration for additional data storage
- Optimized for performance and accessibility

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **CMS**: Payload CMS
- **Database**: MongoDB (for CMS), Supabase (for additional features)
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API, TanStack Query
- **Deployment**: Configurable for various hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Monynha-Softwares/monynha-nexus-lab.git
   cd monynha-nexus-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your MongoDB connection string and other required variables.

4. Seed the database with initial content:
   ```bash
   npm run seed
   ```

### Running the Application

1. Start the Payload CMS server:
   ```bash
   npm run dev:cms
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Payload CMS Admin: http://localhost:3000/admin
   - Default admin credentials:
     - Email: admin@monynha.com
     - Password: MonynhaAdmin123!

## Project Structure

```
monynha-nexus-lab/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── cms/             # Payload CMS configuration
│   │   ├── collections/ # CMS collection definitions
│   │   ├── globals/     # Global CMS data definitions
│   │   ├── server.ts    # CMS server setup
│   │   └── seed.ts      # Database seeding script
│   ├── components/      # React components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party integrations
│   │   └── supabase/    # Supabase client and types
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── services/        # API services
├── .env                 # Environment variables (not in repo)
├── .env.example         # Example environment variables
└── package.json         # Project dependencies and scripts
```

## Development

### Adding New CMS Collections

1. Create a new collection file in `src/cms/collections/`
2. Add the collection to the Payload config in `src/cms/payload.config.ts`
3. Update API services in `src/services/api.ts` to include the new collection

### Customizing Components

1. Modify component files in `src/components/`
2. Update the corresponding CMS schemas if needed
3. Test changes with both static and CMS-driven content

## Deployment

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Build the CMS:
   ```bash
   npm run build:cms
   ```

3. Start the production server:
   ```bash
   npm run start:cms
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Payload CMS](https://payloadcms.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)