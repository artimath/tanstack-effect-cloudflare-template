# Modern Full-Stack Boilerplate

This project provides a solid foundation for building modern web applications using a curated stack of technologies focused on developer experience, performance, and type safety.

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/e53f8665-ecf6-422b-a04a-014b99bdc922" />

<img width="1597" alt="image" src="https://github.com/user-attachments/assets/01bccb09-b700-41e3-815c-be5dc02c5e7c" />

<img width="1597" alt="image" src="https://github.com/user-attachments/assets/e1b3ac60-d95d-4add-b31b-807322d20605" />

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/17d16240-279d-4c65-994e-6ba286d85cb9" />








## Core Technologies

*   **Framework:** [TanStack Start](https://tanstack.com/start/v1) on [Vite](https://vitejs.dev/) + [Vinxi](https://vinxi.dev/) (Modern React foundation with SSR)
*   **Routing:** [TanStack Router](https://tanstack.com/router/v1) (Type-safe client and server routing)
*   **API:** [tRPC](https://trpc.io/) (End-to-end typesafe APIs)
*   **Database:** [Drizzle ORM](https://orm.drizzle.team/) (Type-safe SQL with PostgreSQL, Neon ready)
*   **UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
*   **State Management:** [TanStack Query](https://tanstack.com/query/v5) (Server State), [TanStack Store](https://tanstack.com/store/v0) (Client State)
*   **Forms:** [React Hook Form](https://react-hook-form.com/), [TanStack Form](https://tanstack.com/form/v1), [Zod](https://zod.dev/) (Validation)
*   **Authentication:** [Better Auth](https://github.com/BetterTyped/better-auth) (Details below)
*   **Email:** [Resend](https://resend.com/), [React Email](https://react.email/) (Transactional emails)
*   **Monitoring:** [Sentry](https://sentry.io/) (Error tracking and performance monitoring)
*   **Testing:** [Vitest](https://vitest.dev/) (Unit/Integration testing)
*   **Tooling & DX:** [Biome](https://biomejs.dev/) (Linting/Formatting), [T3 Env](https://github.com/t3-oss/t3-env), [TypeScript](https://www.typescriptlang.org/)
*   **AI:** [@ai-sdk/react](https://sdk.vercel.ai/), [ai](https://sdk.vercel.ai/) (Ready for AI features)
*   **i18n:** [i18next](https://www.i18next.com/) (Internationalization)

## AI Features

The boilerplate includes several AI-powered chat features and file handling capabilities:

*   **Basic Chat:** Simple streaming chat interface powered by OpenAI's GPT-4o.
*   **Image Generation:** AI-based image generation within chat using the AI SDK.
*   **RAG (Retrieval Augmented Generation):** Chat with context from your knowledge base:
    *   Upload documents to be processed into embeddings
    *   AI responses enhanced with information retrieved from your documents
    *   Knowledge base searching before answering questions
*   **File Upload:** PDF document processing for knowledge base:
    *   Drag-and-drop interface with progress indicators
    *   PDF text extraction and embedding generation
    *   Uses tRPC v11's FormData and non-JSON content type support

The implementation leverages tRPC v11's support for FormData and various content types, making it easy to handle file uploads directly through your type-safe API without additional libraries.

<img width="1591" alt="image" src="https://github.com/user-attachments/assets/9e87d828-60cb-4430-b690-44b8d635e14f" />

<img width="1600" alt="image" src="https://github.com/user-attachments/assets/2cf7ab06-fc4b-441d-b1e6-88b391b0691b" />

<img width="1599" alt="image" src="https://github.com/user-attachments/assets/473dd7f7-50b2-4a3b-af1c-bfb195d00800" />

<img width="1595" alt="image" src="https://github.com/user-attachments/assets/5cc566fa-c885-4223-9c73-e8ddfe21e5a0" />


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
- **`getUsers`**: Fetches user data from JSONPlaceholder API
- **`getWelcomeMessage`**: Simple greeting with parameter input
- **`calculateBMI`**: BMI calculator with weight and height parameters

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
    content: [{ type: "text", text: `Result: ${param}` }],
  };
};
```

2. **Add the tool to the tools array**:

```typescript
export const tools = [
  // ... existing tools
  {
    name: "yourNewTool",
    description: "Description of what your tool does",
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

The AI assistant will automatically determine which tools to use based on your requests and execute them in real-time.

## Included Features

### Robust Authentication

Powered by [Better Auth](https://github.com/BetterTyped/better-auth), providing secure user management features out-of-the-box:

*   **Core:** Sign Up, Sign In, Password Reset Flow (Forgot/Reset).
*   **Security:** Two-Factor Authentication (OTP).
*   **User Management:** Invitation Acceptance Flow.
*   **Documentation:** API reference available at `http://localhost:3000/api/auth/reference` when running the application.
*   *(See TODO list for planned additions like Passkey, Admin Dashboard, Org Support)*

### Development Experience

*   **Hot Module Replacement (HMR):** Fast development cycles with Vite.
*   **Type Safety:** End-to-end type safety from database to frontend.
*   **Code Quality:** Integrated linting and formatting with Biome.
*   **Environment Variables:** Type-safe env management with T3 Env.

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
    
    - **Database:** Set up a free Neon Postgres database
      - Sign up at [Neon.tech](https://neon.tech/)
      - Create a new project
      - Get your connection string from the dashboard
      - Set `DATABASE_URL` in your `.env` file:
        ```
        DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[database]
        ```
    
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
    Push the schema (for development/initial setup):
    ```bash
    bun run db:push
    ```
    *For production or more controlled migrations, generate migration files:* 
    ```bash
    # bun run db:generate
    # Apply migrations (tool/command depends on setup)
    ```
    *Optional: Use `bun run db:studio` to explore the schema via Drizzle Studio.*

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

*   `bun run dev`: Starts the development server.
*   `bun run build`: Builds the application for production.
*   `bun run start`: Starts the production server (requires build first).
*   `bun run serve`: Serves the built production app locally (via Vite preview).
*   `bun run test`: Runs tests using Vitest.
*   `bun run db:generate`: Generates Drizzle ORM migration files.
*   `bun run db:push`: Pushes the current Drizzle schema to the database.
*   `bun run db:studio`: Opens Drizzle Kit Studio.
*   `bun run add-ui-components <component-name>`: Adds shadcn/ui components.
*   `bun run format`: Formats code using Biome.
*   `bun run lint`: Lints code using Biome.
*   `bun run check`: Runs Biome check (format, lint, safety).

## TODO List & Potential Improvements

*   [x] **Implement Planned Auth Features:**
    *   [x] Passkey Support
    *   [x] Admin Dashboard (User Management UI)
    *   [x] Organization Support (Multi-tenancy/Teams)
*   [x] **Refactor Auth Hooks:** Ensure auth logic (e.g., `useSession`) is cleanly extracted into custom hooks.
*   [ ] **Standardize Form Usage:** Document preferred approach (React Hook Form vs. TanStack Form) or consolidate.
*   [ ] **Database Seeding:** Create scripts for populating development/testing data.
*   [ ] **Advanced RBAC:** Implement fine-grained Role-Based Access Control if needed.
*   [ ] **Performance Optimization:** Bundle analysis, code splitting, image optimization.
*   [x] **i18n Management:** Add Internationalization (translation platform integration).
*   [x] **AI SDK Examples:** Add examples using `@ai-sdk/react`.
*   [x] **Email Templates:** Add more examples/implementations using `react-email`.
*   [x] **Sentry Configuration:** Add details on advanced Sentry setup (sourcemaps, user identification).
*   [x] **Theme Toggle:** Implement UI for switching between light/dark themes (uses `next-themes`).
*   [ ] **CI/CD:** Set up a basic CI/CD pipeline (e.g., GitHub Actions for linting, testing, building).
*   [ ] **Deployment Guides:** Add specific guides (Vercel, Docker, etc.).

