import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUpIcon, StopCircleIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Types - Using AI SDK v5 types
interface Attachment {
  contentType?: string;
  url: string;
  name?: string;
}

interface ToolInvocationType {
  toolName: string;
  toolCallId: string;
  state: string;
  result?: Array<{
    name: string;
  }>;
}

interface MessagePart {
  type: string;
  toolInvocation: ToolInvocationType;
}

// Using AI SDK v5 UIMessage type
type MessageType = UIMessage;

// Message Components
const MessageHeader = ({ role }: { role: string }) => <div className="font-bold">{role}</div>;

const ToolInvocation = ({ toolInvocation }: { toolInvocation: ToolInvocationType }) => {
  if (toolInvocation.toolName === "addResource" && toolInvocation.state === "call") {
    return <p key={toolInvocation.toolCallId}>Calling addResource tool</p>;
  }

  if (toolInvocation.toolName === "getInformation" && toolInvocation.state === "call") {
    return (
      <div key={toolInvocation.toolCallId} className="animate-pulse">
        Calling getInformation tool
      </div>
    );
  }

  if (toolInvocation.toolName === "generateImage") {
    return (
      <div key={toolInvocation.toolCallId} className="animate-pulse">
        Calling generateImage tool
      </div>
    );
  }

  if (toolInvocation.toolName === "getInformation" && toolInvocation.state === "result") {
    const result = toolInvocation.result?.[0]?.name.replaceAll("\n", "");
    return (
      <div key={toolInvocation.toolCallId}>
        {toolInvocation.toolName} tool result: {result}
      </div>
    );
  }

  return null;
};



const Message = ({ message }: { message: MessageType }) => {
  return (
    <div className="whitespace-pre-wrap">
      <div>
        <div className="font-bold">{message.role}</div>
        <div>
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return <p key={index}>{part.text}</p>;
            }
            
            // Handle new v5 tool patterns - tools are prefixed with 'tool-'
            if (part.type.startsWith("tool-")) {
              const toolPart = part as any; // Type assertion for tool part
              const { toolCallId, state } = toolPart;
              const toolName = part.type.replace("tool-", "");
              
              // Tool is completed and has output
              if (state === "output-available" && toolPart.output) {
                if (toolName === "getInformation") {
                  return (
                    <div key={toolCallId} className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2">
                      <div className="font-medium text-blue-800">Information Retrieved:</div>
                      <div className="text-blue-700">{JSON.stringify(toolPart.output, null, 2)}</div>
                    </div>
                  );
                }
                
                return (
                  <div key={toolCallId} className="bg-green-50 border border-green-200 rounded-lg p-3 my-2">
                    <div className="font-medium text-green-800">{toolName} completed:</div>
                    <pre className="text-green-700 text-sm">{JSON.stringify(toolPart.output, null, 2)}</pre>
                  </div>
                );
              }
              
              // Tool is still processing
              return (
                <div key={toolCallId || index} className="animate-pulse bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                    <span className="text-yellow-700">
                      {state === "input-streaming" && `Preparing ${toolName}...`}
                      {state === "input-available" && `Executing ${toolName}...`}
                      {state === "output-available" && `Processing ${toolName}...`}
                    </span>
                  </div>
                </div>
              );
            }
            
            // Handle step indicators
            if (part.type === "step-start") {
              return null; // Don't render step indicators for cleaner UI
            }
            
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

const MessageList = ({
  messages,
  messagesEndRef,
}: {
  messages: MessageType[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div className="mx-auto mb-20 w-full max-w-2xl space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export function Chat({ api }: { api?: string }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: api || "/api/ai/chat/rag",
    }),
  });

  console.log({ messages });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll when status changes
  useEffect(() => {
    if (status === "streaming") {
      scrollToBottom();
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-4">
      <MessageList messages={messages as MessageType[]} messagesEndRef={messagesEndRef} />

      <form onSubmit={handleSubmit} className="relative flex w-full max-w-xl flex-col items-center justify-center">
        <div className="fixed bottom-0 z-10 mb-8 w-full max-w-lg bg-background">
          <div className="relative flex flex-row items-center justify-between">
            <Textarea
              data-testid="multimodal-input"
              ref={textareaRef}
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 pr-10 shadow-xl"
              rows={1}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
            />
            <div className="absolute right-2">
              {status === "streaming" ? (
                <StopButton stop={stop} />
              ) : (
                <SendButton input={input} submitForm={handleSubmit} uploadQueue={[]} />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function PureStopButton({ stop }: { stop: () => void }) {
  return (
    <Button
      data-testid="stop-button"
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600 "
      onClick={(event) => {
        event.preventDefault();
        stop();
      }}
    >
      <StopCircleIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: (e: React.FormEvent) => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      data-testid="send-button"
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm(event as React.FormEvent);
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length) return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
