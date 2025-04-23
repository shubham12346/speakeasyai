"use client";
import { Post } from "@/lib/utils";
import { ForwardRefEditor } from "./forward-ref-editor";
import BgGradient from "../home/bgGradient";
import { useActionState, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Edit2, Loader2 } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};
type UploadState = {
  success: boolean;
  message?: string;
};

type UploadAction = (
  state: UploadState,
  formData: FormData
) => Promise<UploadState>;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      type="submit"
      className={`w-40 bg-gradient-to-r from-purple-900
    to-indigo-600 hover:from-purple-600 hover:to-indigo-900 text-white *
    font-semibold py-2  px-4 rounded-full shadow-lg transform transition duration-200 ease-out hover:scale-105 focus:outline-none focus:ring-2 `}
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <Edit2 className="w-5 h-5 mr-2" /> Update Text
        </span>
      )}
    </Button>
  );
};

export default function ContentEditor({ post }: { post: Post }) {
  const [content, setContent] = useState<string>();
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const submitFunction: UploadAction = async (
    state: UploadState,
    formdata: FormData
  ) => {
    if (content === post.content) {
      return {
        success: false,
        message: "Content is same",
      };
    }
    // const contentValue = formdata.get("content") as string;
    const postData = {
      title: post.title,
      content,
      summary: post.summary || "",
      tags: post.tags || [],
      videoUrl: post.videoUrl || "",
    };
    try {
      const response = await fetch(`/api/user/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response?.json();
        toast({ description: "Failed to update post", variant: "destructive" });
        return {
          success: false,
          message: errorData.message || "Failed to update post",
        };
      }
      toast({ description: "Post updated successfully" });
      setIsChanged(false);
      return {
        success: true,
        message: "Post updated successfully",
      };
    } catch (err) {
      console.error("Error updating post:", err);
      return {
        success: false,
        message: "An error occurred while updating the post",
      };
    }
  };

  const [state, formAction] = useActionState<UploadState, FormData>(
    submitFunction,
    initialState
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    console.log("value", value);
    setIsChanged(value !== post.content);
  };

  const handleExport = useCallback(() => {
    const fileName = `${post.title || "blog-post"}.md`;
    const blob = new Blob([content], { type: "text/mardown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content, post]);

  useEffect(() => {
    if (post.content) {
      setContent(post?.content || "");
    }
  }, [post]);
  console.log("post", post.content);
  console.log("content", content);

  return (
    <div className=" flex items-center justify-start ">
      <form action={formAction} className="">
        <div className="flex justify-start mt-4 pb-2">
          {isChanged && (
            <p className="text-amber-600 mr-4 self-center">
              You have unsaved changes
            </p>
          )}
          <div className="flex gap-4">
            <SubmitButton />
            <Button
              onClick={handleExport}
              className={`w-40 bg-gradient-to-r from-amber-500 to-amber-900   hover:from-amber-600
               text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200  ease-in-out hover:scale-105 
               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 `}
            >
              Export
            </Button>
          </div>
        </div>
        {post.content?.length > 0 ? (
          <BgGradient>
            <div>
              {content && (
                <ForwardRefEditor
                  markdown={content}
                  className="markdown-content border-dotted border-gray-200 border-2 p-4 
          rounded-md animate-in ease-in-out duration-75 w-[80%] "
                  onChange={handleContentChange}
                />
              )}
            </div>
          </BgGradient>
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-md">
            No content available for this post
          </div>
        )}
      </form>
    </div>
  );
}
