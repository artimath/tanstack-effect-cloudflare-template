import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/ai/chat-rag";
import UploadComponent from "@/features/files/file-upload";

export const Route = createFileRoute("/dashboard/chat/rag")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto flex h-[90vh] w-full gap-4 overflow-hidden py-24">
      <div className="stretch mx-auto flex w-full min-w-[50%] max-w-md flex-col overflow-y-auto border-gray-200 border-r px-14 dark:border-gray-800">
        <Chat />
      </div>
      <div className="sticky top-0 w-full min-w-[50vw] max-w-md">
        <UploadComponent />
      </div>
    </div>
  );
}
