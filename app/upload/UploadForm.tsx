"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size < 20 * 1024 * 1024,
      "file size should be less than 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be audio or video"
    ),
});

export default function UploadForm() {
  const toast = useToast();
  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast.toast({ title: "uploaded successfully!" });
    },
    onUploadError: () => {
      toast.toast({
        title: "error occurred while uploading",
        variant: "destructive",
      });
    },
    onUploadBegin: ({ file }: any) => {
      console.log("upload has begun for", file);
    },
  });

  const handleTranscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    console.log("file", file);
    const validateField: any = schema.safeParse({ file });
    if (!validateField.success) {
      console.log(
        "validated fields",
        validateField.error.flatten().fieldErrors
      );
      let msg =
        validateField.error.flatten().fieldErrors?.file[0] ?? "Unknown error";
      toast.toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    if (file) {
      const res = await startUpload([file]);
      console.log("res", { res });
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleTranscribe}>
      <div className=" flex justify-end items-center gap-1.5">
        <Input
          id="file"
          type="file"
          name="file"
          placeholder="Choose file to upload"
          accept="audio/*,video/*"
          required
        />
        <Button
          type="submit"
          className="bg-purple-600 bg-gradient-to-r from-purple-700 to-pink"
        >
          Transcribe
        </Button>
      </div>
    </form>
  );
}
