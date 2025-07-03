import { createTRPCRouter } from "@/lib/trpc/init";
import { publicRouter } from "./routes/public";
import { resourcesRouter } from "./routes/resources";
import { todoRouter } from "./routes/todo";

export const trpcRouter = createTRPCRouter({
  todo: todoRouter,
  resources: resourcesRouter,
  public: publicRouter,
});

export type TRPCRouter = typeof trpcRouter;
