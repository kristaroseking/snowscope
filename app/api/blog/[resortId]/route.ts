import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { getResortById } from "@/lib/resorts";
import { BlogPost } from "@/types";

const parser = new Parser();

export async function GET(
  request: Request,
  { params }: { params: { resortId: string } }
) {
  try {
    const { resortId } = params;
    const resort = getResortById(resortId);

    if (!resort) {
      return NextResponse.json(
        {
          success: false,
          error: "Resort not found",
        },
        { status: 404 }
      );
    }

    if (!resort.blogUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "No blog configured for this resort",
        },
        { status: 404 }
      );
    }

    // Fetch RSS feed - Blogspot RSS URLs
    let feedUrl = resort.blogUrl;

    if (resort.blogUrl.includes("blogspot.com")) {
      // Remove trailing slash if present
      const baseUrl = resort.blogUrl.replace(/\/$/, "");
      feedUrl = `${baseUrl}/feeds/posts/default`;
    }

    console.log("Fetching blog feed from:", feedUrl);

    // Manual fetch to handle HTTP -> HTTPS redirects properly
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const xmlText = await response.text();
    const feed = await parser.parseString(xmlText);

    const posts: BlogPost[] = (feed.items || []).slice(0, 5).map((item) => ({
      title: item.title || "Untitled",
      link: item.link || resort.blogUrl!,
      pubDate: item.pubDate || new Date().toISOString(),
      description: item.contentSnippet || item.content || "",
      content: item.content,
    }));

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}
