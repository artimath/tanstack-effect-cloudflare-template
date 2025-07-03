import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { TRPCRouter } from "@/server/router";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();
