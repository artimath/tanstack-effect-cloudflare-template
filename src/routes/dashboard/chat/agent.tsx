import { createFileRoute } from "@tanstack/react-router"
import { Chat } from "@/components/ai-chat-rag";

export const Route = createFileRoute("/dashboard/chat/agent")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat api="/api/ai/agent/sdk" />;
}
