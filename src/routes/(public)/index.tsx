import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Activity,
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle,
  Code,
  Database,
  Github,
  LayoutDashboard,
  Mail,
  Menu,
  Paintbrush,
  Shield,
  Sparkles,
  TerminalSquare,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

import { useState } from "react";

import { ModeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/(public)/")({
  component: LandingPage,
});

const techStack = [
  {
    category: "Frontend Framework",
    icon: LayoutDashboard,
    description: "Modern React foundation with server-side rendering.",
    libs: [
      { name: "TanStack Start", href: "https://tanstack.com/start/v1" },
      { name: "React 19", href: "https://react.dev/" },
      { name: "Vite", href: "https://vitejs.dev/" },
      { name: "Vinxi", href: "https://vinxi.dev/" },
    ],
  },
  {
    category: "Routing",
    icon: ArrowRight,
    description: "Type-safe routing for seamless navigation.",
    libs: [{ name: "TanStack Router", href: "https://tanstack.com/router/v1" }],
  },
  {
    category: "Backend & API",
    icon: Code,
    description: "End-to-end typesafe APIs for robust backend communication.",
    libs: [{ name: "tRPC", href: "https://trpc.io/" }],
  },
  {
    category: "Database & ORM",
    icon: Database,
    description: "Type-safe SQL database interactions.",
    libs: [
      { name: "Drizzle ORM", href: "https://orm.drizzle.team/" },
      { name: "PostgreSQL (Neon Ready)", href: "https://neon.com/" },
    ],
  },
  {
    category: "UI & Styling",
    icon: Paintbrush,
    description: "Beautiful, accessible components and utility-first CSS.",
    libs: [
      { name: "shadcn/ui", href: "https://ui.shadcn.com/" },
      { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
      { name: "Lucide Icons", href: "https://lucide.dev/" },
    ],
  },
  {
    category: "State Management",
    icon: Box,
    description: "Powerful server state and local state management.",
    libs: [
      { name: "TanStack Query", href: "https://tanstack.com/query/v5" },
      { name: "TanStack Store", href: "https://tanstack.com/store/v0" },
    ],
  },
  {
    category: "Forms",
    icon: CheckCircle,
    description: "Flexible and type-safe form handling.",
    libs: [
      { name: "React Hook Form", href: "https://react-hook-form.com/" },
      { name: "TanStack Form", href: "https://tanstack.com/form/v1" },
      { name: "Zod", href: "https://zod.dev/" },
    ],
  },
  {
    category: "Authentication",
    icon: Shield,
    description: "Secure and easy-to-implement authentication.",
    libs: [
      {
        name: "Better Auth",
        href: "https://github.com/BetterTyped/better-auth",
      },
    ],
  },
  {
    category: "Tooling & DX",
    icon: Wrench,
    description: "Enhanced developer experience and code quality tools.",
    libs: [
      { name: "Biome", href: "https://biomejs.dev/" },
      { name: "Vitest", href: "https://vitest.dev/" },
      { name: "T3 Env", href: "https://github.com/t3-oss/t3-env" },
      { name: "TypeScript", href: "https://www.typescriptlang.org/" },
    ],
  },
  {
    category: "AI Integration",
    icon: Sparkles,
    description: "Ready for building AI-powered features.",
    libs: [
      { name: "@ai-sdk/react", href: "https://sdk.vercel.ai/" },
      { name: "ai", href: "https://sdk.vercel.ai/" },
    ],
  },
  {
    category: "Email Sending",
    icon: Mail,
    description: "Reliable transactional email delivery and templating.",
    libs: [
      { name: "Resend", href: "https://resend.com/" },
      { name: "React Email", href: "https://react.email/" },
    ],
  },
  {
    category: "Monitoring",
    icon: Activity,
    description: "Application monitoring and error tracking.",
    libs: [{ name: "Sentry", href: "https://sentry.io/" }],
  },
  {
    category: "Internationalization",
    icon: Users,
    description: "Support for multiple languages.",
    libs: [{ name: "i18next", href: "https://www.i18next.com/" }],
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Boilerplate</span>
          </div>

          <nav className="hidden items-center justify-center md:flex">
            <ModeToggle />
            <a
              className="flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="https://github.com/carlosziegler/fullstack-start-template"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <Link
              className="ml-8 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
              to="/login"
            >
              Login
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]" side="right">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TerminalSquare className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">Boilerplate</span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <ModeToggle />
                    <Button asChild className="w-full justify-start" variant="ghost">
                      <a
                        className="flex items-center gap-2"
                        href="https://github.com/YOUR_REPO_LINK"
                        onClick={() => setMobileMenuOpen(false)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                    </Button>
                    <Button asChild className="w-full justify-start" variant="ghost">
                      <Link className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)} to="/login">
                        Login
                      </Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="mb-4 bg-gradient-to-r from-primary via-violet-500 to-secondary bg-clip-text font-bold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Modern Full-Stack Boilerplate
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Jumpstart your next project with this feature-rich boilerplate, built with a modern, type-safe stack focused
            on developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Card className="flex flex-col transition-shadow duration-200 hover:shadow-lg" key={tech.category}>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <tech.icon className="h-6 w-6 text-primary" />
                <CardTitle className="font-semibold text-lg">{tech.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="mb-4">{tech.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {tech.libs.map((lib) => (
                    <Badge key={lib.name} variant="secondary">
                      {lib.href ? (
                        <a
                          className="flex items-center gap-1 hover:underline"
                          href={lib.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {lib.name} <BookOpen className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ) : (
                        lib.name
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-16 md:mt-24">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Robust Authentication Included
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Secure user management features ready out-of-the-box, powered by Better Auth.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <UserCheck className="h-6 w-6 text-blue-500" />
                <CardTitle>Core Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Sign Up / Sign In</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Password Reset Flow (Forgot/Reset)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Shield className="h-6 w-6 text-green-500" />
                <CardTitle>Enhanced Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Two-Factor Authentication (OTP)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                  <span>Passkey Support (Planned/Possible)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Users className="h-6 w-6 text-purple-500" />
                <CardTitle>User & Org Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Invitation Acceptance Flow</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <LayoutDashboard className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                  <span>Admin Dashboard (Planned/Possible)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                  <span>Organization Support (Planned/Possible)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t">
        <div className="container py-6 text-center text-muted-foreground text-sm">
          Built with Modern Tech. &copy; {new Date().getFullYear()} Your Company/Name.
        </div>
      </footer>
    </div>
  );
}
