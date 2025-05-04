import { faker } from "@faker-js/faker";

import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";
import type { TRPCRouterRecord } from "@trpc/server";
import { todoRouter } from "./routes/todo";

const peopleRouter = {
  list: publicProcedure.query(async () => {
    const fakeData = Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
    }));
    return fakeData;
  }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  people: peopleRouter,
  todo: todoRouter,
});

export type TRPCRouter = typeof trpcRouter;
