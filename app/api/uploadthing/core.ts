import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  videoOrAudioUploader: f({
    video: { maxFileSize: "32MB" },
    audio: { maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", metadata, file);
      console.log("File URL:", file);
      return { uploadedBy: metadata.userId, file }; // Ensure return value is a JsonObject
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
