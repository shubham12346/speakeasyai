import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: Request) => {
  return { id: "fakeId" }; // Replace with actual auth logic
};

export const ourFileRouter = {
  videoOrAudioUploader: f({
    video: { maxFileSize: "32MB" },
    audio: { maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) {
        console.error("Upload failed: User not authenticated");
        throw new UploadThingError("Unauthorized: User authentication failed");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log({
        message: "Upload complete",
        userId: metadata.userId,
        fileUrl: file.url,
        fileName: file.name,
      });

      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
