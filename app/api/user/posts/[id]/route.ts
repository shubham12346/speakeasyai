import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            fullName: true,
            user_id: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the post belongs to the current user
    if (post.user.user_id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own posts" },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("Error in fetching post", err);
    return NextResponse.json(
      { error: "Error in fetching post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("params", await params);
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = await params.id;

  try {
    // First check if the post exists and belongs to the user
    // Read the request body ONCE and store it
    const requestBody = await request.json();
    console.log("Request payload:", requestBody);

    const { title, content, summary, tags, videoUrl } = requestBody;
    console.log("content input:", content);

    // Create an update object that only includes defined fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (tags !== undefined) updateData.tags = tags;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;

    console.log("Update data:", updateData);

    // Only proceed with update if we have valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
