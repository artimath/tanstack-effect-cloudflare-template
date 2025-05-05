import { db } from "@/lib/db";
import { publicProcedure } from "@/lib/trpc/init";
import { router } from "@/lib/trpc/init";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TRPCError } from "@trpc/server/unstable-core-do-not-import";

import { uploadFileSchema } from "@/features/file-upload.schema";
import { createResource } from "@/features/resource-create";

export const resourcesRouter = router({
  list: publicProcedure.query(async () => {
    const resources = await db.query.resources.findMany();

    return resources;
  }),
  upload: publicProcedure.input(uploadFileSchema).mutation(async (opts) => {
    const { file } = opts.input;

    // TODO: Handle file upload with mime type
    const blob = new Blob([file], { type: file.type });

    // Use PDFLoader with the blob
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    const content = docs.map((doc) => doc.pageContent).join("\n");

    const dbResource = await createResource({ content });

    if (dbResource.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: dbResource.error,
      });
    }

    return {
      valid: true,
      content: dbResource,
      id: dbResource.id,
      pageCount: docs.length,
    };
  }),
});
