"use client";
import ContentEditor from "@/components/content";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@/lib/utils";

export default function PostPage() {
  const { id } = useParams();

  const [userPost, setUserPost] = useState<Post>([] as unknown as Post);

  if (!userPost?.content) {
    <div>Loading...</div>;
  }

  useEffect(() => {
    if (id) {
      console.log("id", id);
      const fetchPost = async () => {
        const response = await fetch(`/api/user/posts/${id}`);
        const data = await response.json();
        console.log("data", data);
        setUserPost(data);
      };

      fetchPost();
    }
  }, [id]);

  console.log("userPost", userPost);

  return (
    <div className="pl-8">
      <div className="flex justify-between items-center border-b-2 border-gray-200/50 pb-4">
        <div>
          <h2 className="font-bold text-gray-800 mb-2 text-2xl flex items-center gap-2 cursor-pointer">
            📝Edit your post
          </h2>
          <p className="text-gray-600">Start editing your blog post below...</p>
        </div>
      </div>
      <ContentEditor post={userPost} />
    </div>
  );
}
