import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { transpileVideoToBlog } from "@/lib/video-to-blog-agent";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication using Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { videoUrl, title, tags } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    // Process the video using our agent
    const post = await transpileVideoToBlog({
      videoUrl,
      userId, // This is the clerk ID which maps to user_id in your schema
      title,
      tags: tags || [],
    });
    console.log("transpiled in backend  post", post);
    // Return success response with post data
    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        tags: post.tags,
        created_at: post.created_at,
        url: `/posts/${post.id}`,
      },
    });
  } catch (error) {
    console.error("Error processing video:", error);

    // Handle errors
    if (error.message.includes("User not found")) {
      return NextResponse.json(
        { error: "User account issue", message: error.message },
        { status: 404 }
      );
    } else if (error.message.includes("Transcription failed")) {
      return NextResponse.json(
        {
          error: "Video processing failed",
          message:
            "Could not transcribe the video. Please ensure it contains clear audio.",
        },
        { status: 422 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to process video", message: error.message },
        { status: 500 }
      );
    }
  }
}
