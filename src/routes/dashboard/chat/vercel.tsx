import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/ai/chat-rag";

export const Route = createFileRoute("/dashboard/chat/vercel")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat api="/api/ai/vercel/chat" />;
}
