"use client";
import ContentEditor from "@/components/content";
import BgGradient from "@/components/home/bgGradient";
import { Post } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/posts");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="pl-8">loading....</div>;
  }
  console.log("All the posts ", posts);
  return (
    <main className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-0 mb-12 mt-28 ">
      <div className="text-2xl font-semibold text-gr mb-2">
        Your Post ✍️
        {posts?.length === 0 ? (
          <div>
            <p className="text-gray-600 text-lg lg:text-xl mb-4 line-clamp-4">
              You have no posts yet. Upload a video or audio to get started.
            </p>
            <Link
              href={`/dashboard`}
              className="text-purple-600 hover:text-purple-800 font-medium flex gap-1 items-center"
            >
              Go to dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <BgGradient key={post.id}>
                <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                    {post.content.split("\n").slice(1).join("\n")}
                  </p>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-purple-600 hover:text-purple-800 font-medium flex gap-1 items-center"
                  >
                    Read more <ArrowRight className="w-5 h-5 pt-1" />
                  </Link>
                </div>
              </BgGradient>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
