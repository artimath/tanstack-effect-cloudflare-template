import { z } from "zod";

import { db } from "@/lib/db";

const getCatFact = async () => {
  try {
    const res = await fetch("https://catfact.ninja/fact");
    const data = await res.json();

    return { content: [{ type: "text", text: `🐱 ${data.fact}` }] };
  } catch (error) {
    return { content: [{ type: "text", text: "Failed to fetch cat fact" }] };
  }
};

const getQuote = async () => {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    return {
      content: [
        {
          type: "text",
          text: `💭 "${data.content}" - ${data.author}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text", text: "Failed to fetch quote" }] };
  }
};

const getJoke = async () => {
  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await res.json();
    return {
      content: [
        {
          type: "text",
          text: `😄 ${data.setup}\n\n${data.punchline}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text", text: "Failed to fetch joke" }] };
  }
};

const getWelcomeMessage = async ({ name }: { name: string }) => {
  return {
    content: [{ type: "text", text: `Welcome to the AI, ${name}!` }],
  };
};

const calculateBMI = async ({ weight, height }: { weight: number; height: number }) => {
  const bmi = weight / (height * height);
  console.log("💪 BMI", bmi);
  return {
    content: [{ type: "text", text: `Your BMI is ${bmi}` }],
  };
};

const getTodos = async () => {
  const todos = await db.query.todo.findMany();
  console.log("🔑 Todos", todos);
  return {
    content: [{ type: "text", text: `Todos: ${JSON.stringify(todos)}` }],
  };
};

export const tools = [
  {
    name: "getCatFact",
    description: "Get a random cat fact",
    callback: getCatFact,
  },
  {
    name: "getQuote",
    description: "Get a random inspirational quote",
    callback: getQuote,
  },
  {
    name: "getJoke",
    description: "Get a random programming joke",
    callback: getJoke,
  },

  {
    name: "getWelcomeMessage",
    description: "Get the welcome message",
    callback: getWelcomeMessage,
    inputSchema: z.object({
      name: z.string(),
    }),
  },
  {
    name: "calculateBMI",
    description: "Calculate the BMI of a person",
    callback: calculateBMI,
    inputSchema: z.object({
      weight: z.number(),
      height: z.number(),
    }),
  },
  {
    name: "getTodos",
    description: "Get the todos from the app",
    callback: getTodos,
  },
];
