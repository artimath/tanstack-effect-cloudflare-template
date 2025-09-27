import { authClient } from "@/lib/auth/auth-client";

export type Session = typeof authClient.$Infer.Session;
export type SessionUser = Session["user"];

const testUser: SessionUser = {
  id: "1",
};
