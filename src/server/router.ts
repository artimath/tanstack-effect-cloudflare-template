import { createTRPCRouter } from "@/lib/trpc/init";

import { resourcesRouter } from "./routes/resources";
import { todoRouter } from "./routes/todo";

export const trpcRouter = createTRPCRouter({
  todo: todoRouter,
  resources: resourcesRouter,
});

export type TRPCRouter = typeof trpcRouter;
