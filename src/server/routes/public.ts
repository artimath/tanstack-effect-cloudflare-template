import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";

export const publicRouter = createTRPCRouter({
  create: publicProcedure.query(async () => {
    return "hello world";
  }),
});
