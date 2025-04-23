import { OpenAI } from "openai";
import { getVideoMetadata } from "@/lib/video-utils"; // Utility for extracting video metadata
import { prisma } from "@/lib/db"; // Assuming you have Prisma set up

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface VideoToBlogInput {
  videoUrl: string;
  userId: string; // This will be the clerk ID (user_id in your schema)
  title?: string;
  tags?: string[];
}

interface PostOutput {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  videoUrl: string;
  user_id: string;
  created_at: Date;
}

export async function transpileVideoToBlog({
  videoUrl,
  userId,
  title,
  tags = [],
}: VideoToBlogInput): Promise<PostOutput> {
  try {
    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log(
      `Starting video processing for user ${userId}. Video URL: ${videoUrl}`
    );

    // Transcribe the video content
    console.log("Transcribing video...");
    const transcription = await transcribeVideo(videoUrl);
    console.log("Transcription complete--.", transcription);

    // Generate blog content from transcription
    console.log("Generating blog content...");
    const blogContent = await generateBlogFromTranscription(
      transcription,
      title
    );
    console.log("Blog content generated.");

    // Save to database
    console.log("Saving blog to database...");
    const post = await saveToDatabase({
      title: blogContent.title,
      content: blogContent.content,
      summary: blogContent.summary,
      tags: [...tags, ...blogContent.suggestedTags],
      videoUrl,
      user_id: userId,
    });
    console.log(`Blog saved successfully with ID: ${post.id}`);

    return post;
  } catch (error) {
    console.error("Error transpiling video to blog:", error);
    throw new Error(`Failed to process video: ${error.message}`);
  }
}

async function transcribeVideo(videoUrl: string) {
  try {
    // Using OpenAI's API to transcribe video
    const response = await openai.audio.transcriptions.create({
      file: await fetchVideoAsFile(videoUrl),
      model: "whisper-1",
    });

    return response.text;
  } catch (error) {
    console.error("Error in transcription:", error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

async function fetchVideoAsFile(videoUrl: string) {
  try {
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new File([blob], "video.mp4", { type: "video/mp4" });
  } catch (error) {
    console.error("Error fetching video:", error);
    throw new Error(`Video fetch failed: ${error.message}`);
  }
}

async function generateBlogFromTranscription(
  transcription: string,
  suggestedTitle?: string
) {
  // Use OpenAI to generate a structured blog post from the transcription
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a professional blog writer. Transform the provided video transcription into a 
        well-structured blog post with: 
        1. An engaging title (if not provided)
        2. Introduction
        3. Main content with appropriate headings and paragraphs
        4. Conclusion
        5. A short summary (150 words max)
        6. 5 relevant tags for the content`,
      },
      {
        role: "user",
        content: `Here is a transcription from a video. Please convert it into a high-quality blog post.
        ${
          suggestedTitle
            ? `Suggested title: ${suggestedTitle}`
            : "Please create an engaging title."
        }
        
        Transcription:
        ${transcription}`,
      },
    ],
    temperature: 0.7,
  });
  console.log("response", response);
  const blogText = response.choices[0].message.content;
  console.log("blogText", blogText);

  // Parse the generated content to extract components
  // This is a simple implementation - you might need more robust parsing
  const titleMatch = blogText.match(/^#\s(.+)$|^(.+)\n={3,}$/m);
  const title =
    suggestedTitle ||
    (titleMatch ? titleMatch[1] || titleMatch[2] : "Untitled Blog");

  // Extract summary (assuming it's marked in some way)
  const summaryMatch = blogText.match(/Summary:(.+?)(?:\n\n|\n#)/s);
  const summary = summaryMatch
    ? summaryMatch[1].trim()
    : blogText.split("\n").slice(0, 2).join(" ").substring(0, 150);

  // Extract tags
  const tagsMatch = blogText.match(/Tags:(.+?)$/m);
  const suggestedTags = tagsMatch
    ? tagsMatch[1].split(",").map((tag) => tag.trim().replace(/#/g, ""))
    : [];

  return {
    title,
    content: blogText,
    summary,
    suggestedTags,
  };
}

async function saveToDatabase({
  title,
  content,
  summary,
  tags,
  videoUrl,
  user_id,
}) {
  try {
    // Save to database using Prisma
    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary,
        tags,
        videoUrl,
        user_id,
      },
    });

    return post;
  } catch (error) {
    console.error("Error saving blog to database:", error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
}
