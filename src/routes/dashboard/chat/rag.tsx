import { createFileRoute } from "@tanstack/react-router"
import { Chat } from "@/components/ai-chat-rag";
import UploadComponent from "@/components/file-upload";
import { } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat/rag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full py-24 mx-auto gap-4 h-[90vh] overflow-hidden">
      <div className="flex flex-col w-full max-w-md mx-auto stretch min-w-[50%] px-14 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
        <Chat />
      </div>
      <div className="w-full max-w-md min-w-[50vw] sticky top-0">
        <UploadComponent />
      </div>
    </div>
  );
}
