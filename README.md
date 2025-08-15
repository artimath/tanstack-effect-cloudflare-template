# Modern Full-Stack Boilerplate

This project provides a solid foundation for building modern web applications using a curated stack of technologies focused on developer experience, performance, and type safety.

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/e53f8665-ecf6-422b-a04a-014b99bdc922" />

<img width="1597" alt="image" src="https://github.com/user-attachments/assets/01bccb09-b700-41e3-815c-be5dc02c5e7c" />

<img width="1597" alt="image" src="https://github.com/user-attachments/assets/e1b3ac60-d95d-4add-b31b-807322d20605" />

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/17d16240-279d-4c65-994e-6ba286d85cb9" />

## Core Technologies

- **Framework:** [TanStack Start](https://tanstack.com/start/v1) on [Vite](https://vitejs.dev/) + [Vinxi](https://vinxi.dev/) (Modern React foundation with SSR)
- **Routing:** [TanStack Router](https://tanstack.com/router/v1) (Type-safe client and server routing)
- **API:** [tRPC](https://trpc.io/) (End-to-end typesafe APIs)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.com/) + [Vite Plugin](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) (Auto-provisioned serverless PostgreSQL)
- **UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **State Management:** [TanStack Query](https://tanstack.com/query/v5) (Server State), [TanStack Store](https://tanstack.com/store/v0) (Client State), [TanStack DB](https://tanstack.com/db/latest) (Reactive Collections)
- **Forms:** [React Hook Form](https://react-hook-form.com/), [TanStack Form](https://tanstack.com/form/v1), [Zod](https://zod.dev/) (Validation)
- **Authentication:** [Better Auth](https://github.com/BetterTyped/better-auth) (Details below)
- **Email:** [Resend](https://resend.com/), [React Email](https://react.email/) (Transactional emails)
- **Monitoring:** [Sentry](https://sentry.io/) (Error tracking and performance monitoring)
- **Testing:** [Vitest](https://vitest.dev/) (Unit/Integration testing)
- **Tooling & DX:** [Biome](https://biomejs.dev/) (Linting/Formatting), [T3 Env](https://github.com/t3-oss/t3-env), [TypeScript](https://www.typescriptlang.org/)
- **AI:** [@ai-sdk/react](https://sdk.vercel.ai/), [ai](https://sdk.vercel.ai/) (Ready for AI features)
- **i18n:** [i18next](https://www.i18next.com/) (Internationalization)

## Quick Demo: TanStack DB Example

- **Route:** `/dashboard/tanstack-db-example`
- **What it demonstrates:** Reactive collections with live queries, multiple filtered views (All, Pending, Completed), and seamless integration with TanStack Query/tRPC.
- **Docs:** [TanStack DB Overview](https://tanstack.com/db/latest/docs/overview)

<img width="1599" height="1112" alt="image" src="https://github.com/user-attachments/assets/3e0d9de1-e7c4-4f0e-93f9-1cca421fc424" />


## Database with Neon

This boilerplate uses [Neon](https://neon.com/) as the primary database solution, providing a modern serverless PostgreSQL experience that's perfect for full-stack applications.

### Why Neon?

**Neon** is a serverless PostgreSQL platform that separates storage and compute, offering several key advantages:

- **Zero-Friction Setup**: Create databases instantly without signup via [neon.new](https://neon.new/) - perfect for prototyping
- **Serverless Architecture**: Automatically scales to zero when not in use, reducing costs
- **Instant Provisioning**: Create database branches in seconds, not minutes
- **Developer-Friendly**: Built-in connection pooling, automatic backups, and point-in-time recovery
- **Database Branching**: Create database branches for each feature, just like Git branches
- **Modern Tooling**: Native integration with popular ORMs like Drizzle, Prisma, and more
- **Global Edge**: Low-latency read replicas across multiple regions

### Quick Setup

Get started with Neon in minutes using one of these approaches:

#### Option 1: Instant Database Creation (No Login Required)

Choose any of these three methods for instant database setup:

**Method A: Browser Setup**

1. Visit [neon.new](https://neon.new/) to instantly create a new PostgreSQL database

**Method B: CLI Script** 2. Use our built-in script for instant setup:

```bash
bun run db:neon-setup
# This runs: npx neondb --yes
```

**Method C: Automatic Vite Plugin (Recommended)** 3. **Already configured!** The [`@neondatabase/vite-plugin-postgres`](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) plugin automatically:

- Checks for `DATABASE_URL` in your `.env` file on first `bun run dev`
- Creates a claimable Neon database if not found
- Writes the connection string directly to your `.env` file
- Provides both direct and pooled connection strings
- Gives you a 7-day claim URL to take ownership

**Just run `bun run dev` and you're ready to go!** ✨

All methods create a temporary Neon database **instantly without requiring any login or signup**. Perfect for:

- Quick prototyping and testing
- Open-source templates and demos
- Getting started immediately without account setup
- Temporary development environments

**Note**: The database expires after 72 hours unless you claim it with a free Neon account.

#### Option 2: Permanent Database Setup

1. **Sign up**: Create a free account at [neon.com](https://neon.com/)
2. **Create project**: Set up a permanent database in your dashboard
3. **Get connection string**: Copy from your Neon project dashboard

#### Final Step: Configure Connection

Copy your Neon connection string to your `.env` file:

```bash
DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require
```

### Neon Features in This Boilerplate

- **Automatic Database Provisioning**: Pre-configured with [`@neondatabase/vite-plugin-postgres`](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) for zero-config database setup
- **Drizzle Integration**: Pre-configured with `@neondatabase/serverless` for optimal performance
- **Connection Pooling**: Built-in pooling for better connection management
- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Migrations**: Seamless database schema management with Drizzle Kit
- **Development Workflow**: Database branching for feature development
- **Auto Environment Setup**: Plugin automatically writes connection strings to your `.env` file

### Database Branching Workflow

One of Neon's most powerful features is database branching, allowing you to:

1. **Create feature branches**: Each feature gets its own database copy
2. **Test safely**: Make schema changes without affecting production
3. **Collaborate effectively**: Team members can work with isolated data
4. **Deploy confidently**: Merge database changes alongside code changes

For more information about Neon's features and capabilities, visit [neon.com](https://neon.com/).

## AI Features

The boilerplate includes several AI-powered chat features and file handling capabilities:

- **Basic Chat:** Simple streaming chat interface powered by OpenAI's GPT-4o.
- **Vercel v0 Chat:** Advanced chat interface using Vercel's v0-1.0-md model for web development assistance.
- **Image Generation:** AI-based image generation within chat using the AI SDK.
- **RAG (Retrieval Augmented Generation):** Chat with context from your knowledge base:
  - Upload documents to be processed into embeddings
  - AI responses enhanced with information retrieved from your documents
  - Knowledge base searching before answering questions
- **File Upload:** PDF document processing for knowledge base:
  - Drag-and-drop interface with progress indicators
  - PDF text extraction and embedding generation
  - Uses tRPC v11's FormData and non-JSON content type support

The implementation leverages tRPC v11's support for FormData and various content types, making it easy to handle file uploads directly through your type-safe API without additional libraries.

### Vercel v0 API Integration

The boilerplate includes integration with [Vercel's v0 API](https://vercel.com/docs/v0/api), which provides an AI model specifically designed for building modern web applications. The `v0-1.0-md` model is framework-aware, evaluated on modern stacks like Next.js and Vercel, and includes features like auto-fix and quick edit capabilities.

**Features:**

- Framework-aware completions optimized for Next.js and modern web stacks
- Streaming responses with low latency
- OpenAI-compatible API format
- Multimodal support (text and image inputs)
- Auto-fix for common coding issues
- Optimized for frontend and full-stack web development

**Implementation:**

- **API Route:** `src/routes/api/ai/vercel/chat.ts` - Handles streaming chat with the v0 model
- **Chat Interface:** `src/routes/dashboard/chat/vercel.tsx` - Frontend chat component for v0 interactions
- **Model:** Uses `vercel("v0-1.0-md")` via the `@ai-sdk/vercel` package

**Setup:**

1. **Requirements:** Vercel Premium or Team plan with usage-based billing enabled
2. **API Key:** Create an API key at [v0.dev](https://v0.dev)
3. **Environment:** Add your v0 API key to your environment variables:
   ```bash
   V0_API_KEY=your_v0_api_key_here
   ```

**Usage:**
Navigate to `/dashboard/chat/vercel` to access the v0-powered chat interface. This chat is specifically optimized for web development questions and can help with:

- Next.js application development
- React component creation
- TailwindCSS styling
- TypeScript implementation
- Modern web development patterns

**API Limits:**

- Max messages per day: 200
- Max context window: 128,000 tokens
- Max output context: 32,000 tokens

For higher limits, contact Vercel support at support@v0.dev.

<img width="1591" alt="image" src="https://github.com/user-attachments/assets/9e87d828-60cb-4430-b690-44b8d635e14f" />

<img width="1600" alt="image" src="https://github.com/user-attachments/assets/2cf7ab06-fc4b-441d-b1e6-88b391b0691b" />

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/473dd7f7-50b2-4a3b-af1c-bfb195d00800" />

<img width="1595" alt="image" src="https://github.com/user-attachments/assets/5cc566fa-c885-4223-9c73-e8ddfe21e5a0" />

## TanStack DB - Reactive Data Collections

This boilerplate includes [TanStack DB](https://tanstack.com/db/latest), a reactive client store for building super fast apps with live queries and optimistic mutations. TanStack DB provides a powerful abstraction for managing complex client-side data with automatic reactivity.

### What is TanStack DB?

TanStack DB is a reactive data management library that extends TanStack Query with:

- **Collections**: Typed sets of objects that can be populated with data
- **Live Queries**: Reactive queries that automatically update when underlying data changes
- **Optimistic Mutations**: Instant UI updates with automatic rollback on errors
- **Differential Updates**: Incremental query result updates for blazing fast performance

### Example Implementation

Visit `/dashboard/tanstack-db-example` to see TanStack DB in action with a reactive todo application that demonstrates:

#### 🔄 **Single Data Source, Multiple Live Views**

```tsx
// One collection, three reactive views
const { data: allTodos } = useLiveQuery((q) =>
  q.from({ todo: todoCollection }),
);
const { data: completed } = useLiveQuery((q) =>
  q
    .from({ todo: todoCollection })
    .where(({ todo }) => eq(todo.completed, true)),
);
const { data: pending } = useLiveQuery((q) =>
  q
    .from({ todo: todoCollection })
    .where(({ todo }) => eq(todo.completed, false)),
);
```

#### ⚡ **Automatic Reactivity**

- **All Todos**: Shows complete list with real-time updates
- **Pending Todos**: Live-filtered view of incomplete tasks
- **Completed Todos**: Live-filtered view of finished tasks
- When data changes → all views update automatically without manual refetch

#### 🎯 **Client-Side Efficiency**

```tsx
// ❌ Without TanStack DB - Multiple API calls
const allTodos = useQuery(['todos']);
const completedTodos = useQuery(['todos', 'completed']);
const pendingTodos = useQuery(['todos', 'pending']);

// ✅ With TanStack DB - Single data source, multiple reactive views
const todoCollection = createCollection(queryCollectionOptions({...}));
// All live queries automatically sync from the same collection
```

### Key Benefits Demonstrated

| Feature              | Benefit                                            | Implementation                                  |
| -------------------- | -------------------------------------------------- | ----------------------------------------------- |
| **Live Queries**     | Automatic reactive updates when data changes       | Multiple filtered views update simultaneously   |
| **Reactive Updates** | No manual refetch needed                           | Changes propagate through all views instantly   |
| **Filtered Views**   | Multiple live-filtered views from same data source | Pending/Completed sections filter automatically |
| **Type Safety**      | Full TypeScript support                            | End-to-end type safety with schema validation   |

### When to Use TanStack DB

**Perfect for applications with:**

- Multiple views of the same data (dashboards, admin panels)
- Complex client-side filtering and aggregations
- Real-time data requirements (when paired with WebSockets/SSE)
- Large datasets requiring efficient updates
- Complex data relationships and joins

**Consider regular TanStack Query for:**

- Simple CRUD operations
- Basic server state management
- Applications with minimal data transformation needs

### Integration with Your API

The example shows how TanStack DB integrates seamlessly with your existing tRPC endpoints:

```tsx
const todoCollection = createCollection(
  queryCollectionOptions<Todo>({
    queryKey: ['todos'],
    queryFn: async () => {
      const data = await todos.refetch();
      return data.data ?? [];
    },
    queryClient,
    getKey: (item) => item.id,
  }),
);
```

### Performance Benefits

- **Differential Updates**: Only affected UI components re-render
- **Single Data Source**: Eliminates duplicate API calls for related views
- **Optimistic Updates**: Instant feedback with automatic error handling
- **Memory Efficient**: Shared data across multiple query consumers

### Learn More

- **TanStack DB Documentation**: [https://tanstack.com/db/latest](https://tanstack.com/db/latest)
- **Live Queries Guide**: [https://tanstack.com/db/latest/docs/live-queries](https://tanstack.com/db/latest/docs/live-queries)
- **Collection Options**: [https://tanstack.com/db/latest/docs/overview](https://tanstack.com/db/latest/docs/overview)
- **Example Code**: See `src/routes/dashboard/tanstack-db-example.tsx`

_This implementation showcases TanStack DB's core strength: efficient client-side data management with automatic reactivity. For real-time server updates, pair with WebSocket backends or sync engines like ElectricSQL._

## MCP (Model Context Protocol) Integration

This boilerplate includes a fully functional **Model Context Protocol (MCP)** server that allows AI assistants like Claude Desktop and Cursor to interact with your application's tools and data in real-time.

### What is MCP?

The Model Context Protocol is a standard for connecting AI assistants to external tools and data sources. It enables your AI assistant to execute functions, access APIs, and interact with your application directly from the chat interface.

### Implementation

The MCP server is implemented using the [`@vercel/mcp-adapter`](https://www.npmjs.com/package/@vercel/mcp-adapter) package, adapted for **TanStack Start** (instead of Next.js). The implementation consists of:

- **MCP Handler**: Located at `src/routes/api/ai/mcp/$transport.ts`
- **Tools Definition**: Located at `src/lib/ai/mcp-tools.ts`

### Available Tools

The boilerplate comes with several example tools that demonstrate different capabilities:

- **`getCatFact`**: Fetches random cat facts from an external API
- **`getQuote`**: Retrieves inspirational quotes from an external API
- **`getJoke`**: Gets random programming jokes from an external API
- **`getWelcomeMessage`**: Simple greeting with parameter input
- **`calculateBMI`**: BMI calculator with weight and height parameters
- **`getTodos`**: Retrieves todos from the application's database (demonstrates database integration)

### Configuration for AI Assistants

#### Claude Desktop

Add the following configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "your-app": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/api/ai/mcp/mcp"]
    }
  }
}
```

#### Cursor

Add the following configuration to your Cursor MCP config file at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "your-app": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/api/ai/mcp/mcp"]
    }
  }
}
```

### Adding New Tools

To add new tools to your MCP server:

1. **Define the tool function** in `src/lib/ai/mcp-tools.ts`:

```typescript
const yourNewTool = async ({ param }: { param: string }) => {
  // Your tool logic here
  return {
    content: [{ type: 'text', text: `Result: ${param}` }],
  };
};
```

2. **Add the tool to the tools array**:

```typescript
export const tools = [
  // ... existing tools
  {
    name: 'yourNewTool',
    description: 'Description of what your tool does',
    callback: yourNewTool,
    inputSchema: z.object({
      param: z.string(),
    }),
  },
];
```

3. **Restart your development server** and the AI assistant to pick up the new tool.

### Usage

Once configured, you can interact with your tools directly from your AI assistant:

- Ask Claude or Cursor to "get a cat fact" → triggers `getCatFact`
- Say "calculate my BMI for 70kg and 1.75m" → triggers `calculateBMI`
- Request "tell me a joke" → triggers `getJoke`
- Ask "show me my todos" or "what needs to be done" → triggers `getTodos`
- Say "welcome me as John" → triggers `getWelcomeMessage`

The AI assistant will automatically determine which tools to use based on your requests and execute them in real-time, including accessing your application's database for dynamic data.

## Included Features

### Robust Authentication

Powered by [Better Auth](https://github.com/BetterTyped/better-auth), providing secure user management features out-of-the-box:

- **Core:** Sign Up, Sign In, Password Reset Flow (Forgot/Reset).
- **Security:** Two-Factor Authentication (OTP).
- **User Management:** Invitation Acceptance Flow.
- **Documentation:** API reference available at `http://localhost:3000/api/auth/reference` when running the application.
- _(See TODO list for planned additions like Passkey, Admin Dashboard, Org Support)_

### Development Experience

- **Hot Module Replacement (HMR):** Fast development cycles with Vite.
- **Type Safety:** End-to-end type safety from database to frontend.
- **Code Quality:** Integrated linting and formatting with Biome.
- **Environment Variables:** Type-safe env management with T3 Env.

## Getting Started

1.  **Install Bun:**
    If you don't have Bun installed, you can install it using:

    ```bash
    # For macOS, Linux, and WSL
    curl -fsSL https://bun.sh/install | bash

    # For Windows (via PowerShell)
    powershell -c "irm bun.sh/install.ps1 | iex"

    # Verify installation
    bun --version
    ```

2.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

3.  **Install dependencies:**

    ```bash
    bun install
    ```

4.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and configure the required values:

    ```bash
    cp .env.example .env
    ```

    Key environment variables to configure:
    - **Database:** Neon Postgres database (automatically configured!)
      - **Zero-config setup**: Just run `bun run dev` - the Vite plugin will automatically create a database and configure your `.env` file
      - **Alternative methods**: Visit [neon.new](https://neon.new/) or run `bun run db:neon-setup` for manual setup
      - **No signup needed**: All methods create temporary databases without any registration
      - **72-hour trial**: Database expires after 72 hours unless claimed with a free Neon account
      - **Auto-configured**: The plugin writes the connection string to your `.env` file automatically
    - **Auth:** Generate a secure secret for Better Auth
      ```bash
      # Generate a secure random string
      openssl rand -base64 32
      ```
      Add it to your `.env` file as `BETTER_AUTH_SECRET`
    - **Email:** Set up a [Resend](https://resend.com/) account for email sending
      - Get your API key and add it as `RESEND_API_KEY`
    - **Monitoring (optional):** Configure Sentry for error tracking
      - Get your DSN, organization, and project values from your Sentry dashboard
      - Set the corresponding environment variables

5.  **Database Setup:**
    Ensure your PostgreSQL database is running and accessible.

    **Vector Extension Setup (Required for AI Features):**
    This project includes vector embeddings for AI features. The `pg_vector` extension needs to be enabled:

    ```bash
    # Automated setup (recommended)
    bun run db:setup-vector
    ```

    If the automated script fails, enable it manually:
    1. Open your [Neon dashboard](https://console.neon.tech)
    2. Navigate to SQL Editor
    3. Run the following query:
       ```sql
       CREATE EXTENSION vector;
       ```

    📖 **Reference:** [Neon pg_vector documentation](https://neon.tech/docs/extensions/pg_vector)

    **Schema Setup:**
    Push the schema (for development/initial setup):

    ```bash
    bun run db:push
    ```

    _For production or more controlled migrations, generate migration files:_

    ```bash
    # bun run db:generate
    # Apply migrations (tool/command depends on setup)
    ```

    _Optional: Use `bun run db:studio` to explore the schema via Drizzle Studio._

6.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should now be running on `http://localhost:3000`.

## Project Structure

This project follows a structured organization pattern for better maintainability:

```
src/
├─ app/                   # App specific files
├─ components/            # Reusable UI components (including shadcn/ui)
├─ features/              # Feature-specific components and logic
│  ├─ ai-embedding.ts     # Vector embedding generation for RAG functionality
│  ├─ resource-create.ts  # Knowledge base resource creation
│  ├─ file-upload.schema.ts # File upload validation schemas
│  ├─ auth/               # Authentication related features
│  └─ organization/       # Organization management features
├─ hooks/                 # Custom React hooks
├─ lib/                   # Core libraries and utilities
│  ├─ auth/               # Better Auth implementation
│  ├─ db/                 # Drizzle ORM setup and schema
│  ├─ intl/               # i18next internationalization setup
│  ├─ trpc/               # tRPC client and server setup
│  ├─ env.client.ts       # Type-safe client environment variables (T3 Env)
│  ├─ env.server.ts       # Type-safe server environment variables
│  └─ resend.ts           # Email sending with Resend and React Email
├─ routes/                # TanStack Router routes with file-based routing
│  ├─ (auth)/             # Authentication related routes (protected)
│  ├─ (public)/           # Public facing routes
│  ├─ api/                # API routes
│  │  ├─ ai/              # AI-related API endpoints
│  │  │  ├─ chat.ts       # Basic chat API
│  │  │  ├─ chat.rag.ts   # RAG-enhanced chat API
│  │  │  └─ chat.image.generation.ts # Image generation chat API
│  ├─ dashboard/          # Dashboard related routes
│  │  ├─ chat/            # Chat interface routes
│  └─ _root.tsx           # Root layout component
├─ server/                # Server-side code
│  ├─ router.ts           # Main API router setup
│  └─ routes/             # Server-side route handlers
├─ api.ts                 # API client export
├─ client.tsx             # Client entry point
├─ router.tsx             # Router configuration
└─ ssr.tsx                # Server-side rendering setup

public/                   # Static assets
```

The structure organizes code by feature and responsibility, keeping related code together for better maintainability.

## Available Scripts

- `bun run dev`: Starts the development server.
- `bun run build`: Builds the application for production.
- `bun run start`: Starts the production server (requires build first).
- `bun run serve`: Serves the built production app locally (via Vite preview).
- `bun run test`: Runs tests using Vitest.
- `bun run db:generate`: Generates Drizzle ORM migration files.
- `bun run db:push`: Pushes the current Drizzle schema to the database.
- `bun run db:studio`: Opens Drizzle Kit Studio.
- `bun run db:neon-setup`: Sets up Neon database integration locally.
- `bun run db:setup-vector`: Enables the pg_vector extension for AI embedding features.
- `bun run add-ui-components <component-name>`: Adds shadcn/ui components.
- `bun run format`: Formats code using Biome.
- `bun run lint`: Lints code using Biome.
- `bun run check`: Runs Biome check (format, lint, safety).

## Docker Deployment

This project includes a complete Docker setup with automated CI/CD pipeline for containerized deployment.

### GitHub Actions Workflow

The project uses GitHub Actions for automated Docker image building and deployment:

**Workflow:** `.github/workflows/build-docker.yml`

**Features:**

- **Multi-stage build**: Builds application with Bun, then creates optimized Docker image
- **Container Registry**: Pushes images to GitHub Container Registry (ghcr.io)
- **Caching**: Uses GitHub Actions cache for faster builds
- **Automated tagging**: Creates tags based on branch names and commit SHAs
- **Environment handling**: Injects build-time and runtime environment variables
- **Deployment stage**: Includes deployment job for production environments

**Triggers:**

- Push to `dev-test` and `main-test` branches (configure for your preferred branches)
- Manual workflow dispatch

**Build Process:**

1. **Setup**: Installs Bun and dependencies
2. **Build**: Compiles application with environment variables
3. **Docker**: Creates multi-stage Docker image with optimized production build
4. **Push**: Uploads image to GitHub Container Registry
5. **Deploy**: Deploys to production (when pushed to main branch)

### Local Docker Testing

Test your Docker setup locally using the included Docker Compose configuration:

**File:** `compose.yaml`

```bash
# Build and run the application in Docker
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Configuration:**

- **Build context**: Uses `Dockerfile.dev` for development-oriented builds
- **Port mapping**: Exposes application on `localhost:3000`
- **Environment variables**: Automatically loads from your `.env` file
- **Health checks**: Monitors application health with built-in checks
- **Volume mounting**: Mounts `.env` file for configuration

**Environment Setup:**
The Docker Compose setup automatically uses your local `.env` file, so ensure you have:

- `DATABASE_URL`: Your Neon database connection string
- `ANTHROPIC_API_KEY`: For AI features
- `OPENAI_API_KEY`: For AI features
- Other required environment variables

This allows you to test the exact same containerized environment that will be used in production, ensuring consistency across development and deployment environments.

## TODO List & Potential Improvements

- [x] **Implement Planned Auth Features:**
  - [x] Passkey Support
  - [x] Admin Dashboard (User Management UI)
  - [x] Organization Support (Multi-tenancy/Teams)
- [x] **Refactor Auth Hooks:** Ensure auth logic (e.g., `useSession`) is cleanly extracted into custom hooks.
- [x] **MCP Integration:** Model Context Protocol server implementation with example tools.
- [x] **i18n Management:** Add Internationalization (translation platform integration).
- [x] **AI SDK Examples:** Add examples using `@ai-sdk/react`.
- [x] **Email Templates:** Add more examples/implementations using `react-email`.
- [x] **Sentry Configuration:** Add details on advanced Sentry setup (sourcemaps, user identification).
- [x] **Theme Toggle:** Implement UI for switching between light/dark themes (uses `next-themes`).
- [x] **CI/CD:** Set up a basic CI/CD pipeline (e.g., GitHub Actions for linting, testing, building).
- [x] **TanStack DB Example:** Add comprehensive example showcasing reactive collections and live queries.
- [ ] **Deployment Guides:** Add specific guides (Vercel, Docker, etc.).
