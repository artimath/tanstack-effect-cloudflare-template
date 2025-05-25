import { Chat } from "@/components/ai-chat-rag";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat/vercel")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat api="/api/ai/vercel/chat" />;
}
