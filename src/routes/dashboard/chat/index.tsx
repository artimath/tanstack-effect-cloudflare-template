import { Chat } from "@/components/ai-chat-image-generation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat/")({
  component: Chat,
});
