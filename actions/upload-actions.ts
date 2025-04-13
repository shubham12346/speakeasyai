"use server";
import { getDbConnection } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function transcribeUploadedFile(
  resp: { serverData: { userId: string; file: any } }[]
) {
  if (!resp) {
    return {
      sucess: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  console.log("resp", resp);
  const {
    serverData: {
      userId,
      file: { url: fileUrl, name: fileName },
    },
  } = resp[0];

  if (!fileUrl || !fileUrl) {
    return {
      sucess: false,
      message: "File Upload Failed",
      data: null,
    };
  }
  console.log("fileUrl", fileUrl);
  //   const response = await fetch(fileUrl);
  try {
    // 🔹 Fetch file and convert to Blob
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "video/mp4" });

    // 🔹 Use FormData to send file
    const formData = new FormData();
    formData.append("file", blob, fileName);
    formData.append("model", "whisper-1");
    formData.append("response_format", "text");

    const transcriptions = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData, // Ensure this contains the correct file format
      }
    );

    const textResponse = await transcriptions.text(); // Read as text
    console.log("textResponse", textResponse);
    return {
      success: true,
      message: "transcription complted",
      data: {
        userId,
        transcription: { text: textResponse },
      },
    };
  } catch (error) {
    console.log("error", error);
    if (error?.status === 413) {
      return {
        success: false,
        message: "File too large. Please upload a smaller file.",
      };
    }

    return {
      sucess: false,
      message: error instanceof Error ? error.message : "File processing file",
      data: null,
    };
  }
}

async function saveBlogPost(userId: string, title: string, content: string) {
  try {
    const sql = await getDbConnection();
    const [insertedPost] =
      await sql`Insert into (user_id:,title,content) VALUES (${userId},${title},${content}) RETURNING id`;
    return insertedPost.id;
  } catch (error) {
    console.log("Error saving blog post", error);
  }
}

async function generateBlogPost({
  transcriptions,
  userPosts,
}: {
  transcriptions: string;
  userPosts: string;
}) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: ` You are a skilled content writer that convert audio 
              trancriptions into well structured, engaging blog posts 
              in Markdown format. Create a comprehensive blog post with a catchy tiltle, 
              introduction, main body with multiple sections, and a conclusion.
              Analyze the user's writing style from their previous posts and 
              emulate their tone ans style in the new post. keep the tone casual and 
              professionsal `,
      },
      {
        role: "user",
        content: `Here are some of my previous blog posts for reference :
            
            ${userPosts}
  
            Please convert the following transcriptions into a well structured 
            blog post using Mardown formatting. Follow this sructure:
  
            1. Start with a SEO friendly catchy title on the first line.
            2. Add two new lines after thhe title.
            3. Write an engaging introduction paragraph.
            4. Create multiple sections for the main content, using 
            appropriate heading (##, ###).
            5. Include relevant heading subheading within sections if needed.
            6. use bullet points or numbered lists where appropriate.
            7. Add a conslusion paragraph at the end.
            8. Ensure the content is informative, well-organized, and easy 
            to read. 
            9. Emulate my writing style,tone and any recurring patterns 
            you noticed from my previous posts. 
  
            Here's the transcription to convert:${transcriptions}
            `,
      },
    ],
  });

  console.log(completion.choices[0].message);
  console.log(completion.choices[0]);
  return completion.choices[0].message.content;
}

export async function generateBlogPostAction({ transcriptions, userId }) {
  console.log("convert transcriptions");
  let postId = null;
  if (transcriptions) {
    const userPosts = "";
    const blogPosts = await generateBlogPost({
      transcriptions: transcriptions.text,
      userPosts,
    });
    console.log("blogposts", blogPosts);
    if (!blogPosts) {
      return {
        success: false,
        message: "Blog post generation failed please try again...",
      };
    }

    const [title, ...contentParts] = blogPosts?.split("\n\n") || [];

    // database connnection

    //postId = await saveBlogPost(userId, title, blogPosts);
  }

  // navigate
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}
