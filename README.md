# Modern Full-Stack Boilerplate

This project provides a solid foundation for building modern web applications using a curated stack of technologies focused on developer experience, performance, and type safety.

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

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and fill in the required values (Database URL, Auth secrets, Resend API Key, Sentry DSN, etc.).
    ```bash
    cp .env.example .env
    ```
    *Ensure you configure environment variables according to `src/env.mjs`.* 

4.  **Database Setup:**
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

5.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application should now be running on `http://localhost:3000`.

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

*   [ ] **Implement Planned Auth Features:**
    *   [ ] Passkey Support
    *   [ ] Admin Dashboard (User Management UI)
    *   [ ] Organization Support (Multi-tenancy/Teams)
*   [ ] **Refactor Auth Hooks:** Ensure auth logic (e.g., `useSession`) is cleanly extracted into custom hooks.
*   [ ] **Standardize Form Usage:** Document preferred approach (React Hook Form vs. TanStack Form) or consolidate.
*   [ ] **Enhance Testing:**
    *   [ ] Add End-to-End tests (Playwright/Cypress).
    *   [ ] Increase unit/integration test coverage (components, API routes, utils).
*   [ ] **Component Library Documentation:** Set up Storybook for UI components.
*   [ ] **Database Seeding:** Create scripts for populating development/testing data.
*   [ ] **Advanced RBAC:** Implement fine-grained Role-Based Access Control if needed.
*   [ ] **Performance Optimization:** Bundle analysis, code splitting, image optimization.
*   [ ] **i18n Management:** Improve workflow (key extraction, translation platform integration).
*   [ ] **AI SDK Examples:** Add examples using `@ai-sdk/react`.
*   [ ] **Email Templates:** Add more examples/implementations using `react-email`.
*   [ ] **Sentry Configuration:** Add details on advanced Sentry setup (sourcemaps, user identification).
*   [ ] **Theme Toggle:** Implement UI for switching between light/dark themes (uses `next-themes`).
*   [ ] **CI/CD:** Set up a basic CI/CD pipeline (e.g., GitHub Actions for linting, testing, building).
*   [ ] **Deployment Guides:** Add specific guides (Vercel, Docker, etc.).
