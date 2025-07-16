import { openai } from "@ai-sdk/openai";
import { Agent, type AgentInputItem, Runner, run, tool, webSearchTool } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { createDataStream, createDataStreamResponse, StreamData } from "ai";
import { z } from "zod";

const model = aisdk(openai("gpt-4.1-nano"));
const thread: AgentInputItem[] = [];

const refundAgent = new Agent({
  name: "Refund Agent",
  instructions: "You are a refund agent. You are responsible for refunding customers.",
  outputType: z.object({
    refundApproved: z.boolean(),
  }),
});

const agentNews = new Agent({
  name: "Web searcher",
  instructions: "You are a helpful agent.",
  tools: [
    webSearchTool({
      userLocation: { type: "approximate", city: "Berlin" },
    }),
  ],
});

const orderAgent = new Agent({
  name: "Order Agent",
  instructions: "You are an order agent. You are responsible for processing orders.",
  outputType: z.object({
    orderId: z.string(),
  }),
});

const triageAgent = Agent.create({
  name: "Triage Agent",
  instructions: "You are a triage agent. You are responsible for triaging customer issues.",
  handoffs: [refundAgent, orderAgent, agentNews],
});

const runner = new Runner();

export const ServerRoute = createServerFileRoute("/api/ai/agent/sdk").methods({
  POST: async ({ request }) => {
    const { messages } = await request.json();
    console.log(messages);

    const stream = await runner.run(triageAgent, thread.concat(messages), {
      stream: true,
      signal: request.signal,
      maxTurns: 10,
    });

    // Wait for completion and return the final result
    await stream.completed;
    const finalOutput = stream.finalOutput;

    console.log(finalOutput);

    const data = createDataStream({
      async execute(dataStream) {
        dataStream.write({
          'type': 'data',
          'value': [{ value: JSON.stringify(finalOutput) }]
        });
      },
    });

    const response = createDataStreamResponse({
      status: 200,
      statusText: "OK",
      headers: {
        "Custom-Header": "value",
      },
      async execute(dataStream) {
        // Write data
        // const stream1 = stream.toStream();

        // // Ensure finalOutput is properly serializable
        // const messageContent =
        //   typeof finalOutput === "string"
        //     ? finalOutput
        //     : finalOutput
        //       ? JSON.stringify(finalOutput)
        //       : "No response available";

        // dataStream.writeData([
        //   {
        //     role: "assistant",
        //     content: messageContent,
        //   },
        // ]);

        // // // Write annotation
        // // dataStream.writeMessageAnnotation({
        // //   type: "status",
        // //   value: "processing",
        // // });

        // // Merge another stream

        dataStream.write({
          'type': 'message-annotations',

          'value': [{
            type: "status",
            value: "processing",
          }]
        });

        dataStream.merge(data);
      },
      onError: (error: unknown) => `Custom error: ${error instanceof Error ? error.message : "Unknown error"}`,
    });

    return response;
  },
});
