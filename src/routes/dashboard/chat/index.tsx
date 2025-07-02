import { createFileRoute } from "@tanstack/react-router"
import { Chat } from "@/features/ai/chat-image-generation";
import { } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat/")({
  component: Chat,
});
